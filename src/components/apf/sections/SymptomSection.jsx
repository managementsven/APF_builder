import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import PartChips from "../PartChips";

export const SymptomSection = React.memo(({ form, updateForm }) => {
  const [partsExpanded, setPartsExpanded] = useState(false);

  return (
    <div className="card-content">
      <div className="field-group">
        <Label htmlFor="ceNamePhone">CE-NAME / PHONE</Label>
        <Input 
          id="ceNamePhone"
          value={form.ceNamePhone} 
          onChange={(e) => updateForm({ ceNamePhone: e.target.value })} 
        />
      </div>
      <div className="field-group">
        <Label htmlFor="prevWoProblem">PREV-WO-PROBLEM</Label>
        <Input 
          id="prevWoProblem"
          value={form.prevWoProblem} 
          onChange={(e) => updateForm({ prevWoProblem: e.target.value })} 
        />
      </div>
      <div className="field-group">
        <Label htmlFor="prevWoAction">PREV-WO-ACTION</Label>
        <Input 
          id="prevWoAction"
          value={form.prevWoAction} 
          onChange={(e) => updateForm({ prevWoAction: e.target.value })} 
        />
      </div>
      <div className="field-group">
        <Label htmlFor="newSymptom">NEW-SYMPTOM</Label>
        <Textarea 
          id="newSymptom"
          value={form.newSymptom} 
          onChange={(e) => updateForm({ newSymptom: e.target.value })} 
          rows={3} 
          aria-required="true"
        />
      </div>
      <div className="field-group">
        <Label htmlFor="causeNewSymptom">CAUSE</Label>
        <Textarea 
          id="causeNewSymptom"
          value={form.causeNewSymptom} 
          onChange={(e) => updateForm({ causeNewSymptom: e.target.value })} 
          rows={2} 
        />
      </div>
      <div className="field-group">
        <Label htmlFor="nextAction">NEXT-ACTION</Label>
        <Input 
          id="nextAction"
          value={form.nextAction} 
          onChange={(e) => updateForm({ nextAction: e.target.value })} 
        />
      </div>
      <div className="field-group">
        <Label htmlFor="partOrder">PART-ORDER</Label>
        <Textarea 
          id="partOrder"
          value={form.partOrder} 
          onChange={(e) => updateForm({ partOrder: e.target.value })} 
          className="font-mono text-xs" 
          rows={4} 
        />
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setPartsExpanded(!partsExpanded)} 
          className="w-full mt-1"
          aria-expanded={partsExpanded}
          aria-controls="part-options-panel"
        >
          Part Options {partsExpanded ? '▲' : '▼'}
        </Button>
      </div>
      {partsExpanded && (
        <div id="part-options-panel" role="region" aria-label="Part selection options">
          <PartChips 
            partOrder={form.partOrder} 
            setPartOrder={(v) => updateForm({ partOrder: v })} 
          />
        </div>
      )}
    </div>
  );
});

SymptomSection.displayName = 'SymptomSection';