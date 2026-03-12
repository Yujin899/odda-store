'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'new_order' | 'system' | 'alert';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Polling every minute
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id: string, link?: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      if (link) router.push(link);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PATCH' });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="relative outline-none">
        <Bell className="size-5 text-muted-foreground" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative outline-none cursor-pointer">
          <Bell className="size-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-[10px] font-bold border-2 border-white rounded-full animate-in zoom-in"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 shadow-2xl border-border bg-white rounded-(--radius)">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <DropdownMenuLabel className="p-0 text-xs font-black uppercase tracking-widest text-(--navy)">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto p-0 text-[10px] font-black uppercase tracking-widest text-(--primary) hover:text-(--primary)/80 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                markAllAsRead();
              }}
            >
              Mark all read
            </Button>
          )}
        </div>
        
        <div className="max-h-[350px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <div className="size-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                <Bell className="size-5 text-slate-200" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">All caught up!</p>
              <p className="text-[9px] font-bold text-slate-300 uppercase italic">No new notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification._id}
                className={`flex flex-col items-start gap-1 p-4 cursor-pointer transition-colors focus:bg-slate-50 border-b border-slate-50 last:border-none ${
                   !notification.isRead ? 'bg-blue-50/30' : ''
                }`}
                onClick={() => markAsRead(notification._id, notification.link)}
              >
                <div className="flex w-full items-start justify-between gap-2">
                   <h4 className={`text-[11px] font-black uppercase tracking-tight leading-none ${!notification.isRead ? 'text-(--primary)' : 'text-(--navy)'}`}>
                     {notification.title}
                   </h4>
                   {!notification.isRead && <div className="size-2 rounded-full bg-(--primary) shrink-0 mt-1 shadow-sm" />}
                </div>
                <p className="text-[10px] text-muted-foreground font-bold leading-relaxed pr-2">
                  {notification.message}
                </p>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-300 mt-1">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-2 border-t border-border bg-slate-50/50">
            <Button 
              variant="ghost" 
              className="w-full h-10 text-[9px] font-black uppercase tracking-[0.2em] text-(--navy) hover:bg-white transition-all outline-none"
              onClick={() => router.push('/dashboard/notifications')}
            >
              View All Activity
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
