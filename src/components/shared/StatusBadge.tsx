import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getStatusColor } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  labelEn: string;
  labelAr: string;
  isAr?: boolean;
}

export function StatusBadge({ status, labelEn, labelAr, isAr }: StatusBadgeProps) {
  const colorClass = getStatusColor(status);
  const label = isAr ? labelAr : labelEn;
  
  return (
    <Badge 
      variant="secondary" 
      className={cn("px-2.5 py-1 text-[9px] font-black uppercase tracking-widest", colorClass)}
    >
      {label}
    </Badge>
  );
}
