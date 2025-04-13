import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Car,
  Settings,
  BarChart3,
  FileText,
  Zap,
  AlertTriangle,
  Gauge,
  Database,
  ChevronDown,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const routes = [
  {
    label: 'Vehicle AI Agent',
    icon: Car,
    color: 'text-emerald-400',
    submenu: [
      {
        label: 'Chat Assistant',
        icon: MessageSquare,
        href: '/dashboard/chat',
        color: 'text-emerald-400',
      },
      {
        label: 'Risk Assessment',
        icon: AlertTriangle,
        href: '/dashboard/risk',
        color: 'text-orange-400',
      },
      {
        label: 'Performance Metrics',
        icon: Gauge,
        href: '/dashboard/performance',
        color: 'text-blue-400',
      },
    ],
  },
  {
    label: 'Data Analytics',
    icon: BarChart3,
    href: '/dashboard/analytics',
    color: 'text-purple-400',
  },
  {
    label: 'Claims Processing',
    icon: FileText,
    href: '/dashboard/claims',
    color: 'text-cyan-400',
  },
  {
    label: 'AI Insights',
    icon: Zap,
    href: '/dashboard/insights',
    color: 'text-yellow-400',
  },
  {
    label: 'Data Management',
    icon: Database,
    href: '/dashboard/data',
    color: 'text-pink-400',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
    color: 'text-gray-400',
  },
];

export const Sidebar = () => {
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  useEffect(() => {
    // Mở rộng menu Vehicle AI Agent khi vào dashboard
    setExpandedMenu('/dashboard');
  }, []);

  const toggleSubmenu = (href: string) => {
    setExpandedMenu(expandedMenu === href ? null : href);
  };

  return (
    <div className="w-64 space-y-4 py-4 flex flex-col h-full bg-slate-900/50 border-r border-slate-700/50">
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {routes.map((route) => (
            <div key={route.href || route.label}>
              {route.submenu ? (
                <>
                  <div
                    onClick={() => toggleSubmenu(route.href || route.label)}
                    className={cn(
                      'text-sm group flex p-3 w-full justify-between items-center font-medium cursor-pointer hover:text-white hover:bg-slate-800/50 rounded-lg transition',
                      expandedMenu === (route.href || route.label)
                        ? 'text-white bg-slate-800/50'
                        : 'text-slate-400'
                    )}
                  >
                    <div className="flex items-center">
                      <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                      {route.label}
                    </div>
                    {expandedMenu === (route.href || route.label) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                  {expandedMenu === (route.href || route.label) && (
                    <div className="ml-4 space-y-1">
                      {route.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          to={subItem.href}
                          className={cn(
                            'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-slate-800/50 rounded-lg transition',
                            location.pathname === subItem.href
                              ? 'text-white bg-slate-800/50'
                              : 'text-slate-400'
                          )}
                        >
                          <subItem.icon className={cn('h-5 w-5 mr-3', subItem.color)} />
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={route.href || '#'}
                  className={cn(
                    'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-slate-800/50 rounded-lg transition',
                    location.pathname === route.href
                      ? 'text-white bg-slate-800/50'
                      : 'text-slate-400'
                  )}
                >
                  <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                  {route.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
