import { useToastStore } from '@/store/useToastStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { useFormContext } from 'react-hook-form';

export function useSettingsAI() {
  const { addToast } = useToastStore();
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  const { setValue } = useFormContext();

  const handleCopyPrompt = () => {
    const prompt = `Act as a premium dental e-commerce expert. I need to generate professional transactional email templates for 'Order Confirmation' and 'Order Shipped'. Return ONLY a valid JSON object without markdown formatting, code blocks, or explanations. The JSON must contain exact keys: 'confirmationSubjectEn', 'confirmationBodyEn', 'confirmationSubjectAr', 'confirmationBodyAr', 'shippedSubjectEn', 'shippedBodyEn', 'shippedSubjectAr', 'shippedBodyAr'. Body content should be professional, welcoming, and use placeholders like {{customerName}} and {{orderNumber}}. For Arabic templates, use Egyptian Arabic with a premium, helpful tone.`;
    navigator.clipboard.writeText(prompt);
    addToast({ title: dict.toasts.promptCopied, description: dict.toasts.promptCopiedDesc, type: "success" });
  };

  const handleMagicFill = (jsonInput: string) => {
    if (!jsonInput) return;
    
    try {
      let rawJson = jsonInput.trim();
      if (rawJson.startsWith('```')) {
        rawJson = rawJson.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
      }

      const data = JSON.parse(rawJson);
      
      const fields = [
        'confirmationSubjectEn', 'confirmationBodyEn', 
        'confirmationSubjectAr', 'confirmationBodyAr',
        'shippedSubjectEn', 'shippedBodyEn',
        'shippedSubjectAr', 'shippedBodyAr'
      ];

      fields.forEach(field => {
        if (data[field]) {
          setValue(field, data[field]);
        }
      });

      addToast({ title: dict.toasts.magicFillComplete, description: dict.toasts.templatesUpdated, type: "success" });
      return true;
    } catch {
      addToast({ title: dict.toasts.invalidJson, description: dict.toasts.invalidJsonDesc, type: "error" });
      return false;
    }
  };

  return { handleCopyPrompt, handleMagicFill };
}
