import React from 'react';
import { Button } from "@/components/ui/button";

const TS_OPTIONS = [
  'AC ADAPTER',
  'PERIPHERALS-OFF',
  'LCD/HINGES',
  'SSD INSPECT',
  'FRONT-CABLES',
  'BATT-CONN',
  'CABLE-ROUTE',
  'KEYBOARD',
  'POWER-DRAIN',
  'DOCK-STATION',
  'CAM-SHUTTER',
  'WLAN-RESEAT',
  'MB-INSPECT',
  'BATT-REMOVED',
  'CMOS-RESET',
  'TOUCHPAD',
  'AC-PORT',
  'USB-PORTS',
  'DISP-MECH',
  'ANT-CABLES',
  'FAN-CHECK',
  'BATT-SWELL',
  'POST/BEEP',
  'MB-HEAT',
  'LIQUID-DMG',
  'LAN-PORT',
  'RAM-RESEAT',
  'GPU-RESEAT',
  'PSU-CABLES',
  'HEATSINK-MT',
  'USB-C-PWR',
  'HINGE-STAB',
  'SPK-OPEN',
  'PORT-DMG',
  'EXT-DEV-OFF',
  'EXT-MONITOR',
  'RAM-INDIV',
  'SSD-RESEAT',
  'PSU-SWITCH',
  'THERMAL-IND',
  'CHASSIS-INS',
  'VIDEO-OUT',
  'AUDIO-PORTS',
  'WIFI-ANT',
  'BLUETOOTH',
  'BIOS-UPDATE',
  'DRIVER-REINST',
  'OS-REINSTALL',
  'MEM-TEST',
  'DISP-CALIB',
  'TOUCH-TEST',
  'WEBCAM-TEST',
  'MIC-TEST',
  'CHARGER-TEST',
  'BATT-CALIB',
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
    <div className="ts-chips-container">
      <div className="ts-controls">
        <Button variant="outline" size="sm" onClick={handleSelectAll} className="ts-ctrl-btn">
          SELECT-ALL
        </Button>
        <Button variant="outline" size="sm" onClick={handleDeselectAll} className="ts-ctrl-btn">
          CLEAR-ALL
        </Button>
      </div>

      <div className="ts-chips-grid">
        {filteredOptions.map(option => (
          <Button
            key={option}
            variant="outline"
            size="sm"
            onClick={() => handleToggle(option)}
            className={`ts-chip ${selectedTs.has(option) ? 'selected' : ''}`}
          >
            {option}
          </Button>
        ))}
      </div>

      {filteredOptions.length === 0 && (
        <div className="no-results">NO TS OPTIONS FOUND</div>
      )}

      <style jsx>{`
        .ts-chips-container {
          margin-top: 8px;
          padding: 10px;
          background: rgba(8, 12, 18, 0.7);
          border: 1px solid rgba(100, 150, 200, 0.18);
        }

        .ts-controls {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
        }

        .ts-ctrl-btn {
          background: rgba(25, 30, 38, 0.8);
          border: 1px solid rgba(100, 200, 255, 0.25);
          color: rgba(100, 200, 255, 0.75);
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 1px;
          height: 24px;
          padding: 0 10px;
          transition: all 0.12s;
        }

        .ts-ctrl-btn:hover {
          background: rgba(25, 30, 38, 1);
          border-color: rgba(100, 200, 255, 0.45);
          color: rgba(100, 200, 255, 0.95);
        }

        .ts-chips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 6px;
          max-height: 350px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .ts-chips-grid::-webkit-scrollbar {
          width: 6px;
        }

        .ts-chips-grid::-webkit-scrollbar-track {
          background: rgba(15, 20, 28, 0.6);
        }

        .ts-chips-grid::-webkit-scrollbar-thumb {
          background: rgba(100, 200, 255, 0.25);
          border-radius: 3px;
        }

        .ts-chips-grid::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 200, 255, 0.4);
        }

        .ts-chip {
          background: rgba(25, 30, 38, 0.8);
          border: 1px solid rgba(100, 150, 200, 0.25);
          color: rgba(100, 200, 255, 0.7);
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.3px;
          height: 28px;
          padding: 0 8px;
          transition: all 0.12s;
          text-align: left;
          justify-content: flex-start;
        }

        .ts-chip:hover {
          background: rgba(25, 30, 38, 1);
          border-color: rgba(100, 200, 255, 0.4);
          color: rgba(100, 200, 255, 0.9);
        }

        .ts-chip.selected {
          background: rgba(180, 255, 50, 0.12);
          border-color: rgba(180, 255, 50, 0.5);
          color: rgba(180, 255, 50, 0.95);
        }

        .ts-chip.selected:hover {
          background: rgba(180, 255, 50, 0.18);
          border-color: rgba(180, 255, 50, 0.65);
        }

        .no-results {
          text-align: center;
          padding: 20px;
          color: rgba(160, 168, 176, 0.5);
          font-size: 10px;
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
}