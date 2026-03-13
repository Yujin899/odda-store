'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Trash2, 
  Upload, 
  Loader2,
  Check,
  Sparkles,
  GripVertical,
  Plus,
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
import { Label } from '@/components/ui/label';
import { useToastStore } from '@/store/useToastStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { IBundle } from '@/models/Bundle';

interface BundleFormProps {
  initialData?: IBundle;
}

export function BundleForm({ initialData }: BundleFormProps) {
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
    compareAtPrice: initialData?.compareAtPrice || '',
    bundleItems: initialData?.bundleItems || [''],
    bundleItemsAr: initialData?.bundleItemsAr || [''],
    stock: initialData?.stock || 0,
  });

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!!initialData?.slug);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [uploadingFiles, setUploadingFiles] = useState<{ id: string; file: File; progress: number; preview: string }[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
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
      formData.append('folder', 'odda/bundles'); 

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        
        if (res.ok) {
          setImages(prev => [...prev, data.url]);
          setUploadingFiles(prev => prev.filter(f => f.id !== task.id));
          URL.revokeObjectURL(task.preview);
        } else {
          setUploadingFiles(prev => prev.filter(f => f.id !== task.id));
          addToast({ title: dict.toasts.uploadFailed, description: task.file.name, type: 'error' });
        }
      } catch (err: any) {
        setUploadingFiles(prev => prev.filter(f => f.id !== task.id));
        addToast({ title: dict.toasts.uploadFailed, description: task.file.name, type: 'error' });
        console.error("Upload error:", err);
      }
    }
    setIsUploading(false);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setImages(items);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      addToast({ title: dict.toasts.error, description: language === 'ar' ? 'يجب إضافة صورة واحدة على الأقل' : 'At least one image is required', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
        bundleItems: formData.bundleItems.filter(Boolean),
        bundleItemsAr: formData.bundleItemsAr.filter(Boolean),
        images
      };

      const url = initialData ? `/api/bundles/${initialData.slug}` : '/api/bundles';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        addToast({ title: dict.toasts.success, description: language === 'ar' ? 'تم حفظ العرض بنجاح' : 'Bundle saved successfully', type: 'success' });
        router.push('/dashboard/bundles');
        router.refresh();
      } else {
        addToast({ title: dict.toasts.error, description: data.message, type: 'error' });
      }
    } catch {
      addToast({ title: dict.toasts.error, description: 'An error occurred', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-sm py-4 z-10 border-b border-slate-200 -mx-4 px-4 sm:-mx-6 sm:px-6 gap-4">
        <div className={language === 'ar' ? 'text-right' : ''}>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-(--navy)">
            {initialData ? (language === 'ar' ? 'تعديل العرض' : 'Edit Bundle') : (language === 'ar' ? 'عرض جديد' : 'New Bundle')}
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate max-w-[200px] sm:max-w-none">
            {formData.name || (language === 'ar' ? 'بدون عنوان' : 'Untitled')}
          </p>
        </div>
        <div className={`flex items-center gap-2 sm:gap-3 w-full xs:w-auto ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading} className="flex-1 xs:flex-none rounded-sm font-bold uppercase tracking-widest text-[9px] h-10 px-4">
            {dict.common.cancel}
          </Button>
          <Button type="submit" disabled={isLoading || isUploading} className="flex-1 xs:flex-none bg-(--primary) hover:bg-(--primary)/90 text-white font-bold uppercase tracking-widest text-[9px] h-10 px-6 shadow-lg shadow-(--primary)/20 rounded-sm">
            {isLoading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Check className="size-4 mr-2" />}
            {initialData ? (language === 'ar' ? 'تحديث' : 'Update') : (language === 'ar' ? 'نشر' : 'Publish')}
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
                <h3 className="text-sm font-black uppercase tracking-widest">🤖 ODDA AI Assistant (Bundles)</h3>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">SOTA Prompt Generator & JSON Importer</p>
              </div>
            </div>
            <Button 
              type="button"
              onClick={() => {
                const bundleItemsCtx = formData.bundleItems.filter(Boolean).join(', ');
                const prompt = `Act as a premium dental e-commerce expert. I am adding a Bundle (Starter Kit) named '${formData.name}'. 
                The bundle specifically includes these items: ${bundleItemsCtx}.
                
                Return ONLY a valid JSON object with these keys: 
                'nameAr' (Clinical Arabic transliteration),
                'description' (3 sentences English),
                'descriptionAr' (3 sentences Arabic),
                'bundleItems' (Refined names of items in EN),
                'bundleItemsAr' (Names of items in AR),
                'slug' (SEO optimized)`;
                navigator.clipboard.writeText(prompt);
                addToast({ title: dict.toasts.promptCopied, description: dict.toasts.promptCopiedDesc, type: "success" });
              }}
              disabled={!formData.name || formData.bundleItems.filter(Boolean).length === 0}
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
              id="ai-json-input"
              placeholder='{ "nameAr": "...", "description": "...", ... }'
              className="bg-white/5 border-white/10 text-white font-mono text-xs min-h-[100px] focus:border-(--primary) focus:ring-0 placeholder:text-white/20"
            />
            <Button 
              type="button"
              className="w-full bg-(--primary) hover:bg-(--primary)/90 text-white font-black uppercase tracking-widest text-[10px] h-10 rounded-sm"
              onClick={() => {
                const textarea = document.getElementById('ai-json-input') as HTMLTextAreaElement;
                if (!textarea?.value) return;
                try {
                  const data = JSON.parse(textarea.value.trim().replace(/^```(json)?\n?/, '').replace(/\n?```$/, ''));
                  setFormData(prev => ({ ...prev, ...data }));
                  addToast({ title: 'Success', description: 'Form filled', type: "success" });
                  textarea.value = '';
                } catch {
                  addToast({ title: 'Error', description: 'Invalid JSON', type: "error" });
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
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100">
              {dict.dashboard.productForm.sections.basicInfo}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-left">
                <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.productForm.labels.nameEn}</Label>
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      name,
                      slug: isSlugManuallyEdited ? prev.slug : name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')
                    }));
                  }}
                  className="rounded-sm border-slate-200"
                  required
                />
              </div>

              <div className="space-y-2 text-right">
                <Label htmlFor="nameAr" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.productForm.labels.nameAr}</Label>
                <Input 
                  id="nameAr" dir="rtl"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  className="rounded-sm border-slate-200 text-right font-cairo"
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="slug" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.productForm.labels.slug}</Label>
              <Input 
                id="slug"
                value={formData.slug}
                onChange={(e) => {
                  setIsSlugManuallyEdited(true);
                  setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^\w-]+/g, '') });
                }}
                className="rounded-sm font-mono text-xs"
                required
              />
            </div>

            {/* Bundle Items Section */}
            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Bundle Items (English)</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => setFormData(prev => ({ ...prev, bundleItems: [...prev.bundleItems, ''] }))} className="rounded-sm text-[9px] h-8"><Plus className="size-3 mr-1" /> Add Item</Button>
                </div>
                  {formData.bundleItems.map((item: string, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <Input value={item} onChange={(e) => {
                      const newList = [...formData.bundleItems];
                      newList[idx] = e.target.value;
                      setFormData({ ...formData, bundleItems: newList });
                    }} className="rounded-sm h-9 text-xs" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => setFormData(prev => ({ ...prev, bundleItems: prev.bundleItems.filter((_: string, i: number) => i !== idx) }))} className="text-red-500"><Trash2 className="size-4" /></Button>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between flex-row-reverse">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-cairo">مكونات العرض (AR)</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => setFormData(prev => ({ ...prev, bundleItemsAr: [...prev.bundleItemsAr, ''] }))} className="rounded-sm text-[9px] h-8 font-cairo"><Plus className="size-3 ml-1" /> إضافة منتج</Button>
                </div>
                {formData.bundleItemsAr.map((item: string, idx: number) => (
                  <div key={idx} className="flex gap-2 flex-row-reverse">
                    <Input dir="rtl" value={item} onChange={(e) => {
                      const newList = [...formData.bundleItemsAr];
                      newList[idx] = e.target.value;
                      setFormData({ ...formData, bundleItemsAr: newList });
                    }} className="rounded-sm h-9 text-xs text-right font-cairo" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => setFormData(prev => ({ ...prev, bundleItemsAr: prev.bundleItemsAr.filter((_: string, i: number) => i !== idx) }))} className="text-red-500"><Trash2 className="size-4" /></Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="space-y-2 text-left">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Price (EGP)</Label>
                <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="rounded-sm" required />
              </div>
              <div className="space-y-2 text-left">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Compare at Price (EGP)</Label>
                <Input type="number" value={formData.compareAtPrice} onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })} className="rounded-sm" />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description (EN)</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="min-h-[100px] rounded-sm" required />
            </div>

            <div className="space-y-2 text-right">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-cairo">الوصف (AR)</Label>
              <Textarea dir="rtl" value={formData.descriptionAr} onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })} className="min-h-[100px] rounded-sm font-cairo" required />
            </div>

            <div className="space-y-2 text-left pt-4 border-t border-slate-100">
               <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Stock Quantity</Label>
               <Input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} className="rounded-sm font-bold" required />
            </div>
          </div>

          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100">Media</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Images ({images.length})</Label>
                <div className="relative">
                  <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                  <Button type="button" variant="outline" size="sm" className="h-8 text-[9px] uppercase tracking-widest"><Upload className="size-3 mr-2" /> Upload</Button>
                </div>
              </div>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="bundle-images" direction="horizontal">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {images.map((url, index) => (
                        <Draggable key={url} draggableId={url} index={index}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} className="relative aspect-square rounded-sm overflow-hidden border border-slate-200 bg-slate-50 group">
                              <Image src={url} alt="Bundle" fill className="object-cover" />
                              <div {...provided.dragHandleProps} className="absolute top-1 left-1 size-6 bg-white/90 rounded border flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-grab"><GripVertical className="size-3 text-slate-400" /></div>
                              <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 size-6 bg-red-600 text-white rounded flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-700 transition-opacity"><Trash2 className="size-3" /></button>
                              {index === 0 && <div className="absolute bottom-0 inset-x-0 bg-(--primary) text-white text-[8px] font-black uppercase text-center py-0.5">Primary</div>}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {uploadingFiles.map(file => (
                        <div key={file.id} className="relative aspect-square rounded-sm overflow-hidden border border-slate-200 bg-slate-50">
                          <Image src={file.preview} alt="Preview" fill className="object-cover opacity-50" />
                          <div className="absolute inset-0 flex items-center justify-center p-3"><Progress value={file.progress} className="h-1.5" /></div>
                        </div>
                      ))}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
        </div>

      </div>
    </form>
  );
}
