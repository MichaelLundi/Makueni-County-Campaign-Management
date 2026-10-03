import { LayoutDashboard, Calendar, CheckSquare, AlertCircle, Users } from 'lucide-react';
import { PageTab } from '../../types/campaign';

interface MobileNavProps {
  currentPage: PageTab;
  onSelectPage: (page: PageTab) => void;
  openIssuesCount: number;
  pendingTasksCount: number;
}

export function MobileNav({
  currentPage,
  onSelectPage,
  openIssuesCount,
  pendingTasksCount,
}: MobileNavProps) {
  const tabs = [
    { id: 'dashboard' as PageTab, label: 'Home', icon: LayoutDashboard },
    { id: 'activities' as PageTab, label: 'Events', icon: Calendar },
    { id: 'tasks' as PageTab, label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'community-issues' as PageTab, label: 'Issues', icon: AlertCircle, badge: openIssuesCount },
    { id: 'team' as PageTab, label: 'Team', icon: Users },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-2 py-1 shadow-lg"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPage === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectPage(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 min-w-[56px] min-h-[44px] rounded-lg transition-colors relative cursor-pointer ${
                isActive ? 'text-emerald-700 font-semibold' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-700 stroke-[2.2]' : 'text-neutral-500'}`} />
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white tabular-nums">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-emerald-700 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
