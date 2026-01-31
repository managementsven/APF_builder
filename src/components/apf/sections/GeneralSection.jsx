import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const GeneralSection = React.memo(({ form, updateForm }) => {
  return (
    <div className="card-content">
      <div className="field-group">
        <Label htmlFor="caseId">CASE-ID</Label>
        <Input 
          id="caseId"
          value={form.caseId} 
          onChange={(e) => updateForm({ caseId: e.target.value })} 
          placeholder="2027910571" 
          aria-required="true"
        />
      </div>
      <div className="field-group">
        <Label htmlFor="apfCreator">APF-CREATOR</Label>
        <Input 
          id="apfCreator"
          value={form.apfCreator} 
          onChange={(e) => updateForm({ apfCreator: e.target.value })} 
          aria-required="true"
        />
      </div>
      <div className="field-group">
        <Label htmlFor="actionPlan">ACTION-PLAN</Label>
        <Select value={form.actionPlan} onValueChange={(v) => updateForm({ actionPlan: v })}>
          <SelectTrigger id="actionPlan"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="FAILED">FAILED</SelectItem>
            <SelectItem value="PASSED">PASSED</SelectItem>
            <SelectItem value="N/A">N/A</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="field-group">
        <Label htmlFor="ceCalledIn">CE-CALLED-IN</Label>
        <Select value={form.ceCalledIn} onValueChange={(v) => updateForm({ ceCalledIn: v })}>
          <SelectTrigger id="ceCalledIn"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="YES">YES</SelectItem>
            <SelectItem value="NO">NO</SelectItem>
            <SelectItem value="NOT_REQUIRED">NOT REQUIRED</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="field-group">
        <Label htmlFor="minConf">MIN-CONF (Global)</Label>
        <Select value={form.minConf} onValueChange={(v) => updateForm({ minConf: v })}>
          <SelectTrigger id="minConf"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="NO">NO</SelectItem>
            <SelectItem value="YES">YES</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox 
          id="parts-pickup" 
          checked={form.partsNotPickedUp} 
          onCheckedChange={(v) => updateForm({ partsNotPickedUp: !!v })} 
        />
        <Label htmlFor="parts-pickup" className="text-xs cursor-pointer">
          CE did not pick up parts (5 days)
        </Label>
      </div>
    </div>
  );
});

GeneralSection.displayName = 'GeneralSection';