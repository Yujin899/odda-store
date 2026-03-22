'use client';

import { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { 
  FolderTree, 
  Award, 
  ToggleRight
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { ProductFormValues } from '@/lib/schemas';

interface Category {
  id: string;
  name: string;
  nameAr: string;
}

interface Badge {
  _id: string;
  name: string;
  nameAr?: string;
  color?: string;
}

export function OrganizationFields() {
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  const { control, formState: { errors } } = useFormContext<ProductFormValues>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchOrgData = async () => {
      try {
        const [catRes, badgeRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/badges')
        ]);
        const catData = await catRes.json();
        const badgeData = await badgeRes.json();
        if (isMounted) {
          if (catRes.ok) setCategories(catData.categories);
          if (badgeRes.ok) setBadges(badgeData.badges);
        }
      } catch (error) {
        console.error('Failed to fetch organization data:', error);
      }
    };
    fetchOrgData();
    return () => { isMounted = false; };
  }, []);

  const isRtl = language === 'ar';

  return (
    <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-6">
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100 text-start">
        {dict.dashboard.productForm.sections.organization}
      </h3>
      
      {/* Category Selection */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FolderTree className="size-3 text-slate-400" />
          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {dict.dashboard.productForm.labels.category}
          </Label>
        </div>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="rounded-sm border-slate-200 h-11">
                <SelectValue placeholder={dict.dashboard.productForm.placeholders.selectCategory} />
              </SelectTrigger>
              <SelectContent align={isRtl ? 'end' : 'start'}>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id} className={isRtl ? 'text-end' : ''}>
                    {isRtl && cat.nameAr ? cat.nameAr : cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.categoryId && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest ps-1">{errors.categoryId.message}</p>}
      </div>

      {/* Brand Badge */}
      <div className="space-y-2 text-start">
        <div className="flex items-center gap-2">
          <Award className="size-3 text-slate-400" />
          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {dict.dashboard.productForm.labels.badge}
          </Label>
        </div>
        <Controller
          name="badgeId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || 'none'}>
              <SelectTrigger className="rounded-sm border-slate-200 h-11">
                <SelectValue placeholder={dict.dashboard.productForm.placeholders.noBadge} />
              </SelectTrigger>
              <SelectContent align={isRtl ? 'end' : 'start'}>
                <SelectItem key="none" value="none" className={isRtl ? 'text-end' : ''}>
                    {dict.dashboard.productForm.badges.none}
                </SelectItem>
                {badges.map(badge => (
                  <SelectItem key={badge._id} value={badge._id} className={isRtl ? 'text-end' : ''}>
                    <span className="flex items-center gap-2">
                      <div className="size-2 rounded-full" style={{ backgroundColor: badge.color }} />
                      {isRtl && badge.nameAr ? badge.nameAr : badge.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Featured Toggle */}
      <div className="pt-6 border-t border-slate-50">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 text-start">
            <div className="flex items-center gap-2 mb-1">
              <ToggleRight className="size-3 text-primary" />
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                {dict.dashboard.productForm.labels.featured}
              </Label>
            </div>
            <p className="text-[8px] text-slate-400 uppercase tracking-widest leading-relaxed">
              {dict.dashboard.productForm.placeholders.featuredDescription}
            </p>
          </div>
          <Controller
            name="featured"
            control={control}
            render={({ field }) => (
              <Switch 
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
