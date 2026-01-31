import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const PremierSection = React.memo(({ form, updateForm }) => {
  return (
    <div className="card-content">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="field-group">
          <Label htmlFor="modelDescription">MODEL-DESCRIPTION</Label>
          <Input 
            id="modelDescription"
            value={form.modelDescription} 
            onChange={(e) => updateForm({ modelDescription: e.target.value })} 
            placeholder="T14S G3" 
          />
        </div>
        <div className="space-y-2">
          <Label>OPTIONS</Label>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="sporadicAllParts" 
              checked={form.sporadicAllParts} 
              onCheckedChange={(v) => updateForm({ sporadicAllParts: !!v })} 
            />
            <Label htmlFor="sporadicAllParts" className="text-xs cursor-pointer">
              Sporadic: Replace ALL
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="moreThan4Parts" 
              checked={form.moreThan4Parts} 
              onCheckedChange={(v) => updateForm({ moreThan4Parts: !!v })} 
            />
            <Label htmlFor="moreThan4Parts" className="text-xs cursor-pointer">
              &gt;4 Parts Block
            </Label>
          </div>
        </div>
      </div>
      <div className="field-group">
        <Label htmlFor="sporadicNote">SPORADIC-NOTE</Label>
        <Textarea 
          id="sporadicNote"
          value={form.sporadicNote} 
          onChange={(e) => updateForm({ sporadicNote: e.target.value })} 
          rows={2} 
        />
      </div>
      {form.moreThan4Parts && (
        <div className="field-group">
          <Label htmlFor="whyMoreThan4">WHY &gt;4 PARTS</Label>
          <Textarea 
            id="whyMoreThan4"
            value={form.whyMoreThan4} 
            onChange={(e) => updateForm({ whyMoreThan4: e.target.value })} 
            rows={2}
            aria-required="true"
          />
        </div>
      )}
    </div>
  );
});

PremierSection.displayName = 'PremierSection';