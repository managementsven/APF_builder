import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Download, FileText } from 'lucide-react';

export default function OutputPanel({ output, onGenerate, denseMode }) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '_');
    const filename = `apf_output_${timestamp}.txt`;
    
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 shadow-2xl ${denseMode ? 'p-3' : 'p-4'}`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className={`font-bold text-[#E1251B] ${denseMode ? 'text-sm' : 'text-base'} tracking-wide`}>
          OUTPUT
        </h2>
        <div className="flex gap-1.5">
          <Button
            onClick={onGenerate}
            size="sm"
            className={`bg-gradient-to-r from-[#E1251B] to-[#c51f17] hover:from-[#c51f17] hover:to-[#a01915] text-white ${denseMode ? 'h-7 px-2.5 text-[11px]' : 'h-8 px-3 text-xs'} shadow-lg shadow-[#E1251B]/30 font-medium`}
          >
            <FileText className={`${denseMode ? 'w-3 h-3' : 'w-3.5 h-3.5'} mr-1`} />
            Generieren
          </Button>
          <Button
            onClick={handleCopy}
            disabled={!output}
            variant="outline"
            size="sm"
            className={`border-white/10 hover:bg-white/10 backdrop-blur-sm ${denseMode ? 'h-7 px-2.5 text-[11px]' : 'h-8 px-3 text-xs'} font-medium`}
          >
            <Copy className={`${denseMode ? 'w-3 h-3' : 'w-3.5 h-3.5'} mr-1`} />
            {copySuccess ? 'Copied' : 'Kopieren'}
          </Button>
          <Button
            onClick={handleDownload}
            disabled={!output}
            variant="outline"
            size="sm"
            className={`border-white/10 hover:bg-white/10 backdrop-blur-sm ${denseMode ? 'h-7 px-2.5 text-[11px]' : 'h-8 px-3 text-xs'} font-medium`}
          >
            <Download className={`${denseMode ? 'w-3 h-3' : 'w-3.5 h-3.5'} mr-1`} />
            .txt
          </Button>
        </div>
      </div>

      {copySuccess && (
        <div className="mb-2 text-green-400 text-[10px] text-right animate-pulse font-medium">
          ✓ Copied to clipboard!
        </div>
      )}

      <pre 
        className={`
          bg-black/40 
          border border-white/10 
          rounded-lg
          backdrop-blur-sm
          ${denseMode ? 'p-2.5' : 'p-3'}
          ${denseMode ? 'min-h-[280px]' : 'min-h-[350px]'}
          overflow-auto 
          whitespace-pre-wrap 
          break-words
          output-text
          shadow-inner
        `}
        style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '11pt',
          lineHeight: '1.3',
        }}
      >
        {output || 'Click "Generieren" to generate output...'}
      </pre>
    </div>
  );
}