import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, RotateCcw, Zap } from 'lucide-react';
import PartChips from "../components/apf/PartChips";
import TSChips, { getTsTextByLabel } from "../components/apf/TSChips";
import MultiOutput from "../components/apf/MultiOutput";
import { toast } from 'sonner';

const STORAGE_KEY = 'lenovo_apf_builder_state_v2';

const defaultForm = {
  caseId: '',
  apfCreator: '',
  actionPlan: 'FAILED',
  ceCalledIn: 'NO',
  minConf: 'NO',
  partsNotPickedUp: false,
  ceNamePhone: '',
  prevWoProblem: '',
  prevWoAction: '',
  newSymptom: '',
  causeNewSymptom: '',
  nextAction: '',
  partOrder: '',
  minConfTs: 'NO',
  tsSearch: '',
  selectedTs: [],
  additionalTsDetails: '',
  modelDescription: '',
  sporadicAllParts: false,
  sporadicNote: '',
  moreThan4Parts: false,
  whyMoreThan4: '',
};

const loadForm = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultForm;
    const parsed = JSON.parse(stored);
    return {
      ...defaultForm,
      ...parsed,
      selectedTs: Array.isArray(parsed.selectedTs) ? parsed.selectedTs : [],
    };
  } catch {
    return defaultForm;
  }
};

const normalizeCeCalledIn = (val) => {
  if (!val) return 'NO';
  const v = String(val).toUpperCase();
  if (v === 'YES' || v === 'JA' || v === 'TRUE') return 'YES';
  if (v === 'NOTREQUIRED' || v === 'NOT-REQUIRED' || v === 'NOT_REQUIRED') return 'NOT_REQUIRED';
  return 'NO';
};

const normalizeYesNo = (val) => {
  if (!val) return 'NO';
  const v = String(val).toUpperCase();
  if (v === 'YES' || v === 'JA' || v === 'TRUE') return 'YES';
  return 'NO';
};

const mark = (cond) => (cond ? '[X]' : '[ ]');

const sanitizeFilename = (str) => {
  return str.replace(/[^a-zA-Z0-9._-]/g, '_');
};

const buildApfOutput = (form) => {
  const now = new Date();
  const date = now.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const time = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

  const ceYes = mark(form.ceCalledIn === 'YES');
  const ceNo = mark(form.ceCalledIn === 'NO');
  const ceNotReq = mark(form.ceCalledIn === 'NOT_REQUIRED');

  const tsTexts = form.selectedTs.map(label => getTsTextByLabel(label)).filter(Boolean);
  if (form.additionalTsDetails?.trim()) {
    tsTexts.push(form.additionalTsDetails.trim());
  }
  const tsInline = tsTexts.join(', ') || '';

  const minConfValue = form.minConfTs !== 'NO' ? form.minConfTs : form.minConf;
  const minConfYes = mark(minConfValue === 'YES');
  const minConfNo = mark(minConfValue === 'NO');

  const partsLine = mark(form.partsNotPickedUp);

  return `Case ID :${form.caseId}
APFCreator: ${form.apfCreator}

**** ACTION PLAN ${form.actionPlan} ****
CE-Called-In-Yes:${ceYes}
CE-Called-In-No:${ceNo}
CE-Called-In-NotRequired:${ceNotReq}

CE Name/Phone: ${form.ceNamePhone}

Previous WO Problem: ${form.prevWoProblem}
Previous WO Action: ${form.prevWoAction}

New Symptom: ${form.newSymptom}

APF TS performed: ${tsInline}

Min-conf-yes:${minConfYes}
Min-conf-no:${minConfNo}

Cause for new symptom: ${form.causeNewSymptom}

${partsLine} CE did not pick up parts within 5 days -parts returned (set repeat repair reason to OTHER/UNKNOWN)

Next action: ${form.nextAction}
Part order:
${form.partOrder}

Generated on: ${date} at ${time}
--- Ende ---`;
};

const buildPremierOutput = (form) => {
  const repeatYes = mark(form.actionPlan === 'FAILED');
  const repeatNo = mark(form.actionPlan !== 'FAILED');
  const sporadicMark = mark(form.sporadicAllParts);

  const tsLabels = form.selectedTs.join(', ');
  const tsDetails = form.additionalTsDetails?.trim() ? `, ${form.additionalTsDetails.trim()}` : '';
  const troubleshooting = tsLabels + tsDetails;

  return `=========================================
*Premier - Support*
=========================================
Model description: ${form.modelDescription}
Repeat Repair: Yes${repeatYes}  No${repeatNo}
Sporadic problem, replace ALL ordered parts under all circumstances ${sporadicMark}
NOTE for sporadic problem: ${form.sporadicNote}
=========================================
DETAILED PROBLEM DESCRIPTION: ${form.newSymptom}
=========================================
ALREADY PERFORMED TROUBLESHOOTING: ${troubleshooting}
=========================================
PART NAME:
${form.partOrder}
=========================================
WO INITIATOR: ${form.apfCreator}`;
};

const buildEscalationOutput = (form) => {
  const lines = form.partOrder.split('\n').filter(l => l.trim());
  if (lines.length <= 4 || !form.moreThan4Parts) return '';

  const partNames = lines.map(line => {
    const idx = line.indexOf(' - ');
    const part = idx > 0 ? line.substring(0, idx) : line;
    return part.replace(/\s+x\s+\d+\s*$/i, '').trim();
  });

  return `Parts needed:
${partNames.join('\n')}

Why are more than 4 parts needed:
${form.whyMoreThan4}`;
};

export default function APFBuilder() {
  const [form, setForm] = useState(loadForm);
  const [selectedTsSet, setSelectedTsSet] = useState(new Set(form.selectedTs));
  const [denseMode, setDenseMode] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [outputs, setOutputs] = useState({ apf: '', premier: '', escalation: '', showEscalation: false });

  const [allgemeinExpanded, setAllgemeinExpanded] = useState(true);
  const [woSymptomExpanded, setWoSymptomExpanded] = useState(true);
  const [ceOnSiteExpanded, setCeOnSiteExpanded] = useState(true);
  const [premierExpanded, setPremierExpanded] = useState(true);
  const [partsExpanded, setPartsExpanded] = useState(false);
  const [tsExpanded, setTsExpanded] = useState(false);

  useEffect(() => {
    const normalized = {
      ...form,
      ceCalledIn: normalizeCeCalledIn(form.ceCalledIn),
      minConf: normalizeYesNo(form.minConf),
      minConfTs: normalizeYesNo(form.minConfTs),
      selectedTs: Array.from(selectedTsSet),
    };
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }, 250);
    return () => clearTimeout(timer);
  }, [form, selectedTsSet]);

  const generateOutputs = useCallback(() => {
    const currentForm = { ...form, selectedTs: Array.from(selectedTsSet) };
    const apf = buildApfOutput(currentForm);
    const premier = buildPremierOutput(currentForm);
    const escalation = buildEscalationOutput(currentForm);
    const showEscalation = escalation.length > 0;
    setOutputs({ apf, premier, escalation, showEscalation });
  }, [form, selectedTsSet]);

  useEffect(() => {
    if (autoGenerate) {
      const timer = setTimeout(generateOutputs, 160);
      return () => clearTimeout(timer);
    }
  }, [autoGenerate, form, selectedTsSet, generateOutputs]);

  const handleReset = useCallback(() => {
    setForm(defaultForm);
    setSelectedTsSet(new Set());
    setOutputs({ apf: '', premier: '', escalation: '', showEscalation: false });
    localStorage.removeItem(STORAGE_KEY);
    toast.success('Form reset');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleReset();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        generateOutputs();
        toast.success('Output generated');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleReset, generateOutputs]);

  const updateForm = (updates) => setForm(prev => ({ ...prev, ...updates }));

  const partsCount = useMemo(() => {
    return form.partOrder.split('\n').filter(l => l.trim()).length;
  }, [form.partOrder]);

  const tsCount = selectedTsSet.size;

  const isReady = useMemo(() => {
    return form.caseId.trim() && /^\d+$/.test(form.caseId.trim()) && form.apfCreator.trim();
  }, [form.caseId, form.apfCreator]);

  useEffect(() => {
    document.body.classList.toggle('dense', denseMode);
  }, [denseMode]);

  const SectionHeader = ({ title, subtitle, expanded, setExpanded }) => (
    <button onClick={() => setExpanded(!expanded)} className="section-header">
      <div>
        <div className="section-title">{title}</div>
        {subtitle && <div className="section-subtitle">{subtitle}</div>}
      </div>
      {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-[1280px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold text-sm">
                  L
                </div>
                <h1 className="text-lg font-bold">APF Tool</h1>
              </div>
              <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
                <Badge variant="outline" className="font-mono">
                  Parts: {partsCount}
                </Badge>
                <Badge variant="outline" className="font-mono">
                  TS: {tsCount}
                </Badge>
                <Badge variant={isReady ? "default" : "destructive"} className="font-mono">
                  {isReady ? 'READY' : 'CHECK INPUT'}
                </Badge>
                <span className="hidden lg:inline text-[10px]">Alt+R Reset</span>
                <span className="hidden lg:inline text-[10px]">Ctrl+Enter Generate</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Checkbox id="compact" checked={denseMode} onCheckedChange={(v) => setDenseMode(!!v)} />
                <Label htmlFor="compact" className="text-xs cursor-pointer">Compact</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="live" checked={autoGenerate} onCheckedChange={(v) => setAutoGenerate(!!v)} />
                <Label htmlFor="live" className="text-xs cursor-pointer">Live</Label>
              </div>
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-6 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* ALLGEMEIN */}
          <div className="card-panel">
            <SectionHeader title="ALLGEMEIN" subtitle="Basis-Informationen" expanded={allgemeinExpanded} setExpanded={setAllgemeinExpanded} />
            {allgemeinExpanded && (
              <div className="card-content">
                <div className="field-group">
                  <Label>CASE-ID</Label>
                  <Input value={form.caseId} onChange={(e) => updateForm({ caseId: e.target.value })} placeholder="2027910571" />
                </div>
                <div className="field-group">
                  <Label>APF-CREATOR</Label>
                  <Input value={form.apfCreator} onChange={(e) => updateForm({ apfCreator: e.target.value })} />
                </div>
                <div className="field-group">
                  <Label>ACTION-PLAN</Label>
                  <Select value={form.actionPlan} onValueChange={(v) => updateForm({ actionPlan: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FAILED">FAILED</SelectItem>
                      <SelectItem value="PASSED">PASSED</SelectItem>
                      <SelectItem value="N/A">N/A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="field-group">
                  <Label>CE-CALLED-IN</Label>
                  <Select value={form.ceCalledIn} onValueChange={(v) => updateForm({ ceCalledIn: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YES">YES</SelectItem>
                      <SelectItem value="NO">NO</SelectItem>
                      <SelectItem value="NOT_REQUIRED">NOT REQUIRED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="field-group">
                  <Label>MIN-CONF (Global)</Label>
                  <Select value={form.minConf} onValueChange={(v) => updateForm({ minConf: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NO">NO</SelectItem>
                      <SelectItem value="YES">YES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="parts-pickup" checked={form.partsNotPickedUp} onCheckedChange={(v) => updateForm({ partsNotPickedUp: !!v })} />
                  <Label htmlFor="parts-pickup" className="text-xs">CE did not pick up parts (5 days)</Label>
                </div>
              </div>
            )}
          </div>

          {/* WO / SYMPTOM */}
          <div className="card-panel">
            <SectionHeader title="WO / SYMPTOM" subtitle="Work Order Details" expanded={woSymptomExpanded} setExpanded={setWoSymptomExpanded} />
            {woSymptomExpanded && (
              <div className="card-content">
                <div className="field-group">
                  <Label>CE-NAME / PHONE</Label>
                  <Input value={form.ceNamePhone} onChange={(e) => updateForm({ ceNamePhone: e.target.value })} />
                </div>
                <div className="field-group">
                  <Label>PREV-WO-PROBLEM</Label>
                  <Input value={form.prevWoProblem} onChange={(e) => updateForm({ prevWoProblem: e.target.value })} />
                </div>
                <div className="field-group">
                  <Label>PREV-WO-ACTION</Label>
                  <Input value={form.prevWoAction} onChange={(e) => updateForm({ prevWoAction: e.target.value })} />
                </div>
                <div className="field-group">
                  <Label>NEW-SYMPTOM</Label>
                  <Textarea value={form.newSymptom} onChange={(e) => updateForm({ newSymptom: e.target.value })} rows={3} />
                </div>
                <div className="field-group">
                  <Label>CAUSE</Label>
                  <Textarea value={form.causeNewSymptom} onChange={(e) => updateForm({ causeNewSymptom: e.target.value })} rows={2} />
                </div>
                <div className="field-group">
                  <Label>NEXT-ACTION</Label>
                  <Input value={form.nextAction} onChange={(e) => updateForm({ nextAction: e.target.value })} />
                </div>
                <div className="field-group">
                  <Label>PART-ORDER</Label>
                  <Textarea value={form.partOrder} onChange={(e) => updateForm({ partOrder: e.target.value })} className="font-mono text-xs" rows={4} />
                  <Button variant="ghost" size="sm" onClick={() => setPartsExpanded(!partsExpanded)} className="w-full mt-1">
                    Part Options {partsExpanded ? '▲' : '▼'}
                  </Button>
                </div>
                {partsExpanded && <PartChips partOrder={form.partOrder} setPartOrder={(v) => updateForm({ partOrder: v })} />}
              </div>
            )}
          </div>

          {/* CE ON-SITE TS */}
          <div className="card-panel">
            <SectionHeader title="CE ON-SITE TS" subtitle="Troubleshooting" expanded={ceOnSiteExpanded} setExpanded={setCeOnSiteExpanded} />
            {ceOnSiteExpanded && (
              <div className="card-content">
                <div className="field-group">
                  <Label>MIN-CONF (TS / Override)</Label>
                  <Select value={form.minConfTs} onValueChange={(v) => updateForm({ minConfTs: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NO">NO</SelectItem>
                      <SelectItem value="YES">YES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="field-group">
                  <Label>TS-SEARCH</Label>
                  <Input value={form.tsSearch} onChange={(e) => updateForm({ tsSearch: e.target.value })} placeholder="Filter..." />
                </div>
                <Button variant="ghost" size="sm" onClick={() => setTsExpanded(!tsExpanded)} className="w-full">
                  TS Options {tsExpanded ? '▲' : '▼'}
                </Button>
                {tsExpanded && <TSChips selectedTs={selectedTsSet} setSelectedTs={setSelectedTsSet} tsSearch={form.tsSearch} />}
                <div className="field-group">
                  <Label>TS-DETAILS (Additional)</Label>
                  <Textarea value={form.additionalTsDetails} onChange={(e) => updateForm({ additionalTsDetails: e.target.value })} rows={2} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PREMIER SUPPORT */}
        <div className="card-panel">
          <SectionHeader title="PREMIER SUPPORT TEMPLATE" subtitle="Template Configuration" expanded={premierExpanded} setExpanded={setPremierExpanded} />
          {premierExpanded && (
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="field-group">
                  <Label>MODEL-DESCRIPTION</Label>
                  <Input value={form.modelDescription} onChange={(e) => updateForm({ modelDescription: e.target.value })} placeholder="T14S G3" />
                </div>
                <div className="space-y-2">
                  <Label>OPTIONS</Label>
                  <div className="flex items-center gap-2">
                    <Checkbox id="sporadicAllParts" checked={form.sporadicAllParts} onCheckedChange={(v) => updateForm({ sporadicAllParts: !!v })} />
                    <Label htmlFor="sporadicAllParts" className="text-xs">Sporadic: Replace ALL</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="moreThan4Parts" checked={form.moreThan4Parts} onCheckedChange={(v) => updateForm({ moreThan4Parts: !!v })} />
                    <Label htmlFor="moreThan4Parts" className="text-xs">&gt;4 Parts Block</Label>
                  </div>
                </div>
              </div>
              <div className="field-group">
                <Label>SPORADIC-NOTE</Label>
                <Textarea value={form.sporadicNote} onChange={(e) => updateForm({ sporadicNote: e.target.value })} rows={2} />
              </div>
              {form.moreThan4Parts && (
                <div className="field-group">
                  <Label>WHY &gt;4 PARTS</Label>
                  <Textarea value={form.whyMoreThan4} onChange={(e) => updateForm({ whyMoreThan4: e.target.value })} rows={2} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* OUTPUT */}
        <MultiOutput outputs={outputs} onGenerate={generateOutputs} caseId={form.caseId} />
      </div>

      <style jsx>{`
        .card-panel {
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.32);
        }

        .section-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border-bottom: 1px solid hsl(var(--border));
          cursor: pointer;
          transition: background 0.15s;
        }

        .section-header:hover {
          background: hsl(var(--muted) / 0.5);
        }

        .section-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: hsl(var(--foreground));
        }

        .section-subtitle {
          font-size: 11px;
          color: hsl(var(--muted-foreground));
          margin-top: 2px;
        }

        .card-content {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        body.dense .card-content {
          padding: 10px;
          gap: 8px;
        }

        body.dense input,
        body.dense textarea,
        body.dense select {
          min-height: 32px;
          padding: 6px 8px;
        }
      `}</style>
    </div>
  );
}