import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { NotificationBell } from '@/components/dashboard/NotificationBell';
import { LogOut, User } from 'lucide-react';
import { signOut } from '@/auth'; // Adjust based on your auth setup later if needed

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user?.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen bg-(--muted)/30 font-sans text-foreground">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-16 md:ml-60 transition-all duration-300">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-background border-b border-border sticky top-0 z-10">
          <h1 className="text-sm font-bold uppercase tracking-widest text-(--navy)">Admin Panel</h1>
          
          <div className="flex items-center gap-6">
            <NotificationBell />
            
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-(--primary)/10 flex items-center justify-center text-(--primary)">
                <User className="size-4" />
              </div>
              <span className="text-sm font-medium hidden sm:block">{session.user.name || 'Admin User'}</span>
            </div>
            <form action={async () => {
              "use server"
              await signOut();
            }}>
              <button className="p-2 text-muted-foreground hover:text-(--danger) transition-colors rounded-sm cursor-pointer outline-none bg-transparent border-none" title="Sign Out">
                <LogOut className="size-4" />
              </button>
            </form>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
