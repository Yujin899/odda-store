'use client';

import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';
import { useToastStore } from '@/store/useToastStore';
import { BundleFormValues } from '@/lib/schemas';

interface BundleAIAssistantProps {
  language: string;
  dict: any;
}

export function BundleAIAssistant({ language, dict }: BundleAIAssistantProps) {
  const { watch, setValue } = useFormContext<BundleFormValues>();
  const { addToast } = useToastStore();
  const isRtl = language === 'ar';

  const name = watch('name');
  const bundleItems = watch('bundleItems');

  const handleCopyPrompt = () => {
    const bundleItemsCtx = bundleItems.filter(Boolean).join(', ');
    const prompt = `You are the Lead Dental Equipment Copywriter & SEO Specialist for Odda (عُدّة), a premium clinical storefront catering to dental students and professionals in Egypt. Your goal is to transform bundle kits into high-converting, medically accurate data.
Objective: Generate professional clinical data for a Bundle named '${name}' which includes: ${bundleItemsCtx}.

Rules:
1. Medical Precision: Ensure descriptions and features reflect the high standards of clinical dentistry.
2. Tone: 
   - English: Professional, technical, authoritative, and concise.
   - Arabic: Natural, trustworthy, and Egyptian e-commerce friendly. Use "دكتور" as an implied audience.
3. Strict Output Constraint: Output ONLY raw, minified JSON. Do NOT include markdown blocks (e.g., no \`\`\`json), explanations, or pre/post-text.

JSON Schema:
{
  "nameAr": "Clinical transliteration/translation",
  "description": "3-4 sentence professional English description.",
  "descriptionAr": "3-4 sentence professional Arabic description (Egyptian tone).",
  "bundleItems": ["Item 1 (EN)", "Item 2 (EN)", ...],
  "bundleItemsAr": ["Item 1 (AR)", "Item 2 (AR)", ...],
  "slug": "seo-optimized-url-slug-in-english"
}`;
    
    navigator.clipboard.writeText(prompt);
    addToast({ title: dict.toasts.promptCopied, description: dict.toasts.promptCopiedDesc, type: "success" });
  };

  const handleMagicFill = () => {
    const textarea = document.getElementById('ai-json-input') as HTMLTextAreaElement;
    if (!textarea?.value) return;
    try {
      const data = JSON.parse(textarea.value.trim().replace(/^```(json)?\n?/, '').replace(/\n?```$/, ''));
      
      // Map keys to form values
      Object.keys(data).forEach(key => {
        setValue(key as any, data[key]);
      });
      
      addToast({ title: 'Success', description: 'Form filled', type: "success" });
      textarea.value = '';
    } catch {
      addToast({ title: 'Error', description: 'Invalid JSON', type: "error" });
    }
  };

  return (
    <div className="bg-(--navy) text-white p-6 rounded-sm border border-white/10 shadow-xl space-y-4">
      <div className={bcn("flex flex-col md:flex-row md:items-center justify-between gap-4", isRtl ? "flex-row-reverse" : "flex-row")}>
        <div className={bcn("flex items-center gap-2", isRtl ? "flex-row-reverse text-end" : "flex-row text-start")}>
          <div className="size-8 bg-(--primary) rounded-sm flex items-center justify-center shrink-0">
            <Sparkles className="size-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest">🤖 ODDA AI Assistant (Bundles)</h3>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">SOTA Prompt Generator & JSON Importer</p>
          </div>
        </div>
        <Button 
          type="button"
          onClick={handleCopyPrompt}
          disabled={!name || bundleItems.filter(Boolean).length === 0}
          className="bg-white text-(--navy) hover:bg-white/90 font-black uppercase tracking-widest text-[10px] h-9 px-4 rounded-sm disabled:opacity-50"
        >
          📝 {isRtl ? 'نسخ المطالبة' : 'Copy AI Prompt'}
        </Button>
      </div>

      <div className={bcn("space-y-2", isRtl ? "text-end" : "text-start")}>
        <Label className="text-[10px] font-bold uppercase tracking-widest text-white/60">
          📥 {isRtl ? 'الصق مخرجات AI هنا' : 'Paste AI JSON Output Here'}
        </Label>
        <Textarea 
          id="ai-json-input"
          placeholder='{ "nameAr": "...", "description": "...", ... }'
          className="bg-white/5 border-white/10 text-white font-mono text-xs min-h-[100px] focus:border-(--primary) focus:ring-0 placeholder:text-white/20"
        />
        <Button 
          type="button"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-[10px] h-10 rounded-sm"
          onClick={handleMagicFill}
        >
          ✨ {isRtl ? 'تعبئة سحرية للنموذج' : 'Magic Fill Form'}
        </Button>
      </div>
    </div>
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
