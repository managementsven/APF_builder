import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

const STORAGE_KEY = 'lenovo_apf_builder_state_v2';
const DEBOUNCE_DELAY = 250;

export const defaultForm = {
  caseId: '',
  apfCreator: '',
  actionPlan: 'FAILED',
  ceCalledIn: 'NO',
  minConf: 'NO',
  partsNotPickedUp: false,
  ceNamePhone: '',
  prevWoProblem: '',
  prevWoAction: '',
  newSymptom: '',
  causeNewSymptom: '',
  nextAction: '',
  partOrder: '',
  minConfTs: 'NO',
  tsSearch: '',
  selectedTs: [],
  additionalTsDetails: '',
  modelDescription: '',
  sporadicAllParts: false,
  sporadicNote: '',
  moreThan4Parts: false,
  whyMoreThan4: '',
};

const normalizeCeCalledIn = (val) => {
  if (!val) return 'NO';
  const v = String(val).toUpperCase();
  if (v === 'YES' || v === 'JA' || v === 'TRUE') return 'YES';
  if (v === 'NOTREQUIRED' || v === 'NOT-REQUIRED' || v === 'NOT_REQUIRED') return 'NOT_REQUIRED';
  return 'NO';
};

const normalizeYesNo = (val) => {
  if (!val) return 'NO';
  const v = String(val).toUpperCase();
  if (v === 'YES' || v === 'JA' || v === 'TRUE') return 'YES';
  return 'NO';
};

const loadForm = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultForm;
    const parsed = JSON.parse(stored);
    return {
      ...defaultForm,
      ...parsed,
      selectedTs: Array.isArray(parsed.selectedTs) ? parsed.selectedTs : [],
    };
  } catch {
    return defaultForm;
  }
};

/**
 * Custom hook for managing APF form state with LocalStorage persistence
 * @param {Object} options - Hook options
 * @param {boolean} options.useSessionStorage - Use sessionStorage instead of localStorage for sensitive data
 * @returns {Object} Form state and handlers
 */
export const useAPFForm = ({ useSessionStorage = false } = {}) => {
  const [form, setForm] = useState(loadForm);
  const [selectedTsSet, setSelectedTsSet] = useState(new Set(form.selectedTs));

  const storage = useSessionStorage ? sessionStorage : localStorage;

  // Persist form state with debouncing
  useEffect(() => {
    const normalized = {
      ...form,
      ceCalledIn: normalizeCeCalledIn(form.ceCalledIn),
      minConf: normalizeYesNo(form.minConf),
      minConfTs: normalizeYesNo(form.minConfTs),
      selectedTs: Array.from(selectedTsSet),
    };

    const timer = setTimeout(() => {
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      } catch (error) {
        console.error('Failed to save form state:', error);
        toast.error('Failed to save form state');
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [form, selectedTsSet, storage]);

  // Update form fields
  const updateForm = useCallback((updates) => {
    setForm(prev => ({ ...prev, ...updates }));
  }, []);

  // Reset form to defaults
  const resetForm = useCallback(() => {
    setForm(defaultForm);
    setSelectedTsSet(new Set());
    try {
      storage.removeItem(STORAGE_KEY);
      toast.success('Form reset');
    } catch (error) {
      console.error('Failed to clear form state:', error);
      toast.error('Failed to reset form');
    }
  }, [storage]);

  // Computed values
  const partsCount = useMemo(() => {
    return form.partOrder.split('\n').filter(l => l.trim()).length;
  }, [form.partOrder]);

  const tsCount = selectedTsSet.size;

  const isReady = useMemo(() => {
    return form.caseId.trim() && /^\d+$/.test(form.caseId.trim()) && form.apfCreator.trim();
  }, [form.caseId, form.apfCreator]);

  // Get normalized form with selectedTs array
  const getNormalizedForm = useCallback(() => {
    return {
      ...form,
      selectedTs: Array.from(selectedTsSet),
    };
  }, [form, selectedTsSet]);

  return {
    form,
    selectedTsSet,
    updateForm,
    setSelectedTsSet,
    resetForm,
    partsCount,
    tsCount,
    isReady,
    getNormalizedForm,
  };
};