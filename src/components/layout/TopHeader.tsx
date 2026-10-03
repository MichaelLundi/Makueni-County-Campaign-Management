import { 
  Menu, 
  X, 
  HelpCircle, 
  Plus, 
  CheckSquare, 
  AlertCircle, 
  LayoutDashboard, 
  Calendar, 
  ShieldCheck, 
  Users 
} from 'lucide-react';
import { Button } from '../ui/button';
import { PageTab, CountyInfo } from '../../types/campaign';

interface TopHeaderProps {
  currentPage: PageTab;
  onSelectPage: (page: PageTab) => void;
  countyInfo: CountyInfo;
  onOpenTestingGuide: () => void;
  onOpenQuickActivity: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export function TopHeader({
  currentPage,
  onSelectPage,
  countyInfo,
  onOpenTestingGuide,
  onOpenQuickActivity,
  mobileMenuOpen,
  setMobileMenuOpen,
}: TopHeaderProps) {
  const navItems: { id: PageTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'activities', label: 'Activities', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'community-issues', label: 'Community Issues', icon: AlertCircle },
    { id: 'user-management', label: 'User Management', icon: ShieldCheck },
    { id: 'team', label: 'Team', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-neutral-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Zone 1: Wordmark & County Brand */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 rounded-lg text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={() => onSelectPage('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="h-9 w-9 rounded-lg bg-emerald-900 flex items-center justify-center text-white overflow-hidden shadow-xs border border-emerald-800">
              <img
                src="/src/assets/images/campaign_emblem_crest_1791012377812.jpg"
                alt="County Crest"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback if image load fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-neutral-900 group-hover:text-emerald-800 transition-colors">
                County Campaign Manager
              </span>
              <span className="hidden sm:inline-block text-[11px] font-medium text-emerald-800">
                {countyInfo.name} Gubernatorial Campaign
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenTestingGuide}
            className="text-neutral-700 border-neutral-300 hover:bg-neutral-100 gap-1.5"
            title="Open Testing Guide & Verification Checklist"
          >
            <HelpCircle className="h-4 w-4 text-emerald-700" />
            <span className="hidden sm:inline">How to Test</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onOpenQuickActivity}
            className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Log Activity</span>
            <span className="sm:hidden">Log</span>
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 py-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2 px-2">
            Navigation Menu
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectPage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-neutral-900 text-white font-semibold'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-neutral-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 px-1">
            <span>{countyInfo.name} Secretariat</span>
            <button
              onClick={() => {
                onOpenTestingGuide();
                setMobileMenuOpen(false);
              }}
              className="text-emerald-700 font-medium underline underline-offset-2"
            >
              Testing Guide
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
