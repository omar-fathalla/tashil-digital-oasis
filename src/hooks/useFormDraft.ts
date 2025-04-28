
import { useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from "sonner";

const DRAFT_KEY_PREFIX = 'form_draft_';

export function useFormDraft<T extends Record<string, any>>(
  form: UseFormReturn<T>,
  formId: string,
  options?: {
    excludeFields?: string[];
    saveInterval?: number;
  }
) {
  const draftKey = `${DRAFT_KEY_PREFIX}${formId}`;
  const { excludeFields = ['password', 'confirmPassword'], saveInterval = 2000 } = options || {};

  const saveDraft = useCallback(() => {
    const formValues = form.getValues();
    const draftData = { ...formValues };
    
    // Remove sensitive fields
    excludeFields.forEach(field => {
      delete draftData[field];
    });

    localStorage.setItem(draftKey, JSON.stringify(draftData));
  }, [form, draftKey, excludeFields]);

  const loadDraft = useCallback(() => {
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        form.reset(draftData);
        return true;
      } catch (error) {
        console.error('Error loading form draft:', error);
      }
    }
    return false;
  }, [form, draftKey]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(draftKey);
  }, [draftKey]);

  // Save draft on form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      saveDraft();
    });
    return () => subscription.unsubscribe();
  }, [form, saveDraft]);

  // Load draft on mount
  useEffect(() => {
    const hasDraft = loadDraft();
    if (hasDraft) {
      toast({
        title: "Draft Found",
        description: "Your previous form data has been restored.",
        duration: 4000,
      });
    }
  }, [loadDraft]);

  return {
    saveDraft,
    loadDraft,
    clearDraft,
  };
}
