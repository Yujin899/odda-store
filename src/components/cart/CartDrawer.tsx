'use client';

import { useCartUIStore } from '@/store/useCartUIStore';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import Image from 'next/image';

export function CartDrawer() {
  const { isOpen, closeCart } = useCartUIStore();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent showCloseButton={false} className="p-0 border-none w-full max-w-md bg-background flex flex-col shadow-none">
        <SheetTitle className="sr-only">Your Cart</SheetTitle>
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-(--primary) font-normal">shopping_basket</span>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Your Cart</h2>
            <span className="bg-(--primary)/10 text-(--primary) text-xs font-bold px-2 py-0.5 rounded-full">3</span>
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-muted rounded-full transition-colors flex items-center justify-center border-none outline-none cursor-pointer bg-transparent">
            <span className="material-symbols-outlined text-muted-foreground font-normal">close</span>
          </button>
        </div>
        
        {/* Free Delivery Banner */}
        <div className="px-4 sm:px-6 py-3 flex items-center gap-3 border-b border-(--primary)/10 shrink-0">
          <span className="material-symbols-outlined text-(--primary) text-sm font-normal">local_shipping</span>
          <p className="text-[10px] sm:text-xs font-bold text-(--primary) uppercase tracking-widest">Free campus delivery applied</p>
        </div>
        
        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 flex flex-col scrollbar-thin scrollbar-thumb-slate-200">
          {/* Item 1 */}
          <div className="flex gap-3 sm:gap-4">
            <div className="size-20 sm:size-24 bg-muted shrink-0 overflow-hidden border border-slate-100 rounded-sm relative">
              <Image 
                alt="Classic Stethoscope III" 
                fill 
                className="object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjfv7G5fB1b67d_rspMIn-69RhN059Gi6WjIYTn7TxI_cPAgk7y49cizr4mOg_wlViFz3Fc3t1GVgzKtowHTzxVojxJTZILrh1lBPj8PSV5h63CQkQROBxjZGANA5JTGuk2Laxz3Tnnq6Qk-qYlEUfCEd9moCAl9ZpJQ5nju7EcePK80g8Cc0H0kfhghejA9Kvbdi-5p3fX0OG_83R4mFtsjjWr--vpXbrbumS1GLz77Y0gCwEAoLjhm-M7i0NQiLaiWpgA9YhpQ"
              />
            </div>
            <div className="flex flex-col justify-between flex-1 min-w-0">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-foreground leading-tight uppercase tracking-tight text-[11px] sm:text-sm truncate sm:whitespace-normal">Classic Stethoscope III</h3>
                  <button className="text-muted-foreground hover:text-(--danger) transition-colors flex items-center justify-center border-none outline-none cursor-pointer bg-transparent shrink-0">
                    <span className="material-symbols-outlined text-sm font-normal">delete</span>
                  </button>
                </div>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-bold truncate">Diagnostics / Clinical Grade</p>
              </div>
              <div className="flex justify-between items-end gap-2 mt-2">
                <div className="flex items-center border border-slate-200 h-7 sm:h-8 px-1 rounded-sm">
                  <button className="p-1 hover:text-(--primary) transition-colors flex items-center justify-center border-none outline-none cursor-pointer bg-transparent">
                    <span className="material-symbols-outlined text-xs sm:text-sm font-normal">remove</span>
                  </button>
                  <span className="px-2 sm:px-3 text-[10px] sm:text-xs font-bold text-foreground">1</span>
                  <button className="p-1 hover:text-(--primary) transition-colors flex items-center justify-center border-none outline-none cursor-pointer bg-transparent">
                    <span className="material-symbols-outlined text-xs sm:text-sm font-normal">add</span>
                  </button>
                </div>
                <p className="font-black text-foreground text-xs sm:text-sm whitespace-nowrap">4,250 EGP</p>
              </div>
            </div>
          </div>
          
          {/* Item 2 */}
          <div className="flex gap-3 sm:gap-4">
            <div className="size-20 sm:size-24 bg-muted shrink-0 overflow-hidden border border-slate-100 rounded-sm relative">
              <Image 
                alt="Precision Scalpel Set" 
                fill 
                className="object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKVd8MH2HFNM5Jiq53iKbYwSos9ZqxTB3BCnn02hWGsiq2hdnRumXCtQ08Ki7X5iFc-YXTw-nZirWI5GMKKbDHb47vSOSlESml0D8VAOfHOtg-glW3GAKvB3BCL2f7ZMEPzJA3Rc_xgR3sA_hGAS8LgwttyViSz69yVoe5d13bLWpuYSSFkobUAZp-9gTtRnr5XXenJGKVRg_iYFj4Jw-ynbfiEnibVrPulixV7m39BVAx0W17rMLsADC1DgsmF5yeoaq9dA0BMg"
              />
            </div>
            <div className="flex flex-col justify-between flex-1 min-w-0">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-foreground leading-tight uppercase tracking-tight text-[11px] sm:text-sm truncate sm:whitespace-normal">Precision Scalpel Set</h3>
                  <button className="text-muted-foreground hover:text-(--danger) transition-colors flex items-center justify-center border-none outline-none cursor-pointer bg-transparent shrink-0">
                    <span className="material-symbols-outlined text-sm font-normal">delete</span>
                  </button>
                </div>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-bold truncate">Surgery / Titanium Steel</p>
              </div>
              <div className="flex justify-between items-end gap-2 mt-2">
                <div className="flex items-center border border-slate-200 h-7 sm:h-8 px-1 rounded-sm">
                  <button className="p-1 hover:text-(--primary) transition-colors flex items-center justify-center border-none outline-none cursor-pointer bg-transparent">
                    <span className="material-symbols-outlined text-xs sm:text-sm font-normal">remove</span>
                  </button>
                  <span className="px-2 sm:px-3 text-[10px] sm:text-xs font-bold text-foreground">2</span>
                  <button className="p-1 hover:text-(--primary) transition-colors flex items-center justify-center border-none outline-none cursor-pointer bg-transparent">
                    <span className="material-symbols-outlined text-xs sm:text-sm font-normal">add</span>
                  </button>
                </div>
                <p className="font-black text-foreground text-xs sm:text-sm whitespace-nowrap">3,780 EGP</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Drawer Footer */}
        <div className="border-t border-slate-100 p-4 sm:p-6 space-y-4 bg-background shrink-0">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <span>Subtotal</span>
              <span>8,030 EGP</span>
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <span>Delivery</span>
              <span className="text-(--primary)">FREE</span>
            </div>
            <div className="flex justify-between text-lg sm:text-xl font-black text-foreground pt-3 sm:pt-4 border-t border-slate-100">
              <span>Total</span>
              <span>8,030 EGP</span>
            </div>
          </div>
          <div className="pt-2 flex flex-col">
            <button className="w-full bg-(--primary) hover:bg-foreground hover:text-background text-background font-bold py-4 sm:py-5 flex items-center justify-center gap-2 transition-all active:scale-[0.98] rounded-sm border-none outline-none cursor-pointer uppercase tracking-widest text-[10px] sm:text-xs shadow-xl">
              <span>Proceed to Checkout</span>
              <span className="material-symbols-outlined font-normal text-sm">arrow_forward</span>
            </button>
            <p className="text-center text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest mt-4 sm:mt-6 font-bold">Secure Clinical Checkout System</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
