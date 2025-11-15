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

    // Build CE Called In checkboxes
    const ceCalledInYes = ceCalledIn === 'Yes' ? '[X]' : '[ ]';
    const ceCalledInNo = ceCalledIn === 'No' ? '[X]' : '[ ]';
    const ceCalledInNotRequired = ceCalledIn === 'NotRequired' ? '[X]' : '[ ]';

    // Build Min-conf checkboxes
    const minConfYes = minConf === 'Yes' ? '[X]' : '[ ]';
    const minConfNo = minConf === 'No' ? '[X]' : '[ ]';

    // Build TS list
    const tsList = Array.from(selectedTs).join(', ');

    // Build parts not picked up line
    const partsLine = partsNotPickedUp 
      ? '\n[] CE did not pick up parts within 5 days - parts returned (set repeat repair reason to OTHER/UNKNOWN)\n' 
      : '';

    const outputText = `Case ID : ${caseId}
APFCreator: ${apfCreator}

**** ACTION PLAN ${actionPlan} ****
CE-Called-In-Yes:${ceCalledInYes} / CE-Called-In-No:${ceCalledInNo} / CE-Called-In-NotRequired:${ceCalledInNotRequired}
Min-conf-yes:${minConfYes} / Min-conf-no:${minConfNo}

WO / Symptom
CE Name/Phone: ${ceNamePhone}
Previous WO Problem: ${prevWoProblem}
Previous WO Action: ${prevWoAction}
New Symptom: ${newSymptom}
Cause for new symptom: ${causeNewSymptom}
Next action: ${nextAction}

Part order:
${partOrder}

CE TS performed:
Min-conf (Bestätigung): ${minConfTs}
TS selected: ${tsList}

Additional TS details (free):
${additionalTsDetails}
${partsLine}
Generated on: ${date} at ${time}
--- End ---`;

    setOutput(outputText);
  };

  return (
    <div className={`min-h-screen bg-[#1a1d23] text-gray-200 ${denseMode ? 'dense' : ''}`}>
      {/* Toolbar */}
      <div className="sticky top-0 z-50 bg-[#252830] border-b border-gray-700 shadow-lg">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#E1251B] rounded flex items-center justify-center font-bold text-white text-sm">
                L
              </div>
              <span className="font-semibold text-lg">APF Builder</span>
              <span className="text-xs text-gray-400">v17.01</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="dense" 
                checked={denseMode} 
                onCheckedChange={setDenseMode}
                className="border-gray-600"
              />
              <Label htmlFor="dense" className="text-sm cursor-pointer">Kompakt</Label>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleReset}
              className="bg-transparent border-gray-600 hover:bg-gray-700 hover:border-gray-500"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Column 1: Allgemein */}
          <div className={`bg-[#252830] rounded-lg border border-gray-700 ${denseMode ? 'p-3' : 'p-5'}`}>
            <h2 className={`font-semibold text-[#E1251B] ${denseMode ? 'text-base mb-3' : 'text-lg mb-4'}`}>
              Allgemein
            </h2>
            <div className={`space-y-${denseMode ? '2' : '3'}`}>
              <div>
                <Label className={`text-xs ${denseMode ? 'mb-1' : 'mb-1.5'} block`}>Case ID</Label>
                <Input
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  placeholder="z. B. 2027910571"
                  className={`bg-[#1a1d23] border-gray-600 ${denseMode ? 'h-8 text-sm' : 'h-9'}`}
                />
              </div>

              <div>
                <Label className={`text-xs ${denseMode ? 'mb-1' : 'mb-1.5'} block`}>APFCreator</Label>
                <Input
                  value={apfCreator}
                  onChange={(e) => setApfCreator(e.target.value)}
                  className={`bg-[#1a1d23] border-gray-600 ${denseMode ? 'h-8 text-sm' : 'h-9'}`}
                />
              </div>

              <div>
                <Label className={`text-xs ${denseMode ? 'mb-1' : 'mb-1.5'} block`}>Action Plan</Label>
                <Select value={actionPlan} onValueChange={setActionPlan}>
                  <SelectTrigger className={`bg-[#1a1d23] border-gray-600 ${denseMode ? 'h-8 text-sm' : 'h-9'}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FAILED">FAILED</SelectItem>
                    <SelectItem value="PASSED">PASSED</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className={`text-xs ${denseMode ? 'mb-1' : 'mb-1.5'} block`}>CE Called In</Label>
                <Select value={ceCalledIn} onValueChange={setCeCalledIn}>
                  <SelectTrigger className={`bg-[#1a1d23] border-gray-600 ${denseMode ? 'h-8 text-sm' : 'h-9'}`}>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="NotRequired">NotRequired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className={`text-xs ${denseMode ? 'mb-1' : 'mb-1.5'} block`}>Min-conf</Label>
                <Select value={minConf} onValueChange={setMinConf}>
                  <SelectTrigger className={`bg-[#1a1d23] border-gray-600 ${denseMode ? 'h-8 text-sm' : 'h-9'}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <Checkbox
                  id="parts-pickup"
                  checked={partsNotPickedUp}
                  onCheckedChange={setPartsNotPickedUp}
                  className="border-gray-600 mt-0.5"
                />
                <Label htmlFor="parts-pickup" className={`text-xs leading-tight cursor-pointer ${denseMode ? 'text-[11px]' : ''}`}>
                  CE did not pick up parts within 5 days – parts returned (set repeat repair reason to OTHER/UNKNOWN)
                </Label>
              </div>
            </div>
          </div>

          {/* Column 2: WO / Symptom */}
          <div className={`bg-[#252830] rounded-lg border border-gray-700 ${denseMode ? 'p-3' : 'p-5'}`}>
            <h2 className={`font-semibold text-[#E1251B] ${denseMode ? 'text-base mb-3' : 'text-lg mb-4'}`}>
              WO / Symptom
            </h2>
            <div className={`space-y-${denseMode ? '2' : '3'}`}>
              <div>
                <Label className={`text-xs ${denseMode ? 'mb-1' : 'mb-1.5'} block`}>CE Name/Phone</Label>
                <Input
                  value={ceNamePhone}
                  onChange={(e) => setCeNamePhone(e.target.value)}
                  placeholder="CE name and phone number"
                  className={`bg-[#1a1d23] border-gray-600 ${denseMode ? 'h-8 text-sm' : 'h-9'}`}
                />
              </div>

              <div>
                <Label className={`text-xs ${denseMode ? 'mb-1' : 'mb-1.5'} block`}>Previous WO Problem</Label>
                <Input
                  value={prevWoProblem}
                  onChange={(e) => setPrevWoProblem(e.target.value)}
                  placeholder="Previous WO problem (short)"
                  className={`bg-[#1a1d23] border-gray-600 ${denseMode ? 'h-8 text-sm' : 'h-9'}`}
                />
              </div>

              <div>
                <Label className={`text-xs ${denseMode ? 'mb-1' : 'mb-1.5'} block`}>Previous WO Action</Label>
                <Input
                  value={prevWoAction}
                  onChange={(e) => setPrevWoAction(e.target.value)}
                  placeholder="Actions performed in previous WO"
                  className={`bg-[#1a1d23] border-gray-600 ${denseMode ? 'h-8 text-sm' : 'h-9'}`}
                />
              </div>

              <div>
                <Label className={`text-xs ${denseMode ? 'mb-1' : 'mb-1.5'} block`}>New Symptom</Label>
                <Textarea
                  value={newSymptom}
                  onChange={(e) => setNewSymptom(e.target.value)}
                  placeholder="New symptom description (customer view)"
                  className={`bg-[#1a1d23] border-gray-600 ${denseMode ? 'min-h-[60px] text-sm' : 'min-h-[80px]'}`}
                />
              </div>

              <div>
                <Label className={`text-xs ${denseMode ? 'mb-1' : 'mb-1.5'} block`}>Cause for new symptom</Label>
                <Textarea
                  value={causeNewSymptom}
                  onChange={(e) => setCauseNewSymptom(e.target.value)}
                  placeholder="Your assessment of the cause for the new symptom"
                  className={`bg-[#1a1d23] border-gray-600 ${denseMode ? 'min-h-[60px] text-sm' : 'min-h-[80px]'}`}
                />
              </div>

              <div>
                <Label className={`text-xs ${denseMode ? 'mb-1' : 'mb-1.5'} block`}>Next action</Label>
                <Input
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  placeholder="Planned next step (e.g. re-dispatch, order parts, close case)"
                  className={`bg-[#1a1d23] border-gray-600 ${denseMode ? 'h-8 text-sm' : 'h-9'}`}
                />
              </div>

              <div>
                <Label className={`text-xs ${denseMode ? 'mb-1' : 'mb-1.5'} block`}>
                  Part order (jede Zeile ein Teil)
                </Label>
                <Textarea
                  value={partOrder}
                  onChange={(e) => setPartOrder(e.target.value)}
                  placeholder="z. B. Cover - 5M11Q55940"
                  className={`bg-[#1a1d23] border-gray-600 font-mono ${denseMode ? 'min-h-[80px] text-xs' : 'min-h-[100px] text-sm'}`}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPartsExpanded(!partsExpanded)}
                  className={`mt-2 text-xs bg-[#1a1d23] border border-gray-600 hover:bg-gray-700 ${denseMode ? 'h-7 px-2' : 'h-8 px-3'}`}
                >
                  Part-Optionen {partsExpanded ? 'ausblenden' : 'einblenden'}
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
          <div className={`bg-[#252830] rounded-lg border border-gray-700 ${denseMode ? 'p-3' : 'p-5'}`}>
            <h2 className={`font-semibold text-[#E1251B] ${denseMode ? 'text-base mb-3' : 'text-lg mb-4'}`}>
              CE On-Site TS
            </h2>
            <div className={`space-y-${denseMode ? '2' : '3'}`}>
              <div>
                <Label className={`text-xs ${denseMode ? 'mb-1' : 'mb-1.5'} block`}>Min-conf (Bestätigung)</Label>
                <Select value={minConfTs} onValueChange={setMinConfTs}>
                  <SelectTrigger className={`bg-[#1a1d23] border-gray-600 ${denseMode ? 'h-8 text-sm' : 'h-9'}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className={`text-xs ${denseMode ? 'mb-1' : 'mb-1.5'} block`}>TS-Suche</Label>
                <Input
                  value={tsSearch}
                  onChange={(e) => setTsSearch(e.target.value)}
                  placeholder="z. B. RAM, SSD, Battery…"
                  className={`bg-[#1a1d23] border-gray-600 ${denseMode ? 'h-8 text-sm' : 'h-9'}`}
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTsExpanded(!tsExpanded)}
                className={`text-xs bg-[#1a1d23] border border-gray-600 hover:bg-gray-700 ${denseMode ? 'h-7 px-2' : 'h-8 px-3'}`}
              >
                TS-Optionen {tsExpanded ? 'ausblenden' : 'einblenden'}
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
                <Label className={`text-xs ${denseMode ? 'mb-1' : 'mb-1.5'} block`}>
                  Weitere TS-Details (frei)
                </Label>
                <Textarea
                  value={additionalTsDetails}
                  onChange={(e) => setAdditionalTsDetails(e.target.value)}
                  placeholder="Optional: zusätzliche Details..."
                  className={`bg-[#1a1d23] border-gray-600 ${denseMode ? 'min-h-[80px] text-sm' : 'min-h-[100px]'}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Output Section - Full Width */}
        <div className="mt-4">
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
        .dense .space-y-2 > * + * {
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
}