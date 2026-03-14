'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Image as ImageIcon,
  Check,
  Loader2,
  Upload,
  X,
  Sparkles
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToastStore } from '@/store/useToastStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';

interface Category {
  _id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [isMagicFilling, setIsMagicFilling] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    slug: '',
    description: '',
    descriptionAr: '',
    image: ''
  });

  const { addToast } = useToastStore();
  const { language } = useLanguageStore();
  const dict = getDictionary(language);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories);
      } else {
        addToast({ title: dict.toasts.error, description: data.message || dict.toasts.somethingWentWrong, type: 'error' });
      }
    } catch {
      addToast({ title: dict.toasts.error, description: dict.toasts.somethingWentWrong, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [addToast, dict.dashboard.productForm.messages.error]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        nameAr: category.nameAr || '',
        slug: category.slug,
        description: category.description || '',
        descriptionAr: category.descriptionAr || '',
        image: category.image || ''
      });
      setIsSlugManuallyEdited(true);
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        nameAr: '',
        slug: '',
        description: '',
        descriptionAr: '',
        image: ''
      });
      setIsSlugManuallyEdited(false);
    }
    setIsModalOpen(true);
  };

  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulated progress logic
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    const data = new FormData();
    data.append('file', file);
    data.append('folder', 'odda/categories');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      });
      const uploadData = await res.json();

      if (res.ok) {
        setUploadProgress(100);
        setTimeout(() => {
          setFormData({ ...formData, image: uploadData.url });
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
        addToast({ title: dict.toasts.success, description: language === 'ar' ? 'تم رفع الصورة بنجاح' : 'Image uploaded successfully', type: 'success' });
      } else {
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(0);
        addToast({ title: dict.toasts.error, description: uploadData.message || dict.toasts.uploadFailed, type: 'error' });
      }
    } catch {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(0);
      addToast({ title: dict.toasts.error, description: dict.toasts.errorUploading, type: 'error' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
      const method = editingCategory ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        addToast({ 
          title: dict.toasts.success, 
          description: dict.toasts.categorySaved, 
          type: 'success' 
        });
        setIsModalOpen(false);
        fetchCategories();
      } else {
        addToast({ title: dict.toasts.error, description: data.message || dict.toasts.categoryFailed, type: 'error' });
      }
    } catch {
      addToast({ title: dict.toasts.error, description: dict.toasts.somethingWentWrong, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMagicFill = async () => {
    if (!formData.name) {
      addToast({ title: language === 'ar' ? 'الاسم مطلوب' : 'Name Required', description: language === 'ar' ? 'يرجى إدخال اسم القسم أولاً لاستخدام الملء التلقائي.' : 'Please enter a category name first to use Auto Translate & SEO.', type: 'info' });
      return;
    }

    setIsMagicFilling(true);
    try {
      const res = await fetch('/api/admin/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType: 'category',
          payload: { 
            name: formData.name, 
            description: formData.description 
          }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setFormData(prev => ({
        ...prev,
        nameAr: data.nameAr || prev.nameAr,
        description: data.description || prev.description,
        descriptionAr: data.descriptionAr || prev.descriptionAr,
        slug: data.slug || prev.slug
      }));

      addToast({ title: dict.toasts.magicFillComplete, description: dict.toasts.magicFillDesc, type: 'success' });
    } catch (error: any) {
      addToast({ 
        title: dict.toasts.error, 
        description: error.message || dict.toasts.somethingWentWrong, 
        type: 'error' 
      });
    } finally {
      setIsMagicFilling(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/categories/${deleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        addToast({ title: dict.toasts.success, description: dict.toasts.categoryDeleted, type: 'success' });
        fetchCategories();
      } else {
        addToast({ title: dict.toasts.error, description: data.message || dict.toasts.categoryDeleteFailed, type: 'error' });
      }
    } catch {
      addToast({ title: dict.toasts.error, description: dict.toasts.somethingWentWrong, type: 'error' });
    } finally {
      setDeleteId(null);
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 text-start" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-start">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-(--navy)">{dict.dashboard.categoriesPage.title}</h1>
          <p className="text-sm text-slate-500 font-medium">{dict.dashboard.categoriesPage.subtitle}</p>
        </div>
        <Button 
          onClick={() => openModal()}
          className="bg-(--primary) hover:bg-(--primary)/90 text-white font-bold uppercase tracking-widest text-xs h-11 px-6 shadow-lg shadow-(--primary)/20 rounded-sm"
        >
          <Plus className="size-4 me-2" />
          {dict.dashboard.categoriesPage.addCategory}
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute inset-s-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input 
              placeholder={dict.dashboard.categoriesPage.searchPlaceholder}
              className="h-10 border-slate-200 focus:border-(--primary) focus:ring-(--primary)/10 rounded-sm text-sm ps-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Table dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-transparent border-slate-100">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-[80px] text-xs font-bold uppercase tracking-widest text-slate-500 text-start">{dict.dashboard.categoriesPage.table.image}</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-widest text-slate-500 text-start">{dict.dashboard.categoriesPage.table.name}</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-widest text-slate-500 text-start">{dict.dashboard.categoriesPage.table.slug}</TableHead>
              <TableHead className="hidden md:table-cell text-xs font-bold uppercase tracking-widest text-slate-500 text-start">{dict.dashboard.categoriesPage.table.description}</TableHead>
              <TableHead className="text-end ps-4 text-xs font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.categoriesPage.table.actions}</TableHead>
            </TableRow>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-sm text-slate-500 italic">
                  <div className={`flex items-center justify-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <Loader2 className="size-4 animate-spin" />
                    {dict.dashboard.categoriesPage.loading}
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-sm text-slate-500 italic">
                  {dict.dashboard.categoriesPage.empty}
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category._id} className="hover:bg-slate-50 transition-colors border-slate-50">
                  <TableCell className="text-start font-cairo">
                    <div className="size-10 rounded-sm overflow-hidden bg-slate-100 relative border border-slate-200 shadow-inner ms-auto me-0">
                      {category.image ? (
                        <Image 
                          src={category.image} 
                          alt={language === 'ar' && category.nameAr ? category.nameAr : category.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center size-full">
                          <ImageIcon className="size-4 text-slate-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className={`font-bold text-(--navy) text-start ${language === 'ar' ? 'font-cairo' : ''}`}>
                    {language === 'ar' && category.nameAr ? category.nameAr : category.name}
                  </TableCell>
                  <TableCell className="text-start">
                    <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono uppercase tracking-tighter">
                      {category.slug}
                    </code>
                  </TableCell>
                  <TableCell className={`hidden md:table-cell max-w-[200px] truncate text-sm text-slate-500 text-start ${language === 'ar' ? 'font-cairo' : ''}`}>
                    {language === 'ar' && category.descriptionAr ? category.descriptionAr : (category.description || '-')}
                  </TableCell>
                  <TableCell className="text-end ps-4 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="size-8 p-0">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-sm overflow-hidden">
                        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400 text-start">{dict.dashboard.categoriesPage.table.actions}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => openModal(category)}
                          className="text-xs font-medium focus:bg-slate-50 cursor-pointer"
                        >
                          <Pencil className="size-3 me-2" />
                          {dict.common.edit}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-xs font-medium text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                          onClick={() => setDeleteId(category._id)}
                        >
                          <Trash2 className="size-3 me-2" />
                          {dict.common.delete}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl rounded-sm pt-12" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <form onSubmit={handleSave}>
            <DialogHeader className={language === 'ar' ? 'text-right' : ''}>
              <DialogTitle className="font-black uppercase tracking-tighter text-xl">
                {editingCategory ? dict.dashboard.categoriesPage.modal.editTitle : dict.dashboard.categoriesPage.modal.newTitle}
              </DialogTitle>
              <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {dict.dashboard.categoriesPage.modal.description}
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-6">
              {/* AI Assistant Panel */}
              <div className="bg-(--navy) text-white p-4 rounded-sm border border-white/10 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-(--primary)" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">AI Assistant</span>
                  </div>
                  <Button 
                    type="button"
                    onClick={() => {
                      const prompt = `Act as a premium dental e-commerce expert. I am adding a category named '${formData.name}' to my store. Return ONLY a valid JSON object without markdown formatting, code blocks, or explanations. The JSON must contain exact keys: 'nameAr' (Clinical transliteration), 'description' (English 2 sentences), 'descriptionAr' (Egyptian Arabic 2 sentences, premium tone), 'slug' (SEO optimized English slug, lowercase, hyphens).`;
                      navigator.clipboard.writeText(prompt);
                      addToast({ title: dict.toasts.promptCopied, description: dict.toasts.promptCopiedDesc, type: "success" });
                    }}
                    disabled={!formData.name}
                    className="bg-white text-(--navy) hover:bg-white/90 font-black uppercase tracking-widest text-[9px] h-7 px-3 rounded-sm border-none shadow-none"
                  >
                    📝 Copy Prompt
                  </Button>
                </div>
                <div className="space-y-2">
                  <Textarea 
                    placeholder="Paste AI JSON output here..."
                    id="cat-ai-json"
                    className="bg-white/5 border-white/10 text-white font-mono text-[10px] min-h-[60px] focus:border-(--primary) focus:ring-0 placeholder:text-white/20"
                  />
                  <Button 
                    type="button"
                    className="w-full bg-(--primary) hover:bg-(--primary)/90 text-white font-black uppercase tracking-widest text-[9px] h-8 rounded-sm"
                    onClick={() => {
                      const textarea = document.getElementById('cat-ai-json') as HTMLTextAreaElement;
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
                    <div className={`space-y-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <Label htmlFor="cat-name" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.categoriesPage.modal.nameEn}</Label>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={handleMagicFill}
                          disabled={isMagicFilling || !formData.name}
                          className="h-6 px-2 text-[9px] uppercase tracking-widest font-black text-(--primary) hover:text-(--primary) hover:bg-(--primary)/10"
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
                    <div className={`space-y-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      <Label htmlFor="cat-nameAr" className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block ${language === 'ar' ? 'text-right' : ''}`}>{dict.dashboard.categoriesPage.modal.nameAr}</Label>
                      <Input 
                        id="cat-nameAr"
                        dir="rtl"
                        value={formData.nameAr}
                        onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                        placeholder={dict.dashboard.categoriesPage.modal.nameAr.includes('Name') ? 'مثال: أدوات طب الأسنان' : dict.dashboard.categoriesPage.modal.nameAr}
                        className="rounded-sm border-slate-200 focus:border-(--primary) text-sm text-right font-cairo"
                      />
                    </div>
                  </div>

                  <div className={`space-y-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
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

                <div className={`space-y-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <Label className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2 ${language === 'ar' ? 'text-right' : ''}`}>{dict.dashboard.categoriesPage.modal.image}</Label>
                  <div className={`relative group aspect-video rounded-sm overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center ${isUploading ? 'grayscale opacity-80' : ''}`}>
                    {formData.image && !isUploading ? (
                      <>
                        <Image src={formData.image} alt="Category" fill className="object-cover" />
                        <button 
                          type="button"
                          onClick={() => setFormData({ ...formData, image: '' })}
                          className="absolute top-2 inset-e-2 size-6 bg-red-600 text-white rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="size-3" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center w-full px-8">
                        {isUploading ? (
                          <div className="w-full space-y-4">
                            <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-(--primary) animate-pulse">{dict.dashboard.productForm.messages.uploading}</span>
                              <span className="text-[10px] font-bold text-slate-400">{uploadProgress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-(--primary) transition-all duration-300 rounded-full"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="size-6 text-slate-300 mb-2" />
                            <div className="relative">
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                disabled={isUploading}
                              />
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                className="rounded-sm text-[9px] uppercase tracking-widest h-8"
                                disabled={isUploading}
                              >
                                <Upload className={`size-3 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                                {dict.dashboard.categoriesPage.modal.uploadImage}
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`space-y-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
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
                <div className={`space-y-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <Label htmlFor="cat-descAr" className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block ${language === 'ar' ? 'text-right' : ''}`}>{dict.dashboard.categoriesPage.modal.descAr}</Label>
                  <Textarea 
                    id="cat-descAr"
                    dir="rtl"
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    placeholder={dict.dashboard.categoriesPage.modal.descPlaceholderAr}
                    className="rounded-sm min-h-[100px] border-slate-200 focus:border-(--primary) text-sm text-right font-cairo"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className={`gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                className="rounded-sm font-bold uppercase tracking-widest text-[10px] h-10 px-6 border-slate-200"
              >
                {dict.dashboard.categoriesPage.modal.cancel}
              </Button>
              <Button 
                type="submit" 
                disabled={isSaving || isUploading}
                className="bg-(--primary) hover:bg-(--primary)/90 text-white font-bold uppercase tracking-widest text-[10px] h-10 px-8 shadow-lg shadow-(--primary)/20 rounded-sm"
              >
                {isSaving ? <Loader2 className="size-4 animate-spin me-2" /> : <Check className="size-4 me-2" />}
                {editingCategory ? dict.dashboard.categoriesPage.modal.update : dict.dashboard.categoriesPage.modal.create}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-sm" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <AlertDialogHeader className="text-start">
            <AlertDialogTitle className="font-black uppercase tracking-tighter">{dict.dashboard.categoriesPage.deleteDialog.title}</AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium">
              {dict.dashboard.categoriesPage.deleteDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-sm font-bold uppercase tracking-widest text-[10px]">{dict.dashboard.categoriesPage.deleteDialog.cancel}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-sm font-bold uppercase tracking-widest text-[10px]"
            >
              {dict.dashboard.categoriesPage.deleteDialog.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
