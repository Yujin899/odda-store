'use client';

import { 
  Sparkles,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImageUploader } from '@/components/shared/ImageUploader';

interface CategoryFormProps {
  formData: {
    name: string;
    nameAr: string;
    slug: string;
    description: string;
    descriptionAr: string;
    image: string;
  };
  setFormData: (data: any) => void;
  handleMagicFill: () => void;
  isMagicFilling: boolean;
  isSlugManuallyEdited: boolean;
  setIsSlugManuallyEdited: (val: boolean) => void;
  dict: any;
  language: string;
  addToast: (toast: any) => void;
}

export function CategoryForm({
  formData,
  setFormData,
  handleMagicFill,
  isMagicFilling,
  isSlugManuallyEdited,
  setIsSlugManuallyEdited,
  dict,
  language,
  addToast
}: CategoryFormProps) {
  return (
    <div className="py-6 space-y-6">
      {/* AI Assistant Panel */}
      <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-6 bg-(--primary)/10 rounded-sm flex items-center justify-center shrink-0">
               <Sparkles className="size-3 text-(--primary)" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-(--navy)">AI Assistant</span>
          </div>
          <Button 
            type="button"
            onClick={() => {
              const prompt = `Act as a premium dental e-commerce expert. I am adding a category named '${formData.name}' to my store. Return ONLY a valid JSON object without markdown formatting, code blocks, or explanations. The JSON must contain exact keys: 'nameAr' (Clinical transliteration), 'description' (English 2 sentences), 'descriptionAr' (Egyptian Arabic 2 sentences, premium tone), 'slug' (SEO optimized English slug, lowercase, hyphens).`;
              navigator.clipboard.writeText(prompt);
              addToast({ title: dict.toasts.promptCopied, description: dict.toasts.promptCopiedDesc, type: "success" });
            }}
            disabled={!formData.name}
            className="bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[9px] h-7 px-3 rounded-sm border-none shadow-none"
          >
            📝 Copy Prompt
          </Button>
        </div>
        <div className="space-y-2">
          <Textarea 
            placeholder="Paste AI JSON output here..."
            id="cat-ai-json"
            className="bg-slate-50 border-slate-200 text-(--navy) font-mono text-[10px] min-h-[60px] focus:border-(--primary) focus:ring-0 placeholder:text-slate-300"
          />
          <Button 
            type="button"
            className="w-full bg-(--primary) hover:bg-(--primary)/90 text-white font-black uppercase tracking-widest text-[9px] h-8 rounded-sm shadow-md shadow-(--primary)/10"
            onClick={() => {
              const textarea = document.getElementById('cat-ai-json') as HTMLTextAreaElement;
              if (!textarea?.value) return;
              try {
                let rawJson = textarea.value.trim();
                if (rawJson.startsWith('```')) {
                  rawJson = rawJson.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
                }
                const data = JSON.parse(rawJson);
                setFormData((prev: any) => ({
                  ...prev,
                  nameAr: data.nameAr || prev.nameAr,
                  description: data.description || prev.description,
                  descriptionAr: data.descriptionAr || prev.descriptionAr,
                  slug: data.slug || prev.slug
                }));
                addToast({ title: dict.toasts.magicFillComplete, description: dict.toasts.magicFillDesc, type: "success" });
                textarea.value = '';
              } catch (err) {
                addToast({ title: dict.toasts.invalidJson, description: dict.toasts.invalidJsonDesc, type: "error" });
              }
            }}
          >
            ✨ Magic Fill
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`space-y-2 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
              <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Label htmlFor="cat-name" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.categoriesPage.modal.nameEn}</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={handleMagicFill}
                  disabled={isMagicFilling || !formData.name}
                  className="h-6 px-2 text-[9px] uppercase tracking-widest font-black text-primary hover:text-primary hover:bg-primary/10"
                >
                  {isMagicFilling ? <Loader2 className="size-3 animate-spin me-1" /> : <Sparkles className="size-3 me-1" />}
                  ✨ AI Complete
                </Button>
              </div>
              <Input 
                id="cat-name"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  const updates: any = { name };
                  if (!isSlugManuallyEdited) {
                    updates.slug = name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
                  }
                  setFormData({ ...formData, ...updates });
                }}
                placeholder="e.g. Dental Tools"
                className="rounded-sm border-slate-200 focus:border-(--primary) text-sm"
                required
                dir="ltr"
              />
            </div>
            <div className={`space-y-2 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
              <Label htmlFor="cat-nameAr" className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block ${language === 'ar' ? 'text-end' : ''}`}>{dict.dashboard.categoriesPage.modal.nameAr}</Label>
              <Input 
                id="cat-nameAr"
                dir="rtl"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                placeholder={dict.dashboard.categoriesPage.modal.nameAr.includes('Name') ? 'مثال: أدوات طب الأسنان' : dict.dashboard.categoriesPage.modal.nameAr}
                className="rounded-sm border-slate-200 focus:border-(--primary) text-sm text-end font-cairo"
              />
            </div>
          </div>

          <div className={`space-y-2 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
            <Label htmlFor="cat-slug" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.categoriesPage.modal.slug}</Label>
            <Input 
              id="cat-slug"
              value={formData.slug}
              onChange={(e) => {
                setIsSlugManuallyEdited(true);
                setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^\w-]+/g, '').replace(/ +/g, '-') });
              }}
              placeholder="dental-tools"
              className="rounded-sm border-slate-200 focus:border-(--primary) text-xs font-mono"
              required
              dir="ltr"
            />
          </div>
        </div>

        <div className={`space-y-2 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
          <Label className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2 ${language === 'ar' ? 'text-end' : ''}`}>{dict.dashboard.categoriesPage.modal.image}</Label>
          <ImageUploader 
            value={formData.image ? [{ url: formData.image, isPrimary: true, order: 0 }] : []}
            onChange={(images) => setFormData({ ...formData, image: images[0]?.url || '' })}
            folder="odda/categories"
            maxImages={1}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`space-y-2 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
          <Label htmlFor="cat-desc" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.categoriesPage.modal.descEn}</Label>
          <Textarea 
            id="cat-desc"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={dict.dashboard.categoriesPage.modal.descPlaceholderEn}
            className="rounded-sm min-h-[100px] border-slate-200 focus:border-(--primary) text-sm"
            dir="ltr"
          />
        </div>
        <div className={`space-y-2 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
          <Label htmlFor="cat-descAr" className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block ${language === 'ar' ? 'text-end' : ''}`}>{dict.dashboard.categoriesPage.modal.descAr}</Label>
          <Textarea 
            id="cat-descAr"
            dir="rtl"
            value={formData.descriptionAr}
            onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
            placeholder={dict.dashboard.categoriesPage.modal.descPlaceholderAr}
            className="rounded-sm min-h-[100px] border-slate-200 focus:border-(--primary) text-sm text-end font-cairo"
          />
        </div>
      </div>
    </div>
  );
}
