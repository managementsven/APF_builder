import React, { useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TS_ACTIONS = [
  { label: 'AC adapter', text: 'Verified AC adapter functionality.' },
  { label: 'Power drain', text: 'Performed power drain on the system.' },
  { label: 'AC port', text: 'Checked the AC port for physical issues.' },
  { label: 'Liquid damage', text: 'Checked system for signs of liquid damage.' },
  { label: 'Port damage', text: 'Inspected ports for mechanical damage.' },
  { label: 'Peripherals removed', text: 'Removed all external devices for isolation.' },
  { label: 'Docking station', text: 'Disconnected and verified docking station functionality.' },
  { label: 'USB ports', text: 'Tested USB ports with known-working devices.' },
  { label: 'LAN port', text: 'Tested LAN port and cable integrity.' },
  { label: 'External monitor', text: 'Tested the system with an external monitor.' },
  { label: 'Video output', text: 'Verified display output through HDMI/DP/USB-C.' },
  { label: 'LCD / hinges', text: 'Inspected LCD panel movement and hinge tension.' },
  { label: 'Camera shutter', text: 'Checked camera shutter functionality.' },
  { label: 'Display mechanics', text: 'Examined the display construction for mechanical faults.' },
  { label: 'RAM reseat', text: 'Reseated RAM modules.' },
  { label: 'RAM individual', text: 'Tested RAM modules individually.' },
  { label: 'SSD reseat', text: 'Reseated the SSD and verified connection integrity.' },
  { label: 'SSD inspection', text: 'Inspected SSD for physical indicators of failure.' },
  { label: 'WLAN card', text: 'Reseated the WLAN card.' },
  { label: 'Antenna cables', text: 'Verified antenna cable seating and routing.' },
  { label: 'GPU reseat', text: 'Reseated the GPU (desktop only).' },
  { label: 'PSU cables', text: 'Verified PSU cable seating (desktop only).' },
  { label: 'PSU switch', text: 'Checked PSU switch and power status (desktop only).' },
  { label: 'Front panel cables', text: 'Verified front-panel connector seating (desktop only).' },
  { label: 'Mainboard inspection', text: 'Inspected motherboard for physical damage or corrosion.' },
  { label: 'Fan check', text: 'Inspected the fan for movement and noise.' },
  { label: 'Cooling system', text: 'Checked cooling system for dust or obstruction.' },
  { label: 'Heatsink mounting', text: 'Verified heatsink alignment and mounting pressure.' },
  { label: 'Thermal indicators', text: 'Assessed the system for thermal stress indicators.' },
  { label: 'Battery connector', text: 'Reseated the internal battery connector.' },
  { label: 'Battery removed test', text: 'Tested system operation with battery removed (if applicable).' },
  { label: 'Battery swelling', text: 'Inspected battery for swelling or deformation.' },
  { label: 'USB-C power', text: 'Verified USB-C power delivery functionality.' },
  { label: 'Hinge stability', text: 'Verified hinge stability and smooth movement.' },
  { label: 'Chassis inspection', text: 'Inspected chassis for cracks or pressure damage.' },
  { label: 'Cable routing', text: 'Checked all visible cables for proper routing and tension.' },
  { label: 'CMOS reset', text: 'Performed CMOS reset.' },
  { label: 'POST / beep codes', text: 'Verified POST behavior and checked for beep codes.' },
  { label: 'Mainboard heat check', text: 'Inspected motherboard for abnormal heat or component damage.' },
  { label: 'Speaker openings', text: 'Checked speaker openings for blockage or physical issues.' },
  { label: 'Audio ports', text: 'Tested mechanical integrity of microphone and audio ports.' },
  { label: 'Keyboard', text: 'Verified keyboard functionality.' },
  { label: 'Touchpad', text: 'Verified touchpad functionality.' },
  { label: 'Cross-test', text: 'Performed cross-test using known-good parts where available.' },
];

const getTsTextByLabel = (label) => {
  const action = TS_ACTIONS.find(a => a.label.toLowerCase() === label.toLowerCase());
  return action ? action.text : label;
};

const TSChips = React.memo(({ selectedTs, setSelectedTs, tsSearch }) => {
  const filtered = useMemo(() => {
    if (!tsSearch?.trim()) return TS_ACTIONS;
    const search = tsSearch.toLowerCase();
    return TS_ACTIONS.filter(a =>
      a.label.toLowerCase().includes(search) || a.text.toLowerCase().includes(search)
    );
  }, [tsSearch]);

  const toggleTs = (label) => {
    const newSet = new Set(selectedTs);
    if (newSet.has(label)) {
      newSet.delete(label);
    } else {
      newSet.add(label);
    }
    setSelectedTs(newSet);
  };

  const selectFiltered = () => {
    const newSet = new Set(selectedTs);
    filtered.forEach(a => newSet.add(a.label));
    setSelectedTs(newSet);
  };

  const clearAll = () => {
    setSelectedTs(new Set());
  };

  return (
    <div className="space-y-3 p-3 bg-muted/30 rounded-lg border border-border">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={selectFiltered} className="h-7 text-xs">
          Select Filtered ({filtered.length})
        </Button>
        <Button variant="outline" size="sm" onClick={clearAll} className="h-7 text-xs">
          Clear All
        </Button>
        {selectedTs.size > 0 && (
          <Badge variant="secondary" className="ml-auto">
            {selectedTs.size} selected
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2" style={{ scrollbarGutter: 'stable' }}>
        {filtered.map(action => {
          const isSelected = selectedTs.has(action.label);
          return (
            <button
              key={action.label}
              onClick={() => toggleTs(action.label)}
              onDoubleClick={() => {
                if (isSelected) toggleTs(action.label);
              }}
              className={`ts-option-card ${isSelected ? 'ts-selected' : 'ts-unselected'}`}
            >
              <div className="ts-option-title">{action.label}</div>
              <div className="ts-option-desc">{action.text}</div>
            </button>
          );
        })}
      </div>
      
      <style jsx>{`
        .ts-option-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-height: 72px;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          cursor: pointer;
          transition: all 0.15s;
          text-align: left;
          width: 100%;
          box-sizing: border-box;
        }

        .ts-option-card:hover {
          background: hsl(var(--muted) / 0.5);
        }

        .ts-selected {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border-color: hsl(var(--primary));
        }

        .ts-unselected {
          background: hsl(var(--background));
          color: hsl(var(--foreground));
        }

        .ts-option-title {
          font-size: 12px;
          font-weight: 600;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
        }

        .ts-option-desc {
          font-size: 10px;
          line-height: 1.35;
          opacity: 0.75;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
        }

        .ts-selected .ts-option-desc {
          opacity: 0.85;
        }
      `}</style>

      {filtered.length === 0 && (
        <div className="text-center text-xs text-muted-foreground py-4">
          No TS options found
        </div>
      )}
    </div>
  );
});

TSChips.displayName = 'TSChips';

export { getTsTextByLabel };
export default TSChips;