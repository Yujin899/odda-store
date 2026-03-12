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
        addToast({ title: 'Success', description: 'User updated successfully', type: 'success' });
        setIsEditModalOpen(false);
        router.refresh();
      } else {
        const data = await res.json();
        addToast({ title: 'Error', description: data.message || 'Failed to update user', type: 'error' });
      }
    } catch {
      addToast({ title: 'Error', description: 'Fatal error updating user', type: 'error' });
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
        addToast({ title: 'Success', description: 'Password reset successfully', type: 'success' });
        setIsPasswordModalOpen(false);
        setNewPassword('');
        router.refresh();
      } else {
        const data = await res.json();
        addToast({ title: 'Error', description: data.message || 'Failed to reset password', type: 'error' });
      }
    } catch {
      addToast({ title: 'Error', description: 'Fatal error resetting password', type: 'error' });
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
          title: 'Success', 
          description: `User ${selectedUser.isBlocked ? 'unblocked' : 'blocked'} successfully`, 
          type: 'success' 
        });
        setIsBlockModalOpen(false);
        router.refresh();
      } else {
        const data = await res.json();
        addToast({ title: 'Error', description: data.message || 'Failed to toggle block status', type: 'error' });
      }
    } catch {
      addToast({ title: 'Error', description: 'Fatal error toggling block status', type: 'error' });
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
        addToast({ title: 'Success', description: 'User deleted successfully', type: 'success' });
        setIsDeleteModalOpen(false);
        router.refresh();
      } else {
        const data = await res.json();
        addToast({ title: 'Error', description: data.message || 'Failed to delete user', type: 'error' });
      }
    } catch {
      addToast({ title: 'Error', description: 'Fatal error deleting user', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Search customers..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-sm bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[80px] font-bold uppercase text-[10px] tracking-widest text-slate-500">Avatar</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-500">Customer</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-500">Role</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-500">Joined Date</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-500 text-center">Status</TableHead>
              <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest text-slate-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const isSelf = session?.user?.id === user._id;
                return (
                  <TableRow key={user._id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <Avatar className="size-9 border rounded-sm">
                        {user.image && <AvatarImage src={user.image} alt={user.name} />}
                        <AvatarFallback className="bg-slate-100 text-[10px] font-bold text-slate-600 rounded-sm">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm flex items-center gap-2">
                          {user.name}
                          {isSelf && <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-black border border-blue-100">YOU</span>}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.role === 'admin' ? 'default' : 'secondary'}
                        className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                          user.role === 'admin' ? 'bg-(--navy) hover:bg-(--navy)/90 text-white' : ''
                        }`}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {user.createdAt ? format(new Date(user.createdAt), 'MMMM dd, yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 ${
                          user.isBlocked 
                            ? 'bg-red-50 text-red-700 border-red-200' 
                            : 'bg-green-100 text-green-800 border-green-200'
                        }`}
                      >
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="size-8 p-0" disabled={isSelf}>
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-sm overflow-hidden">
                          <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400">Manage User</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedUser(user);
                              setEditFormData({ name: user.name, email: user.email, role: user.role });
                              setIsEditModalOpen(true);
                            }}
                            className="text-xs font-medium focus:bg-slate-50 cursor-pointer"
                          >
                            <Pencil className="size-3.5 mr-2" />
                            Edit Profile & Role
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedUser(user);
                              setIsPasswordModalOpen(true);
                            }}
                            className="text-xs font-medium focus:bg-slate-50 cursor-pointer"
                          >
                            <KeyRound className="size-3.5 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedUser(user);
                              setIsBlockModalOpen(true);
                            }}
                            className={`text-xs font-medium focus:bg-slate-50 cursor-pointer ${
                              user.isBlocked ? 'text-green-600 focus:text-green-700' : 'text-amber-600 focus:text-amber-700'
                            }`}
                          >
                            {user.isBlocked ? (
                              <><UserCheck className="size-3.5 mr-2" /> Unblock User</>
                            ) : (
                              <><UserX className="size-3.5 mr-2" /> Block User</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDeleteModalOpen(true);
                            }}
                            className="text-xs font-medium text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="size-3.5 mr-2" />
                            Delete Account
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
          <form onSubmit={handleUpdateUser}>
            <DialogHeader>
              <DialogTitle className="font-black uppercase tracking-tighter text-xl">Edit User Profile</DialogTitle>
              <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Update user identification and permissions
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Full Name</Label>
                <Input 
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="rounded-sm border-slate-200 text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Address</Label>
                <Input 
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="rounded-sm border-slate-200 text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">System Role</Label>
                <Select 
                  value={editFormData.role} 
                  onValueChange={(val: 'customer' | 'admin') => setEditFormData({ ...editFormData, role: val })}
                >
                  <SelectTrigger className="rounded-sm border-slate-200 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-sm">
                    <SelectItem value="customer" className="text-sm">Customer</SelectItem>
                    <SelectItem value="admin" className="text-sm">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="rounded-sm font-bold uppercase tracking-widest text-[10px] h-10 px-6 border-slate-200">Cancel</Button>
              <Button type="submit" disabled={isProcessing} className="bg-(--primary) hover:bg-(--primary)/90 text-white font-bold uppercase tracking-widest text-[10px] h-10 px-8 rounded-sm shadow-lg shadow-(--primary)/20">
                {isProcessing ? <Loader2 className="size-4 animate-spin mr-2" /> : <Check className="size-4 mr-2" />}
                Update User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Password Reset Modal */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="max-w-md rounded-sm">
          <form onSubmit={handleResetPassword}>
            <DialogHeader>
              <DialogTitle className="font-black uppercase tracking-tighter text-xl">Reset User Password</DialogTitle>
              <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Override this user&apos;s current password securely
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">New Secure Password</Label>
                <Input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter at least 6 characters"
                  className="rounded-sm border-slate-200 text-sm"
                  required
                />
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-sm flex items-start gap-3">
                <ShieldAlert className="size-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-[10px] text-amber-700 font-medium leading-relaxed uppercase tracking-tight">
                  This will immediately change the user&apos;s password. They will need to log in again if using credentials.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsPasswordModalOpen(false)} className="rounded-sm font-bold uppercase tracking-widest text-[10px] h-10 px-6 border-slate-200">Cancel</Button>
              <Button type="submit" disabled={isProcessing} className="bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-widest text-[10px] h-10 px-8 rounded-sm shadow-lg shadow-amber-600/20">
                {isProcessing ? <Loader2 className="size-4 animate-spin mr-2" /> : <KeyRound className="size-4 mr-2" />}
                Reset Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Block Confirmation */}
      <AlertDialog open={isBlockModalOpen} onOpenChange={setIsBlockModalOpen}>
        <AlertDialogContent className="rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black uppercase tracking-tighter">
              {selectedUser?.isBlocked ? 'Unblock User Account?' : 'Block User Account?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium">
              {selectedUser?.isBlocked 
                ? `This will restore ${selectedUser.name}&apos;s access to their account and the storefront.` 
                : `This will immediately prevent ${selectedUser?.name} from logging in or using their account.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm font-bold uppercase tracking-widest text-[10px]">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleBlock}
              className={`rounded-sm font-bold uppercase tracking-widest text-[10px] text-white ${
                selectedUser?.isBlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {isProcessing && <Loader2 className="size-3 animate-spin mr-2" />}
              {selectedUser?.isBlocked ? 'Confirm Unblock' : 'Confirm Block'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent className="rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black uppercase tracking-tighter text-red-600">Delete Account Permanently?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium">
              Are you sure you want to delete {selectedUser?.name}&apos;s account? This action is irreversible and all associated data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm font-bold uppercase tracking-widest text-[10px]">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="rounded-sm font-bold uppercase tracking-widest text-[10px] bg-red-600 hover:bg-red-700 text-white"
            >
              {isProcessing && <Loader2 className="size-3 animate-spin mr-2" />}
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
