'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Server, BarChart3, Settings, Store, PlusCircle } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { getPublisherId } from '../../api/client';

interface SidebarProps {
  publisherId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ publisherId }) => {
  const pathname = usePathname();
  const { credits, signedIn, publisher, openSignIn, loading } = useAuth();
  const activePublisherId = publisherId || publisher?.id || getPublisherId() || 'active';

  const navItems = [
    {
      name: 'Marketplace',
      path: '/',
      icon: Store,
      exact: true,
      requiresAuth: false,
    },
    {
      name: 'Overview',
      path: `/dashboard/${activePublisherId}`,
      icon: LayoutDashboard,
      exact: true,
      requiresAuth: true,
    },
    {
      name: 'APIs',
      path: `/dashboard/${activePublisherId}/apis`,
      icon: Server,
      exact: false,
      requiresAuth: true,
    },
    {
      name: 'Analytics',
      path: `/dashboard/${activePublisherId}/analytics`,
      icon: BarChart3,
      exact: false,
      requiresAuth: true,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      exact: true,
      requiresAuth: false,
    },
  ];

  return (
    <aside className="w-64 bg-panel/30 border-r border-border sticky top-16 h-[calc(100vh-64px)] flex flex-col justify-between py-6 px-4 shrink-0 z-30 overflow-y-auto">
      <nav className="flex flex-col gap-1">
        {navItems.map(item => {
          const isActive = item.exact
            ? pathname === item.path
            : Boolean(pathname?.startsWith(item.path));

          return (
            <Link
              key={item.name}
              href={item.path}
              onClick={e => {
                if (item.requiresAuth && !signedIn) {
                  e.preventDefault();
                  openSignIn();
                }
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm no-underline transition-colors ${
                isActive
                  ? 'bg-panel text-main font-medium border border-border'
                  : 'text-muted hover:bg-panel-hover hover:text-main'
              }`}
            >
              <item.icon size={18} className={isActive ? 'text-main' : 'text-muted'} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-border">
        {loading ? (
          <div className="p-3.5 rounded-lg bg-panel border border-border animate-pulse">
            <div className="h-3 bg-panel-hover rounded w-16 mb-2" />
            <div className="h-6 bg-panel-hover rounded w-24 mb-2.5" />
            <div className="h-7 bg-panel-hover rounded w-full" />
          </div>
        ) : signedIn ? (
          <div className="p-3.5 rounded-lg bg-panel border border-border">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted font-medium">Balance</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-bg text-accent border border-border">
                Arc Testnet
              </span>
            </div>
            <div className="font-mono text-xl font-semibold text-main mb-2.5">
              {(credits ?? 0).toFixed(2)}{' '}
              <span className="text-xs font-normal text-muted">USDC</span>
            </div>
            <Link
              href="/settings"
              className="flex items-center justify-center gap-1.5 w-full text-xs font-medium py-1.5 px-2 rounded bg-panel-hover hover:bg-main hover:text-bg text-main border border-border transition-colors text-center no-underline"
            >
              <PlusCircle size={13} />
              <span>Manage & Top Up</span>
            </Link>
          </div>
        ) : (
          <div className="p-3.5 rounded-lg bg-panel border border-border text-center">
            <div className="text-xs text-muted mb-2">Arc Testnet Balance</div>
            <button
              type="button"
              onClick={openSignIn}
              className="w-full text-xs font-medium py-1.5 px-2 rounded bg-main text-bg border border-main cursor-pointer hover:opacity-90 transition-opacity"
            >
              Sign in to view
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
