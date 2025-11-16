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
    <div className={`backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 shadow-2xl transition-all duration-300 ${denseMode ? 'p-2.5' : 'p-3'} clay-panel`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-between font-bold text-[#E1251B] ${denseMode ? 'text-xs py-1.5' : 'text-sm py-2'} tracking-wide hover:opacity-80 transition-opacity`}
      >
        <span>{title}</span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {expanded && (
        <>
          <div className={`flex items-center gap-1.5 ${denseMode ? 'mt-2 mb-1.5' : 'mt-2.5 mb-2'}`}>
            <Button
              onClick={handleCopy}
              disabled={!content}
              variant="outline"
              size="sm"
              className={`border-white/10 hover:bg-white/10 backdrop-blur-sm ${denseMode ? 'h-6 px-2 text-[10px]' : 'h-7 px-2.5 text-[11px]'} font-medium clay-button`}
            >
              <Copy className={`${denseMode ? 'w-3 h-3' : 'w-3.5 h-3.5'} mr-1`} />
              {copySuccess ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              onClick={handleDownload}
              disabled={!content}
              variant="outline"
              size="sm"
              className={`border-white/10 hover:bg-white/10 backdrop-blur-sm ${denseMode ? 'h-6 px-2 text-[10px]' : 'h-7 px-2.5 text-[11px]'} font-medium clay-button`}
            >
              <Download className={`${denseMode ? 'w-3 h-3' : 'w-3.5 h-3.5'} mr-1`} />
              .txt
            </Button>
            <Button
              onClick={onClear}
              disabled={!content}
              variant="outline"
              size="sm"
              className={`border-white/10 hover:bg-white/10 backdrop-blur-sm ${denseMode ? 'h-6 px-2 text-[10px]' : 'h-7 px-2.5 text-[11px]'} font-medium clay-button`}
            >
              <Trash2 className={`${denseMode ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
            </Button>
            {charCount > 0 && (
              <span className="ml-auto text-[10px] text-gray-500">
                {charCount.toLocaleString()} chars
              </span>
            )}
          </div>

          <pre 
            className={`
              bg-black/40 
              border border-white/10 
              rounded-lg
              backdrop-blur-sm
              ${denseMode ? 'p-2.5' : 'p-3'}
              max-h-[400px]
              overflow-auto 
              whitespace-pre-wrap 
              break-words
              shadow-inner
              clay-output
            `}
            style={{
              fontFamily: 'Arial, "Segoe UI", Tahoma, sans-serif',
              fontSize: '11pt',
              lineHeight: '1.3',
            }}
          >
            {content || `Click "Generate" to create ${title.toLowerCase()}...`}
          </pre>
        </>
      )}
    </div>
  );
}

export default function MultiOutput({ outputs, onGenerate, onClearPane, denseMode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className={`font-bold text-[#E1251B] ${denseMode ? 'text-sm' : 'text-base'} tracking-wide`}>
          OUTPUTS
        </h2>
        <Button
          onClick={onGenerate}
          size="sm"
          className={`bg-gradient-to-r from-[#E1251B] to-[#c51f17] hover:from-[#c51f17] hover:to-[#a01915] text-white ${denseMode ? 'h-7 px-3 text-[11px]' : 'h-8 px-4 text-xs'} shadow-lg shadow-[#E1251B]/30 font-medium clay-button-primary`}
        >
          Generate All
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-start">
        <OutputPane
          title="APF OUTPUT"
          content={outputs.apf}
          onClear={() => onClearPane('apf')}
          denseMode={denseMode}
        />
        
        <OutputPane
          title="PREMIER SUPPORT"
          content={outputs.premier}
          onClear={() => onClearPane('premier')}
          denseMode={denseMode}
        />
        
        <OutputPane
          title=">4 PARTS ESCALATION"
          content={outputs.escalation}
          onClear={() => onClearPane('escalation')}
          denseMode={denseMode}
          show={outputs.showEscalation}
        />
      </div>
    </div>
  );
}