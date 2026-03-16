'use client';

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
  Trash2, 
  KeyRound, 
  UserX, 
  UserCheck 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
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

interface CustomersTableProps {
  users: UserRow[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onEdit: (user: UserRow) => void;
  onResetPassword: (user: UserRow) => void;
  onToggleBlock: (user: UserRow) => void;
  onDelete: (user: UserRow) => void;
  currentUserId?: string;
  dict: any;
  language: string;
}

export function CustomersTable({
  users,
  searchTerm,
  setSearchTerm,
  onEdit,
  onResetPassword,
  onToggleBlock,
  onDelete,
  currentUserId,
  dict,
  language,
}: CustomersTableProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute inset-s-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder={dict.dashboard.customersPage.searchPlaceholder}
            className="ps-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-sm bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className={`w-[80px] font-bold uppercase text-[10px] tracking-widest text-slate-500 ${language === 'ar' ? 'text-end' : 'text-start'}`}>{dict.dashboard.customersPage.table.avatar}</TableHead>
              <TableHead className={`font-bold uppercase text-[10px] tracking-widest text-slate-500 ${language === 'ar' ? 'text-end' : 'text-start'}`}>{dict.dashboard.customersPage.table.customer}</TableHead>
              <TableHead className={`font-bold uppercase text-[10px] tracking-widest text-slate-500 ${language === 'ar' ? 'text-end' : 'text-start'}`}>{dict.dashboard.customersPage.table.role}</TableHead>
              <TableHead className={`font-bold uppercase text-[10px] tracking-widest text-slate-500 ${language === 'ar' ? 'text-end' : 'text-start'}`}>{dict.dashboard.customersPage.table.joined}</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-500 text-center">{dict.dashboard.customersPage.table.status}</TableHead>
              <TableHead className={`font-bold uppercase text-[10px] tracking-widest text-slate-500 ${language === 'ar' ? 'text-start' : 'text-end'}`}>{dict.dashboard.customersPage.table.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
                  {dict.dashboard.customersPage.table.empty}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const isSelf = currentUserId === user._id;
                return (
                  <TableRow key={user._id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className={language === 'ar' ? 'text-end' : 'text-start'}>
                      <Avatar className="size-9 border rounded-sm">
                        {user.image && <AvatarImage src={user.image} alt={user.name} />}
                        <AvatarFallback className="bg-slate-100 text-[10px] font-bold text-slate-600 rounded-sm">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className={language === 'ar' ? 'text-end' : 'text-start'}>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm flex items-center gap-2">
                          {user.name}
                          {isSelf && <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-black border border-blue-100 uppercase tracking-tighter">{dict.dashboard.customersPage.table.you}</span>}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className={language === 'ar' ? 'text-end' : 'text-start'}>
                      <Badge 
                        variant={user.role === 'admin' ? 'default' : 'secondary'}
                        className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                          user.role === 'admin' ? 'bg-(--navy) hover:bg-(--navy)/90 text-white' : ''
                        } ${language === 'ar' ? 'font-cairo' : ''}`}
                      >
                        {dict.dashboard.customersPage.roles[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-sm ${language === 'ar' ? 'font-cairo text-end' : 'text-start'}`}>
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
                    <TableCell className={language === 'ar' ? 'text-start' : 'text-end'}>
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
                            onClick={() => onEdit(user)}
                            className="text-xs font-medium focus:bg-slate-50 cursor-pointer p-2 flex items-center gap-2"
                          >
                            <Pencil className="size-3.5" />
                            {dict.dashboard.customersPage.menu.edit}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onResetPassword(user)}
                            className="text-xs font-medium focus:bg-slate-50 cursor-pointer p-2 flex items-center gap-2"
                          >
                            <KeyRound className="size-3.5" />
                            {dict.dashboard.customersPage.menu.reset}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onToggleBlock(user)}
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
                            onClick={() => onDelete(user)}
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
    </div>
  );
}
