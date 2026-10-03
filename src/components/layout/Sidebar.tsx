import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  AlertCircle, 
  ShieldCheck, 
  Users, 
  MapPin, 
  CheckCircle2,
  Layers
} from 'lucide-react';
import { PageTab, CountyInfo } from '../../types/campaign';

interface SidebarProps {
  currentPage: PageTab;
  onSelectPage: (page: PageTab) => void;
  countyInfo: CountyInfo;
  selectedSubCountyFilter: string;
  onSelectSubCountyFilter: (subCounty: string) => void;
  counts: {
    activities: number;
    pendingTasks: number;
    openIssues: number;
    users: number;
    team: number;
  };
}

export function Sidebar({
  currentPage,
  onSelectPage,
  countyInfo,
  selectedSubCountyFilter,
  onSelectSubCountyFilter,
  counts,
}: SidebarProps) {
  const mainNav = [
    { id: 'dashboard' as PageTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'activities' as PageTab, label: 'Campaign Activities', icon: Calendar, count: counts.activities },
    { id: 'tasks' as PageTab, label: 'Task Execution Board', icon: CheckSquare, count: counts.pendingTasks },
    { id: 'community-issues' as PageTab, label: 'Community Issues', icon: AlertCircle, count: counts.openIssues },
  ];

  const adminNav = [
    { id: 'user-management' as PageTab, label: 'User Management', icon: ShieldCheck, count: counts.users },
    { id: 'team' as PageTab, label: 'Field Mobilization Team', icon: Users, count: counts.team },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col bg-white border-r border-neutral-200 min-h-[calc(100vh-4rem)] p-4 space-y-6">
      {/* Sub-county quick filter selector */}
      <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800">
            <MapPin className="h-3.5 w-3.5 text-emerald-700" />
            <span>Active Territory</span>
          </div>
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-mono">6 Sub-Counties</span>
        </div>
        <select
          value={selectedSubCountyFilter}
          onChange={(e) => onSelectSubCountyFilter(e.target.value)}
          className="w-full text-xs font-medium rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
        >
          <option value="All">All {countyInfo.name}</option>
          {countyInfo.subCounties.map((sc) => (
            <option key={sc.name} value={sc.name}>
              {sc.name} Sub-County ({sc.wards.length} Wards)
            </option>
          ))}
        </select>
      </div>

      {/* Main Campaign Nav */}
      <div className="space-y-1">
        <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          Campaign Core
        </div>
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-neutral-500'}`} />
                <span>{item.label}</span>
              </div>
              {typeof item.count === 'number' && (
                <span
                  className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Operations & People Nav */}
      <div className="space-y-1">
        <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          Campaign Admin
        </div>
        {adminNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-neutral-500'}`} />
                <span>{item.label}</span>
              </div>
              {typeof item.count === 'number' && (
                <span
                  className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Campaign Target Summary badge */}
      <div className="mt-auto pt-4 border-t border-neutral-100">
        <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-800 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-emerald-700" />
              Mobilization Pulse
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-800">
              64% Covered
            </span>
          </div>
          <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full w-[64%]" />
          </div>
          <p className="text-[11px] text-neutral-500">
            30 Wards targeted across 6 sub-counties. Target 457,000 voter reach.
          </p>
          <div className="pt-1 flex items-center gap-1 text-[11px] text-emerald-800 font-medium">
            <CheckCircle2 className="h-3 w-3 text-emerald-700" />
            <span>Autonomous Ground Deck</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
