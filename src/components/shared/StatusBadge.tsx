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
    <span className={`inline-flex items-center px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest ${colorClass}`}>
      {label}
    </span>
  );
}
