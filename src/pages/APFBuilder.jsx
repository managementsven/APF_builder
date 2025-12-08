import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from 'lucide-react';
import PartChips from "../components/apf/PartChips";
import TSChips from "../components/apf/TSChips";
import MultiOutput from "../components/apf/MultiOutput";

export default function APFBuilder() {
  const [denseMode, setDenseMode] = useState(false);
  const [allgemeinExpanded, setAllgemeinExpanded] = useState(true);
  const [woSymptomExpanded, setWoSymptomExpanded] = useState(true);
  const [ceOnSiteExpanded, setCeOnSiteExpanded] = useState(true);
  const [premierExpanded, setPremierExpanded] = useState(true);

  const [caseId, setCaseId] = useState('');
  const [apfCreator, setApfCreator] = useState('');
  const [actionPlan, setActionPlan] = useState('FAILED');
  const [ceCalledIn, setCeCalledIn] = useState('');
  const [minConf, setMinConf] = useState('No');
  const [partsNotPickedUp, setPartsNotPickedUp] = useState(false);

  const [ceNamePhone, setCeNamePhone] = useState('');
  const [prevWoProblem, setPrevWoProblem] = useState('');
  const [prevWoAction, setPrevWoAction] = useState('');
  const [newSymptom, setNewSymptom] = useState('');
  const [causeNewSymptom, setCauseNewSymptom] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [partOrder, setPartOrder] = useState('');
  const [partsExpanded, setPartsExpanded] = useState(false);

  const [minConfTs, setMinConfTs] = useState('No');
  const [tsSearch, setTsSearch] = useState('');
  const [selectedTs, setSelectedTs] = useState(new Set());
  const [tsExpanded, setTsExpanded] = useState(false);
  const [additionalTsDetails, setAdditionalTsDetails] = useState('');

  const [modelDescription, setModelDescription] = useState('');
  const [sporadicAllParts, setSporadicAllParts] = useState(false);
  const [sporadicNote, setSporadicNote] = useState('');
  const [moreThan4Parts, setMoreThan4Parts] = useState(false);
  const [whyMoreThan4, setWhyMoreThan4] = useState('');

  const [outputs, setOutputs] = useState({
    apf: '',
    premier: '',
    escalation: '',
    showEscalation: false
  });

  const handleReset = () => {
    setCaseId('');
    setApfCreator('');
    setActionPlan('FAILED');
    setCeCalledIn('');
    setMinConf('No');
    setPartsNotPickedUp(false);
    setCeNamePhone('');
    setPrevWoProblem('');
    setPrevWoAction('');
    setNewSymptom('');
    setCauseNewSymptom('');
    setNextAction('');
    setPartOrder('');
    setPartsExpanded(false);
    setMinConfTs('No');
    setTsSearch('');
    setSelectedTs(new Set());
    setTsExpanded(false);
    setAdditionalTsDetails('');
    setModelDescription('');
    setSporadicAllParts(false);
    setSporadicNote('');
    setMoreThan4Parts(false);
    setWhyMoreThan4('');
    setOutputs({ apf: '', premier: '', escalation: '', showEscalation: false });
  };

  const handleGenerate = () => {
    const now = new Date();
    const date = now.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const time = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

    const ceCalledInYes = ceCalledIn === 'Yes' ? '[X]' : '[]';
    const ceCalledInNo = ceCalledIn === 'No' ? '[X]' : '[]';
    const ceCalledInNotRequired = ceCalledIn === 'NotRequired' ? '[X]' : '[]';
    const minConfYes = minConf === 'Yes' ? '[X]' : '[]';
    const minConfNo = minConf === 'No' ? '[X]' : '[]';
    const tsList = Array.from(selectedTs).join(', ');
    const tsFormatted = tsList ? tsList + '.' : '';
    const partsLine = partsNotPickedUp 
      ? '\n[] CE did not pick up parts within 5 days -parts returned (set repeat repair reason to OTHER/UNKNOWN)\n' 
      : '';

    const apfOutput = `Case ID :${caseId}
APFCreator: ${apfCreator}

**** ACTION PLAN ${actionPlan} ****
CE-Called-In-Yes:${ceCalledInYes}
CE-Called-In-No:${ceCalledInNo}
CE-Called-In-NotRequired:${ceCalledInNotRequired}

CE Name/Phone: ${ceNamePhone}

Previous WO Problem: ${prevWoProblem}
Previous WO Action: ${prevWoAction}

New Symptom: ${newSymptom}

CE TS performed: ${tsFormatted}
Min-conf-yes:${minConfYes}
Min-conf-no:${minConfNo}

Cause for new symptom: ${causeNewSymptom}
${partsLine}
Next action: ${nextAction}
Part order:
${partOrder}

Generated on: ${date} at ${time}
--- Ende ---`;

    const repeatRepairYes = actionPlan === 'FAILED' ? '[x]' : '[]';
    const repeatRepairNo = actionPlan === 'FAILED' ? '[]' : '[x]';
    const sporadicMark = sporadicAllParts ? '[x]' : '[]';
    const tsListCommaSeparated = Array.from(selectedTs).join(', ');

    const premierOutput = `=========================================
*Premier - Support*
=========================================
Model description: ${modelDescription}
Repeat Repair: Yes${repeatRepairYes}  No${repeatRepairNo}
Sporadic problem, replace ALL ordered parts under all circumstances ${sporadicMark}
NOTE for sporadic problem: ${sporadicNote}
=========================================
DETAILED PROBLEM DESCRIPTION: ${newSymptom}
=========================================
ALREADY PERFORMED TROUBLESHOOTING:  ${tsListCommaSeparated}
=========================================
PART NAME:
${partOrder}
=========================================
WO INITIATOR: ${apfCreator}`;

    let escalationOutput = '';
    const partLines = partOrder.split('\n').filter(line => line.trim());
    
    if (moreThan4Parts && partLines.length > 4) {
      const partNames = partLines.map(line => {
        const idx = line.indexOf(' - ');
        return idx > 0 ? line.substring(0, idx).trim() : line.trim();
      });

      escalationOutput = `Parts needed:
${partNames.join('\n')}

Why are more than 4 parts needed:
${whyMoreThan4}`;
    }

    setOutputs({
      apf: apfOutput,
      premier: premierOutput,
      escalation: escalationOutput,
      showEscalation: moreThan4Parts
    });
  };

  const handleClearPane = (pane) => {
    setOutputs(prev => ({ ...prev, [pane]: '' }));
  };

  const SectionHeader = ({ title, expanded, setExpanded }) => (
    <button
      onClick={() => setExpanded(!expanded)}
      className="nerv-section-header"
    >
      <div className="corner-brackets">
        <span className="bracket tl"></span>
        <span className="bracket tr"></span>
        <span className="bracket bl"></span>
        <span className="bracket br"></span>
      </div>
      <span className="title">{title}</span>
      {expanded ? <ChevronUp className="chevron" /> : <ChevronDown className="chevron" />}
    </button>
  );

  return (
    <div className="nerv-container">
      <div className="scan-overlay"></div>
      <div className="noise-overlay"></div>

      {/* Top Bar */}
      <div className="nerv-topbar">
        <div className="topbar-inner">
          <div className="logo-section">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6918520f2d38836a5df81c78/ce88ba337_apf_builder_logo_light_1024.png"
              alt="APF"
              className="logo-img"
            />
            <div className="telemetry">
              <span className="telem-label">SYS-ID</span>
              <span className="telem-value">APF-001</span>
            </div>
          </div>
          
          <div className="controls-section">
            <div className="mode-toggle">
              <Checkbox 
                id="dense" 
                checked={denseMode} 
                onCheckedChange={setDenseMode}
                className="nerv-checkbox"
              />
              <Label htmlFor="dense" className="mode-label">COMPACT</Label>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleReset}
              className="nerv-btn-secondary"
            >
              RESET
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="nerv-main">
        <div className="sections-grid">
          {/* Section 1: ALLGEMEIN */}
          <div className="nerv-panel">
            <SectionHeader 
              title="ALLGEMEIN" 
              expanded={allgemeinExpanded} 
              setExpanded={setAllgemeinExpanded}
            />
            {allgemeinExpanded && (
              <div className="panel-content">
                <div className="field-group">
                  <Label className="field-label">CASE-ID</Label>
                  <Input value={caseId} onChange={(e) => setCaseId(e.target.value)} placeholder="2027910571" className="nerv-input" />
                </div>
                <div className="field-group">
                  <Label className="field-label">APF-CREATOR</Label>
                  <Input value={apfCreator} onChange={(e) => setApfCreator(e.target.value)} className="nerv-input" />
                </div>
                <div className="field-group">
                  <Label className="field-label">ACTION-PLAN</Label>
                  <Select value={actionPlan} onValueChange={setActionPlan}>
                    <SelectTrigger className="nerv-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="nerv-dropdown">
                      <SelectItem value="FAILED" className="nerv-option">FAILED</SelectItem>
                      <SelectItem value="PASSED" className="nerv-option">PASSED</SelectItem>
                      <SelectItem value="N/A" className="nerv-option">N/A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="field-group">
                  <Label className="field-label">CE-CALLED-IN</Label>
                  <Select value={ceCalledIn} onValueChange={setCeCalledIn}>
                    <SelectTrigger className="nerv-select">
                      <SelectValue placeholder="SELECT..." />
                    </SelectTrigger>
                    <SelectContent className="nerv-dropdown">
                      <SelectItem value="Yes" className="nerv-option">YES</SelectItem>
                      <SelectItem value="No" className="nerv-option">NO</SelectItem>
                      <SelectItem value="NotRequired" className="nerv-option">NOT-REQUIRED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="field-group">
                  <Label className="field-label">MIN-CONF</Label>
                  <Select value={minConf} onValueChange={setMinConf}>
                    <SelectTrigger className="nerv-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="nerv-dropdown">
                      <SelectItem value="No" className="nerv-option">NO</SelectItem>
                      <SelectItem value="Yes" className="nerv-option">YES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="field-checkbox">
                  <Checkbox id="parts-pickup" checked={partsNotPickedUp} onCheckedChange={setPartsNotPickedUp} className="nerv-checkbox" />
                  <Label htmlFor="parts-pickup" className="checkbox-label">CE DID NOT PICK UP PARTS (5 DAYS)</Label>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: WO / SYMPTOM */}
          <div className="nerv-panel">
            <SectionHeader 
              title="WO / SYMPTOM" 
              expanded={woSymptomExpanded} 
              setExpanded={setWoSymptomExpanded}
            />
            {woSymptomExpanded && (
              <div className="panel-content">
                <div className="field-group">
                  <Label className="field-label">CE-NAME / PHONE</Label>
                  <Input value={ceNamePhone} onChange={(e) => setCeNamePhone(e.target.value)} className="nerv-input" />
                </div>
                <div className="field-group">
                  <Label className="field-label">PREV-WO-PROBLEM</Label>
                  <Input value={prevWoProblem} onChange={(e) => setPrevWoProblem(e.target.value)} className="nerv-input" />
                </div>
                <div className="field-group">
                  <Label className="field-label">PREV-WO-ACTION</Label>
                  <Input value={prevWoAction} onChange={(e) => setPrevWoAction(e.target.value)} className="nerv-input" />
                </div>
                <div className="field-group">
                  <Label className="field-label">NEW-SYMPTOM</Label>
                  <Textarea value={newSymptom} onChange={(e) => setNewSymptom(e.target.value)} className="nerv-textarea" />
                </div>
                <div className="field-group">
                  <Label className="field-label">CAUSE</Label>
                  <Textarea value={causeNewSymptom} onChange={(e) => setCauseNewSymptom(e.target.value)} className="nerv-textarea" />
                </div>
                <div className="field-group">
                  <Label className="field-label">NEXT-ACTION</Label>
                  <Input value={nextAction} onChange={(e) => setNextAction(e.target.value)} className="nerv-input" />
                </div>
                <div className="field-group">
                  <Label className="field-label">PART-ORDER</Label>
                  <Textarea value={partOrder} onChange={(e) => setPartOrder(e.target.value)} className="nerv-textarea mono" />
                  <Button variant="ghost" size="sm" onClick={() => setPartsExpanded(!partsExpanded)} className="nerv-btn-toggle">
                    PART-SELECT {partsExpanded ? '▲' : '▼'}
                  </Button>
                </div>
                {partsExpanded && <PartChips partOrder={partOrder} setPartOrder={setPartOrder} denseMode={denseMode} />}
              </div>
            )}
          </div>

          {/* Section 3: CE ON-SITE TS */}
          <div className="nerv-panel">
            <SectionHeader 
              title="CE ON-SITE TS" 
              expanded={ceOnSiteExpanded} 
              setExpanded={setCeOnSiteExpanded}
            />
            {ceOnSiteExpanded && (
              <div className="panel-content">
                <div className="field-group">
                  <Label className="field-label">MIN-CONF</Label>
                  <Select value={minConfTs} onValueChange={setMinConfTs}>
                    <SelectTrigger className="nerv-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="nerv-dropdown">
                      <SelectItem value="No" className="nerv-option">NO</SelectItem>
                      <SelectItem value="Yes" className="nerv-option">YES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="field-group">
                  <Label className="field-label">TS-SEARCH</Label>
                  <Input value={tsSearch} onChange={(e) => setTsSearch(e.target.value)} placeholder="RAM, SSD..." className="nerv-input" />
                </div>
                <Button variant="ghost" size="sm" onClick={() => setTsExpanded(!tsExpanded)} className="nerv-btn-toggle full">
                  TS-OPTIONS {tsExpanded ? '▲' : '▼'}
                </Button>
                {tsExpanded && <TSChips selectedTs={selectedTs} setSelectedTs={setSelectedTs} tsSearch={tsSearch} denseMode={denseMode} />}
                <div className="field-group">
                  <Label className="field-label">TS-DETAILS</Label>
                  <Textarea value={additionalTsDetails} onChange={(e) => setAdditionalTsDetails(e.target.value)} className="nerv-textarea" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Premier Section */}
        <div className="nerv-panel full-width">
          <SectionHeader 
            title="PREMIER-SUPPORT TEMPLATE" 
            expanded={premierExpanded} 
            setExpanded={setPremierExpanded}
          />
          {premierExpanded && (
            <div className="panel-content">
              <div className="premier-grid">
                <div className="field-group">
                  <Label className="field-label">MODEL-DESC</Label>
                  <Input value={modelDescription} onChange={(e) => setModelDescription(e.target.value)} placeholder="T14S G3" className="nerv-input" />
                </div>
                <div className="options-group">
                  <Label className="field-label">OPTIONS</Label>
                  <div className="field-checkbox">
                    <Checkbox id="sporadicAllParts" checked={sporadicAllParts} onCheckedChange={setSporadicAllParts} className="nerv-checkbox" />
                    <Label htmlFor="sporadicAllParts" className="checkbox-label">SPORADIC: REPLACE ALL</Label>
                  </div>
                  <div className="field-checkbox">
                    <Checkbox id="moreThan4Parts" checked={moreThan4Parts} onCheckedChange={setMoreThan4Parts} className="nerv-checkbox" />
                    <Label htmlFor="moreThan4Parts" className="checkbox-label">&gt;4 PARTS BLOCK</Label>
                  </div>
                </div>
              </div>
              <div className="field-group">
                <Label className="field-label">SPORADIC-NOTE</Label>
                <Textarea value={sporadicNote} onChange={(e) => setSporadicNote(e.target.value)} className="nerv-textarea" />
              </div>
              {moreThan4Parts && (
                <div className="field-group">
                  <Label className="field-label">WHY &gt;4 PARTS</Label>
                  <Textarea value={whyMoreThan4} onChange={(e) => setWhyMoreThan4(e.target.value)} className="nerv-textarea" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Output Section */}
        <MultiOutput outputs={outputs} onGenerate={handleGenerate} onClearPane={handleClearPane} denseMode={denseMode} />
      </div>

      <style jsx>{`
        .nerv-container {
          min-height: 100vh;
          background: radial-gradient(ellipse at center, #0d1117 0%, #050810 100%);
          color: #8a9199;
          font-family: 'Roboto Mono', 'Courier New', monospace;
          position: relative;
          overflow-x: hidden;
        }

        .nerv-container::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: 
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.015) 2px, rgba(255, 255, 255, 0.015) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 255, 255, 0.015) 2px, rgba(255, 255, 255, 0.015) 4px);
          pointer-events: none;
          z-index: 1;
        }

        .nerv-container::after {
          content: '';
          position: fixed;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%);
          pointer-events: none;
          z-index: 2;
        }

        .scan-overlay {
          display: none;
        }

        .noise-overlay {
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.015'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 3;
          animation: flicker 3s infinite;
        }

        @keyframes flicker {
          0%, 100% { opacity: 0.015; }
          50% { opacity: 0.012; }
        }

        /* Top Bar */
        .nerv-topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(5, 8, 16, 0.98);
          border-bottom: 1px solid rgba(120, 130, 140, 0.25);
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.03), 0 4px 20px rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
        }

        .topbar-inner {
          max-width: 1600px;
          margin: 0 auto;
          padding: 8px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .logo-img {
          height: 28px;
          object-fit: contain;
          filter: brightness(1.2) contrast(1.1);
        }

        .telemetry {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: rgba(15, 20, 28, 0.9);
          border: 1px solid rgba(120, 130, 140, 0.3);
          clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
        }

        .telem-label {
          font-size: 9px;
          color: rgba(100, 200, 255, 0.5);
          letter-spacing: 1px;
        }

        .telem-value {
          font-size: 11px;
          color: rgba(100, 200, 255, 0.9);
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .controls-section {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .mode-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 10px;
          background: rgba(15, 20, 28, 0.8);
          border: 1px solid rgba(100, 150, 200, 0.25);
        }

        .mode-label {
          font-size: 10px;
          color: rgba(100, 200, 255, 0.7);
          letter-spacing: 1px;
          cursor: pointer;
          user-select: none;
        }

        .nerv-checkbox {
          border-color: rgba(100, 200, 255, 0.4);
        }

        .nerv-checkbox[data-state="checked"] {
          background: rgba(180, 255, 50, 0.9);
          border-color: rgba(180, 255, 50, 0.9);
        }

        .nerv-btn-secondary {
          background: rgba(25, 30, 38, 0.9);
          border: 1px solid rgba(120, 130, 140, 0.35);
          color: rgba(100, 200, 255, 0.8);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1px;
          height: 28px;
          padding: 0 14px;
          transition: all 0.12s;
        }

        .nerv-btn-secondary:hover {
          background: rgba(25, 30, 38, 1);
          border-color: rgba(100, 200, 255, 0.55);
          color: rgba(100, 200, 255, 1);
        }

        /* Main Content */
        .nerv-main {
          max-width: 1600px;
          margin: 0 auto;
          padding: 16px;
          position: relative;
          z-index: 10;
        }

        /* Grid Layout */
        .sections-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 14px;
        }

        @media (max-width: 1100px) {
          .sections-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Panel */
        .nerv-panel {
          background: rgba(12, 16, 22, 0.92);
          border: 1px solid rgba(120, 130, 140, 0.22);
          position: relative;
          min-height: 200px;
          transition: border-color 0.15s;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02), 0 2px 8px rgba(0, 0, 0, 0.4);
        }

        .nerv-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at center, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 16px 16px;
          pointer-events: none;
          opacity: 0.3;
        }

        .nerv-panel:focus-within {
          border-color: rgba(120, 130, 140, 0.4);
        }

        .nerv-panel.full-width {
          grid-column: 1 / -1;
          border-color: rgba(120, 130, 140, 0.28);
        }

        /* Section Header */
        .nerv-section-header {
          width: 100%;
          padding: 10px 14px;
          background: rgba(8, 12, 18, 0.85);
          border-bottom: 1px solid rgba(120, 130, 140, 0.25);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          cursor: pointer;
          transition: background 0.12s;
        }

        .nerv-section-header:hover {
          background: rgba(12, 16, 22, 0.95);
        }

        .corner-brackets {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .bracket {
          position: absolute;
          width: 10px;
          height: 10px;
          border-color: rgba(100, 200, 255, 0.4);
        }

        .bracket.tl {
          top: 0;
          left: 0;
          border-top: 1px solid;
          border-left: 1px solid;
        }

        .bracket.tr {
          top: 0;
          right: 0;
          border-top: 1px solid;
          border-right: 1px solid;
        }

        .bracket.bl {
          bottom: 0;
          left: 0;
          border-bottom: 1px solid;
          border-left: 1px solid;
        }

        .bracket.br {
          bottom: 0;
          right: 0;
          border-bottom: 1px solid;
          border-right: 1px solid;
        }

        .nerv-section-header .title {
          font-size: 11px;
          font-weight: 700;
          color: rgba(140, 150, 160, 0.95);
          letter-spacing: 2px;
        }

        .nerv-section-header .chevron {
          width: 14px;
          height: 14px;
          color: rgba(100, 200, 255, 0.5);
          transition: transform 0.15s;
        }

        /* Panel Content */
        .panel-content {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Field Group */
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .field-label {
          font-size: 9px;
          color: rgba(100, 200, 255, 0.55);
          letter-spacing: 1.5px;
          font-weight: 600;
        }

        .nerv-input, .nerv-select, .nerv-textarea {
          background: rgba(8, 12, 18, 0.85);
          border: 1px solid rgba(100, 150, 200, 0.25);
          color: #b0b8c0;
          font-family: 'Roboto Mono', monospace;
          font-size: 12px;
          padding: 6px 10px;
          height: auto;
          transition: all 0.12s;
        }

        .nerv-input {
          height: 32px;
        }

        .nerv-textarea {
          min-height: 60px;
          resize: vertical;
          line-height: 1.4;
        }

        .nerv-textarea.mono {
          font-size: 11px;
        }

        .nerv-input:focus, .nerv-select:focus, .nerv-textarea:focus {
          outline: none;
          border-color: rgba(100, 200, 255, 0.5);
          box-shadow: 0 0 0 1px rgba(100, 200, 255, 0.25);
          background: rgba(10, 14, 20, 0.95);
        }

        .nerv-input::placeholder, .nerv-textarea::placeholder {
          color: rgba(160, 168, 176, 0.4);
          font-size: 11px;
        }

        .nerv-dropdown {
          background: rgba(12, 16, 22, 0.98);
          border: 1px solid rgba(120, 130, 140, 0.4);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.8);
        }

        .nerv-option {
          color: #b0b8c0;
          font-size: 11px;
          letter-spacing: 0.5px;
        }

        .nerv-option:focus {
          background: rgba(100, 200, 255, 0.12);
          color: rgba(100, 200, 255, 0.95);
        }

        /* Checkbox Field */
        .field-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 4px;
        }

        .checkbox-label {
          font-size: 9px;
          color: rgba(160, 168, 176, 0.9);
          letter-spacing: 0.5px;
          cursor: pointer;
          line-height: 1.3;
        }

        /* Button Toggle */
        .nerv-btn-toggle {
          background: rgba(25, 30, 38, 0.7);
          border: 1px solid rgba(100, 150, 200, 0.25);
          color: rgba(100, 200, 255, 0.75);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 1px;
          height: 26px;
          padding: 0 12px;
          margin-top: 4px;
          transition: all 0.12s;
        }

        .nerv-btn-toggle:hover {
          background: rgba(25, 30, 38, 0.95);
          border-color: rgba(100, 200, 255, 0.45);
          color: rgba(100, 200, 255, 0.95);
        }

        .nerv-btn-toggle.full {
          width: 100%;
        }

        /* Premier Grid */
        .premier-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        @media (max-width: 768px) {
          .premier-grid {
            grid-template-columns: 1fr;
          }
        }

        .options-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}