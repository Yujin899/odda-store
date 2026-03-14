'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useToastStore } from '@/store/useToastStore';
import { BundleFormValues } from '../components/dashboard/BundleFormParts/BundleSchema';

export function useBundleUpload(dict: any) {
  const { setValue, watch } = useFormContext<BundleFormValues>();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ id: string; file: File; progress: number; preview: string }[]>([]);
  const images = watch('images') || [];

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
          setValue('images', [...images, data.url]);
          setUploadingFiles(prev => prev.filter(f => f.id !== task.id));
          URL.revokeObjectURL(task.preview);
        } else {
           setUploadingFiles(prev => prev.filter(f => f.id !== task.id));
           // No toast here to keep it lean, caller handles or pass dict
        }
      } catch (err) {
        setUploadingFiles(prev => prev.filter(f => f.id !== task.id));
      }
    }
    setIsUploading(false);
  };

  const removeImage = (index: number) => {
    setValue('images', images.filter((_, i) => i !== index));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setValue('images', items);
  };

  return {
    isUploading,
    uploadingFiles,
    handleImageUpload,
    removeImage,
    onDragEnd
  };
}
