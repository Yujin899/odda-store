'use client'

import { useState, useRef } from 'react';
import { X, Star, ImagePlus } from 'lucide-react';
import { uploadImageWithProgress } from '@/lib/upload';
import { deleteCloudinaryImage } from '@/app/actions/image-actions';
import { cn } from '@/lib/utils';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary-utils';
import { useToastStore } from '@/store/useToastStore';
import { Button } from '@/components/ui/button';

export interface UploadedImage {
  url: string;
  isPrimary: boolean;
  order: number;
}

interface ImageUploaderProps {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  folder: 'odda/products' | 'odda/categories' | 'odda/payments' | 'odda/hero';
  maxImages?: number; // default: 1
  disabled?: boolean;
}

interface UploadingState {
  file: File;
  preview: string;
  percent: number;
  estimatedSeconds: number;
}

export function ImageUploader({
  value = [],
  onChange,
  folder,
  maxImages = 1,
  disabled = false,
}: ImageUploaderProps) {
  const [uploadingImages, setUploadingImages] = useState<UploadingState[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToastStore();

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return 'Only JPG, PNG, and WebP images are allowed';
    }
    if (file.size > maxSize) {
      return `File too large. Max size is 10MB (this file is ${(file.size / 1024 / 1024).toFixed(1)}MB)`;
    }
    return null;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    const error = validateFile(file);
    if (error) {
      addToast({ title: 'Validation Error', description: error, type: 'error' });
      return;
    }

    const preview = URL.createObjectURL(file);
    setUploadingImages((prev) => [
      ...prev,
      { file, preview, percent: 0, estimatedSeconds: 0 }
    ]);

    try {
      const data = await uploadImageWithProgress(file, folder, (percent, estimatedSeconds) => {
        setUploadingImages((prev) => 
          prev.map((u) => u.file === file ? { ...u, percent, estimatedSeconds } : u)
        );
      });
      
      const url = data.url;
      
      let newImages = [...value];
      
      if (maxImages === 1) {
        // Replace existing
        newImages = [{ url, isPrimary: true, order: 0 }];
      } else {
        // Add to list
        const isFirst = newImages.length === 0;
        newImages.push({
          url,
          isPrimary: isFirst,
          order: newImages.length,
        });
      }
      
      onChange(newImages);
    } catch (err) {
      console.error('Upload failed:', err);
      addToast({ title: 'Upload Error', description: 'Upload failed. Please try again.', type: 'error' });
    } finally {
      // Remove from uploading state
      setUploadingImages((prev) => {
        return prev.filter((u) => u.file !== file);
      });
    }
  };

  const handleRemove = async (indexToRemove: number) => {
    const imageToRemove = value[indexToRemove];
    
    // Attempt to delete from cloudinary (fire and forget)
    deleteCloudinaryImage(imageToRemove.url).catch(console.error);
    
    const newImages = value.filter((_, idx) => idx !== indexToRemove);
    
    // Re-adjust order and primary
    let hasPrimary = false;
    const reorderedImages = newImages.map((img, idx) => {
      const isPrimary = imageToRemove.isPrimary && idx === 0 ? true : img.isPrimary;
      if (isPrimary) hasPrimary = true;
      return {
        ...img,
        order: idx,
        isPrimary,
      };
    });

    // Fallback if no primary is set after removal but there are still images
    if (!hasPrimary && reorderedImages.length > 0) {
      reorderedImages[0].isPrimary = true;
    }

    onChange(reorderedImages);
  };

  const setPrimary = (indexToSet: number) => {
    if (maxImages === 1) return; // No point in setting primary if only 1 image allowed
    
    const newImages = value.map((img, idx) => ({
      ...img,
      isPrimary: idx === indexToSet,
    }));
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {/* Render already uploaded images */}
        {value.map((image, idx) => (
          <div key={image.url} className="space-y-2">
            <div
              className={cn(
                "relative aspect-square rounded-sm overflow-hidden border-2 cursor-pointer group",
                image.isPrimary ? "border-blue-500" : "border-zinc-200 dark:border-zinc-800"
              )}
              onClick={() => setPrimary(idx)}
            >
              {/* Image display */}
              <img
                src={optimizeCloudinaryUrl ? optimizeCloudinaryUrl(image.url, 'admin') : image.url}
                alt={`Upload ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Primary Indicator */}
              {image.isPrimary && maxImages > 1 && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white p-1 rounded-full shadow-md z-10">
                  <Star className="w-3 h-3 fill-current" />
                </div>
              )}
              
              {/* Remove Button (Desktop Hover Only - Optional to keep, but user asked for below) */}
              {/* I will keep it but also add the one below as requested */}
            </div>

            {/* Accessible Remove Button Below Image */}
            {!disabled && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(idx);
                }}
                className="w-full h-8 text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 hover:bg-red-50 border-zinc-200 dark:border-zinc-800"
              >
                <X className="w-3 h-3 me-1" />
                {maxImages > 1 ? `Remove #${idx + 1}` : 'Delete Image'}
              </Button>
            )}
          </div>
        ))}

        {/* Render currently uploading images with progress UI only */}
        {uploadingImages.map((u, idx) => (
          <div
            key={`uploading-${idx}`}
            className="relative aspect-square rounded-sm overflow-hidden border border-slate-100 bg-white shadow-sm flex flex-col items-center justify-center p-3 sm:p-4"
          >
            {u.preview && (
              <img 
                src={u.preview} 
                alt="Uploading preview" 
                className="absolute inset-0 w-full h-full object-cover opacity-30" 
              />
            )}
            
            {/* progress bar */}
            <div className="relative z-10 w-full flex flex-col items-center">
              <div className="w-full h-1 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${u.percent}%` }}
                />
              </div>
              {/* text */}
              <span className="text-navy/70 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-center mt-1">
                {u.percent}% {u.estimatedSeconds > 0 ? `• ~${u.estimatedSeconds}s` : ''}
              </span>
            </div>
          </div>
        ))}

        {/* Upload Button - Hidden while uploading for "Safer/Advanced" flow */}
        {value.length < maxImages && uploadingImages.length === 0 && (
          <div
            className={cn(
              "relative aspect-square rounded-sm border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300",
              disabled 
                ? "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 cursor-not-allowed" 
                : "border-zinc-200 bg-white hover:border-blue-500 shadow-sm cursor-pointer group"
            )}
            onClick={() => {
              if (!disabled) {
                fileInputRef.current?.click();
              }
            }}
          >
            <ImagePlus className="w-6 h-6 text-zinc-400 mb-2" />
            <span className="text-xs text-zinc-500 font-medium tracking-widest uppercase text-center px-2">
              {value.length === 0 ? 'Add Image' : 'Add Another'}
            </span>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              disabled={disabled}
            />
          </div>
        )}
      </div>
      
      <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">
        Accepted: JPG, PNG, WebP. Max: 10MB.{' '}
        {maxImages > 1 && value.length > 0 && "CLICK AN IMAGE TO SET AS PRIMARY."}
      </p>
    </div>
  );
}
