'use client';

import React from 'react';
import Image from 'next/image';
import { Upload, Trash2, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { BundleFormValues } from './BundleSchema';

interface BundleMediaSectionProps {
  language: string;
  isUploading: boolean;
  uploadingFiles: any[];
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  onDragEnd: (result: DropResult) => void;
}

export function BundleMediaSection({ 
  language, 
  isUploading, 
  uploadingFiles,
  handleImageUpload,
  removeImage,
  onDragEnd 
}: BundleMediaSectionProps) {
  const { watch } = useFormContext<BundleFormValues>();
  const images = watch('images') || [];
  const isRtl = language === 'ar';

  return (
    <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
      <h3 className={bcn("text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100", isRtl ? "text-end" : "text-start")}>
        {isRtl ? 'الصور والوسائط' : 'Media Library'}
      </h3>
      
      <div className="space-y-4">
        <div className={bcn("flex items-center justify-between", isRtl ? "flex-row-reverse" : "flex-row")}>
          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Images ({images.length})</Label>
          <div className="relative">
            <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
            <Button type="button" variant="outline" size="sm" className="h-8 text-[9px] uppercase tracking-widest">
              <Upload className="size-3 me-2" /> Upload
            </Button>
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
                        <div {...provided.dragHandleProps} className="absolute top-1 inset-s-1 size-6 bg-white/90 rounded border flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-grab">
                          <GripVertical className="size-3 text-slate-400" />
                        </div>
                        <button type="button" onClick={() => removeImage(index)} className="absolute top-1 inset-e-1 size-6 bg-red-600 text-white rounded flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-700 transition-opacity">
                          <Trash2 className="size-3" />
                        </button>
                        {index === 0 && <div className="absolute bottom-0 inset-x-0 bg-(--primary) text-white text-[8px] font-black uppercase text-center py-0.5">Primary</div>}
                      </div>
                    )}
                  </Draggable>
                ))}
                
                {uploadingFiles.map(file => (
                  <div key={file.id} className="relative aspect-square rounded-sm overflow-hidden border border-slate-200 bg-slate-50">
                    <Image src={file.preview} alt="Preview" fill className="object-cover opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center p-3">
                      <Progress value={file.progress} className="h-1.5" />
                    </div>
                  </div>
                ))}
                
                {provided.placeholder}
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
