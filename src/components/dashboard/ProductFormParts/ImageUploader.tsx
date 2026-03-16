'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
import { 
  Image as ImageIcon, 
  Trash2, 
  Upload, 
  Star, 
  GripVertical,
  Loader2
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToastStore } from '@/store/useToastStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { ProductFormValues } from '@/lib/schemas';

interface UploadTask {
  id: string;
  file: File;
  progress: number;
  preview: string;
}

import { uploadImage } from '@/lib/upload';

export function ImageUploader() {
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  const { addToast } = useToastStore();
  const { watch, setValue } = useFormContext<ProductFormValues>();

  const images = watch('images') || [];
  const [uploadingFiles, setUploadingFiles] = useState<UploadTask[]>([]);
  const isRtl = language === 'ar';

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Create temporary entries for progress tracking
    const newTasks: UploadTask[] = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      preview: URL.createObjectURL(file)
    }));

    setUploadingFiles(prev => [...prev, ...newTasks]);

    for (const task of newTasks) {
      // Simulate smooth progress
      const progressInterval = setInterval(() => {
        setUploadingFiles(prev => prev.map(f => 
          f.id === task.id ? { ...f, progress: Math.min(f.progress + 10, 90) } : f
        ));
      }, 200);

      try {
        const data = await uploadImage(task.file, 'odda/products');
        
        clearInterval(progressInterval);
        setUploadingFiles(prev => prev.map(f => f.id === task.id ? { ...f, progress: 100 } : f));
        
        // Small delay before replacing with final image for visual smoothness
        setTimeout(() => {
          const currentImages = watch('images') || [];
          const newImage = {
            url: data.url,
            isPrimary: currentImages.length === 0,
            order: currentImages.length
          };
          
          setValue('images', [...currentImages, newImage], { 
            shouldValidate: true, 
            shouldDirty: true 
          });

          setUploadingFiles(prev => prev.filter(f => f.id !== task.id));
          URL.revokeObjectURL(task.preview);
        }, 400);

      } catch (error: any) {
        clearInterval(progressInterval);
        setUploadingFiles(prev => prev.filter(f => f.id !== task.id));
        addToast({ 
          title: dict.toasts.uploadFailed, 
          description: `${task.file.name}: ${error.message || 'Fatal error'}`, 
          type: 'error' 
        });
      }
    }
  };

  const removeImage = (index: number) => {
    const currentImages = [...images];
    const removedWasPrimary = currentImages[index].isPrimary;
    
    currentImages.splice(index, 1);
    
    // Maintain primary status logic
    const updatedImages = currentImages.map((img, idx) => ({
      ...img,
      order: idx,
      isPrimary: (removedWasPrimary && idx === 0) || img.isPrimary
    }));

    // If we removed everything and primary was true, or if no primary remains
    if (updatedImages.length > 0 && !updatedImages.some(img => img.isPrimary)) {
        updatedImages[0].isPrimary = true;
    }

    setValue('images', updatedImages, { shouldValidate: true, shouldDirty: true });
  };

  const setPrimary = (index: number) => {
    const updatedImages = images.map((img, idx) => ({
      ...img,
      isPrimary: idx === index
    }));
    setValue('images', updatedImages, { shouldDirty: true });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedImages = items.map((img, idx) => ({ ...img, order: idx }));
    setValue('images', updatedImages, { shouldDirty: true });
  };

  return (
    <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
      <h3 className={bcn(
        "text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100",
        isRtl ? "text-end" : "text-start"
      )}>
        {dict.dashboard.productForm.sections.media}
      </h3>
      
      <div className="space-y-4">
        <div className={bcn("flex items-center justify-between", isRtl ? "flex-row-reverse" : "flex-row")}>
          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {dict.dashboard.productForm.labels.images} ({images.length})
          </Label>
          <div className="relative">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleImageUpload}
              disabled={uploadingFiles.length > 0}
            />
            <Button type="button" variant="outline" size="sm" className="rounded-sm text-[9px] uppercase tracking-widest h-8" disabled={uploadingFiles.length > 0}>
              {uploadingFiles.length > 0 ? (
                <Loader2 className={bcn("size-3 animate-spin", isRtl ? "ms-2" : "me-2")} />
              ) : (
                <Upload className={bcn("size-3", isRtl ? "ms-2" : "me-2")} />
              )}
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
                {images.map((img, index) => (
                  <Draggable key={img.url} draggableId={img.url} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={bcn(
                          "relative group aspect-square rounded-sm overflow-hidden border bg-slate-50 transition-all",
                          img.isPrimary ? 'border-(--primary) border-2' : 'border-slate-200',
                          snapshot.isDragging ? 'shadow-2xl z-20 scale-105' : ''
                        )}
                      >
                        <Image 
                          src={img.url} 
                          alt={`Product Image ${index + 1}`} 
                          fill 
                          className="object-cover" 
                          sizes="(max-width: 640px) 50vw, 20vw"
                        />
                        
                        <div {...provided.dragHandleProps} className="absolute top-1 start-1 size-6 bg-white/90 rounded border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                          <GripVertical className="size-3 text-slate-400" />
                        </div>

                        <div className="absolute top-1 end-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            type="button"
                            onClick={() => removeImage(index)}
                            className="size-6 bg-red-600 text-white rounded flex items-center justify-center hover:bg-red-700 shadow-sm"
                          >
                            <Trash2 className="size-3" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => setPrimary(index)}
                            className={bcn(
                              "size-6 rounded flex items-center justify-center shadow-sm",
                              img.isPrimary ? 'bg-(--primary) text-white' : 'bg-white text-slate-400 hover:text-(--primary)'
                            )}
                          >
                            <Star className={bcn("size-3", img.isPrimary ? 'fill-current' : '')} />
                          </button>
                        </div>

                        {img.isPrimary && (
                          <div className="absolute bottom-0 inset-x-0 bg-(--primary) text-white text-[8px] font-black uppercase text-center py-0.5 tracking-widest shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
                            {dict.dashboard.productForm.badges.primary}
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}

                {/* Uploading State Previews */}
                {uploadingFiles.map((task) => (
                  <div 
                    key={task.id} 
                    className="relative aspect-square rounded-sm overflow-hidden border border-slate-200 bg-slate-50"
                  >
                    <Image 
                      src={task.preview} 
                      alt="Preview" 
                      fill
                      className="object-cover rounded-sm opacity-50 grayscale" 
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 gap-2 bg-white/40 backdrop-blur-[1px]">
                      <Progress value={task.progress} className="h-1.5" />
                      <span className="text-[10px] font-black tracking-tighter text-(--primary) animate-pulse">{task.progress}%</span>
                    </div>
                  </div>
                ))}

                {provided.placeholder}
                
                {images.length === 0 && uploadingFiles.length === 0 && (
                  <div className="col-span-full h-32 border-2 border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
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
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
