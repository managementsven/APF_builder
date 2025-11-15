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
    <div className={`bg-[#252830] rounded-lg border border-gray-700 ${denseMode ? 'p-3' : 'p-5'}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`font-semibold text-[#E1251B] ${denseMode ? 'text-base' : 'text-lg'}`}>
          Output
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={onGenerate}
            size="sm"
            className={`bg-[#E1251B] hover:bg-[#c51f17] text-white ${denseMode ? 'h-7 px-3 text-xs' : 'h-8 px-4 text-sm'}`}
          >
            <FileText className={`${denseMode ? 'w-3 h-3' : 'w-4 h-4'} mr-1.5`} />
            Generieren
          </Button>
          <Button
            onClick={handleCopy}
            disabled={!output}
            variant="outline"
            size="sm"
            className={`border-gray-600 hover:bg-gray-700 ${denseMode ? 'h-7 px-3 text-xs' : 'h-8 px-4 text-sm'}`}
          >
            <Copy className={`${denseMode ? 'w-3 h-3' : 'w-4 h-4'} mr-1.5`} />
            {copySuccess ? 'Copied' : 'Kopieren'}
          </Button>
          <Button
            onClick={handleDownload}
            disabled={!output}
            variant="outline"
            size="sm"
            className={`border-gray-600 hover:bg-gray-700 ${denseMode ? 'h-7 px-3 text-xs' : 'h-8 px-4 text-sm'}`}
          >
            <Download className={`${denseMode ? 'w-3 h-3' : 'w-4 h-4'} mr-1.5`} />
            Als .txt herunterladen
          </Button>
        </div>
      </div>

      {copySuccess && (
        <div className="mb-2 text-green-400 text-xs text-right animate-pulse">
          Copied to clipboard!
        </div>
      )}

      <pre 
        className={`
          bg-[#1a1d23] 
          border border-gray-600 
          rounded 
          ${denseMode ? 'p-2' : 'p-4'}
          ${denseMode ? 'min-h-[300px]' : 'min-h-[400px]'}
          overflow-auto 
          whitespace-pre-wrap 
          break-words
          output-text
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