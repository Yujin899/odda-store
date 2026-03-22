import { useFormContext } from 'react-hook-form';
import { BundleFormValues } from '@/lib/schemas';
import { IBundle } from '@/models/Bundle';

interface BundleFormHeaderProps {
  initialData?: IBundle;
  language: string;
  dict: any;
}

export function BundleFormHeader({ initialData, language, dict }: BundleFormHeaderProps) {
  const { watch } = useFormContext<BundleFormValues>();
  const name = watch('name');
  const isRtl = language === 'ar';

  return (
    <div className={bcn("flex flex-col gap-1 mb-10 pb-6 border-b border-slate-200", isRtl ? "text-end" : "text-start")}>
      <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-navy">
        {initialData ? (isRtl ? 'تعديل العرض' : 'Edit Bundle') : (isRtl ? 'عرض جديد' : 'New Bundle')}
      </h1>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate max-w-[200px] sm:max-w-none">
        {name || (isRtl ? 'بدون عنوان' : 'Untitled')}
      </p>
    </div>
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
