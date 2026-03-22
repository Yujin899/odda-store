import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Package, Settings, ShieldCheck, ChevronRight } from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import en from "@/dictionaries/en.json";
import ar from "@/dictionaries/ar.json";
import { cookies } from "next/headers";

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const language = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const dict = language === "en" ? en : ar;

  const isAdmin = session.user.role === "admin";

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pb-24">
      {/* Header */}
      <div className="flex flex-col items-center mb-12">
        <div className="relative mb-4">
          {session.user.image ? (
            <div className="relative size-24 md:size-32">
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                fill
                className="rounded-full border-4 border-white shadow-xl object-cover"
                sizes="(max-width: 768px) 96px, 128px"
                priority
              />
            </div>
          ) : (
            <div className="bg-primary/10 text-primary size-24 md:size-32 rounded-full flex items-center justify-center font-bold text-3xl md:text-4xl uppercase shadow-inner border border-primary/20">
              {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
            </div>
          )}
          <div className="absolute inset-b-1 inset-e-1 md:inset-b-2 md:inset-e-2 bg-green-500 size-5 rounded-full border-2 border-white" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-navy mb-1 text-center">
          {session.user.name || dict.profile.userPlaceholder}
        </h1>
        <p className="text-slate-500 text-sm md:text-base">
          {session.user.email}
        </p>
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <Link 
          href="/orders" 
          className="group flex items-center justify-between p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Package className="size-6" />
            </div>
            <div>
              <h3 className="font-bold text-navy truncate">{dict.profile.orderHistory}</h3>
              <p className="text-xs text-slate-400">{dict.profile.viewOrders}</p>
            </div>
          </div>
          <ChevronRight className="size-5 text-slate-300 group-hover:text-primary transition-colors ms-auto rtl:rotate-180" />
        </Link>

        <div 
          className="group flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-2xl cursor-not-allowed opacity-70"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-200 text-slate-500 rounded-xl">
              <Settings className="size-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-500">{dict.profile.accountSettings}</h3>
              <p className="text-xs text-slate-400">{dict.profile.manageAccount}</p>
            </div>
          </div>
        </div>

        {isAdmin && (
          <Link 
            href="/dashboard" 
            className="md:col-span-2 group flex items-center justify-between p-6 bg-primary/5 border border-primary/20 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary text-white rounded-xl">
                <ShieldCheck className="size-6" />
              </div>
              <div>
                <h3 className="font-bold text-navy">{dict.profile.adminDashboard}</h3>
                <p className="text-xs text-slate-500">{dict.profile.adminDesc}</p>
              </div>
            </div>
            <ChevronRight className="size-5 text-primary ms-auto rtl:rotate-180" />
          </Link>
        )}
      </div>

      {/* Sign Out */}
      <div className="flex justify-center">
        <SignOutButton />
      </div>
    </div>
  );
}
