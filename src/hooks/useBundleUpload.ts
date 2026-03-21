import { useState } from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { BundleFormValues } from '@/lib/schemas';
import { DropResult } from '@hello-pangea/dnd';

export function useBundleUpload(
  setValue: UseFormSetValue<BundleFormValues>,
  watch: UseFormWatch<BundleFormValues>
) {
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
    setUploadingFiles((prev: Array<{ id: string; file: File; progress: number; preview: string }>) => [...prev, ...uploadTasks]);

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
          setUploadingFiles((prev: Array<{ id: string; file: File; progress: number; preview: string }>) => prev.filter((f) => f.id !== task.id));
          URL.revokeObjectURL(task.preview);
        } else {
           setUploadingFiles(prev => prev.filter((f: { id: string }) => f.id !== task.id));
           // No toast here to keep it lean, caller handles or pass dict
        }
      } catch {
        setUploadingFiles((prev: Array<{ id: string; file: File; progress: number; preview: string }>) => prev.filter((f) => f.id !== task.id));
      }
    }
    setIsUploading(false);
  };

  const removeImage = (index: number) => {
    setValue('images', (images as string[]).filter((_, i: number) => i !== index));
  };

  const onDragEnd = (result: DropResult) => {
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
