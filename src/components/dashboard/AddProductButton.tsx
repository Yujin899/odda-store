import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';

export function AddProductButton() {
  const router = useRouter();
  const { language } = useLanguageStore();
  const dict = getDictionary(language);

  return (
    <Button 
      onClick={() => router.push('/dashboard/products/new')}
      className="bg-(--primary) hover:bg-(--primary)/90 text-white font-bold uppercase tracking-widest text-xs h-11 px-6 shadow-lg shadow-(--primary)/20 rounded-sm"
    >
      <Plus className={`size-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
      {dict.dashboard.productsPage.addProduct}
    </Button>
  );
}
