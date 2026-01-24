import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Trash2, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { toast } from 'sonner';

const sanitizeFilename = (str) => {
  return str.replace(/[^a-zA-Z0-9._-]/g, '_');
};

const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-999999px';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  } catch {
    return false;
  }
};

function OutputPane({ title, content, onClear, caseId, filePrefix }) {
  const [expanded, setExpanded] = useState(true);

  const handleCopy = async () => {
    if (!content) return;
    const success = await copyToClipboard(content);
    if (success) {
      toast.success(`${title} copied to clipboard`);
    } else {
      toast.error('Failed to copy');
    }
  };

  const handleDownload = () => {
    if (!content) return;
    const casePart = caseId && /^\d+$/.test(caseId.trim()) ? `_${sanitizeFilename(caseId.trim())}` : '';
    const filename = `${filePrefix}${casePart}.txt`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  };

  const charCount = content ? content.length : 0;

  return (
    <div className="card-panel">
      <button onClick={() => setExpanded(!expanded)} className="section-header">
        <div className="section-title">{title}</div>
        {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {expanded && (
        <>
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30">
            <Button variant="outline" size="sm" onClick={handleCopy} disabled={!content} className="h-7 text-xs">
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} disabled={!content} className="h-7 text-xs">
              <Download className="w-3 h-3 mr-1" />
              .txt
            </Button>
            <Button variant="outline" size="sm" onClick={onClear} disabled={!content} className="h-7 text-xs">
              <Trash2 className="w-3 h-3 mr-1" />
              Clear
            </Button>
            {charCount > 0 && (
              <Badge variant="secondary" className="ml-auto text-[10px] font-mono">
                {charCount.toLocaleString()} CHR
              </Badge>
            )}
          </div>

          <pre className="output-display">
            {content || `AWAITING INPUT...`}
          </pre>
        </>
      )}

      <style jsx>{`
        .output-display {
          background: hsl(var(--input));
          border: none;
          padding: 14px;
          overflow: auto;
          white-space: pre-wrap;
          word-break: break-word;
          font-family: Arial, sans-serif;
          font-size: 11pt;
          line-height: 1.3;
          color: hsl(var(--foreground));
          min-height: 350px;
          margin: 0;
        }
      `}</style>
    </div>
  );
}

export default function MultiOutput({ outputs, onGenerate, caseId }) {
  const visiblePanes = [
    { key: 'apf', title: 'APF-OUTPUT', prefix: 'APF_output', show: true },
    { key: 'premier', title: 'PREMIER-SUPPORT', prefix: 'Premier_template', show: true },
    { key: 'escalation', title: '>4-PARTS-ESC', prefix: 'Parts_ESC', show: outputs.showEscalation },
  ].filter(p => p.show);

  const handleClearPane = (key) => {
    toast.success(`${key.toUpperCase()} cleared`);
  };

  return (
    <div className="space-y-4">
      <div className="card-panel">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold uppercase tracking-wide">Output Terminal</h2>
            <Badge variant="default" className="text-[10px] font-mono">READY</Badge>
          </div>
          <Button onClick={onGenerate} size="sm" className="gap-2">
            <Zap className="w-4 h-4" />
            Generate
          </Button>
        </div>
      </div>

      <div className={`grid gap-4 ${visiblePanes.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
        {visiblePanes.map(pane => (
          <OutputPane
            key={pane.key}
            title={pane.title}
            content={outputs[pane.key]}
            onClear={() => handleClearPane(pane.key)}
            caseId={caseId}
            filePrefix={pane.prefix}
          />
        ))}
      </div>

      <style jsx>{`
        .card-panel {
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.32);
        }

        .section-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border-bottom: 1px solid hsl(var(--border));
          cursor: pointer;
          transition: background 0.15s;
        }

        .section-header:hover {
          background: hsl(var(--muted) / 0.5);
        }

        .section-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: hsl(var(--foreground));
        }
      `}</style>
    </div>
  );
}