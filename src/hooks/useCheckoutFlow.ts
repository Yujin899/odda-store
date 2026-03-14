import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Session } from 'next-auth';
import { checkoutSchema, CheckoutFormValues } from '@/lib/schemas';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';
import { CheckoutSettings } from '@/components/checkout/CheckoutTypes';

export function useCheckoutFlow(
  session: Session | null,
  settings: CheckoutSettings,
  dict: any,
  language: string
) {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCartStore();
  const { addToast } = useToastStore();

  const [currentStep, setCurrentStep] = useState(session?.user ? 1 : 0);
  const isRtl = language === 'ar';

  const methods = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: session?.user?.name || '',
      email: session?.user?.email || '',
      phone: '',
      address: '',
      city: 'Cairo',
      paymentMethod: 'cod',
      paymentProof: '',
    },
  });

  const { handleSubmit, trigger } = methods;

  useEffect(() => {
    if (session?.user && currentStep === 0) {
      setCurrentStep(1);
    }
  }, [session, currentStep]);

  const handleNext = async () => {
    if (currentStep === 2) {
      const isShippingValid = await trigger(['fullName', 'phone', 'address', 'city', 'email']);
      if (!isShippingValid) return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const onSubmit = async (values: CheckoutFormValues) => {
    const shippingFee = settings?.shippingFee || 0;
    const grandTotal = totalAmount + shippingFee;

    const orderBody = {
      shippingAddress: {
        fullName: values.fullName,
        phone: values.phone,
        address: values.address,
        city: values.city,
        email: values.email,
      },
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        nameAr: item.nameAr,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        type: item.type,
      })),
      totalAmount: grandTotal,
      paymentMethod: values.paymentMethod === 'cod' ? 'COD' : 'InstaPay',
      paymentProof: values.paymentProof,
      locale: language,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderBody),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Submission failed');

      addToast({ 
        title: dict.toasts.orderPlaced, 
        description: dict.toasts.orderPlacedDesc, 
        type: 'success' 
      });

      clearCart();
      router.push(`/order-confirmation/${data.id}`);
      router.refresh();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Final Submission Error:', error);
      addToast({ 
        title: dict.toasts.error, 
        description: errorMessage || dict.toasts.somethingWentWrong, 
        type: 'error' 
      });
    }
  };

  return {
    methods,
    currentStep,
    isRtl,
    handleNext,
    handleBack,
    handleSubmit: handleSubmit(onSubmit),
    itemsCount: items.length
  };
}
