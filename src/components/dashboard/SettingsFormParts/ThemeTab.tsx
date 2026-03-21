'use client';

import { useState, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLanguageStore } from '@/store/useLanguageStore';
import { generatePreviewCSS } from '@/lib/theme';

export const THEME_PRESETS = [
  {
    name: 'Odda Blue',
    emoji: '💙',
    primary: '#0073E6',
    primaryForeground: '#FFFFFF',
    secondary: '#F1F5F9',
    secondaryForeground: '#0A192F',
    accent: '#EFF6FF',
    accentForeground: '#0A192F',
    background: '#FFFFFF',
    foreground: '#0A192F',
    border: '#E2E8F0',
    radius: '0.5rem',
    brandDark: '#0A192F',
  },
  {
    name: 'Midnight Navy',
    emoji: '🌌',
    primary: '#1E3A5F',
    primaryForeground: '#FFFFFF',
    secondary: '#F0F4F8',
    secondaryForeground: '#1E3A5F',
    accent: '#E8EEF5',
    accentForeground: '#1E3A5F',
    background: '#FFFFFF',
    foreground: '#1E3A5F',
    border: '#CBD5E1',
    radius: '0.375rem',
    brandDark: '#1E3A5F',
  },
  {
    name: 'Clinical Green',
    emoji: '🏥',
    primary: '#059669',
    primaryForeground: '#FFFFFF',
    secondary: '#F0FDF4',
    secondaryForeground: '#064E3B',
    accent: '#ECFDF5',
    accentForeground: '#064E3B',
    background: '#FFFFFF',
    foreground: '#064E3B',
    border: '#D1FAE5',
    radius: '0.5rem',
    brandDark: '#064E3B',
  },
  {
    name: 'Warm Gold',
    emoji: '✨',
    primary: '#B45309',
    primaryForeground: '#FFFFFF',
    secondary: '#FFFBEB',
    secondaryForeground: '#78350F',
    accent: '#FEF3C7',
    accentForeground: '#78350F',
    background: '#FFFDF7',
    foreground: '#1C1917',
    border: '#FDE68A',
    radius: '0.25rem',
    brandDark: '#B45309',
  },
  {
    name: 'Deep Purple',
    emoji: '💜',
    primary: '#7C3AED',
    primaryForeground: '#FFFFFF',
    secondary: '#F5F3FF',
    secondaryForeground: '#4C1D95',
    accent: '#EDE9FE',
    accentForeground: '#4C1D95',
    background: '#FFFFFF',
    foreground: '#1C1917',
    border: '#DDD6FE',
    radius: '0.75rem',
    brandDark: '#4C1D95',
  },
  {
    name: 'Rose Premium',
    emoji: '🌹',
    primary: '#E11D48',
    primaryForeground: '#FFFFFF',
    secondary: '#FFF1F2',
    secondaryForeground: '#881337',
    accent: '#FFE4E6',
    accentForeground: '#881337',
    background: '#FFFFFF',
    foreground: '#1C1917',
    border: '#FECDD3',
    radius: '0.625rem',
    brandDark: '#881337',
  },
];

const radiusOptions = [
  { label: 'None', value: '0rem' },
  { label: 'Small', value: '0.25rem' },
  { label: 'Medium', value: '0.5rem' },
  { label: 'Large', value: '0.75rem' },
  { label: 'Full', value: '1rem' },
];

function ColorField({ label, name }: { label: string; name: string }) {
  const { watch, setValue } = useFormContext();
  const value = (watch(`theme.${name}`) as string) || '';
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 relative">
      <label className="w-full md:w-40 text-[10px] md:text-sm font-bold md:font-medium uppercase md:capitalize tracking-widest md:tracking-normal text-slate-500 md:text-foreground shrink-0 leading-none">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="size-9 md:size-10 rounded-sm border-2 border-border shadow-sm shrink-0"
          style={{ backgroundColor: value }}
        />
        <div className="relative group/input">
          <Input
            type="text"
            value={value}
            onChange={(e) => setValue(`theme.${name}`, e.target.value)}
            className="w-28 font-mono text-xs md:text-sm h-9 md:h-10 px-2.5 rounded-sm outline-none focus:border-(--primary) bg-slate-50 border-slate-200"
            placeholder="#000000"
          />
        </div>
      </div>
      {open && (
        <div className="absolute top-full md:top-12 left-0 md:inset-s-40 z-100 mt-2 md:mt-0 shadow-2xl rounded-sm border bg-white p-3 border-slate-200">
          <HexColorPicker color={value} onChange={(c) => setValue(`theme.${name}`, c)} />
        </div>
      )}
    </div>
  );
}

function ThemePreview() {
  const { watch } = useFormContext();
  const theme = watch('theme');
  const previewCSS = generatePreviewCSS(theme || {});

  return (
    <div className="border rounded-sm p-4 space-y-4 bg-background text-foreground relative overflow-hidden" style={{ borderRadius: theme?.radius }}>
      <style dangerouslySetInnerHTML={{ __html: previewCSS }} />
      
      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Live Preview</p>
      
      <div className="flex gap-2 flex-wrap mb-4">
        <Button>Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      
      <div className="flex gap-2 mb-4">
        <Badge>Badge</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
      
      <div className="max-w-xs mb-4">
        <Input placeholder="Input field..." />
      </div>
      
      <div className="h-px bg-border my-4" />
      
      <div className="p-3 bg-secondary rounded-sm inline-block">
        <p className="text-sm font-medium text-secondary-foreground">Secondary / Accent Area</p>
      </div>
    </div>
  );
}

export function ThemeTab() {
  const { watch, setValue } = useFormContext();
  const { language } = useLanguageStore();
  const currentTheme = watch('theme');

  const applyPreset = (preset: typeof THEME_PRESETS[0]) => {
    Object.keys(preset).forEach((key) => {
      if (key !== 'name' && key !== 'emoji') {
        setValue(`theme.${key}`, preset[key as keyof typeof preset]);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 sm:p-8 rounded-sm border border-slate-200 shadow-sm" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Configuration Column */}
      <div className="space-y-8">
        
        {/* Presets */}
        <div>
          <h3 className="text-lg font-bold text-brand-dark mb-4">Theme Presets</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`flex flex-col items-center justify-center p-3 border rounded-sm transition-all ${
                  currentTheme?.primary === preset.primary && currentTheme?.radius === preset.radius
                    ? 'border-(--primary) bg-(--primary)/5 ring-2 ring-(--primary)/20'
                    : 'border-border hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{preset.emoji}</span>
                  <div className="size-4 rounded-full" style={{ backgroundColor: preset.primary }} />
                </div>
                <span className="text-xs font-semibold text-slate-700">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        <hr className="border-border" />

        {/* Radius */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Border Radius</label>
          <div className="flex flex-wrap gap-2">
            {radiusOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue('theme.radius', opt.value)}
                className={`px-4 py-2 text-xs font-medium border transition-colors ${
                  currentTheme?.radius === opt.value
                    ? 'bg-(--primary) text-white border-(--primary)'
                    : 'bg-white text-foreground border-border hover:bg-slate-50'
                }`}
                style={{ borderRadius: opt.value }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-border" />

        {/* Colors */}
        <div>
          <h3 className="text-lg font-bold text-brand-dark mb-4">Core Colors</h3>
          <div className="space-y-4">
            <ColorField label="Primary (Buttons & Key Elements)" name="primary" />
            <ColorField label="Primary Foreground (Button Text)" name="primaryForeground" />
            <div className="h-px bg-slate-100 my-2" />
            <ColorField label="Secondary (Cards & Subtle Bg)" name="secondary" />
            <ColorField label="Secondary Foreground (Card Text)" name="secondaryForeground" />
            <div className="h-px bg-slate-100 my-2" />
            <ColorField label="Accent (Highlights)" name="accent" />
            <ColorField label="Accent Foreground (Highlight Text)" name="accentForeground" />
            <div className="h-px bg-slate-100 my-2" />
            <ColorField label="Background (Main Page)" name="background" />
            <ColorField label="Foreground (Main Text)" name="foreground" />
            <div className="h-px bg-slate-100 my-2" />
            <ColorField label="Border & Input Colors" name="border" />
            <div className="h-px bg-slate-100 my-2" />
            <ColorField label="Brand Dark (Announcement & Footer)" name="brandDark" />
          </div>
        </div>

      </div>

      {/* Preview Column */}
      <div className="lg:border-l lg:border-border lg:ps-8">
        <div className="sticky top-24">
          <h3 className="text-lg font-bold text-brand-dark mb-4">Live Preview</h3>
          <ThemePreview />
          
          <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-sm border border-blue-100 text-sm">
            <p className="font-semibold mb-1">How it works</p>
            <p>Changes made here are previewed instantly on the right. Once you click "Save", the new theme is injected via the root layout and applies to all Shadcn components across the storefront and dashboard.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
