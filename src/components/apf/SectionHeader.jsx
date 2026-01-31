import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const SectionHeader = React.memo(({ title, subtitle, expanded, setExpanded, sectionId }) => {
  const headerId = `${sectionId}-header`;
  const contentId = `${sectionId}-content`;

  return (
    <button 
      onClick={() => setExpanded(!expanded)} 
      className="section-header"
      aria-expanded={expanded}
      aria-controls={contentId}
      id={headerId}
    >
      <div>
        <div className="section-title">{title}</div>
        {subtitle && <div className="section-subtitle">{subtitle}</div>}
      </div>
      {expanded ? (
        <ChevronUp className="w-5 h-5" aria-hidden="true" />
      ) : (
        <ChevronDown className="w-5 h-5" aria-hidden="true" />
      )}
    </button>
  );
});

SectionHeader.displayName = 'SectionHeader';