import React, { useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Minus } from 'lucide-react';

const PARTS_LIST = [
  'MB/Planar',
  'RAM',
  'SSD',
  'Speaker',
  'C-Cover',
  'A-Cover',
  'B-Cover',
  'D-Cover',
  'EDP-Cable',
  'Speaker-Cable',
  'Subboard',
  'DC-IN',
  'CMOS',
  'Battery',
  'LCD',
  'LCD-Cable',
  'TP',
  'TP-Cable',
  'Keyboard',
  'C-Cover+Keyboard',
  'PSU',
  'DOCK',
];

const parsePartOrder = (partOrder) => {
  const lines = partOrder.split('\n');
  const knownParts = {};
  const unknownLines = [];

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    let matched = false;
    for (const partName of PARTS_LIST) {
      const regex = new RegExp(`^${partName.replace(/[+/]/g, '\\$&')}(\\s+x\\s+(\\d+))?(\\s+-\\s*(.*))?$`, 'i');
      const match = trimmed.match(regex);
      if (match) {
        const qty = parseInt(match[2] || '1', 10);
        const details = (match[4] || '').trim();
        if (!knownParts[partName]) {
          knownParts[partName] = { qty: 0, details: '' };
        }
        knownParts[partName].qty += qty;
        if (!knownParts[partName].details && details) {
          knownParts[partName].details = details;
        }
        matched = true;
        break;
      }
    }

    if (!matched) {
      unknownLines.push(line);
    }
  });

  return { knownParts, unknownLines };
};

const buildPartOrder = (knownParts, unknownLines) => {
  const lines = [];
  for (const partName of PARTS_LIST) {
    const part = knownParts[partName];
    if (part && part.qty > 0) {
      const qtyStr = part.qty > 1 ? ` x ${part.qty}` : '';
      const detailsStr = part.details ? ` - ${part.details}` : ' -';
      lines.push(`${partName}${qtyStr}${detailsStr}`);
    }
  }
  unknownLines.forEach(line => {
    if (line.trim()) lines.push(line);
  });
  return lines.join('\n');
};

const PartChips = React.memo(({ partOrder, setPartOrder }) => {
  const { knownParts, unknownLines } = useMemo(() => parsePartOrder(partOrder), [partOrder]);

  const togglePart = (partName) => {
    const updated = { ...knownParts };
    if (updated[partName]) {
      delete updated[partName];
    } else {
      updated[partName] = { qty: 1, details: '' };
    }
    setPartOrder(buildPartOrder(updated, unknownLines));
  };

  const updateQty = (partName, delta) => {
    const updated = { ...knownParts };
    if (!updated[partName]) return;
    updated[partName].qty = Math.max(1, updated[partName].qty + delta);
    setPartOrder(buildPartOrder(updated, unknownLines));
  };

  const updateDetails = (partName, details) => {
    const updated = { ...knownParts };
    if (!updated[partName]) return;
    updated[partName].details = details;
    setPartOrder(buildPartOrder(updated, unknownLines));
  };

  const removePart = (partName) => {
    const updated = { ...knownParts };
    delete updated[partName];
    setPartOrder(buildPartOrder(updated, unknownLines));
  };

  const clearAll = () => {
    setPartOrder(unknownLines.join('\n'));
  };

  const selectedParts = Object.keys(knownParts);

  return (
    <div className="space-y-3 p-3 bg-muted/30 rounded-lg border border-border">
      <div className="flex flex-wrap gap-2">
        {PARTS_LIST.map(partName => {
          const isSelected = !!knownParts[partName];
          const qty = knownParts[partName]?.qty || 0;
          return (
            <button
              key={partName}
              onClick={() => togglePart(partName)}
              className={`part-chip ${isSelected ? 'part-selected' : 'part-unselected'}`}
            >
              <span className="part-name">{partName}</span>
              {isSelected && qty > 1 && <span className="part-qty">x{qty}</span>}
            </button>
          );
        })}
      </div>
      
      <style jsx>{`
        .part-chip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          min-width: 120px;
          min-height: 40px;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid hsl(var(--border));
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          box-sizing: border-box;
          white-space: normal;
          overflow-wrap: anywhere;
          word-break: break-word;
          line-height: 1.2;
          text-align: center;
        }

        .part-chip:hover {
          background: hsl(var(--muted) / 0.5);
        }

        .part-selected {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border-color: hsl(var(--primary));
        }

        .part-unselected {
          background: hsl(var(--background));
          color: hsl(var(--foreground));
        }

        .part-name {
          flex: 1;
          min-width: 0;
        }

        .part-qty {
          font-size: 10px;
          opacity: 0.8;
          white-space: nowrap;
        }
      `}</style>

      {selectedParts.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <Label className="text-xs font-semibold">Selected Parts Editor</Label>
            <Button variant="outline" size="sm" onClick={clearAll} className="h-7 text-xs">
              Clear All
            </Button>
          </div>
          <div className="space-y-2">
            {selectedParts.map(partName => {
              const part = knownParts[partName];
              return (
                <div key={partName} className="flex items-center gap-2 p-2 bg-background rounded border border-border">
                  <span className="text-xs font-medium min-w-[100px]">{partName}</span>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(partName, -1)}>
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={part.qty}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (val >= 1) {
                          const updated = { ...knownParts };
                          updated[partName].qty = val;
                          setPartOrder(buildPartOrder(updated, unknownLines));
                        }
                      }}
                      className="h-7 w-16 text-center text-xs"
                    />
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(partName, 1)}>
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <Input
                    placeholder="FRU / Part No"
                    value={part.details}
                    onChange={(e) => updateDetails(partName, e.target.value)}
                    className="h-7 flex-1 text-xs"
                  />
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removePart(partName)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
});

PartChips.displayName = 'PartChips';

export default PartChips;