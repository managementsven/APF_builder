import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import PartChips from "../components/apf/PartChips";
import TSChips from "../components/apf/TSChips";
import OutputPanel from "../components/apf/OutputPanel";

export default function APFBuilder() {
  // Dense mode
  const [denseMode, setDenseMode] = useState(false);

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

  // Output
  const [output, setOutput] = useState('');

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
    setOutput('');
  };

  const handleGenerate = () => {
    const now = new Date();
    const date = now.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const time = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

    // Build CE Called In checkboxes - each on separate line
    const ceCalledInYes = ceCalledIn === 'Yes' ? '[X]' : '[]';
    const ceCalledInNo = ceCalledIn === 'No' ? '[X]' : '[]';
    const ceCalledInNotRequired = ceCalledIn === 'NotRequired' ? '[X]' : '[]';

    // Build Min-conf checkboxes
    const minConfYes = minConf === 'Yes' ? '[X]' : '[]';
    const minConfNo = minConf === 'No' ? '[X]' : '[]';

    // Build TS list as a sentence
    const tsList = Array.from(selectedTs).join(', ');
    const tsFormatted = tsList ? tsList + '.' : '';

    // Build parts not picked up line
    const partsLine = partsNotPickedUp 
      ? '\n[] CE did not pick up parts within 5 days -parts returned (set repeat repair reason to OTHER/UNKNOWN)\n' 
      : '';

    const outputText = `Case ID :${caseId}
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

    setOutput(outputText);
  };

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
        <div className="max-w-[1600px] mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gradient-to-br from-[#E1251B] to-[#c51f17] rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-[#E1251B]/30">
                L
              </div>
              <div>
                <div className="font-bold text-base leading-none bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  APF Builder
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">v17.01</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
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
              className="bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-sm text-xs h-8"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 py-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Column 1: Allgemein */}
          <div className={`backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 shadow-2xl ${denseMode ? 'p-3' : 'p-4'}`}>
            <h2 className={`font-bold text-[#E1251B] ${denseMode ? 'text-sm mb-2.5' : 'text-base mb-3'} tracking-wide`}>
              ALLGEMEIN
            </h2>
            <div className={`space-y-${denseMode ? '2' : '2.5'}`}>
              <div>
                <Label className="text-[10px] mb-1 block text-gray-400 uppercase tracking-wider">Case ID</Label>
                <Input
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  placeholder="z. B. 2027910571"
                  className={`bg-black/30 border-white/10 backdrop-blur-sm ${denseMode ? 'h-7 text-xs' : 'h-8 text-sm'} focus:border-[#E1251B] transition-all`}
                />
              </div>

              <div>
                <Label className="text-[10px] mb-1 block text-gray-400 uppercase tracking-wider">APFCreator</Label>
                <Input
                  value={apfCreator}
                  onChange={(e) => setApfCreator(e.target.value)}
                  className={`bg-black/30 border-white/10 backdrop-blur-sm ${denseMode ? 'h-7 text-xs' : 'h-8 text-sm'} focus:border-[#E1251B] transition-all`}
                />
              </div>

              <div>
                <Label className="text-[10px] mb-1 block text-gray-400 uppercase tracking-wider">Action Plan</Label>
                <Select value={actionPlan} onValueChange={setActionPlan}>
                  <SelectTrigger className={`bg-black/30 border-white/10 backdrop-blur-sm ${denseMode ? 'h-7 text-xs' : 'h-8 text-sm'}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1d2e] border-white/20">
                    <SelectItem value="FAILED">FAILED</SelectItem>
                    <SelectItem value="PASSED">PASSED</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[10px] mb-1 block text-gray-400 uppercase tracking-wider">CE Called In</Label>
                <Select value={ceCalledIn} onValueChange={setCeCalledIn}>
                  <SelectTrigger className={`bg-black/30 border-white/10 backdrop-blur-sm ${denseMode ? 'h-7 text-xs' : 'h-8 text-sm'}`}>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1d2e] border-white/20">
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="NotRequired">NotRequired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[10px] mb-1 block text-gray-400 uppercase tracking-wider">Min-conf</Label>
                <Select value={minConf} onValueChange={setMinConf}>
                  <SelectTrigger className={`bg-black/30 border-white/10 backdrop-blur-sm ${denseMode ? 'h-7 text-xs' : 'h-8 text-sm'}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1d2e] border-white/20">
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
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
                <Label htmlFor="parts-pickup" className={`text-[10px] leading-tight cursor-pointer text-gray-300`}>
                  CE did not pick up parts within 5 days – parts returned
                </Label>
              </div>
            </div>
          </div>

          {/* Column 2: WO / Symptom */}
          <div className={`backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 shadow-2xl ${denseMode ? 'p-3' : 'p-4'}`}>
            <h2 className={`font-bold text-[#E1251B] ${denseMode ? 'text-sm mb-2.5' : 'text-base mb-3'} tracking-wide`}>
              WO / SYMPTOM
            </h2>
            <div className={`space-y-${denseMode ? '2' : '2.5'}`}>
              <div>
                <Label className="text-[10px] mb-1 block text-gray-400 uppercase tracking-wider">CE Name/Phone</Label>
                <Input
                  value={ceNamePhone}
                  onChange={(e) => setCeNamePhone(e.target.value)}
                  placeholder="CE name and phone number"
                  className={`bg-black/30 border-white/10 backdrop-blur-sm ${denseMode ? 'h-7 text-xs' : 'h-8 text-sm'} focus:border-[#E1251B] transition-all`}
                />
              </div>

              <div>
                <Label className="text-[10px] mb-1 block text-gray-400 uppercase tracking-wider">Previous WO Problem</Label>
                <Input
                  value={prevWoProblem}
                  onChange={(e) => setPrevWoProblem(e.target.value)}
                  placeholder="Previous WO problem (short)"
                  className={`bg-black/30 border-white/10 backdrop-blur-sm ${denseMode ? 'h-7 text-xs' : 'h-8 text-sm'} focus:border-[#E1251B] transition-all`}
                />
              </div>

              <div>
                <Label className="text-[10px] mb-1 block text-gray-400 uppercase tracking-wider">Previous WO Action</Label>
                <Input
                  value={prevWoAction}
                  onChange={(e) => setPrevWoAction(e.target.value)}
                  placeholder="Actions performed in previous WO"
                  className={`bg-black/30 border-white/10 backdrop-blur-sm ${denseMode ? 'h-7 text-xs' : 'h-8 text-sm'} focus:border-[#E1251B] transition-all`}
                />
              </div>

              <div>
                <Label className="text-[10px] mb-1 block text-gray-400 uppercase tracking-wider">New Symptom</Label>
                <Textarea
                  value={newSymptom}
                  onChange={(e) => setNewSymptom(e.target.value)}
                  placeholder="New symptom description"
                  className={`bg-black/30 border-white/10 backdrop-blur-sm ${denseMode ? 'min-h-[50px] text-xs' : 'min-h-[60px] text-sm'} focus:border-[#E1251B] transition-all`}
                />
              </div>

              <div>
                <Label className="text-[10px] mb-1 block text-gray-400 uppercase tracking-wider">Cause for new symptom</Label>
                <Textarea
                  value={causeNewSymptom}
                  onChange={(e) => setCauseNewSymptom(e.target.value)}
                  placeholder="Your assessment of the cause"
                  className={`bg-black/30 border-white/10 backdrop-blur-sm ${denseMode ? 'min-h-[50px] text-xs' : 'min-h-[60px] text-sm'} focus:border-[#E1251B] transition-all`}
                />
              </div>

              <div>
                <Label className="text-[10px] mb-1 block text-gray-400 uppercase tracking-wider">Next action</Label>
                <Input
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  placeholder="Planned next step"
                  className={`bg-black/30 border-white/10 backdrop-blur-sm ${denseMode ? 'h-7 text-xs' : 'h-8 text-sm'} focus:border-[#E1251B] transition-all`}
                />
              </div>

              <div>
                <Label className="text-[10px] mb-1 block text-gray-400 uppercase tracking-wider">
                  Part order
                </Label>
                <Textarea
                  value={partOrder}
                  onChange={(e) => setPartOrder(e.target.value)}
                  placeholder="z. B. Cover - 5M11Q55940"
                  className={`bg-black/30 border-white/10 backdrop-blur-sm font-mono ${denseMode ? 'min-h-[60px] text-[10px]' : 'min-h-[70px] text-xs'} focus:border-[#E1251B] transition-all`}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPartsExpanded(!partsExpanded)}
                  className={`mt-1.5 text-[10px] bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-sm ${denseMode ? 'h-6 px-2' : 'h-7 px-2.5'}`}
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
          </div>

          {/* Column 3: CE On-Site TS */}
          <div className={`backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 shadow-2xl ${denseMode ? 'p-3' : 'p-4'}`}>
            <h2 className={`font-bold text-[#E1251B] ${denseMode ? 'text-sm mb-2.5' : 'text-base mb-3'} tracking-wide`}>
              CE ON-SITE TS
            </h2>
            <div className={`space-y-${denseMode ? '2' : '2.5'}`}>
              <div>
                <Label className="text-[10px] mb-1 block text-gray-400 uppercase tracking-wider">Min-conf</Label>
                <Select value={minConfTs} onValueChange={setMinConfTs}>
                  <SelectTrigger className={`bg-black/30 border-white/10 backdrop-blur-sm ${denseMode ? 'h-7 text-xs' : 'h-8 text-sm'}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1d2e] border-white/20">
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[10px] mb-1 block text-gray-400 uppercase tracking-wider">TS-Suche</Label>
                <Input
                  value={tsSearch}
                  onChange={(e) => setTsSearch(e.target.value)}
                  placeholder="z. B. RAM, SSD, Battery…"
                  className={`bg-black/30 border-white/10 backdrop-blur-sm ${denseMode ? 'h-7 text-xs' : 'h-8 text-sm'} focus:border-[#E1251B] transition-all`}
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTsExpanded(!tsExpanded)}
                className={`text-[10px] bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-sm ${denseMode ? 'h-6 px-2' : 'h-7 px-2.5'}`}
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
                <Label className="text-[10px] mb-1 block text-gray-400 uppercase tracking-wider">
                  Weitere TS-Details
                </Label>
                <Textarea
                  value={additionalTsDetails}
                  onChange={(e) => setAdditionalTsDetails(e.target.value)}
                  placeholder="Optional: zusätzliche Details..."
                  className={`bg-black/30 border-white/10 backdrop-blur-sm ${denseMode ? 'min-h-[60px] text-xs' : 'min-h-[70px] text-sm'} focus:border-[#E1251B] transition-all`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Output Section - Full Width */}
        <div className="mt-3">
          <OutputPanel 
            output={output}
            onGenerate={handleGenerate}
            denseMode={denseMode}
          />
        </div>
      </div>

      <style jsx>{`
        .dense .space-y-3 > * + * {
          margin-top: 0.5rem;
        }
        .dense .space-y-2\.5 > * + * {
          margin-top: 0.375rem;
        }
        .dense .space-y-2 > * + * {
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
}