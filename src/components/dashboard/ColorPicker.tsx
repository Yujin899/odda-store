'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PRESET_COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#64748b', // Slate
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#eab308', // Yellow
  '#84cc16', // Lime
  '#22c55e', // Green
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#0ea5e9', // Sky
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#a855f7', // Purple
  '#d946ef', // Fuchsia
  '#ec4899', // Pink
  '#f43f5e', // Rose
];

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      {label && <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full h-10 px-3 flex items-center justify-between rounded-sm border-slate-200"
          >
            <div className="flex items-center gap-2">
              <div 
                className="size-4 rounded-sm border border-slate-200" 
                style={{ backgroundColor: color }} 
              />
              <span className="text-xs font-mono uppercase tracking-wider">{color}</span>
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Picker</div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-3 rounded-sm border-slate-200 shadow-xl">
          <div className="space-y-3">
            <div className="grid grid-cols-7 gap-1.5">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={cn(
                    "size-7 rounded-sm border border-slate-100 transition-all hover:scale-110",
                    color.toLowerCase() === preset.toLowerCase() ? "ring-2 ring-(--primary) ring-offset-2" : ""
                  )}
                  style={{ backgroundColor: preset }}
                  onClick={() => onChange(preset)}
                />
              ))}
            </div>
            
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <div 
                className="size-8 rounded-sm border border-slate-200 shrink-0" 
                style={{ backgroundColor: color }} 
              />
              <Input 
                value={color}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#000000"
                className="h-8 text-xs font-mono rounded-sm border-slate-200 focus:border-(--primary)"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
