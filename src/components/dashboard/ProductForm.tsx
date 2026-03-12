'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Image as ImageIcon, 
  Trash2, 
  Upload, 
  Loader2,
  Check,
  Star,
  GripVertical
} from 'lucide-react';
import Image from 'next/image';
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

interface ImageFile {
  id: string;
  url: string;
  file?: File;
  isPrimary: boolean;
  order: number;
}

interface ProductFormProps {
  initialData?: any;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const { addToast } = useToastStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    originalPrice: initialData?.originalPrice || '',
    categoryId: initialData?.categoryId?._id || initialData?.categoryId || '',
    badgeId: initialData?.badgeId?._id || initialData?.badgeId || '',
    stock: initialData?.stock || 0,
    featured: initialData?.featured || false,
  });

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!!initialData?.slug);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<{ id: string; file: File; progress: number; preview: string }[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
    if (initialData?.images) {
      setImages(initialData.images.map((img: any, idx: number) => ({
        id: `existing-${idx}`,
        url: img.url,
        isPrimary: img.isPrimary,
        order: img.order
      })));
    }
  }, [initialData]);

  const fetchData = async () => {
    const [catRes, badgeRes] = await Promise.all([
      fetch('/api/categories'),
      fetch('/api/badges')
    ]);
    const catData = await catRes.json();
    const badgeData = await badgeRes.json();
    if (catRes.ok) setCategories(catData.categories);
    if (badgeRes.ok) setBadges(badgeData.badges);
  };

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
            title: 'Upload Failed', 
            description: data.message || `Failed to upload ${task.file.name}`, 
            type: 'error' 
          });
        }
      } catch {
        clearInterval(progressInterval);
        setUploadingFiles(prev => prev.filter(f => f.id !== task.id));
        addToast({ title: 'Upload Failed', description: `Error uploading ${task.file.name}`, type: 'error' });
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
      addToast({ title: 'Validation Error', description: 'At least one image is required', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        stock: Number(formData.stock),
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
        addToast({ title: 'Success', description: 'Product saved successfully', type: 'success' });
        router.push('/dashboard/products');
        router.refresh();
      } else {
        addToast({ title: 'Error', description: data.message || 'Failed to save product', type: 'error' });
      }
    } catch {
      addToast({ title: 'Error', description: 'Fatal error saving product', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-sm py-4 z-10 border-b border-slate-200 -mx-4 px-4 sm:-mx-6 sm:px-6">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-[var(--navy)]">
            {initialData ? 'Edit Product' : 'New Product'}
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{formData.name || 'Untitled'}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
            disabled={isLoading}
            className="rounded-sm font-bold uppercase tracking-widest text-[10px] h-10 px-6"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || isUploading}
            className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-bold uppercase tracking-widest text-[10px] h-10 px-8 shadow-lg shadow-[var(--primary)]/20 rounded-sm"
          >
            {isLoading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Check className="size-4 mr-2" />}
            {initialData ? 'Update Product' : 'Publish Product'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Product Name</Label>
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
                placeholder="e.g. Surgical Scalpel Set"
                className="rounded-sm border-slate-200 focus:border-[var(--primary)] focus:ring-[var(--primary)]/10"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Slug (URL Fragment)</Label>
              <Input 
                id="slug"
                value={formData.slug}
                onChange={(e) => {
                  setIsSlugManuallyEdited(true);
                  setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^\w-]+/g, '').replace(/ +/g, '-') });
                }}
                placeholder="surgical-scalpel-set"
                className="rounded-sm font-mono text-xs border-slate-200 focus:border-[var(--primary)] focus:ring-[var(--primary)]/10"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description</Label>
              <Textarea 
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed product specifications..."
                className="rounded-sm min-h-[120px] border-slate-200 focus:border-[var(--primary)] focus:ring-[var(--primary)]/10"
                required
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100">Media Management</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Images ({images.length})</Label>
                <div className="relative">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={handleImageUpload}
                  />
                  <Button type="button" variant="outline" size="sm" className="rounded-sm text-[9px] uppercase tracking-widest h-8">
                    <Upload className="size-3 mr-2" />
                    Upload
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
                                <div className="absolute bottom-0 inset-x-0 bg-[var(--primary)] text-white text-[8px] font-black uppercase text-center py-0.5">
                                  Primary
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
                          <img 
                            src={file.preview} 
                            alt="Uploading" 
                            className="object-cover w-full h-full grayscale opacity-40" 
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
                          <p className="text-[10px] uppercase font-bold tracking-widest">No images uploaded</p>
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
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100">Pricing & Stock</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Price (EGP)</Label>
                <Input 
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="rounded-sm border-slate-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Original (EGP)</Label>
                <Input 
                  id="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="Optional"
                  className="rounded-sm border-slate-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Stock Quantity</Label>
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

          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100">Organization</h3>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Category</Label>
              <Select 
                value={formData.categoryId} 
                onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
              >
                <SelectTrigger className="rounded-sm border-slate-200">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="badge" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Badge</Label>
              <Select 
                value={formData.badgeId} 
                onValueChange={(val) => setFormData({ ...formData, badgeId: val })}
              >
                <SelectTrigger className="rounded-sm border-slate-200">
                  <SelectValue placeholder="No Badge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {badges.map(badge => (
                    <SelectItem key={badge._id} value={badge._id}>
                      <span className="flex items-center gap-2">
                        <div className="size-2 rounded-full" style={{ backgroundColor: badge.color }} />
                        {badge.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Featured</Label>
                <p className="text-[8px] text-slate-400 uppercase tracking-widest">Show on homepage</p>
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
