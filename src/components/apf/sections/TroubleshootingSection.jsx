import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import TSChips from "../TSChips";

export const TroubleshootingSection = React.memo(({ form, updateForm, selectedTsSet, setSelectedTsSet }) => {
  const [tsExpanded, setTsExpanded] = useState(false);

  return (
    <div className="card-content">
      <div className="field-group">
        <Label htmlFor="minConfTs">MIN-CONF (TS / Override)</Label>
        <Select value={form.minConfTs} onValueChange={(v) => updateForm({ minConfTs: v })}>
          <SelectTrigger id="minConfTs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="NO">NO</SelectItem>
            <SelectItem value="YES">YES</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="field-group">
        <Label htmlFor="tsSearch">TS-SEARCH</Label>
        <Input 
          id="tsSearch"
          value={form.tsSearch} 
          onChange={(e) => updateForm({ tsSearch: e.target.value })} 
          placeholder="Filter..." 
        />
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setTsExpanded(!tsExpanded)} 
        className="w-full"
        aria-expanded={tsExpanded}
        aria-controls="ts-options-panel"
      >
        TS Options {tsExpanded ? '▲' : '▼'}
      </Button>
      {tsExpanded && (
        <div id="ts-options-panel" role="region" aria-label="Troubleshooting options">
          <TSChips 
            selectedTs={selectedTsSet} 
            setSelectedTs={setSelectedTsSet} 
            tsSearch={form.tsSearch} 
          />
        </div>
      )}
      <div className="field-group">
        <Label htmlFor="additionalTsDetails">TS-DETAILS (Additional)</Label>
        <Textarea 
          id="additionalTsDetails"
          value={form.additionalTsDetails} 
          onChange={(e) => updateForm({ additionalTsDetails: e.target.value })} 
          rows={2} 
        />
      </div>
    </div>
  );
});

TroubleshootingSection.displayName = 'TroubleshootingSection';