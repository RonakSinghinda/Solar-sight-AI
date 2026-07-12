"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Map, MapPin, History, FileText, Settings,
  ChevronLeft, ChevronRight, Sun, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Panel View', href: '/panel-view', icon: Map },
  { name: 'Inspections', href: '/inspections', icon: History },
  { name: 'Fault Map', href: '/map', icon: MapPin },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navContent = (isMobile = false) => (
    <>
      {/* Brand */}
      <div className="h-16 md:h-20 flex items-center px-4 md:px-5 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 rounded bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan box-glow-cyan flex-shrink-0">
            <Sun size={18} />
          </div>
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-display font-bold tracking-widest text-sm whitespace-nowrap"
              >
                SOLARSIGHT <span className="text-accent-cyan text-glow-cyan">AI</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {/* Close button — mobile only */}
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 py-4 md:py-6 px-3 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} onClick={isMobile ? onClose : undefined}>
              <div className={cn(
                "relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
                isActive ? "bg-white/10 text-white" : "text-muted hover:bg-white/5 hover:text-white"
              )}>
                {isActive && (
                  <motion.div layoutId={isMobile ? "sidebar-active-mobile" : "sidebar-active"}
                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent-cyan rounded-r-full"
                  />
                )}
                <Icon size={18} className={cn("flex-shrink-0", isActive ? "text-accent-cyan" : "")} />
                <AnimatePresence>
                  {(!collapsed || isMobile) && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </div>

      {/* User */}
      <div className="p-3 border-t border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/5 border border-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-blue to-accent-cyan flex-shrink-0" />
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden">
                <div className="text-xs font-bold text-white whitespace-nowrap">Cmdr. Shepard</div>
                <div className="text-[10px] font-mono text-accent-cyan whitespace-nowrap">ADMIN ACCESS</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop Sidebar (md and above) ───────────────────────────────── */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-screen bg-surface/50 backdrop-blur-2xl border-r border-white/5 flex-col z-50 flex-shrink-0 overflow-hidden hidden md:flex"
      >
        {navContent(false)}

        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[88px] w-6 h-6 rounded-full bg-card border border-white/10 flex items-center justify-center text-muted hover:text-white transition-all z-50 shadow-xl"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>

      {/* ── Mobile Drawer (below md) ──────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            key="mobile-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 h-full w-72 bg-surface/95 backdrop-blur-2xl border-r border-white/10 flex flex-col z-50 md:hidden shadow-2xl"
          >
            {navContent(true)}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
