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
  // Dense mode
  const [denseMode, setDenseMode] = useState(false);

  // Collapsible sections
  const [allgemeinExpanded, setAllgemeinExpanded] = useState(true);
  const [woSymptomExpanded, setWoSymptomExpanded] = useState(true);
  const [ceOnSiteExpanded, setCeOnSiteExpanded] = useState(true);
  const [premierExpanded, setPremierExpanded] = useState(true);

  // Allgemein fields
  const [caseId, setCaseId] = useState('');
  const [apfCreator, setApfCreator] = useState('');
  const [actionPlan, setActionPlan] = useState('FAILED');
  const [ceCalledIn, setCeCalledIn] = useState('');
  const [minConf, setMinConf] = useState('No');
  const [partsNotPickedUp, setPartsNotPickedUp] = useState(false);

  // WO / Symptom fields
  const [ceNamePhone, setCeNamePhone] = useState('');
  const [prevWoProblem, setPrevWoProblem] = useState('');
  const [prevWoAction, setPrevWoAction] = useState('');
  const [newSymptom, setNewSymptom] = useState('');
  const [causeNewSymptom, setCauseNewSymptom] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [partOrder, setPartOrder] = useState('');
  const [partsExpanded, setPartsExpanded] = useState(false);

  // CE On-Site TS fields
  const [minConfTs, setMinConfTs] = useState('No');
  const [tsSearch, setTsSearch] = useState('');
  const [selectedTs, setSelectedTs] = useState(new Set());
  const [tsExpanded, setTsExpanded] = useState(false);
  const [additionalTsDetails, setAdditionalTsDetails] = useState('');

  // Premier Support fields
  const [modelDescription, setModelDescription] = useState('');
  const [sporadicAllParts, setSporadicAllParts] = useState(false);
  const [sporadicNote, setSporadicNote] = useState('');
  const [moreThan4Parts, setMoreThan4Parts] = useState(false);
  const [whyMoreThan4, setWhyMoreThan4] = useState('');

  // Outputs
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
    setOutputs({
      apf: '',
      premier: '',
      escalation: '',
      showEscalation: false
    });
  };

  const handleGenerate = () => {
    const now = new Date();
    const date = now.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const time = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

    // ========== APF Output ==========
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

    // ========== Premier Support Output ==========
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

    // ========== >4 Parts Escalation Output ==========
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
    setOutputs(prev => ({
      ...prev,
      [pane]: ''
    }));
  };

  const SectionHeader = ({ title, expanded, setExpanded }) => (
    <button
      onClick={() => setExpanded(!expanded)}
      className={`w-full flex items-center justify-between font-bold text-[#E1251B] ${denseMode ? 'text-sm py-2' : 'text-base py-2.5'} tracking-wide hover:opacity-80 transition-all`}
    >
      <span>{title}</span>
      {expanded ? <ChevronUp className="w-4 h-4 transition-transform duration-300" /> : <ChevronDown className="w-4 h-4 transition-transform duration-300" />}
    </button>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#1a1d2e] text-gray-100 ${denseMode ? 'dense' : ''}`}>
      {/* Futuristic Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#E1251B] rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-[#0f1419]/80 border-b border-gray-700/50 shadow-2xl">
        <div className="max-w-[1600px] mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6918520f2d38836a5df81c78/ce88ba337_apf_builder_logo_light_1024.png"
                alt="APF Builder"
                className="h-8 object-contain"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 clay-panel">
              <Checkbox 
                id="dense" 
                checked={denseMode} 
                onCheckedChange={setDenseMode}
                className="border-gray-500 data-[state=checked]:bg-[#E1251B] data-[state=checked]:border-[#E1251B]"
              />
              <Label htmlFor="dense" className="text-xs cursor-pointer font-medium">Kompakt</Label>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleReset}
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white backdrop-blur-sm text-xs h-8 font-semibold clay-button"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 py-4 relative z-10">
        {/* Three Main Sections - IDENTICAL LAYOUT */}
        <div className="sections-grid">
          {/* Section 1: ALLGEMEIN */}
          <div className="sectionBox">
            <SectionHeader 
              title="ALLGEMEIN" 
              expanded={allgemeinExpanded} 
              setExpanded={setAllgemeinExpanded}
            />
            {allgemeinExpanded && (
              <div className="sectionContent">
                <div>
                  <Label className="fieldLabel">Case ID</Label>
                  <Input
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                    placeholder="z. B. 2027910571"
                    className="fieldInput"
                  />
                </div>

                <div>
                  <Label className="fieldLabel">APFCreator</Label>
                  <Input
                    value={apfCreator}
                    onChange={(e) => setApfCreator(e.target.value)}
                    className="fieldInput"
                  />
                </div>

                <div>
                  <Label className="fieldLabel">Action Plan</Label>
                  <Select value={actionPlan} onValueChange={setActionPlan}>
                    <SelectTrigger className="fieldInput">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2a2d3a] border-white/30">
                      <SelectItem value="FAILED" className="text-white focus:bg-white/20 focus:text-white">FAILED</SelectItem>
                      <SelectItem value="PASSED" className="text-white focus:bg-white/20 focus:text-white">PASSED</SelectItem>
                      <SelectItem value="N/A" className="text-white focus:bg-white/20 focus:text-white">N/A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="fieldLabel">CE Called In</Label>
                  <Select value={ceCalledIn} onValueChange={setCeCalledIn}>
                    <SelectTrigger className="fieldInput">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2a2d3a] border-white/30">
                      <SelectItem value="Yes" className="text-white focus:bg-white/20 focus:text-white">Yes</SelectItem>
                      <SelectItem value="No" className="text-white focus:bg-white/20 focus:text-white">No</SelectItem>
                      <SelectItem value="NotRequired" className="text-white focus:bg-white/20 focus:text-white">NotRequired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="fieldLabel">Min-conf</Label>
                  <Select value={minConf} onValueChange={setMinConf}>
                    <SelectTrigger className="fieldInput">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2a2d3a] border-white/30">
                      <SelectItem value="No" className="text-white focus:bg-white/20 focus:text-white">No</SelectItem>
                      <SelectItem value="Yes" className="text-white focus:bg-white/20 focus:text-white">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <Checkbox
                    id="parts-pickup"
                    checked={partsNotPickedUp}
                    onCheckedChange={setPartsNotPickedUp}
                    className="border-gray-500 mt-0.5 data-[state=checked]:bg-[#E1251B] data-[state=checked]:border-[#E1251B]"
                  />
                  <Label htmlFor="parts-pickup" className="text-[10px] leading-tight cursor-pointer text-gray-300">
                    CE did not pick up parts within 5 days – parts returned
                  </Label>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: WO / SYMPTOM */}
          <div className="sectionBox">
            <SectionHeader 
              title="WO / SYMPTOM" 
              expanded={woSymptomExpanded} 
              setExpanded={setWoSymptomExpanded}
            />
            {woSymptomExpanded && (
              <div className="sectionContent">
                <div>
                  <Label className="fieldLabel">CE Name/Phone</Label>
                  <Input
                    value={ceNamePhone}
                    onChange={(e) => setCeNamePhone(e.target.value)}
                    placeholder="CE name and phone number"
                    className="fieldInput"
                  />
                </div>

                <div>
                  <Label className="fieldLabel">Previous WO Problem</Label>
                  <Input
                    value={prevWoProblem}
                    onChange={(e) => setPrevWoProblem(e.target.value)}
                    placeholder="Previous WO problem (short)"
                    className="fieldInput"
                  />
                </div>

                <div>
                  <Label className="fieldLabel">Previous WO Action</Label>
                  <Input
                    value={prevWoAction}
                    onChange={(e) => setPrevWoAction(e.target.value)}
                    placeholder="Actions performed in previous WO"
                    className="fieldInput"
                  />
                </div>

                <div>
                  <Label className="fieldLabel">New Symptom</Label>
                  <Textarea
                    value={newSymptom}
                    onChange={(e) => setNewSymptom(e.target.value)}
                    placeholder="New symptom description"
                    className="fieldInput fieldTextarea"
                  />
                </div>

                <div>
                  <Label className="fieldLabel">Cause for new symptom</Label>
                  <Textarea
                    value={causeNewSymptom}
                    onChange={(e) => setCauseNewSymptom(e.target.value)}
                    placeholder="Your assessment of the cause"
                    className="fieldInput fieldTextarea"
                  />
                </div>

                <div>
                  <Label className="fieldLabel">Next action</Label>
                  <Input
                    value={nextAction}
                    onChange={(e) => setNextAction(e.target.value)}
                    placeholder="Planned next step"
                    className="fieldInput"
                  />
                </div>

                <div>
                  <Label className="fieldLabel">Part order</Label>
                  <Textarea
                    value={partOrder}
                    onChange={(e) => setPartOrder(e.target.value)}
                    placeholder="z. B. Cover - 5M11Q55940"
                    className="fieldInput fieldTextarea font-mono"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPartsExpanded(!partsExpanded)}
                    className="mt-1.5 text-[10px] bg-white/10 border border-white/20 hover:bg-white/20 text-white backdrop-blur-sm font-semibold h-7 px-2.5 clay-button"
                  >
                    Part-Optionen {partsExpanded ? '▲' : '▼'}
                  </Button>
                </div>

                {partsExpanded && (
                  <PartChips 
                    partOrder={partOrder} 
                    setPartOrder={setPartOrder} 
                    denseMode={denseMode}
                  />
                )}
              </div>
            )}
          </div>

          {/* Section 3: CE ON-SITE TS */}
          <div className="sectionBox">
            <SectionHeader 
              title="CE ON-SITE TS" 
              expanded={ceOnSiteExpanded} 
              setExpanded={setCeOnSiteExpanded}
            />
            {ceOnSiteExpanded && (
              <div className="sectionContent">
                <div>
                  <Label className="fieldLabel">Min-conf</Label>
                  <Select value={minConfTs} onValueChange={setMinConfTs}>
                    <SelectTrigger className="fieldInput">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2a2d3a] border-white/30">
                      <SelectItem value="No" className="text-white focus:bg-white/20 focus:text-white">No</SelectItem>
                      <SelectItem value="Yes" className="text-white focus:bg-white/20 focus:text-white">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="fieldLabel">TS-Suche</Label>
                  <Input
                    value={tsSearch}
                    onChange={(e) => setTsSearch(e.target.value)}
                    placeholder="z. B. RAM, SSD, Battery…"
                    className="fieldInput"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTsExpanded(!tsExpanded)}
                  className="text-[10px] bg-white/10 border border-white/20 hover:bg-white/20 text-white backdrop-blur-sm font-semibold h-7 px-2.5 clay-button w-full"
                >
                  TS-Optionen {tsExpanded ? '▲' : '▼'}
                </Button>

                {tsExpanded && (
                  <TSChips
                    selectedTs={selectedTs}
                    setSelectedTs={setSelectedTs}
                    tsSearch={tsSearch}
                    denseMode={denseMode}
                  />
                )}

                <div>
                  <Label className="fieldLabel">Weitere TS-Details</Label>
                  <Textarea
                    value={additionalTsDetails}
                    onChange={(e) => setAdditionalTsDetails(e.target.value)}
                    placeholder="Optional: zusätzliche Details..."
                    className="fieldInput fieldTextarea"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Premier Support Section - Full Width */}
        <div className="mt-3">
          <div className={`backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 shadow-2xl transition-all duration-300 ${denseMode ? 'p-2.5' : 'p-3'} clay-panel`}>
            <SectionHeader 
              title="PREMIER - SUPPORT TEMPLATE" 
              expanded={premierExpanded} 
              setExpanded={setPremierExpanded}
            />
            {premierExpanded && (
              <div className={`pt-1 space-y-${denseMode ? '1.5' : '2'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[10px] mb-1 block text-gray-400 uppercase tracking-wider">Model description</Label>
                    <Input
                      id="modelDescription"
                      value={modelDescription}
                      onChange={(e) => setModelDescription(e.target.value)}
                      placeholder="e.g. T14s G3"
                      className={`bg-black/30 border-white/10 backdrop-blur-sm text-white ${denseMode ? 'h-7 text-xs' : 'h-8 text-sm'} focus:border-[#E1251B] transition-all clay-input`}
                    />
                  </div>

                  <div>
                    <Label className="text-[10px] mb-1 block text-gray-400 uppercase tracking-wider">Options</Label>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="sporadicAllParts"
                          checked={sporadicAllParts}
                          onCheckedChange={setSporadicAllParts}
                          className="border-gray-500 mt-0.5 data-[state=checked]:bg-[#E1251B] data-[state=checked]:border-[#E1251B]"
                        />
                        <Label htmlFor="sporadicAllParts" className="text-[10px] leading-tight cursor-pointer text-gray-300">
                          Sporadic problem, replace ALL ordered parts under all circumstances
                        </Label>
                      </div>

                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="moreThan4Parts"
                          checked={moreThan4Parts}
                          onCheckedChange={setMoreThan4Parts}
                          className="border-gray-500 mt-0.5 data-[state=checked]:bg-[#E1251B] data-[state=checked]:border-[#E1251B]"
                        />
                        <Label htmlFor="moreThan4Parts" className="text-[10px] leading-tight cursor-pointer text-gray-300">
                          Add '&gt;4 parts' justification block
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-[10px] mb-1 block text-gray-400 uppercase tracking-wider">NOTE for sporadic problem</Label>
                  <Textarea
                    id="sporadicNote"
                    value={sporadicNote}
                    onChange={(e) => setSporadicNote(e.target.value)}
                    placeholder="Optional note..."
                    className={`bg-black/30 border-white/10 backdrop-blur-sm text-white ${denseMode ? 'min-h-[40px] text-xs' : 'min-h-[50px] text-sm'} focus:border-[#E1251B] transition-all clay-input`}
                  />
                </div>

                {moreThan4Parts && (
                  <div id="whyMoreThan4Wrap">
                    <Label className="text-[10px] mb-1 block text-gray-400 uppercase tracking-wider">Why are more than 4 parts needed</Label>
                    <Textarea
                      id="whyMoreThan4"
                      value={whyMoreThan4}
                      onChange={(e) => setWhyMoreThan4(e.target.value)}
                      placeholder="Reason for more than 4 parts"
                      className={`bg-black/30 border-white/10 backdrop-blur-sm text-white ${denseMode ? 'min-h-[40px] text-xs' : 'min-h-[50px] text-sm'} focus:border-[#E1251B] transition-all clay-input`}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Multi-Output Section */}
        <div className="mt-3">
          <MultiOutput
            outputs={outputs}
            onGenerate={handleGenerate}
            onClearPane={handleClearPane}
            denseMode={denseMode}
          />
        </div>
      </div>

      <style jsx>{`
        /* ========== UNIFIED SECTIONS GRID ========== */
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
        
        /* ========== UNIFIED SECTION BOX ========== */
        .sectionBox {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 2px 2px 4px rgba(255, 255, 255, 0.03),
            inset -2px -2px 4px rgba(0, 0, 0, 0.3);
          padding: ${denseMode ? '10px' : '12px'};
          transition: all 0.3s ease;
          min-height: 200px;
          display: flex;
          flex-direction: column;
        }
        
        .sectionBox:hover {
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.5),
            inset 2px 2px 4px rgba(255, 255, 255, 0.04),
            inset -2px -2px 4px rgba(0, 0, 0, 0.35);
        }
        
        /* ========== UNIFIED SECTION CONTENT ========== */
        .sectionContent {
          display: flex;
          flex-direction: column;
          gap: ${denseMode ? '10px' : '12px'};
          padding-top: 8px;
          animation: slideDown 0.3s ease;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* ========== UNIFIED FIELD LABELS ========== */
        .fieldLabel {
          font-size: 10px;
          margin-bottom: 4px;
          display: block;
          color: rgba(156, 163, 175, 1);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 500;
        }
        
        /* ========== UNIFIED FIELD INPUTS ========== */
        .fieldInput {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          color: white;
          height: ${denseMode ? '28px' : '32px'};
          font-size: ${denseMode ? '12px' : '14px'};
          transition: all 0.2s ease;
          border-radius: 6px;
          padding: 0 12px;
        }
        
        .fieldInput:focus {
          border-color: #E1251B;
          box-shadow: 
            inset 1px 1px 2px rgba(0, 0, 0, 0.4),
            0 0 0 2px rgba(225, 37, 27, 0.2);
          outline: none;
        }
        
        .fieldTextarea {
          min-height: ${denseMode ? '45px' : '55px'};
          padding: 8px 12px;
          resize: vertical;
        }
        
        /* ========== DENSE MODE ADJUSTMENTS ========== */
        .dense .space-y-2\.5 > * + * {
          margin-top: 0.375rem;
        }
        .dense .space-y-2 > * + * {
          margin-top: 0.25rem;
        }
        .dense .space-y-1\.5 > * + * {
          margin-top: 0.25rem;
        }
        
        /* ========== CLAYMORPHISM EFFECTS ========== */
        .clay-panel {
          box-shadow: 
            inset 2px 2px 4px rgba(255, 255, 255, 0.03),
            inset -2px -2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .clay-input:focus {
          box-shadow: 
            inset 1px 1px 2px rgba(0, 0, 0, 0.4),
            0 0 0 2px rgba(225, 37, 27, 0.2);
        }
        
        .clay-button {
          box-shadow: 
            2px 2px 4px rgba(0, 0, 0, 0.3),
            -1px -1px 2px rgba(255, 255, 255, 0.03);
        }
        
        .clay-button:hover {
          box-shadow: 
            inset 1px 1px 2px rgba(0, 0, 0, 0.3),
            1px 1px 2px rgba(255, 255, 255, 0.02);
        }
        
        .clay-button:active {
          box-shadow: 
            inset 2px 2px 4px rgba(0, 0, 0, 0.4);
        }
        
        .clay-button-primary {
          box-shadow: 
            3px 3px 6px rgba(0, 0, 0, 0.4),
            -1px -1px 3px rgba(255, 255, 255, 0.05),
            0 0 20px rgba(225, 37, 27, 0.3);
        }
        
        .clay-button-primary:hover {
          box-shadow: 
            2px 2px 4px rgba(0, 0, 0, 0.5),
            0 0 25px rgba(225, 37, 27, 0.4);
        }
        
        .clay-output {
          box-shadow: 
            inset 3px 3px 6px rgba(0, 0, 0, 0.5),
            inset -1px -1px 2px rgba(255, 255, 255, 0.02);
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse {
            animation: none;
          }
          * {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}