import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Download, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

function OutputPane({ title, content, onClear, denseMode, show = true }) {
  const [expanded, setExpanded] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!show) return null;

  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    if (!content) return;
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '_');
    const safeName = title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const filename = `${safeName}_${timestamp}.txt`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const charCount = content ? content.length : 0;

  return (
    <div className="output-pane">
      <button onClick={() => setExpanded(!expanded)} className="output-header">
        <div className="corner-brackets-sm">
          <span className="bracket-sm tl"></span>
          <span className="bracket-sm tr"></span>
          <span className="bracket-sm bl"></span>
          <span className="bracket-sm br"></span>
        </div>
        <span className="output-title">{title}</span>
        {expanded ? <ChevronUp className="chevron-sm" /> : <ChevronDown className="chevron-sm" />}
      </button>

      {expanded && (
        <>
          <div className="output-controls">
            <Button onClick={handleCopy} disabled={!content} variant="outline" size="sm" className="output-btn">
              <Copy className="btn-icon" />
              {copySuccess ? 'OK' : 'COPY'}
            </Button>
            <Button onClick={handleDownload} disabled={!content} variant="outline" size="sm" className="output-btn">
              <Download className="btn-icon" />
              .TXT
            </Button>
            <Button onClick={onClear} disabled={!content} variant="outline" size="sm" className="output-btn">
              <Trash2 className="btn-icon" />
            </Button>
            {charCount > 0 && (
              <span className="char-count">
                {charCount.toLocaleString()} CHR
              </span>
            )}
          </div>

          <pre className="output-display">
            {content || `AWAITING DATA FROM ${title}...`}
          </pre>
        </>
      )}

      <style jsx>{`
        .output-pane {
          background: rgba(12, 16, 22, 0.92);
          border: 1px solid rgba(120, 130, 140, 0.28);
          display: flex;
          flex-direction: column;
          min-height: 200px;
          transition: border-color 0.15s;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02), 0 2px 8px rgba(0, 0, 0, 0.4);
        }

        .output-pane::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at center, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 16px 16px;
          pointer-events: none;
          opacity: 0.3;
        }

        .output-pane:focus-within {
          border-color: rgba(120, 130, 140, 0.45);
        }

        .output-header {
          width: 100%;
          padding: 10px 14px;
          background: rgba(8, 12, 18, 0.85);
          border-bottom: 1px solid rgba(120, 130, 140, 0.25);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          cursor: pointer;
          transition: background 0.12s;
        }

        .output-header:hover {
          background: rgba(12, 16, 22, 0.95);
        }

        .corner-brackets-sm {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .bracket-sm {
          position: absolute;
          width: 10px;
          height: 10px;
          border-color: rgba(100, 200, 255, 0.4);
        }

        .bracket-sm.tl {
          top: 0;
          left: 0;
          border-top: 2px solid;
          border-left: 2px solid;
        }

        .bracket-sm.tr {
          top: 0;
          right: 0;
          border-top: 2px solid;
          border-right: 2px solid;
        }

        .bracket-sm.bl {
          bottom: 0;
          left: 0;
          border-bottom: 2px solid;
          border-left: 2px solid;
        }

        .bracket-sm.br {
          bottom: 0;
          right: 0;
          border-bottom: 2px solid;
          border-right: 2px solid;
        }

        .output-title {
          font-size: 10px;
          font-weight: 700;
          color: rgba(140, 150, 160, 0.95);
          letter-spacing: 2px;
        }

        .chevron-sm {
          width: 12px;
          height: 12px;
          color: rgba(100, 200, 255, 0.5);
          transition: transform 0.15s;
        }

        .output-controls {
          padding: 10px 14px;
          display: flex;
          gap: 8px;
          align-items: center;
          background: rgba(8, 12, 18, 0.7);
          border-bottom: 1px solid rgba(100, 150, 200, 0.18);
        }

        .output-btn {
          background: rgba(25, 30, 38, 0.8);
          border: 1px solid rgba(100, 200, 255, 0.25);
          color: rgba(100, 200, 255, 0.75);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 1px;
          height: 26px;
          padding: 0 10px;
          transition: all 0.12s;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .output-btn:hover:not(:disabled) {
          background: rgba(25, 30, 38, 1);
          border-color: rgba(100, 200, 255, 0.45);
          color: rgba(100, 200, 255, 0.95);
        }

        .output-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .btn-icon {
          width: 12px;
          height: 12px;
        }

        .char-count {
          margin-left: auto;
          font-size: 9px;
          color: rgba(100, 200, 255, 0.6);
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .output-display {
          flex: 1;
          background: rgba(8, 12, 18, 0.92);
          border: none;
          padding: 14px;
          overflow: auto;
          white-space: pre-wrap;
          word-break: break-word;
          font-family: 'Courier New', monospace;
          font-size: 11pt;
          line-height: 1.3;
          color: #a0a8b0;
          min-height: 350px;
        }
        
        .output-display:empty::before {
          content: 'AWAITING INPUT...';
          color: rgba(120, 130, 140, 0.4);
          font-size: 10px;
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
}

export default function MultiOutput({ outputs, onGenerate, onClearPane, denseMode }) {
  const visibleOutputsCount = outputs.showEscalation ? 3 : 2;
  
  return (
    <div className="multi-output">
      <div className="output-topbar">
        <div className="output-header-left">
          <span className="output-main-title">OUTPUT-TERMINAL</span>
          <div className="status-indicator">
            <span className="status-dot"></span>
            <span className="status-text">READY</span>
          </div>
        </div>
        <Button onClick={onGenerate} size="sm" className="generate-btn">
          <span className="btn-text">GENERATE</span>
        </Button>
      </div>

      <div className={`output-grid ${visibleOutputsCount === 3 ? 'three-col' : 'two-col'}`}>
        <OutputPane title="APF-OUTPUT" content={outputs.apf} onClear={() => onClearPane('apf')} denseMode={denseMode} />
        <OutputPane title="PREMIER-SUPPORT" content={outputs.premier} onClear={() => onClearPane('premier')} denseMode={denseMode} />
        <OutputPane title=">4-PARTS-ESC" content={outputs.escalation} onClear={() => onClearPane('escalation')} denseMode={denseMode} show={outputs.showEscalation} />
      </div>

      <style jsx>{`
        .multi-output {
          margin-top: 14px;
        }

        .output-topbar {
          background: rgba(8, 12, 18, 0.92);
          border: 1px solid rgba(120, 130, 140, 0.28);
          border-bottom: none;
          padding: 10px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .output-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .output-main-title {
          font-size: 11px;
          font-weight: 700;
          color: rgba(140, 150, 160, 0.95);
          letter-spacing: 2px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: rgba(15, 20, 28, 0.9);
          border: 1px solid rgba(100, 200, 255, 0.25);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background: rgba(180, 255, 50, 0.9);
          border-radius: 50%;
          box-shadow: 0 0 4px rgba(180, 255, 50, 0.5);
          animation: statusPulse 3s ease-in-out infinite;
        }

        @keyframes statusPulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 0.85; }
        }

        .status-text {
          font-size: 9px;
          color: rgba(180, 255, 50, 0.85);
          letter-spacing: 1px;
          font-weight: 600;
        }

        .generate-btn {
          background: rgba(180, 255, 50, 0.15);
          border: 1px solid rgba(180, 255, 50, 0.5);
          color: rgba(180, 255, 50, 0.95);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
          height: 32px;
          padding: 0 20px;
          box-shadow: inset 0 1px 0 rgba(180, 255, 50, 0.1);
          transition: all 0.15s;
        }

        .generate-btn:hover {
          background: rgba(180, 255, 50, 0.22);
          border-color: rgba(180, 255, 50, 0.7);
          color: rgba(180, 255, 50, 1);
          box-shadow: 0 0 16px rgba(180, 255, 50, 0.15), inset 0 1px 0 rgba(180, 255, 50, 0.15);
        }

        .generate-btn:active {
          background: rgba(180, 255, 50, 0.18);
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .btn-text {
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .output-grid {
          display: grid;
          gap: 14px;
        }

        .output-grid.three-col {
          grid-template-columns: repeat(3, 1fr);
        }

        .output-grid.two-col {
          grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width: 1200px) {
          .output-grid.three-col {
            grid-template-columns: 1fr;
          }
          .output-grid.two-col {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}