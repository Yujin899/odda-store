'use client';

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";
import ar from "@/dictionaries/ar.json";
import en from "@/dictionaries/en.json";

export function SignOutButton() {
  const { language } = useLanguageStore();
  const dict = language === 'en' ? en : ar;
  
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-2 px-8 py-3 bg-red-50 text-red-600 font-bold rounded-full hover:bg-red-600 hover:text-white transition-all active:scale-95 border-none cursor-pointer outline-none"
    >
      <LogOut className="size-5" />
      {dict.profile.signOut}
    </button>
  );
}
