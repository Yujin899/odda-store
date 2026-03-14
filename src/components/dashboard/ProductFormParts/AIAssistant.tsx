'use client';

import { Sparkles, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useFormContext } from 'react-hook-form';
import { useToastStore } from '@/store/useToastStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { ProductFormValues } from '@/lib/schemas';

export function AIAssistant() {
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  const { addToast } = useToastStore();
  const { setValue, watch } = useFormContext<ProductFormValues>();

  const name = watch('name');

  const handleCopyPrompt = () => {
    if (!name) return;

    const prompt = `Act as a premium dental e-commerce expert. I am adding a product named '${name}' to my store. Return ONLY a valid JSON object without markdown formatting, code blocks, or explanations. 
Rules:
1. 'nameAr': Provide a clinical transliteration into Arabic (e.g., 'Contra Coxo High Speed' -> 'كونترا كوسكو هاي سبيد').
2. 'description': Professional English description (3 sentences). Highlight the value proposition.
3. 'descriptionAr': Professional Egyptian Arabic description (3 sentences). Use a helpful, premium tone.
4. 'features': Array of 4-6 English strings.
5. 'featuresAr': Array of 4-6 Arabic strings (Egyptian tone). These will be displayed in an Amazon-style accordion.
6. 'slug': SEO optimized English slug.

The JSON must contain exact keys: 'nameAr', 'description', 'descriptionAr', 'features', 'featuresAr', 'slug'.`;

    navigator.clipboard.writeText(prompt);
    addToast({ 
      title: dict.toasts.promptCopied, 
      description: dict.toasts.promptCopiedDesc, 
      type: "success" 
    });
  };

  const handleMagicFill = () => {
    const textarea = document.getElementById('ai-json-input') as HTMLTextAreaElement;
    if (!textarea?.value) return;

    try {
      let rawJson = textarea.value.trim();
      
      // Strip markdown code blocks if present
      if (rawJson.startsWith('```')) {
        rawJson = rawJson.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
      }

      const data = JSON.parse(rawJson);
      
      // Dynamic setValue for each matching key
      const keys: (keyof ProductFormValues)[] = ['nameAr', 'description', 'descriptionAr', 'features', 'featuresAr', 'slug'];
      
      keys.forEach(key => {
        if (data[key]) {
          setValue(key, data[key], { shouldValidate: true, shouldDirty: true });
        }
      });

      addToast({ 
        title: dict.toasts.magicFillComplete, 
        description: dict.toasts.magicFillDesc, 
        type: "success" 
      });
      textarea.value = '';
    } catch {
      addToast({ 
        title: dict.toasts.invalidJson, 
        description: dict.toasts.invalidJsonDesc, 
        type: "error" 
      });
    }
  };

  return (
    <div className="bg-(--navy) text-white p-6 rounded-sm border border-white/10 shadow-xl space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-start">
          <div className="size-8 bg-(--primary) rounded-sm flex items-center justify-center shrink-0">
            <Sparkles className="size-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">
              🤖 {dict.dashboard.brandInitial} AI Assistant
            </h3>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
              SOTA Prompt Generator & JSON Importer
            </p>
          </div>
        </div>
        <Button 
          type="button"
          onClick={handleCopyPrompt}
          disabled={!name}
          className="bg-white text-(--navy) hover:bg-white/90 font-black uppercase tracking-widest text-[10px] h-9 px-4 rounded-sm disabled:opacity-50"
        >
          <Copy className="size-3 me-2" />
          {language === 'ar' ? 'نسخ المطالبة' : 'Copy AI Prompt'}
        </Button>
      </div>

      <div className="space-y-2 text-start">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-white/60">
          📥 {language === 'ar' ? 'اصق مخرجات AI هنا' : 'Paste AI JSON Output Here'}
        </Label>
        <Textarea 
          id="ai-json-input"
          placeholder='{ "nameAr": "...", "description": "...", "descriptionAr": "...", ... }'
          className="bg-white/5 border-white/10 text-white font-mono text-xs min-h-[100px] focus:border-(--primary) focus:ring-0 placeholder:text-white/20"
        />
        <Button 
          type="button"
          className="w-full bg-(--primary) hover:bg-(--primary)/90 text-white font-black uppercase tracking-widest text-[10px] h-10 rounded-sm"
          onClick={handleMagicFill}
        >
          <Sparkles className="size-3 me-2" />
          {language === 'ar' ? 'تعبئة سحرية للنموذج' : 'Magic Fill Form'}
        </Button>
      </div>
    </div>
  );
}
