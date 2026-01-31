import { getTsTextByLabel } from '../apf/TSChips';

/**
 * Input Sanitization for text outputs
 * Prevents injection issues in target systems
 */
export const sanitizeInput = (value) => {
  if (!value) return '';
  return String(value)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
};

export const sanitizeMultiline = (value) => {
  if (!value) return '';
  return String(value)
    .split('\n')
    .map(line => sanitizeInput(line))
    .join('\n');
};

const mark = (cond) => (cond ? '[X]' : '[ ]');

/**
 * Builds APF Output Template
 * @param {Object} form - Form data object
 * @returns {string} Formatted APF output
 */
export const buildApfOutput = (form) => {
  const now = new Date();
  const date = now.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const time = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

  const ceYes = mark(form.ceCalledIn === 'YES');
  const ceNo = mark(form.ceCalledIn === 'NO');
  const ceNotReq = mark(form.ceCalledIn === 'NOT_REQUIRED');

  const tsTexts = form.selectedTs.map(label => getTsTextByLabel(label)).filter(Boolean);
  if (form.additionalTsDetails?.trim()) {
    tsTexts.push(sanitizeInput(form.additionalTsDetails));
  }
  const tsInline = tsTexts.join(', ') || '';

  const minConfValue = form.minConfTs !== 'NO' ? form.minConfTs : form.minConf;
  const minConfYes = mark(minConfValue === 'YES');
  const minConfNo = mark(minConfValue === 'NO');

  const partsLine = mark(form.partsNotPickedUp);

  return `Case ID :${sanitizeInput(form.caseId)}
APFCreator: ${sanitizeInput(form.apfCreator)}

**** ACTION PLAN ${sanitizeInput(form.actionPlan)} ****
CE-Called-In-Yes:${ceYes}
CE-Called-In-No:${ceNo}
CE-Called-In-NotRequired:${ceNotReq}

CE Name/Phone: ${sanitizeInput(form.ceNamePhone)}

Previous WO Problem: ${sanitizeInput(form.prevWoProblem)}
Previous WO Action: ${sanitizeInput(form.prevWoAction)}

New Symptom: ${sanitizeMultiline(form.newSymptom)}

APF TS performed: ${tsInline}

Min-conf-yes:${minConfYes}
Min-conf-no:${minConfNo}

Cause for new symptom: ${sanitizeMultiline(form.causeNewSymptom)}

${partsLine} CE did not pick up parts within 5 days -parts returned (set repeat repair reason to OTHER/UNKNOWN)

Next action: ${sanitizeInput(form.nextAction)}
Part order:
${sanitizeMultiline(form.partOrder)}

Generated on: ${date} at ${time}
--- Ende ---`;
};

/**
 * Builds Premier Support Output Template
 * @param {Object} form - Form data object
 * @returns {string} Formatted Premier Support output
 */
export const buildPremierOutput = (form) => {
  const repeatYes = mark(form.actionPlan === 'FAILED');
  const repeatNo = mark(form.actionPlan !== 'FAILED');
  const sporadicMark = mark(form.sporadicAllParts);

  const tsLabels = form.selectedTs.join(', ');
  const tsDetails = form.additionalTsDetails?.trim() ? `, ${sanitizeInput(form.additionalTsDetails)}` : '';
  const troubleshooting = tsLabels + tsDetails;

  return `=========================================
*Premier - Support*
=========================================
Model description: ${sanitizeInput(form.modelDescription)}
Repeat Repair: Yes${repeatYes}  No${repeatNo}
Sporadic problem, replace ALL ordered parts under all circumstances ${sporadicMark}
NOTE for sporadic problem: ${sanitizeMultiline(form.sporadicNote)}
=========================================
DETAILED PROBLEM DESCRIPTION: ${sanitizeMultiline(form.newSymptom)}
=========================================
ALREADY PERFORMED TROUBLESHOOTING: ${troubleshooting}
=========================================
PART NAME:
${sanitizeMultiline(form.partOrder)}
=========================================
WO INITIATOR: ${sanitizeInput(form.apfCreator)}`;
};

/**
 * Builds Escalation Output Template (for >4 parts)
 * @param {Object} form - Form data object
 * @returns {string} Formatted Escalation output or empty string
 */
export const buildEscalationOutput = (form) => {
  const lines = form.partOrder.split('\n').filter(l => l.trim());
  if (lines.length <= 4 || !form.moreThan4Parts) return '';

  const partNames = lines.map(line => {
    const idx = line.indexOf(' - ');
    const part = idx > 0 ? line.substring(0, idx) : line;
    return sanitizeInput(part.replace(/\s+x\s+\d+\s*$/i, ''));
  });

  return `Parts needed:
${partNames.join('\n')}

Why are more than 4 parts needed:
${sanitizeMultiline(form.whyMoreThan4)}`;
};