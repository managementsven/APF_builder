import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RotateCcw } from 'lucide-react';
import MultiOutput from "../components/apf/MultiOutput";
import { SectionHeader } from "../components/apf/SectionHeader";
import { GeneralSection } from "../components/apf/sections/GeneralSection";
import { SymptomSection } from "../components/apf/sections/SymptomSection";
import { TroubleshootingSection } from "../components/apf/sections/TroubleshootingSection";
import { PremierSection } from "../components/apf/sections/PremierSection";
import { useAPFForm } from "../components/hooks/useAPFForm";
import { buildApfOutput, buildPremierOutput, buildEscalationOutput } from "../components/utils/apfGenerators";
import { toast } from 'sonner';

export default function APFBuilder() {
  const {
    form,
    selectedTsSet,
    updateForm,
    setSelectedTsSet,
    resetForm,
    partsCount,
    tsCount,
    isReady,
    getNormalizedForm,
  } = useAPFForm();
  const [denseMode, setDenseMode] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [outputs, setOutputs] = useState({ apf: '', premier: '', escalation: '', showEscalation: false });

  const [allgemeinExpanded, setAllgemeinExpanded] = useState(true);
  const [woSymptomExpanded, setWoSymptomExpanded] = useState(true);
  const [ceOnSiteExpanded, setCeOnSiteExpanded] = useState(true);
  const [premierExpanded, setPremierExpanded] = useState(true);

  const generateOutputs = useCallback(() => {
    const currentForm = getNormalizedForm();
    const apf = buildApfOutput(currentForm);
    const premier = buildPremierOutput(currentForm);
    const escalation = buildEscalationOutput(currentForm);
    const showEscalation = escalation.length > 0;
    setOutputs({ apf, premier, escalation, showEscalation });
  }, [getNormalizedForm]);

  useEffect(() => {
    if (autoGenerate) {
      const timer = setTimeout(generateOutputs, 160);
      return () => clearTimeout(timer);
    }
  }, [autoGenerate, generateOutputs]);

  const handleReset = useCallback(() => {
    resetForm();
    setOutputs({ apf: '', premier: '', escalation: '', showEscalation: false });
  }, [resetForm]);

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

  useEffect(() => {
    document.body.classList.toggle('dense', denseMode);
  }, [denseMode]);

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
          <div className="card-panel" role="region" aria-labelledby="allgemein-header">
            <SectionHeader 
              title="ALLGEMEIN" 
              subtitle="Basis-Informationen" 
              expanded={allgemeinExpanded} 
              setExpanded={setAllgemeinExpanded}
              sectionId="allgemein"
            />
            {allgemeinExpanded && (
              <div id="allgemein-content" role="region" aria-labelledby="allgemein-header">
                <GeneralSection form={form} updateForm={updateForm} />
              </div>
            )}
          </div>

          {/* WO / SYMPTOM */}
          <div className="card-panel" role="region" aria-labelledby="wo-symptom-header">
            <SectionHeader 
              title="WO / SYMPTOM" 
              subtitle="Work Order Details" 
              expanded={woSymptomExpanded} 
              setExpanded={setWoSymptomExpanded}
              sectionId="wo-symptom"
            />
            {woSymptomExpanded && (
              <div id="wo-symptom-content" role="region" aria-labelledby="wo-symptom-header">
                <SymptomSection form={form} updateForm={updateForm} />
              </div>
            )}
          </div>

          {/* CE ON-SITE TS */}
          <div className="card-panel" role="region" aria-labelledby="ce-onsite-header">
            <SectionHeader 
              title="CE ON-SITE TS" 
              subtitle="Troubleshooting" 
              expanded={ceOnSiteExpanded} 
              setExpanded={setCeOnSiteExpanded}
              sectionId="ce-onsite"
            />
            {ceOnSiteExpanded && (
              <div id="ce-onsite-content" role="region" aria-labelledby="ce-onsite-header">
                <TroubleshootingSection 
                  form={form} 
                  updateForm={updateForm}
                  selectedTsSet={selectedTsSet}
                  setSelectedTsSet={setSelectedTsSet}
                />
              </div>
            )}
          </div>
        </div>

        {/* PREMIER SUPPORT */}
        <div className="card-panel" role="region" aria-labelledby="premier-header">
          <SectionHeader 
            title="PREMIER SUPPORT TEMPLATE" 
            subtitle="Template Configuration" 
            expanded={premierExpanded} 
            setExpanded={setPremierExpanded}
            sectionId="premier"
          />
          {premierExpanded && (
            <div id="premier-content" role="region" aria-labelledby="premier-header">
              <PremierSection form={form} updateForm={updateForm} />
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