"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, Activity, Menu, X, Check, Clock } from 'lucide-react';

import { notificationsApi } from '@/services/api';
import { cn } from '@/lib/utils';
import { NewScanModal } from '@/components/modals/NewScanModal';


interface TopNavProps {
  onMenuClick: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  link?: string;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const data = await notificationsApi.list() as Notification[];
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };


  const handleNotificationClick = (item: Notification) => {
    setDropdownOpen(false);
    if (item.link) {
      router.push(item.link);
    }
  };

  return (
    <>
      <NewScanModal open={scanModalOpen} onClose={() => { setScanModalOpen(false); fetchNotifications(); }} />
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-surface/30 backdrop-blur-md border-b border-white/5 sticky top-0 z-40 flex-shrink-0 gap-3">
      {/* Left: hamburger (mobile) + search (desktop) */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-muted hover:text-white transition-colors rounded-lg hover:bg-white/5 flex-shrink-0"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="relative w-80 hidden md:block">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search inspections, panels, reports..."
            className="w-full bg-black/40 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-muted focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/30 transition-all"
          />
        </div>

        {searchOpen && (
          <div className="relative flex-1 md:hidden">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input
              autoFocus
              type="text"
              placeholder="Search..."
              className="w-full bg-black/40 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-muted focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/30 transition-all"
            />
          </div>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 md:gap-5 flex-shrink-0 relative">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
          </span>
          <span className="text-[10px] font-mono text-muted tracking-widest">SYSTEM NORMAL</span>
        </div>

        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="md:hidden p-2 text-muted hover:text-white transition-colors rounded-lg hover:bg-white/5"
          aria-label="Search"
        >
          {searchOpen ? <X size={18} /> : <Search size={18} />}
        </button>

        {/* Notifications Dropdown trigger */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative p-2 text-muted hover:text-white transition-colors rounded-lg hover:bg-white/5"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[10px] h-[10px] rounded-full bg-accent-orange border border-background flex items-center justify-center text-[7px] font-bold text-white px-0.5">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown body */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in duration-200">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <span className="font-display font-semibold text-xs text-white">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-mono text-accent-cyan hover:underline flex items-center gap-1"
                  >
                    <Check size={10} /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[300px] overflow-y-auto divide-y divide-white/5 bg-background/95">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={cn(
                        "p-4 text-left cursor-pointer hover:bg-white/5 transition-colors",
                        !item.is_read ? "bg-accent-cyan/5" : ""
                      )}
                    >
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <span className={cn("text-xs font-bold", !item.is_read ? "text-white" : "text-muted")}>
                          {item.title}
                        </span>
                        <span className="text-[9px] text-muted whitespace-nowrap flex items-center gap-1">
                          <Clock size={8} /> {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted leading-relaxed truncate">
                        {item.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

      {/* New Scan button */}
        <button
          onClick={() => setScanModalOpen(true)}
          className="flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm font-medium hover:bg-white hover:text-black transition-all"
        >
          <Activity size={14} />
          <span className="hidden sm:inline">New Scan</span>
        </button>
      </div>
    </header>
    </>
  );
}
