'use client'

import React from 'react'
import Link from 'next/link'
import { type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface NavItem {
  label: string
  labelAr?: string
  icon: LucideIcon
  href?: string           // for Link-based items
  onClick?: () => void    // for button-based items (cart, search, menu)
  isActive?: boolean
  badge?: number          // for cart count etc.
}

interface MobileBottomNavProps {
  items: NavItem[]
  isAr?: boolean
}

export function MobileBottomNav({ items, isAr }: MobileBottomNavProps) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 flex md:hidden items-center justify-around bg-white/90 backdrop-blur-md border-t border-slate-200 px-1 pb-[env(safe-area-inset-bottom)] pt-2 h-[calc(72px+env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      {items.map((item, index) => {
        const { icon: Icon, label, labelAr, href, onClick, isActive, badge } = item
        const displayLabel = isAr && labelAr ? labelAr : label

        const content = (
          <div className="flex flex-col items-center justify-center gap-1 w-full relative scale-95 sm:scale-100">
            {isActive && (
              <motion.div 
                layoutId="activeTabTop"
                className="absolute -top-2 w-8 h-1 bg-(--primary) rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <div className={cn(
              "p-1.5 rounded-xl transition-colors",
              isActive ? "bg-(--primary)/10" : "bg-transparent"
            )}>
              <Icon 
                className={cn(
                  "size-5 transition-colors duration-200",
                  isActive ? 'text-(--primary) stroke-[2.5px]' : 'text-slate-400 stroke-[2px]'
                )} 
              />
              {badge !== undefined && badge > 0 && (
                <span className="absolute -top-1 -inset-e-1 bg-(--primary) text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none flex items-center justify-center min-w-[16px] h-4 border-2 border-white dir-ltr" dir="ltr">
                  {badge}
                </span>
              )}
            </div>
            <span className={cn(
              "text-[10px] font-black uppercase tracking-tighter transition-colors duration-200 text-center px-1 truncate w-full",
              isActive ? 'text-(--primary)' : 'text-slate-400 font-bold'
            )}>
              {displayLabel}
            </span>
          </div>
        )

        if (href) {
          return (
            <Link key={index} href={href} className="flex-1 py-1 outline-none">
              {content}
            </Link>
          )
        }

        return (
          <button 
            key={index} 
            onClick={onClick}
            className="flex-1 py-1 border-none bg-transparent cursor-pointer outline-none"
          >
            {content}
          </button>
        )
      })}
    </nav>
  )
}
