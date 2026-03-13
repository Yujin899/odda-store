'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Image as ImageIcon, 
  Trash2, 
  Upload, 
  Loader2,
  Check,
  Sparkles,
  Star,
  GripVertical,
  Plus,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToastStore } from '@/store/useToastStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';

interface ImageFile {
  id: string;
  url: string;
  file?: File;
  isPrimary: boolean;
  order: number;
}

interface Category {
  _id: string;
  name: string;
  nameAr: string;
}

interface Badge {
  _id: string;
  name: string;
  nameAr?: string;
  color?: string;
}

interface ProductFormProps {
  initialData?: any; // Keep as any for now due to large nested object
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const { addToast } = useToastStore();
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    nameAr: initialData?.nameAr || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    descriptionAr: initialData?.descriptionAr || '',
    price: initialData?.price || '',
    originalPrice: initialData?.originalPrice || '',
    categoryId: initialData?.categoryId?._id || initialData?.categoryId || '',
    badgeId: initialData?.badgeId?._id || initialData?.badgeId || '',
    stock: initialData?.stock || 0,
    featured: initialData?.featured || false,
    compareAtPrice: initialData?.compareAtPrice || '',
    features: initialData?.features || [],
    featuresAr: initialData?.featuresAr || [],
  });

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!!initialData?.slug);
  const [isMagicFilling, setIsMagicFilling] = useState(false);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<{ id: string; file: File; progress: number; preview: string }[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);

  const fetchData = useCallback(async () => {
    const [catRes, badgeRes] = await Promise.all([
      fetch('/api/categories'),
      fetch('/api/badges')
    ]);
    const catData = await catRes.json();
    const badgeData = await badgeRes.json();
    if (catRes.ok) setCategories(catData.categories);
    if (badgeRes.ok) setBadges(badgeData.badges);
  }, []);

  useEffect(() => {
    fetchData();
    if (initialData?.images) {
      setImages(initialData.images.map((img: { url: string; isPrimary: boolean; order: number }, idx: number) => ({
        id: `existing-${idx}`,
        url: img.url,
        isPrimary: img.isPrimary,
        order: img.order
      })));
    }
  }, [initialData, fetchData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    
    // Create temporary entries for progress tracking
    const uploadTasks = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      preview: URL.createObjectURL(file)
    }));

    setUploadingFiles(prev => [...prev, ...uploadTasks]);

    for (const task of uploadTasks) {
      const formData = new FormData();
      formData.append('file', task.file);
      formData.append('folder', 'odda/products'); 

      // Simulate smooth progress
      const progressInterval = setInterval(() => {
        setUploadingFiles(prev => prev.map(f => 
          f.id === task.id ? { ...f, progress: Math.min(f.progress + 10, 90) } : f
        ));
      }, 200);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        
        clearInterval(progressInterval);

        if (res.ok) {
          setUploadingFiles(prev => prev.map(f => f.id === task.id ? { ...f, progress: 100 } : f));
          
          // Small delay before replacing with final image for visual smoothness
          setTimeout(() => {
            setImages(prev => {
              const newImages = [...prev];
              newImages.push({
                id: data.publicId,
                url: data.url,
                isPrimary: newImages.length === 0,
                order: newImages.length
              });
              return newImages;
            });
            setUploadingFiles(prev => prev.filter(f => f.id !== task.id));
            URL.revokeObjectURL(task.preview);
          }, 400);

        } else {
          setUploadingFiles(prev => prev.filter(f => f.id !== task.id));
          addToast({ 
            title: dict.toasts.uploadFailed, 
            description: `${task.file.name}: ${data.message || dict.dashboard.productForm.messages.saveFailed}`, 
            type: 'error' 
          });
        }
      } catch (error: any) {
        clearInterval(progressInterval);
        setUploadingFiles(prev => prev.filter(f => f.id !== task.id));
        addToast({ 
          title: dict.toasts.uploadFailed, 
          description: `${task.file.name}: ${error.message || dict.dashboard.productForm.messages.saveFailed}`, 
          type: 'error' 
        });
      }
    }

    setIsUploading(false);
  };

  const removeImage = (id: string) => {
    const filtered = images.filter(img => img.id !== id);
    // If we removed the primary, set the first remaining as primary
    if (images.find(img => img.id === id)?.isPrimary && filtered.length > 0) {
      filtered[0].isPrimary = true;
    }
    setImages(filtered.map((img, idx) => ({ ...img, order: idx })));
  };

  const setPrimary = (id: string) => {
    setImages(images.map(img => ({
      ...img,
      isPrimary: img.id === id
    })));
  };

  const handleAddFeature = (lang: 'en' | 'ar') => {
    const key = lang === 'en' ? 'features' : 'featuresAr';
    setFormData(prev => ({
      ...prev,
      [key]: [...prev[key], '']
    }));
  };

  const handleRemoveFeature = (lang: 'en' | 'ar', index: number) => {
    const key = lang === 'en' ? 'features' : 'featuresAr';
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].filter((_: any, i: number) => i !== index)
    }));
  };

  const handleUpdateFeature = (lang: 'en' | 'ar', index: number, value: string) => {
    const key = lang === 'en' ? 'features' : 'featuresAr';
    setFormData(prev => {
      const newList = [...prev[key]];
      newList[index] = value;
      return { ...prev, [key]: newList };
    });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImages(items.map((img, idx) => ({ ...img, order: idx })));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      addToast({ 
        title: dict.dashboard.productForm.messages.validationError, 
        description: dict.dashboard.productForm.messages.imageRequired, 
        type: 'error' 
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        stock: Number(formData.stock),
        nameAr: formData.nameAr || undefined,
        descriptionAr: formData.descriptionAr || undefined,
        features: formData.features.length > 0 ? formData.features : undefined,
        featuresAr: formData.featuresAr.length > 0 ? formData.featuresAr : undefined,
        images: images.map(img => ({
          url: img.url,
          isPrimary: img.isPrimary,
          order: img.order
        }))
      };

      const url = initialData ? `/api/products/${initialData.slug}` : '/api/products';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        addToast({ title: dict.dashboard.productForm.messages.success, description: dict.dashboard.productForm.messages.productSaved, type: 'success' });
        router.push('/dashboard/products');
        router.refresh();
      } else {
        addToast({ title: dict.dashboard.productForm.messages.error, description: data.message || dict.dashboard.productForm.messages.saveFailed, type: 'error' });
      }
    } catch {
      addToast({ title: dict.dashboard.productForm.messages.error, description: dict.dashboard.productForm.messages.fatalError, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-sm py-4 z-10 border-b border-slate-200 -mx-4 px-4 sm:-mx-6 sm:px-6 gap-4">
        <div className={language === 'ar' ? 'text-right' : ''}>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-(--navy)">
            {initialData ? dict.dashboard.productForm.editTitle : dict.dashboard.productForm.newTitle}
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate max-w-[200px] sm:max-w-none">
            {formData.name || dict.dashboard.productForm.untitled}
          </p>
        </div>
        <div className={`flex items-center gap-2 sm:gap-3 w-full xs:w-auto ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
            disabled={isLoading}
            className="flex-1 xs:flex-none rounded-sm font-bold uppercase tracking-widest text-[9px] h-10 px-4 sm:px-6"
          >
            {dict.dashboard.productForm.cancel}
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || isUploading}
            className="flex-1 xs:flex-none bg-(--primary) hover:bg-(--primary)/90 text-white font-bold uppercase tracking-widest text-[9px] h-10 px-6 sm:px-8 shadow-lg shadow-(--primary)/20 rounded-sm"
          >
            {isLoading ? <Loader2 className={`size-4 animate-spin ${language === 'ar' ? 'ml-2' : 'mr-2'}`} /> : <Check className={`size-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />}
            {initialData ? dict.dashboard.productForm.update : dict.dashboard.productForm.publish}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* AI Assistant Panel */}
        <div className="lg:col-span-3 bg-(--navy) text-white p-6 rounded-sm border border-white/10 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-left">
              <div className="size-8 bg-(--primary) rounded-sm flex items-center justify-center shrink-0">
                <Sparkles className="size-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest">🤖 {dict.dashboard.brandInitial} AI Assistant</h3>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">SOTA Prompt Generator & JSON Importer</p>
              </div>
            </div>
            <Button 
              type="button"
              onClick={() => {
                const prompt = `Act as a premium dental e-commerce expert. I am adding a product named '${formData.name}' to my store. Return ONLY a valid JSON object without markdown formatting, code blocks, or explanations. 
Rules:
1. 'nameAr': Provide a clinical transliteration into Arabic (e.g., 'Contra Coxo High Speed' -> 'كونترا كوسكو هاي سبيد').
2. 'description': Professional English description (3 sentences). Highlight the value proposition.
3. 'descriptionAr': Professional Egyptian Arabic description (3 sentences). Use a helpful, premium tone.
4. 'features': Array of 4-6 English strings.
5. 'featuresAr': Array of 4-6 Arabic strings (Egyptian tone). These will be displayed in an Amazon-style accordion.
6. 'slug': SEO optimized English slug.

The JSON must contain exact keys: 'nameAr', 'description', 'descriptionAr', 'features', 'featuresAr', 'slug'.`;
                navigator.clipboard.writeText(prompt);
                addToast({ title: dict.toasts.promptCopied, description: dict.toasts.promptCopiedDesc, type: "success" });
              }}
              disabled={!formData.name}
              className="bg-white text-(--navy) hover:bg-white/90 font-black uppercase tracking-widest text-[10px] h-9 px-4 rounded-sm disabled:opacity-50"
            >
              📝 {language === 'ar' ? 'نسخ المطالبة' : 'Copy AI Prompt'}
            </Button>
          </div>

          <div className="space-y-2 text-left">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-white/60">
              📥 {language === 'ar' ? 'الصق مخرجات AI هنا' : 'Paste AI JSON Output Here'}
            </Label>
            <Textarea 
              placeholder='{ "nameAr": "...", "description": "...", "descriptionAr": "...", ... }'
              className="bg-white/5 border-white/10 text-white font-mono text-xs min-h-[100px] focus:border-(--primary) focus:ring-0 placeholder:text-white/20"
              id="ai-json-input"
            />
            <Button 
              type="button"
              className="w-full bg-(--primary) hover:bg-(--primary)/90 text-white font-black uppercase tracking-widest text-[10px] h-10 rounded-sm"
              onClick={() => {
                const textarea = document.getElementById('ai-json-input') as HTMLTextAreaElement;
                if (!textarea?.value) return;
                
                try {
                  let rawJson = textarea.value.trim();
                  if (rawJson.startsWith('```')) {
                    rawJson = rawJson.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
                  }

                  const data = JSON.parse(rawJson);
                  
                  setFormData(prev => ({
                    ...prev,
                    nameAr: data.nameAr || prev.nameAr,
                    description: data.description || prev.description,
                    descriptionAr: data.descriptionAr || prev.descriptionAr,
                    features: data.features || prev.features,
                    featuresAr: data.featuresAr || prev.featuresAr,
                    slug: data.slug || prev.slug,
                  }));

                  addToast({ title: dict.toasts.magicFillComplete, description: dict.toasts.magicFillDesc, type: "success" });
                  textarea.value = '';
                } catch {
                  addToast({ title: dict.toasts.invalidJson, description: dict.toasts.invalidJsonDesc, type: "error" });
                }
              }}
            >
              ✨ {language === 'ar' ? 'تعبئة سحرية للنموذج' : 'Magic Fill Form'}
            </Button>
          </div>
        </div>
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            <h3 className={`text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {dict.dashboard.productForm.sections.basicInfo}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.productForm.labels.nameEn}</Label>
                </div>
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const updates: any = { name };
                    if (!isSlugManuallyEdited) {
                      updates.slug = name
                        .toLowerCase()
                        .replace(/[^\w ]+/g, '')
                        .replace(/ +/g, '-');
                    }
                    setFormData({ ...formData, ...updates });
                  }}
                  placeholder={dict.dashboard.productForm.placeholders.nameEn}
                  className="rounded-sm border-slate-200 focus:border-(--primary) focus:ring-(--primary)/10"
                  required
                />
              </div>

              <div className="space-y-2 text-right">
                <Label htmlFor="nameAr" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.productForm.labels.nameAr}</Label>
                <Input 
                  id="nameAr"
                  dir="rtl"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder={dict.dashboard.productForm.placeholders.nameAr}
                  className="rounded-sm border-slate-200 focus:border-[var(--primary)] focus:ring-[var(--primary)]/10 text-right font-cairo"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block ${language === 'ar' ? 'text-right' : 'text-left'}`}>{dict.dashboard.productForm.labels.slug}</Label>
              <Input 
                id="slug"
                value={formData.slug}
                onChange={(e) => {
                  setIsSlugManuallyEdited(true);
                  setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^\w-]+/g, '').replace(/ +/g, '-') });
                }}
                placeholder={dict.dashboard.productForm.placeholders.slug}
                className="rounded-sm font-mono text-xs border-slate-200 focus:border-[var(--primary)] focus:ring-[var(--primary)]/10"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2 text-left">
                <Label htmlFor="description" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.productForm.labels.descriptionEn}</Label>
                <Textarea 
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={dict.dashboard.productForm.placeholders.descriptionEn}
                  className="rounded-sm min-h-[100px] border-slate-200 focus:border-[var(--primary)] focus:ring-[var(--primary)]/10"
                  required
                />
              </div>

              <div className="space-y-2 text-right">
                <Label htmlFor="descriptionAr" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.productForm.labels.descriptionAr}</Label>
                <Textarea 
                   id="descriptionAr"
                   dir="rtl"
                   value={formData.descriptionAr}
                   onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                   placeholder={dict.dashboard.productForm.placeholders.descriptionAr}
                   className="rounded-sm min-h-[100px] border-slate-200 focus:border-(--primary) focus:ring-(--primary)/10 text-right font-cairo"
                />
              </div>
            </div>

            {/* Dynamic Features Section */}
            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div className="space-y-4">
                <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Product Features (English)
                  </Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleAddFeature('en')}
                    className="rounded-sm text-[9px] uppercase tracking-widest h-8"
                  >
                    <Plus className="size-3 mr-1" /> Add Feature
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.features.map((feature: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <Input 
                        value={feature}
                        onChange={(e) => handleUpdateFeature('en', index, e.target.value)}
                        placeholder="e.g. Clinical Grade Stainless Steel"
                        className="rounded-sm border-slate-200 text-xs"
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveFeature('en', index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                  {formData.features.length === 0 && (
                    <p className="text-[10px] text-slate-400 uppercase font-bold text-center py-4 border border-dashed rounded-sm">No features added yet</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-cairo">
                    مميزات المنتج (باللغة العربية)
                  </Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleAddFeature('ar')}
                    className="rounded-sm text-[9px] uppercase tracking-widest h-8 font-cairo"
                  >
                    <Plus className={`size-3 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} /> إضافة ميزة
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.featuresAr.map((feature: string, index: number) => (
                    <div key={index} className="flex gap-2 flex-row-reverse">
                      <Input 
                        value={feature}
                        dir="rtl"
                        onChange={(e) => handleUpdateFeature('ar', index, e.target.value)}
                        placeholder="مثال: ستانلس ستيل طبي عالي الجودة"
                        className="rounded-sm border-slate-200 text-xs text-right font-cairo"
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveFeature('ar', index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                  {formData.featuresAr.length === 0 && (
                    <p className="text-[10px] text-slate-400 uppercase font-bold text-center py-4 border border-dashed rounded-sm font-cairo">لم يتم إضافة مميزات بعد</p>
                  )}
                </div>
              </div>
            </div>

          </div>

          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
            <h3 className={`text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {dict.dashboard.productForm.sections.media}
            </h3>
            
            <div className="space-y-4">
              <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.productForm.labels.images} ({images.length})</Label>
                <div className="relative">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={handleImageUpload}
                  />
                  <Button type="button" variant="outline" size="sm" className="rounded-sm text-[9px] uppercase tracking-widest h-8">
                    <Upload className={`size-3 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                    {dict.dashboard.productForm.messages.upload}
                  </Button>
                </div>
              </div>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="images" direction="horizontal">
                  {(provided) => (
                    <div 
                      {...provided.droppableProps} 
                      ref={provided.innerRef}
                      className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4"
                    >
                      {images.filter(img => img && img.id && img.url).map((img, index) => (
                        <Draggable key={img.id} draggableId={img.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`relative group aspect-square rounded-sm overflow-hidden border ${
                                img.isPrimary ? 'border-(--primary) border-2' : 'border-slate-200'
                              } bg-slate-50 ${snapshot.isDragging ? 'shadow-2xl z-20 scale-105' : ''}`}
                            >
                              <Image src={img.url} alt="Product" fill className="object-cover" />
                              
                              <div {...provided.dragHandleProps} className="absolute top-1 left-1 size-6 bg-white/90 rounded border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                                <GripVertical className="size-3 text-slate-400" />
                              </div>

                              <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  type="button"
                                  onClick={() => removeImage(img.id)}
                                  className="size-6 bg-red-600 text-white rounded flex items-center justify-center hover:bg-red-700"
                                >
                                  <Trash2 className="size-3" />
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => setPrimary(img.id)}
                                  className={`size-6 rounded flex items-center justify-center ${
                                    img.isPrimary ? 'bg-[var(--primary)] text-white' : 'bg-white text-slate-400 hover:text-[var(--primary)]'
                                  }`}
                                >
                                  <Star className={`size-3 ${img.isPrimary ? 'fill-current' : ''}`} />
                                </button>
                              </div>

                              {img.isPrimary && (
                                <div className="absolute bottom-0 inset-x-0 bg-(--primary) text-white text-[8px] font-black uppercase text-center py-0.5">
                                  {dict.dashboard.productForm.badges.primary}
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {/* Uploading State */}
                      {uploadingFiles.map((file) => (
                        <div 
                          key={file.id} 
                          className="relative aspect-square rounded-sm overflow-hidden border border-slate-200 bg-slate-50"
                        >
                          <Image 
                        src={file.preview} 
                        alt="Preview" 
                        fill
                        className="object-cover rounded-sm" 
                      />
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 gap-2 bg-white/40 backdrop-blur-[1px]">
                            <Progress value={file.progress} className="h-1.5" />
                            <span className="text-[10px] font-black tracking-tighter text-(--primary)">{file.progress}%</span>
                          </div>
                        </div>
                      ))}
                      {provided.placeholder}
                      {images.length === 0 && (
                        <div className="col-span-full h-32 border-2 border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center text-slate-400">
                          <ImageIcon className="size-8 mb-2 opacity-20" />
                          <p className="text-[10px] uppercase font-bold tracking-widest">{dict.dashboard.productForm.messages.noImages}</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
        </div>

        {/* Right Column: Organization */}
        <div className="space-y-6">
          <div className={`bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            <h3 className={`text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {dict.dashboard.productForm.sections.pricing}
            </h3>
            
            <div className={`grid grid-cols-2 gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <div className="space-y-2">
                <Label htmlFor="price" className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block ${language === 'ar' ? 'text-right' : 'text-left'}`}>{dict.dashboard.productForm.labels.price}</Label>
                <Input 
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder={dict.dashboard.productForm.placeholders.price}
                  className="rounded-sm border-slate-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="compareAtPrice" className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block ${language === 'ar' ? 'text-right' : 'text-left'}`}>{language === 'ar' ? 'السعر قبل الخصم' : 'Compare at Price'}</Label>
                <Input 
                  id="compareAtPrice"
                  type="number"
                  value={formData.compareAtPrice}
                  onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                  placeholder="e.g. 1500"
                  className="rounded-sm border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice" className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block ${language === 'ar' ? 'text-right' : 'text-left'}`}>{dict.dashboard.productForm.labels.originalPrice}</Label>
                <Input 
                  id="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder={dict.dashboard.productForm.placeholders.originalPrice}
                  className="rounded-sm border-slate-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock" className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block ${language === 'ar' ? 'text-right' : 'text-left'}`}>{dict.dashboard.productForm.labels.stock}</Label>
              <Input 
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="rounded-sm border-slate-200 font-bold"
                required
              />
            </div>
          </div>

          <div className={`bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            <h3 className={`text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {dict.dashboard.productForm.sections.organization}
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="category" className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block ${language === 'ar' ? 'text-right' : 'text-left'}`}>{dict.dashboard.productForm.labels.category}</Label>
              <Select 
                value={formData.categoryId} 
                onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
              >
                <SelectTrigger className={`rounded-sm border-slate-200 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <SelectValue placeholder={dict.dashboard.productForm.placeholders.selectCategory} />
                </SelectTrigger>
                <SelectContent align={language === 'ar' ? 'end' : 'start'}>
                  {categories.map(cat => (
                    <SelectItem key={cat._id} value={cat._id} className={language === 'ar' ? 'text-right flex-row-reverse' : ''}>
                      {language === 'ar' && cat.nameAr ? cat.nameAr : cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="badge" className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block ${language === 'ar' ? 'text-right' : 'text-left'}`}>{dict.dashboard.productForm.labels.badge}</Label>
              <Select 
                value={formData.badgeId} 
                onValueChange={(val) => setFormData({ ...formData, badgeId: val })}
              >
                <SelectTrigger className={`rounded-sm border-slate-200 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <SelectValue placeholder={dict.dashboard.productForm.placeholders.noBadge} />
                </SelectTrigger>
                <SelectContent align={language === 'ar' ? 'end' : 'start'}>
                  <SelectItem value="none" className={language === 'ar' ? 'text-right flex-row-reverse' : ''}>{dict.dashboard.productForm.badges.none}</SelectItem>
                  {badges.map(badge => (
                    <SelectItem key={badge._id} value={badge._id} className={language === 'ar' ? 'text-right flex-row-reverse' : ''}>
                      <span className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <div className="size-2 rounded-full" style={{ backgroundColor: badge.color }} />
                        {language === 'ar' && badge.nameAr ? badge.nameAr : badge.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className={`pt-4 flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <div className={`space-y-0.5 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.productForm.labels.featured}</Label>
                <p className="text-[8px] text-slate-400 uppercase tracking-widest">{dict.dashboard.productForm.placeholders.featuredDescription}</p>
              </div>
              <Switch 
                checked={formData.featured}
                onCheckedChange={(val) => setFormData({ ...formData, featured: val })}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
