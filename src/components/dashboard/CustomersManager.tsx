'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  MoreHorizontal, 
  Pencil, 
  ShieldAlert, 
  Trash2, 
  KeyRound, 
  UserX, 
  UserCheck,
  Check,
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToastStore } from '@/store/useToastStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { arEG } from 'date-fns/locale';

interface UserRow {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  isBlocked: boolean;
  image?: string;
  createdAt: string;
}

interface CustomersManagerProps {
  users: UserRow[];
}

export function CustomersManager({ users }: CustomersManagerProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { addToast } = useToastStore();
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Modal states
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [editFormData, setEditFormData] = useState({ name: '', email: '', role: 'customer' });
  const [newPassword, setNewPassword] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/users/${selectedUser._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });

      if (res.ok) {
        addToast({ title: dict.toasts.success, description: dict.toasts.userUpdated, type: 'success' });
        setIsEditModalOpen(false);
        router.refresh();
      } else {
        const data = await res.json();
        addToast({ title: dict.toasts.error, description: data.message || dict.toasts.userUpdateError, type: 'error' });
      }
    } catch {
      addToast({ title: dict.toasts.error, description: dict.toasts.somethingWentWrong, type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newPassword) return;

    setIsProcessing(true);
    try {
      const res = await fetch(`/api/users/${selectedUser._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });

      if (res.ok) {
        addToast({ title: dict.toasts.success, description: dict.toasts.passwordReset, type: 'success' });
        setIsPasswordModalOpen(false);
        setNewPassword('');
        router.refresh();
      } else {
        const data = await res.json();
        addToast({ title: dict.toasts.error, description: data.message || dict.toasts.passwordResetError, type: 'error' });
      }
    } catch {
      addToast({ title: dict.toasts.error, description: dict.toasts.somethingWentWrong, type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleBlock = async () => {
    if (!selectedUser) return;

    setIsProcessing(true);
    try {
      const res = await fetch(`/api/users/${selectedUser._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBlocked: !selectedUser.isBlocked }),
      });

      if (res.ok) {
        addToast({ 
          title: dict.toasts.success, 
          description: selectedUser.isBlocked ? dict.toasts.userUnblocked : dict.toasts.userBlocked, 
          type: 'success' 
        });
        setIsBlockModalOpen(false);
        router.refresh();
      } else {
        const data = await res.json();
        addToast({ title: dict.toasts.error, description: data.message || dict.toasts.userToggleBlockError, type: 'error' });
      }
    } catch {
      addToast({ title: dict.toasts.error, description: dict.toasts.somethingWentWrong, type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsProcessing(true);
    try {
      const res = await fetch(`/api/users/${selectedUser._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        addToast({ title: dict.toasts.success, description: dict.toasts.userDeleted, type: 'success' });
        setIsDeleteModalOpen(false);
        router.refresh();
      } else {
        const data = await res.json();
        addToast({ title: dict.toasts.error, description: data.message || dict.toasts.userDeleteError, type: 'error' });
      }
    } catch {
      addToast({ title: dict.toasts.error, description: dict.toasts.somethingWentWrong, type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">{dict.dashboard.customersPage.title}</h1>
        <p className="text-muted-foreground">
          {dict.dashboard.customersPage.subtitle}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder={dict.dashboard.customersPage.searchPlaceholder}
            className="ps-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        </div>
      </div>

      <div className="border rounded-sm bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className={`w-[80px] font-bold uppercase text-[10px] tracking-widest text-slate-500 ${language === 'ar' ? 'text-right' : 'text-left'}`}>{dict.dashboard.customersPage.table.avatar}</TableHead>
              <TableHead className={`font-bold uppercase text-[10px] tracking-widest text-slate-500 ${language === 'ar' ? 'text-right' : 'text-left'}`}>{dict.dashboard.customersPage.table.customer}</TableHead>
              <TableHead className={`font-bold uppercase text-[10px] tracking-widest text-slate-500 ${language === 'ar' ? 'text-right' : 'text-left'}`}>{dict.dashboard.customersPage.table.role}</TableHead>
              <TableHead className={`font-bold uppercase text-[10px] tracking-widest text-slate-500 ${language === 'ar' ? 'text-right' : 'text-left'}`}>{dict.dashboard.customersPage.table.joined}</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-500 text-center">{dict.dashboard.customersPage.table.status}</TableHead>
              <TableHead className={`font-bold uppercase text-[10px] tracking-widest text-slate-500 ${language === 'ar' ? 'text-left' : 'text-right'}`}>{dict.dashboard.customersPage.table.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
                  {dict.dashboard.customersPage.table.empty}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const isSelf = session?.user?.id === user._id;
                return (
                  <TableRow key={user._id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className={language === 'ar' ? 'text-right' : 'text-left'}>
                      <Avatar className="size-9 border rounded-sm">
                        {user.image && <AvatarImage src={user.image} alt={user.name} />}
                        <AvatarFallback className="bg-slate-100 text-[10px] font-bold text-slate-600 rounded-sm">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className={language === 'ar' ? 'text-right' : 'text-left'}>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm flex items-center gap-2">
                          {user.name}
                          {isSelf && <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-black border border-blue-100 uppercase tracking-tighter">{dict.dashboard.customersPage.table.you}</span>}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className={language === 'ar' ? 'text-right' : 'text-left'}>
                      <Badge 
                        variant={user.role === 'admin' ? 'default' : 'secondary'}
                        className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                          user.role === 'admin' ? 'bg-(--navy) hover:bg-(--navy)/90 text-white' : ''
                        } ${language === 'ar' ? 'font-cairo' : ''}`}
                      >
                        {dict.dashboard.customersPage.roles[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-sm ${language === 'ar' ? 'font-cairo text-right' : 'text-left'}`}>
                      {user.createdAt ? format(new Date(user.createdAt), language === 'ar' ? 'dd MMMM yyyy' : 'MMMM dd, yyyy', { locale: language === 'ar' ? arEG : undefined }) : dict.dashboard.customersPage.table.na}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 ${
                          user.isBlocked 
                            ? 'bg-red-50 text-red-700 border-red-200' 
                            : 'bg-green-100 text-green-800 border-green-200'
                        } ${language === 'ar' ? 'font-cairo' : ''}`}
                      >
                        {user.isBlocked ? dict.dashboard.customersPage.statuses.blocked : dict.dashboard.customersPage.statuses.active}
                      </Badge>
                    </TableCell>
                    <TableCell className={language === 'ar' ? 'text-left' : 'text-right'}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="size-8 p-0" disabled={isSelf}>
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-sm overflow-hidden p-1">
                          <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400 px-2 py-1.5">{dict.dashboard.customersPage.menu.label}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedUser(user);
                              setEditFormData({ name: user.name, email: user.email, role: user.role });
                              setIsEditModalOpen(true);
                            }}
                            className="text-xs font-medium focus:bg-slate-50 cursor-pointer p-2 flex items-center gap-2"
                          >
                            <Pencil className="size-3.5" />
                            {dict.dashboard.customersPage.menu.edit}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedUser(user);
                              setIsPasswordModalOpen(true);
                            }}
                            className="text-xs font-medium focus:bg-slate-50 cursor-pointer p-2 flex items-center gap-2"
                          >
                            <KeyRound className="size-3.5" />
                            {dict.dashboard.customersPage.menu.reset}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedUser(user);
                              setIsBlockModalOpen(true);
                            }}
                            className={`text-xs font-medium focus:bg-slate-50 cursor-pointer p-2 flex items-center gap-2 ${
                              user.isBlocked ? 'text-green-600 focus:text-green-700' : 'text-amber-600 focus:text-amber-700'
                            }`}
                          >
                            {user.isBlocked ? (
                              <><UserCheck className="size-3.5" /> {dict.dashboard.customersPage.menu.unblock}</>
                            ) : (
                              <><UserX className="size-3.5" /> {dict.dashboard.customersPage.menu.block}</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDeleteModalOpen(true);
                            }}
                            className="text-xs font-medium text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer p-2 flex items-center gap-2"
                          >
                            <Trash2 className="size-3.5" />
                            {dict.dashboard.customersPage.menu.delete}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md rounded-sm">
          <form onSubmit={handleUpdateUser} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <DialogHeader className={language === 'ar' ? 'text-right' : 'text-left'}>
              <DialogTitle className={`font-black uppercase tracking-tighter text-xl ${language === 'ar' ? 'font-cairo' : ''}`}>
                {dict.dashboard.customersPage.modals.edit.title}
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {dict.dashboard.customersPage.modals.edit.description}
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <Label className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {dict.dashboard.customersPage.modals.edit.name}
                </Label>
                <Input 
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className={`rounded-sm border-slate-200 text-sm ${language === 'ar' ? 'text-right' : ''}`}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {dict.dashboard.customersPage.modals.edit.email}
                </Label>
                <Input 
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className={`rounded-sm border-slate-200 text-sm ${language === 'ar' ? 'text-right' : ''}`}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {dict.dashboard.customersPage.modals.edit.role}
                </Label>
                <Select 
                  value={editFormData.role} 
                  onValueChange={(val: 'customer' | 'admin') => setEditFormData({ ...editFormData, role: val })}
                >
                  <SelectTrigger className={`rounded-sm border-slate-200 text-sm ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-sm" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    <SelectItem value="customer" className="text-sm">{dict.dashboard.customersPage.roles.customer}</SelectItem>
                    <SelectItem value="admin" className="text-sm">{dict.dashboard.customersPage.roles.admin}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className={`gap-3 ${language === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1 sm:flex-none rounded-sm font-bold uppercase tracking-widest text-[10px] h-10 px-6 border-slate-200">
                {dict.dashboard.customersPage.modals.edit.cancel}
              </Button>
              <Button type="submit" disabled={isProcessing} className="flex-1 sm:flex-none bg-(--primary) hover:bg-(--primary)/90 text-white font-bold uppercase tracking-widest text-[10px] h-10 px-8 rounded-sm shadow-lg shadow-(--primary)/20">
                {isProcessing ? <Loader2 className="size-4 animate-spin mr-2" /> : <Check className="size-4 mr-2" />}
                {dict.dashboard.customersPage.modals.edit.update}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Password Reset Modal */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="max-w-md rounded-sm">
          <form onSubmit={handleResetPassword} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <DialogHeader className={language === 'ar' ? 'text-right' : 'text-left'}>
              <DialogTitle className={`font-black uppercase tracking-tighter text-xl ${language === 'ar' ? 'font-cairo' : ''}`}>
                {dict.dashboard.customersPage.modals.reset.title}
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {dict.dashboard.customersPage.modals.reset.description}
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <Label className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {dict.dashboard.customersPage.modals.reset.password}
                </Label>
                <Input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={dict.dashboard.customersPage.modals.reset.placeholder}
                  className={`rounded-sm border-slate-200 text-sm ${language === 'ar' ? 'text-right' : ''}`}
                  required
                />
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-sm flex items-start gap-3">
                <ShieldAlert className="size-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-[10px] text-amber-700 font-medium leading-relaxed uppercase tracking-tight">
                  {dict.dashboard.customersPage.modals.reset.notice}
                </p>
              </div>
            </div>
            <DialogFooter className={`gap-3 ${language === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
              <Button type="button" variant="outline" onClick={() => setIsPasswordModalOpen(false)} className="flex-1 sm:flex-none rounded-sm font-bold uppercase tracking-widest text-[10px] h-10 px-6 border-slate-200">
                {dict.dashboard.customersPage.modals.reset.cancel}
              </Button>
              <Button type="submit" disabled={isProcessing} className="flex-1 sm:flex-none bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-widest text-[10px] h-10 px-8 rounded-sm shadow-lg shadow-amber-600/20">
                {isProcessing ? <Loader2 className="size-4 animate-spin mr-2" /> : <KeyRound className="size-4 mr-2" />}
                {dict.dashboard.customersPage.modals.reset.confirm}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Block Confirmation */}
      <AlertDialog open={isBlockModalOpen} onOpenChange={isBlockModalOpen ? setIsBlockModalOpen : () => {}}>
        <AlertDialogContent className="rounded-sm" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <AlertDialogHeader className={language === 'ar' ? 'text-right' : 'text-left'}>
            <AlertDialogTitle className={`font-black uppercase tracking-tighter ${language === 'ar' ? 'font-cairo' : ''}`}>
              {selectedUser?.isBlocked ? dict.dashboard.customersPage.modals.block.unblockTitle : dict.dashboard.customersPage.modals.block.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium">
              {selectedUser?.isBlocked 
                ? dict.dashboard.customersPage.modals.block.unblockDescription 
                : dict.dashboard.customersPage.modals.block.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={`gap-3 ${language === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
            <AlertDialogCancel className="rounded-sm font-bold uppercase tracking-widest text-[10px]">
              {dict.dashboard.customersPage.modals.block.cancel}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleBlock}
              className={`rounded-sm font-bold uppercase tracking-widest text-[10px] text-white ${
                selectedUser?.isBlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {isProcessing && <Loader2 className="size-3 animate-spin mr-2" />}
              {selectedUser?.isBlocked ? dict.dashboard.customersPage.modals.block.confirmUnblock : dict.dashboard.customersPage.modals.block.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={isDeleteModalOpen ? setIsDeleteModalOpen : () => {}}>
        <AlertDialogContent className="rounded-sm" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <AlertDialogHeader className={language === 'ar' ? 'text-right' : 'text-left'}>
            <AlertDialogTitle className={`font-black uppercase tracking-tighter text-red-600 ${language === 'ar' ? 'font-cairo' : ''}`}>
              {dict.dashboard.customersPage.modals.delete.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium">
              {dict.dashboard.customersPage.modals.delete.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={`gap-3 ${language === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
            <AlertDialogCancel className="rounded-sm font-bold uppercase tracking-widest text-[10px]">
              {dict.dashboard.customersPage.modals.delete.cancel}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="rounded-sm font-bold uppercase tracking-widest text-[10px] bg-red-600 hover:bg-red-700 text-white"
            >
              {isProcessing && <Loader2 className="size-3 animate-spin mr-2" />}
              {dict.dashboard.customersPage.modals.delete.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
