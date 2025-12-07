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
          background: rgba(5, 10, 20, 0.6);
          border: 1px solid rgba(100, 150, 200, 0.2);
        }

        .ts-controls {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
        }

        .ts-ctrl-btn {
          background: rgba(30, 35, 45, 0.8);
          border: 1px solid rgba(100, 200, 255, 0.3);
          color: rgba(100, 200, 255, 0.9);
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 1px;
          height: 24px;
          padding: 0 10px;
          transition: all 0.15s;
        }

        .ts-ctrl-btn:hover {
          background: rgba(100, 200, 255, 0.15);
          border-color: rgba(100, 200, 255, 0.6);
          color: #64c8ff;
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
          background: rgba(20, 25, 35, 0.5);
        }

        .ts-chips-grid::-webkit-scrollbar-thumb {
          background: rgba(100, 200, 255, 0.3);
          border-radius: 3px;
        }

        .ts-chips-grid::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 200, 255, 0.5);
        }

        .ts-chip {
          background: rgba(30, 35, 45, 0.7);
          border: 1px solid rgba(100, 150, 200, 0.3);
          color: rgba(100, 200, 255, 0.8);
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.3px;
          height: 28px;
          padding: 0 8px;
          transition: all 0.15s;
          text-align: left;
          justify-content: flex-start;
        }

        .ts-chip:hover {
          background: rgba(100, 200, 255, 0.1);
          border-color: rgba(100, 200, 255, 0.5);
          color: #64c8ff;
        }

        .ts-chip.selected {
          background: linear-gradient(135deg, rgba(180, 255, 50, 0.25) 0%, rgba(150, 220, 40, 0.25) 100%);
          border-color: #b4ff32;
          color: #b4ff32;
          box-shadow: 0 0 12px rgba(180, 255, 50, 0.3);
        }

        .ts-chip.selected:hover {
          background: linear-gradient(135deg, rgba(180, 255, 50, 0.35) 0%, rgba(150, 220, 40, 0.35) 100%);
          box-shadow: 0 0 16px rgba(180, 255, 50, 0.4);
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