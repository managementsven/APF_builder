import React from 'react';
import { Button } from "@/components/ui/button";

const PARTS = [
  { key: 'mb_planar', label: 'MB/Planar' },
  { key: 'ram', label: 'RAM', promptQty: true },
  { key: 'ssd', label: 'SSD', promptQty: true },
  { key: 'speaker', label: 'Speaker' },
  { key: 'c_cover', label: 'C-Cover' },
  { key: 'a_cover', label: 'A-Cover' },
  { key: 'b_cover', label: 'B-Cover' },
  { key: 'd_cover', label: 'D-Cover' },
  { key: 'edp_cable', label: 'EDP-Cable' },
  { key: 'speaker_cable', label: 'Speaker-Cable' },
  { key: 'subboard', label: 'Subboard' },
  { key: 'dc_in', label: 'DC-IN' },
  { key: 'cmos', label: 'CMOS' },
  { key: 'battery', label: 'Battery' },
  { key: 'lcd', label: 'LCD' },
  { key: 'lcd_cable', label: 'LCD-Cable' },
  { key: 'tp', label: 'TP' },
  { key: 'tp_cable', label: 'TP-Cable' },
  { key: 'keyboard', label: 'Keyboard' },
  { key: 'c_cover_keyboard', label: 'C-Cover+Keyboard' },
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
        const part = PARTS.find(p => p.label === label);
        if (part) {
          map[part.key] = { label, qty };
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
      // Part exists - update or remove
      if (part.promptQty) {
        const currentQty = map[part.key].qty;
        const newQty = prompt(`Enter quantity for ${part.label}:`, currentQty);
        if (newQty !== null) {
          const qty = parseInt(newQty, 10);
          if (qty > 0) {
            map[part.key] = { label: part.label, qty };
          } else {
            delete map[part.key];
          }
        }
      } else {
        // For non-prompt parts, single click does nothing if already present
        // Double-click will remove (handled separately)
      }
    } else {
      // Part doesn't exist - add it
      if (part.promptQty) {
        const qty = prompt(`Enter quantity for ${part.label}:`, '1');
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
    <div className={`${denseMode ? 'mt-2' : 'mt-3'}`}>
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 ${denseMode ? 'gap-1.5' : 'gap-2'}`}>
        {PARTS.map(part => (
          <Button
            key={part.key}
            variant="outline"
            size="sm"
            onClick={() => handleChipClick(part)}
            onDoubleClick={() => handleChipDoubleClick(part)}
            role="button"
            aria-pressed={isSelected(part.key)}
            title={part.label}
            className={`
              ${denseMode ? 'h-7 px-2 text-[11px]' : 'h-8 px-3 text-xs'}
              border-gray-600 hover:bg-gray-700 transition-all
              ${isSelected(part.key) 
                ? 'bg-[#E1251B] border-[#E1251B] text-white hover:bg-[#c51f17]' 
                : 'bg-[#1a1d23]'
              }
            `}
          >
            {part.label}
          </Button>
        ))}
      </div>
    </div>
  );
}