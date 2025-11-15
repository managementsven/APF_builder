import React from 'react';
import { Button } from "@/components/ui/button";

const TS_OPTIONS = [
  'AC adapter',
  'Peripherals disconnected',
  'LCD/hinges',
  'SSD inspection',
  'Front panel cables',
  'Battery connector',
  'Cable routing',
  'Keyboard',
  'Power drain',
  'Docking station',
  'Camera shutter',
  'WLAN card reseat',
  'Mainboard inspection',
  'Battery removed test',
  'CMOS reset',
  'Touchpad',
  'AC port',
  'USB ports',
  'Display mechanics',
  'Antenna cables',
  'Fan check',
  'Battery swelling',
  'POST / beep codes',
  'Mainboard heat check',
  'Liquid damage',
  'LAN port',
  'RAM reseat',
  'GPU reseat',
  'PSU cables',
  'Heatsink mounting',
  'USB-C power',
  'Hinge stability',
  'Speaker openings',
  'Port damage',
  'External devices removed',
  'External monitor',
  'RAM individual test',
  'SSD reseat',
  'PSU switch',
  'Thermal indicators',
  'Chassis inspection',
  'Video output',
  'Audio ports',
  'WiFi antenna check',
  'Bluetooth check',
  'BIOS update',
  'Driver reinstall',
  'OS reinstall',
  'Memory test',
  'Display calibration',
  'Touchscreen test',
  'Webcam test',
  'Microphone test',
  'Charger test',
  'Battery calibration',
];

export default function TSChips({ selectedTs, setSelectedTs, tsSearch, denseMode }) {
  const filteredOptions = TS_OPTIONS.filter(option =>
    option.toLowerCase().includes(tsSearch.toLowerCase())
  );

  const handleToggle = (option) => {
    const newSet = new Set(selectedTs);
    if (newSet.has(option)) {
      newSet.delete(option);
    } else {
      newSet.add(option);
    }
    setSelectedTs(newSet);
  };

  const handleSelectAll = () => {
    const newSet = new Set(selectedTs);
    filteredOptions.forEach(option => newSet.add(option));
    setSelectedTs(newSet);
  };

  const handleDeselectAll = () => {
    setSelectedTs(new Set());
  };

  return (
    <div className={`${denseMode ? 'mt-1.5' : 'mt-2'}`}>
      <div className={`flex gap-1.5 ${denseMode ? 'mb-1.5' : 'mb-2'}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          className={`${denseMode ? 'h-6 px-2 text-[10px]' : 'h-7 px-2.5 text-[11px]'} bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-sm font-medium`}
        >
          Alle auswählen
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDeselectAll}
          className={`${denseMode ? 'h-6 px-2 text-[10px]' : 'h-7 px-2.5 text-[11px]'} bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-sm font-medium`}
        >
          Alle abwählen
        </Button>
      </div>

      <div className={`grid grid-cols-2 sm:grid-cols-3 ${denseMode ? 'gap-1' : 'gap-1.5'} max-h-[350px] overflow-y-auto pr-1`}>
        {filteredOptions.map(option => (
          <Button
            key={option}
            variant="outline"
            size="sm"
            onClick={() => handleToggle(option)}
            role="button"
            aria-pressed={selectedTs.has(option)}
            title={option}
            className={`
              ${denseMode ? 'h-6 px-1.5 text-[10px]' : 'h-7 px-2 text-[11px]'}
              border-white/10 hover:bg-white/10 transition-all text-left justify-start backdrop-blur-sm font-medium
              ${selectedTs.has(option)
                ? 'bg-gradient-to-r from-[#E1251B] to-[#c51f17] border-[#E1251B] text-white hover:from-[#c51f17] hover:to-[#a01915] shadow-lg shadow-[#E1251B]/30'
                : 'bg-white/5'
              }
            `}
          >
            {option}
          </Button>
        ))}
      </div>

      {filteredOptions.length === 0 && (
        <div className="text-center text-gray-500 text-xs py-3">
          Keine TS-Optionen gefunden
        </div>
      )}
    </div>
  );
}