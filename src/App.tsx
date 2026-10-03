import * as React from 'react';
import { 
  PageTab, 
  CampaignActivity, 
  CampaignTask, 
  CommunityIssue, 
  CampaignUser, 
  TeamMember,
  CountyInfo,
  ActivityStatus,
  TaskStatus,
  IssueStatus
} from './types/campaign';
import { 
  getStoredCountyInfo, 
  getStoredActivities, 
  saveActivities, 
  getStoredTasks, 
  saveTasks, 
  getStoredIssues, 
  saveIssues, 
  getStoredUsers, 
  saveUsers, 
  getStoredTeam, 
  saveTeam, 
  resetAllDataToDefault 
} from './lib/storage';
import { TopHeader } from './components/layout/TopHeader';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';

// Pages
import { DashboardPage } from './components/pages/DashboardPage';
import { ActivitiesPage } from './components/pages/ActivitiesPage';
import { TasksPage } from './components/pages/TasksPage';
import { CommunityIssuesPage } from './components/pages/CommunityIssuesPage';
import { UserManagementPage } from './components/pages/UserManagementPage';
import { TeamPage } from './components/pages/TeamPage';

// Common Modals
import { ActivityModal } from './components/common/ActivityModal';
import { TaskModal } from './components/common/TaskModal';
import { IssueModal } from './components/common/IssueModal';
import { UserModal } from './components/common/UserModal';
import { TeamModal } from './components/common/TeamModal';
import { TestingGuideModal } from './components/common/TestingGuideModal';
import { HelpCircle, RotateCcw, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = React.useState<PageTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [selectedSubCountyFilter, setSelectedSubCountyFilter] = React.useState('All');
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Data States
  const [countyInfo] = React.useState<CountyInfo>(getStoredCountyInfo);
  const [activities, setActivities] = React.useState<CampaignActivity[]>(getStoredActivities);
  const [tasks, setTasks] = React.useState<CampaignTask[]>(getStoredTasks);
  const [issues, setIssues] = React.useState<CommunityIssue[]>(getStoredIssues);
  const [users, setUsers] = React.useState<CampaignUser[]>(getStoredUsers);
  const [team, setTeam] = React.useState<TeamMember[]>(getStoredTeam);

  // Modal States
  const [testingGuideOpen, setTestingGuideOpen] = React.useState(false);

  const [activityModalOpen, setActivityModalOpen] = React.useState(false);
  const [editingActivity, setEditingActivity] = React.useState<CampaignActivity | null>(null);

  const [taskModalOpen, setTaskModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<CampaignTask | null>(null);

  const [issueModalOpen, setIssueModalOpen] = React.useState(false);
  const [editingIssue, setEditingIssue] = React.useState<CommunityIssue | null>(null);

  const [userModalOpen, setUserModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<CampaignUser | null>(null);

  const [teamModalOpen, setTeamModalOpen] = React.useState(false);
  const [editingMember, setEditingMember] = React.useState<TeamMember | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Activity Handlers
  const handleSaveActivity = (activity: CampaignActivity) => {
    const exists = activities.some((a) => a.id === activity.id);
    let updated: CampaignActivity[];
    if (exists) {
      updated = activities.map((a) => (a.id === activity.id ? activity : a));
      showToast('Activity details updated successfully.');
    } else {
      updated = [activity, ...activities];
      showToast(`Activity "${activity.title}" logged successfully.`);
    }
    setActivities(updated);
    saveActivities(updated);
  };

  const handleDeleteActivity = (id: string) => {
    const updated = activities.filter((a) => a.id !== id);
    setActivities(updated);
    saveActivities(updated);
    showToast('Activity deleted.');
  };

  const handleUpdateActivityStatus = (id: string, status: ActivityStatus) => {
    const updated = activities.map((a) => (a.id === id ? { ...a, status } : a));
    setActivities(updated);
    saveActivities(updated);
    showToast(`Activity status changed to ${status}.`);
  };

  // Task Handlers
  const handleSaveTask = (task: CampaignTask) => {
    const exists = tasks.some((t) => t.id === task.id);
    let updated: CampaignTask[];
    if (exists) {
      updated = tasks.map((t) => (t.id === task.id ? task : t));
      showToast('Task updated successfully.');
    } else {
      updated = [task, ...tasks];
      showToast(`Task assigned to ${task.assignee}.`);
    }
    setTasks(updated);
    saveTasks(updated);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    saveTasks(updated);
    showToast('Task removed.');
  };

  const handleUpdateTaskStatus = (id: string, status: TaskStatus) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, status } : t));
    setTasks(updated);
    saveTasks(updated);
    showToast(`Task status updated to ${status}.`);
  };

  const handleQuickToggleTask = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;
    const nextStatus: TaskStatus = target.status === 'Done' ? 'To Do' : 'Done';
    handleUpdateTaskStatus(id, nextStatus);
  };

  // Community Issue Handlers
  const handleSaveIssue = (issue: CommunityIssue) => {
    const exists = issues.some((i) => i.id === issue.id);
    let updated: CommunityIssue[];
    if (exists) {
      updated = issues.map((i) => (i.id === issue.id ? issue : i));
      showToast('Community issue record updated.');
    } else {
      updated = [issue, ...issues];
      showToast('Community grievance submitted to campaign desk.');
    }
    setIssues(updated);
    saveIssues(updated);
  };

  const handleDeleteIssue = (id: string) => {
    const updated = issues.filter((i) => i.id !== id);
    setIssues(updated);
    saveIssues(updated);
    showToast('Community issue deleted.');
  };

  const handleUpdateIssueStatus = (id: string, status: IssueStatus) => {
    const updated = issues.map((i) => (i.id === id ? { ...i, status } : i));
    setIssues(updated);
    saveIssues(updated);
    showToast(`Issue status moved to ${status}.`);
  };

  // User Management Handlers
  const handleSaveUser = (user: CampaignUser) => {
    const exists = users.some((u) => u.id === user.id);
    let updated: CampaignUser[];
    if (exists) {
      updated = users.map((u) => (u.id === user.id ? user : u));
      showToast('User account updated.');
    } else {
      updated = [user, ...users];
      showToast(`User account created for ${user.fullName}.`);
    }
    setUsers(updated);
    saveUsers(updated);
  };

  const handleDeleteUser = (id: string) => {
    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    saveUsers(updated);
    showToast('User removed.');
  };

  const handleToggleUserStatus = (id: string) => {
    const updated = users.map((u) =>
      u.id === id ? { ...u, status: (u.status === 'Active' ? 'Inactive' : 'Active') as 'Active' | 'Inactive' } : u
    );
    setUsers(updated);
    saveUsers(updated);
    showToast('User status updated.');
  };

  // Team Handlers
  const handleSaveMember = (member: TeamMember) => {
    const exists = team.some((m) => m.id === member.id);
    let updated: TeamMember[];
    if (exists) {
      updated = team.map((m) => (m.id === member.id ? member : m));
      showToast('Team member updated.');
    } else {
      updated = [member, ...team];
      showToast(`${member.fullName} enlisted into campaign team.`);
    }
    setTeam(updated);
    saveTeam(updated);
  };

  const handleDeleteMember = (id: string) => {
    const updated = team.filter((m) => m.id !== id);
    setTeam(updated);
    saveTeam(updated);
    showToast('Team member removed.');
  };

  // Reset Data Handler
  const handleResetData = () => {
    resetAllDataToDefault();
    setActivities(getStoredActivities());
    setTasks(getStoredTasks());
    setIssues(getStoredIssues());
    setUsers(getStoredUsers());
    setTeam(getStoredTeam());
    showToast('All sample data reset to initial prototype state.');
  };

  // Filter items by territory if sub-county filter is selected in sidebar
  const displayedActivities = React.useMemo(() => {
    return selectedSubCountyFilter === 'All'
      ? activities
      : activities.filter((a) => a.subCounty === selectedSubCountyFilter);
  }, [activities, selectedSubCountyFilter]);

  const displayedTasks = React.useMemo(() => {
    return selectedSubCountyFilter === 'All'
      ? tasks
      : tasks.filter((t) => t.subCounty === selectedSubCountyFilter || t.subCounty === 'All County');
  }, [tasks, selectedSubCountyFilter]);

  const displayedIssues = React.useMemo(() => {
    return selectedSubCountyFilter === 'All'
      ? issues
      : issues.filter((i) => i.subCounty === selectedSubCountyFilter);
  }, [issues, selectedSubCountyFilter]);

  const openIssuesCount = issues.filter((i) => i.status === 'Open' || i.status === 'Investigating').length;
  const pendingTasksCount = tasks.filter((t) => t.status !== 'Done').length;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
      {/* Top Header (Top Bar Contract: 3 Zones) */}
      <TopHeader
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        countyInfo={countyInfo}
        onOpenTestingGuide={() => setTestingGuideOpen(true)}
        onOpenQuickActivity={() => {
          setEditingActivity(null);
          setActivityModalOpen(true);
        }}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Quick Territory Notification if Filtered */}
      {selectedSubCountyFilter !== 'All' && (
        <div className="bg-emerald-900 text-white px-4 py-1.5 text-xs flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <span>
              Filtering territory views for: <strong>{selectedSubCountyFilter} Sub-County</strong>
            </span>
            <button
              onClick={() => setSelectedSubCountyFilter('All')}
              className="text-emerald-300 hover:text-white font-medium underline underline-offset-2 ml-4 cursor-pointer"
            >
              Reset to All County
            </button>
          </div>
        </div>
      )}

      {/* Main Container: Sidebar + Page Content */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Desktop Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onSelectPage={setCurrentPage}
          countyInfo={countyInfo}
          selectedSubCountyFilter={selectedSubCountyFilter}
          onSelectSubCountyFilter={setSelectedSubCountyFilter}
          counts={{
            activities: activities.length,
            pendingTasks: pendingTasksCount,
            openIssues: openIssuesCount,
            users: users.length,
            team: team.length,
          }}
        />

        {/* Dynamic Main Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-full">
          {/* Top Testing Helper Strip */}
          <div className="mb-5 p-3 rounded-xl bg-white border border-neutral-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-900">Prototype Mode:</span>
              <span className="text-neutral-600">
                Functional prototype for {countyInfo.name} campaign. All actions save to your local browser storage.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTestingGuideOpen(true)}
                className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-2 cursor-pointer"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                How to Test
              </button>
              <button
                type="button"
                onClick={handleResetData}
                className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-800 cursor-pointer"
                title="Restore default mock data"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Sample Data
              </button>
            </div>
          </div>

          {/* Page Routing */}
          {currentPage === 'dashboard' && (
            <DashboardPage
              countyInfo={countyInfo}
              activities={displayedActivities}
              tasks={displayedTasks}
              issues={displayedIssues}
              onNavigate={setCurrentPage}
              onOpenNewActivity={() => {
                setEditingActivity(null);
                setActivityModalOpen(true);
              }}
              onOpenNewTask={() => {
                setEditingTask(null);
                setTaskModalOpen(true);
              }}
              onOpenNewIssue={() => {
                setEditingIssue(null);
                setIssueModalOpen(true);
              }}
              onQuickToggleTask={handleQuickToggleTask}
              onQuickUpdateIssueStatus={handleUpdateIssueStatus}
            />
          )}

          {currentPage === 'activities' && (
            <ActivitiesPage
              countyInfo={countyInfo}
              activities={displayedActivities}
              onOpenCreateModal={() => {
                setEditingActivity(null);
                setActivityModalOpen(true);
              }}
              onEditActivity={(act) => {
                setEditingActivity(act);
                setActivityModalOpen(true);
              }}
              onDeleteActivity={handleDeleteActivity}
              onUpdateStatus={handleUpdateActivityStatus}
            />
          )}

          {currentPage === 'tasks' && (
            <TasksPage
              countyInfo={countyInfo}
              tasks={displayedTasks}
              onOpenCreateModal={() => {
                setEditingTask(null);
                setTaskModalOpen(true);
              }}
              onEditTask={(tsk) => {
                setEditingTask(tsk);
                setTaskModalOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onUpdateStatus={handleUpdateTaskStatus}
            />
          )}

          {currentPage === 'community-issues' && (
            <CommunityIssuesPage
              countyInfo={countyInfo}
              issues={displayedIssues}
              onOpenCreateModal={() => {
                setEditingIssue(null);
                setIssueModalOpen(true);
              }}
              onEditIssue={(iss) => {
                setEditingIssue(iss);
                setIssueModalOpen(true);
              }}
              onDeleteIssue={handleDeleteIssue}
              onUpdateStatus={handleUpdateIssueStatus}
            />
          )}

          {currentPage === 'user-management' && (
            <UserManagementPage
              countyInfo={countyInfo}
              users={users}
              onOpenCreateModal={() => {
                setUserModalOpen(true);
                setEditingUser(null);
              }}
              onEditUser={(u) => {
                setEditingUser(u);
                setUserModalOpen(true);
              }}
              onDeleteUser={handleDeleteUser}
              onToggleStatus={handleToggleUserStatus}
            />
          )}

          {currentPage === 'team' && (
            <TeamPage
              countyInfo={countyInfo}
              team={team}
              onOpenCreateModal={() => {
                setEditingMember(null);
                setTeamModalOpen(true);
              }}
              onEditMember={(m) => {
                setEditingMember(m);
                setTeamModalOpen(true);
              }}
              onDeleteMember={handleDeleteMember}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        openIssuesCount={openIssuesCount}
        pendingTasksCount={pendingTasksCount}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 bg-neutral-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-150 border border-neutral-700">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <TestingGuideModal
        open={testingGuideOpen}
        onOpenChange={setTestingGuideOpen}
        onResetData={handleResetData}
      />

      <ActivityModal
        open={activityModalOpen}
        onOpenChange={setActivityModalOpen}
        countyInfo={countyInfo}
        onSave={handleSaveActivity}
        initialData={editingActivity}
      />

      <TaskModal
        open={taskModalOpen}
        onOpenChange={setTaskModalOpen}
        countyInfo={countyInfo}
        onSave={handleSaveTask}
        initialData={editingTask}
      />

      <IssueModal
        open={issueModalOpen}
        onOpenChange={setIssueModalOpen}
        countyInfo={countyInfo}
        onSave={handleSaveIssue}
        initialData={editingIssue}
      />

      <UserModal
        open={userModalOpen}
        onOpenChange={setUserModalOpen}
        countyInfo={countyInfo}
        onSave={handleSaveUser}
        initialData={editingUser}
      />

      <TeamModal
        open={teamModalOpen}
        onOpenChange={setTeamModalOpen}
        countyInfo={countyInfo}
        onSave={handleSaveMember}
        initialData={editingMember}
      />
    </div>
  );
}
