import React from 'react';
import { Button } from "@/components/ui/button";

const PARTS = [
  { key: 'mb_planar', label: 'MB/PLANAR' },
  { key: 'ram', label: 'RAM', promptQty: true },
  { key: 'ssd', label: 'SSD', promptQty: true },
  { key: 'speaker', label: 'SPEAKER' },
  { key: 'c_cover', label: 'C-COVER' },
  { key: 'a_cover', label: 'A-COVER' },
  { key: 'b_cover', label: 'B-COVER' },
  { key: 'd_cover', label: 'D-COVER' },
  { key: 'edp_cable', label: 'EDP-CABLE' },
  { key: 'speaker_cable', label: 'SPK-CABLE' },
  { key: 'subboard', label: 'SUBBOARD' },
  { key: 'dc_in', label: 'DC-IN' },
  { key: 'cmos', label: 'CMOS' },
  { key: 'battery', label: 'BATTERY' },
  { key: 'lcd', label: 'LCD' },
  { key: 'lcd_cable', label: 'LCD-CABLE' },
  { key: 'tp', label: 'TP' },
  { key: 'tp_cable', label: 'TP-CABLE' },
  { key: 'keyboard', label: 'KEYBOARD' },
  { key: 'c_cover_keyboard', label: 'C-CVR+KB' },
  { key: 'psu', label: 'PSU' },
  { key: 'dock', label: 'DOCK' },
];

export default function PartChips({ partOrder, setPartOrder, denseMode }) {
  const parsePartOrder = () => {
    const map = {};
    const lines = partOrder.split('\n').filter(line => line.trim());
    lines.forEach(line => {
      const match = line.match(/^(.+?)\s+x\s+(\d+)\s+-/);
      if (match) {
        const label = match[1].trim();
        const qty = parseInt(match[2], 10);
        const part = PARTS.find(p => p.label.toLowerCase() === label.toLowerCase());
        if (part) {
          map[part.key] = { label: part.label, qty };
        }
      }
    });
    return map;
  };

  const updatePartOrder = (map) => {
    const lines = PARTS
      .filter(part => map[part.key])
      .map(part => {
        const { label, qty } = map[part.key];
        return `${label} x ${qty} -`;
      });
    setPartOrder(lines.join('\n'));
  };

  const handleChipClick = (part) => {
    const map = parsePartOrder();
    
    if (map[part.key]) {
      if (part.promptQty) {
        const currentQty = map[part.key].qty;
        const newQty = prompt(`ENTER QUANTITY FOR ${part.label}:`, currentQty);
        if (newQty !== null) {
          const qty = parseInt(newQty, 10);
          if (qty > 0) {
            map[part.key] = { label: part.label, qty };
          } else {
            delete map[part.key];
          }
        }
      }
    } else {
      if (part.promptQty) {
        const qty = prompt(`ENTER QUANTITY FOR ${part.label}:`, '1');
        if (qty !== null) {
          const qtyNum = parseInt(qty, 10);
          if (qtyNum > 0) {
            map[part.key] = { label: part.label, qty: qtyNum };
          }
        }
      } else {
        map[part.key] = { label: part.label, qty: 1 };
      }
    }
    
    updatePartOrder(map);
  };

  const handleChipDoubleClick = (part) => {
    const map = parsePartOrder();
    if (map[part.key]) {
      delete map[part.key];
      updatePartOrder(map);
    }
  };

  const isSelected = (partKey) => {
    const map = parsePartOrder();
    return !!map[partKey];
  };

  return (
    <div className="part-chips-container">
      <div className="part-chips-grid">
        {PARTS.map(part => (
          <Button
            key={part.key}
            variant="outline"
            size="sm"
            onClick={() => handleChipClick(part)}
            onDoubleClick={() => handleChipDoubleClick(part)}
            className={`part-chip ${isSelected(part.key) ? 'selected' : ''}`}
          >
            {part.label}
          </Button>
        ))}
      </div>

      <style jsx>{`
        .part-chips-container {
          margin-top: 8px;
          padding: 10px;
          background: rgba(8, 12, 18, 0.7);
          border: 1px solid rgba(100, 150, 200, 0.18);
        }

        .part-chips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
          gap: 6px;
        }

        .part-chip {
          background: rgba(25, 30, 38, 0.8);
          border: 1px solid rgba(100, 150, 200, 0.25);
          color: rgba(100, 200, 255, 0.7);
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.5px;
          height: 26px;
          padding: 0 8px;
          transition: all 0.12s;
          text-transform: uppercase;
        }

        .part-chip:hover {
          background: rgba(25, 30, 38, 1);
          border-color: rgba(100, 200, 255, 0.4);
          color: rgba(100, 200, 255, 0.9);
        }

        .part-chip.selected {
          background: rgba(180, 255, 50, 0.12);
          border-color: rgba(180, 255, 50, 0.5);
          color: rgba(180, 255, 50, 0.95);
        }

        .part-chip.selected:hover {
          background: rgba(180, 255, 50, 0.18);
          border-color: rgba(180, 255, 50, 0.65);
        }
      `}</style>
    </div>
  );
}