import { 
  Calendar, 
  CheckSquare, 
  AlertCircle, 
  Users, 
  TrendingUp, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { StatusTag } from '../ui/status-tag';
import { 
  CampaignActivity, 
  CampaignTask, 
  CommunityIssue, 
  CountyInfo,
  PageTab 
} from '../../types/campaign';
import { formatDate, formatNumber } from '../../lib/utils';

interface DashboardPageProps {
  countyInfo: CountyInfo;
  activities: CampaignActivity[];
  tasks: CampaignTask[];
  issues: CommunityIssue[];
  onNavigate: (tab: PageTab) => void;
  onOpenNewActivity: () => void;
  onOpenNewTask: () => void;
  onOpenNewIssue: () => void;
  onQuickToggleTask: (taskId: string) => void;
  onQuickUpdateIssueStatus: (issueId: string, status: CommunityIssue['status']) => void;
}

export function DashboardPage({
  countyInfo,
  activities,
  tasks,
  issues,
  onNavigate,
  onOpenNewActivity,
  onOpenNewTask,
  onOpenNewIssue,
  onQuickToggleTask,
  onQuickUpdateIssueStatus,
}: DashboardPageProps) {
  // Aggregate Metrics
  const totalAudienceEngaged = activities.reduce(
    (acc, curr) => acc + (curr.actualTurnout || curr.estimatedReach || 0),
    0
  );

  const completedActivitiesCount = activities.filter((a) => a.status === 'Completed').length;
  const scheduledActivities = activities.filter((a) => a.status === 'Scheduled' || a.status === 'In Progress');
  
  const pendingTasks = tasks.filter((t) => t.status !== 'Done');
  const highPriorityTasks = pendingTasks.filter((t) => t.priority === 'High');
  
  const openIssues = issues.filter((i) => i.status === 'Open' || i.status === 'Investigating');
  const criticalIssues = openIssues.filter((i) => i.severity === 'Critical');
  const manifestoPledgedIssues = issues.filter((i) => i.status === 'Manifesto Priority').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Welcome & Campaign Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-900 text-white shadow-sm">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="/src/assets/images/county_community_hall_1791012389358.jpg"
            alt="County Community"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{countyInfo.name} Governor Campaign HQ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Ground Campaign Operations Portal
            </h1>
            <p className="text-neutral-300 text-sm leading-relaxed">
              Real-time grassroots coordination across 6 sub-counties and 30 wards. Monitoring field rallies, citizen priorities, logistics, and field mobilizers.
            </p>
          </div>

          {/* Quick Action Hub */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2.5 shrink-0">
            <Button
              onClick={onOpenNewActivity}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3.5 py-2.5 rounded-lg"
            >
              <Plus className="h-4 w-4" />
              Log Activity
            </Button>
            <Button
              variant="outline"
              onClick={onOpenNewTask}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs px-3.5 py-2.5 rounded-lg"
            >
              <CheckSquare className="h-4 w-4" />
              Add Task
            </Button>
            <Button
              variant="outline"
              onClick={onOpenNewIssue}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs px-3.5 py-2.5 rounded-lg"
            >
              <AlertCircle className="h-4 w-4" />
              Report Issue
            </Button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Card className="border-neutral-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Field Audience Reach</span>
              <Users className="h-4 w-4 text-emerald-700" />
            </div>
            <div className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
              {formatNumber(totalAudienceEngaged)}
            </div>
            <div className="mt-2 flex items-center text-xs text-neutral-600">
              <span className="font-semibold text-emerald-800 mr-1.5">{completedActivitiesCount} events</span>
              <span>completed to date</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="border-neutral-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Upcoming Events</span>
              <Calendar className="h-4 w-4 text-emerald-700" />
            </div>
            <div className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
              {scheduledActivities.length}
            </div>
            <div className="mt-2 flex items-center text-xs text-neutral-600">
              <span>Next: {scheduledActivities[0]?.title ? scheduledActivities[0].title.slice(0, 24) + '...' : 'None'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="border-neutral-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Pending Tasks</span>
              <CheckSquare className="h-4 w-4 text-emerald-700" />
            </div>
            <div className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
              {pendingTasks.length}
            </div>
            <div className="mt-2 flex items-center text-xs text-neutral-600">
              <span className="font-semibold text-rose-700 mr-1.5">{highPriorityTasks.length} high priority</span>
              <span>awaiting clearance</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="border-neutral-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Citizen Grievances</span>
              <AlertCircle className="h-4 w-4 text-emerald-700" />
            </div>
            <div className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
              {openIssues.length}
            </div>
            <div className="mt-2 flex items-center text-xs text-neutral-600">
              <span className="font-semibold text-emerald-800 mr-1.5">{manifestoPledgedIssues} pledged</span>
              <span>into county manifesto</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols on lg): Upcoming Campaign Schedule & Urgent Community Issues */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Field Activities */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-700" />
                  Upcoming Field Events & Rallies
                </CardTitle>
                <p className="text-xs text-neutral-500 mt-1">Scheduled rallies, town halls and door-to-doors</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('activities')}
                className="text-xs text-emerald-800 font-semibold gap-1"
              >
                View All ({activities.length})
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-neutral-100">
                {scheduledActivities.slice(0, 4).map((act) => (
                  <div
                    key={act.id}
                    className="p-4 sm:p-5 hover:bg-neutral-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <StatusTag status={act.status} />
                        <span className="text-xs font-medium text-neutral-500">{act.type}</span>
                        <span className="text-xs text-neutral-400">·</span>
                        <span className="text-xs font-semibold text-neutral-800">{act.subCounty} / {act.ward}</span>
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900 leading-snug">
                        {act.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="h-3.5 w-3.5 text-neutral-400" />
                          {formatDate(act.date)} at {act.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                          {act.venue}
                        </span>
                        <span>Coord: {act.coordinator}</span>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <span className="block text-xs text-neutral-500">Target Reach</span>
                      <span className="text-sm font-bold font-mono text-neutral-900 tabular-nums">
                        {formatNumber(act.estimatedReach)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Urgent Community Issues Attention Box */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-neutral-900">
                  <ShieldAlert className="h-4 w-4 text-rose-700" />
                  Urgent Community Needs from Field Mobilizers
                </CardTitle>
                <p className="text-xs text-neutral-500 mt-1">High-priority problems reported during ground campaigns</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('community-issues')}
                className="text-xs text-emerald-800 font-semibold gap-1"
              >
                All Issues ({issues.length})
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-neutral-100">
                {issues.slice(0, 3).map((iss) => (
                  <div key={iss.id} className="p-4 sm:p-5 hover:bg-neutral-50/80 transition-colors space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <StatusTag status={iss.severity} />
                        <span className="text-xs font-semibold text-neutral-800">{iss.category}</span>
                        <span className="text-xs text-neutral-400">·</span>
                        <span className="text-xs text-neutral-600">{iss.subCounty} ({iss.ward})</span>
                      </div>
                      <StatusTag status={iss.status} />
                    </div>

                    <h4 className="text-sm font-bold text-neutral-900">{iss.title}</h4>
                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {iss.description}
                    </p>

                    <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-neutral-500">
                        Reported by: <strong>{iss.reportedBy}</strong> ({formatDate(iss.reportedDate)})
                      </span>
                      <div className="flex items-center gap-2">
                        {iss.status !== 'Manifesto Priority' && iss.status !== 'Resolved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onQuickUpdateIssueStatus(iss.id, 'Manifesto Priority')}
                            className="h-7 text-xs text-emerald-800 border-emerald-300 hover:bg-emerald-50 py-0"
                          >
                            Pledge in Manifesto
                          </Button>
                        )}
                        {iss.status !== 'Resolved' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => onQuickUpdateIssueStatus(iss.id, 'Resolved')}
                            className="h-7 text-xs text-neutral-700 py-0"
                          >
                            Mark Resolved
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col on lg): Action Tasks & Sub-County Coverage */}
        <div className="space-y-6">
          {/* Quick Action Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-emerald-700" />
                  Immediate Field Tasks
                </CardTitle>
                <p className="text-xs text-neutral-500 mt-0.5">Click to toggle done</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('tasks')}
                className="text-xs text-emerald-800 font-semibold"
              >
                Tasks Board
              </Button>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              {tasks.slice(0, 5).map((tsk) => {
                const isDone = tsk.status === 'Done';
                return (
                  <div
                    key={tsk.id}
                    onClick={() => onQuickToggleTask(tsk.id)}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      isDone
                        ? 'bg-neutral-50/60 border-neutral-200/60 opacity-60'
                        : 'bg-white border-neutral-200 hover:border-emerald-300 shadow-xs'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => {}} // Handled by container
                      className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-emerald-700 focus:ring-emerald-600 cursor-pointer"
                    />
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className={`text-xs font-semibold leading-snug ${isDone ? 'line-through text-neutral-500' : 'text-neutral-900'}`}>
                        {tsk.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                        <span className="font-medium text-neutral-700">{tsk.assignee}</span>
                        <span>·</span>
                        <span className="font-mono">Due {formatDate(tsk.dueDate)}</span>
                        <span>·</span>
                        <StatusTag status={tsk.priority} dotOnly />
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Sub-County Voter Outreach Targets */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-700" />
                Sub-County Target Matrix
              </CardTitle>
              <p className="text-xs text-neutral-500">Territory coverage & voter outreach target</p>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {countyInfo.subCounties.map((sc, index) => {
                const scActivities = activities.filter((a) => a.subCounty === sc.name);
                const reachedInSc = scActivities.reduce(
                  (acc, curr) => acc + (curr.actualTurnout || curr.estimatedReach || 0),
                  0
                );
                const percentage = Math.min(100, Math.round((reachedInSc / sc.voterTarget) * 100));

                return (
                  <div key={sc.name} className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-neutral-900 font-semibold">{sc.name}</span>
                      <span className="font-mono text-neutral-600">
                        {formatNumber(reachedInSc)} / {formatNumber(sc.voterTarget)} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-700 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(5, percentage)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-neutral-500">
                      <span>{sc.wards.length} Wards</span>
                      <span>{scActivities.length} Activities logged</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
