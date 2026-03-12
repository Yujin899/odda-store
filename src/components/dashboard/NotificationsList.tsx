'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  Clock, 
  AlertCircle, 
  ShoppingBag, 
  Settings,
  CheckCircle2,
  MoreVertical
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from '@/store/useToastStore';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'new_order' | 'system' | 'alert';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string, link?: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      if (link) router.push(link);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PATCH' });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All marked as read');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'new_order':
        return <ShoppingBag className="size-4 text-blue-500" />;
      case 'alert':
        return <AlertCircle className="size-4 text-rose-500" />;
      default:
        return <Settings className="size-4 text-slate-400" />;
    }
  };

  const filteredNotifications = notifications.filter(n => 
    filter === 'all' ? true : !n.isRead
  );

  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-(--radius) border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-(--primary)/10 flex items-center justify-center">
            <Bell className="size-5 text-(--primary)" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase tracking-widest text-(--navy)">Activity Center</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Manage all system notifications</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200">
            <Button 
              variant={filter === 'all' ? 'secondary' : 'ghost'} 
              size="sm" 
              className={`h-8 px-4 text-[10px] font-black uppercase tracking-widest ${filter === 'all' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={filter === 'unread' ? 'secondary' : 'ghost'} 
              size="sm" 
              className={`h-8 px-4 text-[10px] font-black uppercase tracking-widest ${filter === 'unread' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
              onClick={() => setFilter('unread')}
            >
              Unread
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="ml-2 size-4 bg-(--primary) text-white text-[8px] flex items-center justify-center rounded-full">
                  {notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-10 text-[10px] font-black uppercase tracking-widest px-4 border-slate-200 hover:bg-slate-50"
            onClick={markAllAsRead}
            disabled={!notifications.some(n => !n.isRead)}
          >
            <CheckCircle2 className="size-3 mr-2 text-emerald-500" />
            Mark All Read
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="size-10 border-4 border-(--primary)/20 border-t-(--primary) rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Activity...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white border rounded-(--radius) p-20 text-center space-y-4 shadow-sm">
            <div className="size-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto border border-dashed border-slate-200">
              <Bell className="size-6 text-slate-200" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Nothing here yet</p>
              <p className="text-[10px] font-bold text-slate-300 uppercase italic">Your activity history is empty</p>
            </div>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification._id}
              className={`group transition-all hover:bg-slate-50 cursor-pointer overflow-hidden border-border ${!notification.isRead ? 'bg-blue-50/20 ring-1 ring-blue-500/10' : 'bg-white'}`}
              onClick={() => markAsRead(notification._id, notification.link)}
            >
              <CardContent className="p-0">
                <div className="flex items-start p-5 gap-4">
                  <div className={`mt-1 size-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${!notification.isRead ? 'bg-white' : 'bg-slate-50 border border-slate-100'}`}>
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-[12px] font-black uppercase tracking-tight ${!notification.isRead ? 'text-(--primary)' : 'text-(--navy)'}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <Badge className="h-4 bg-(--primary) text-white text-[8px] font-black uppercase p-1">NEW</Badge>
                        )}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
                        <Clock className="size-3" />
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-bold leading-relaxed max-w-2xl">
                      {notification.message}
                    </p>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreVertical className="size-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="text-[10px] font-black uppercase tracking-widest">
                        {!notification.isRead && (
                          <DropdownMenuItem onClick={() => markAsRead(notification._id)}>
                            <Check className="size-3 mr-2 text-emerald-500" />
                            Mark as read
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-rose-500">
                          <Trash2 className="size-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {!isLoading && notifications.length > 50 && (
         <div className="flex justify-center pt-4">
            <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest border-slate-200">
               Load More Activity
            </Button>
         </div>
      )}
    </div>
  );
}
