import * as React from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Clock, 
  User, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  LayoutGrid, 
  List, 
  AlertTriangle 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { StatusTag } from '../ui/status-tag';
import { CampaignTask, CountyInfo, TaskStatus, TaskPriority } from '../../types/campaign';
import { formatDate } from '../../lib/utils';

interface TasksPageProps {
  countyInfo: CountyInfo;
  tasks: CampaignTask[];
  onOpenCreateModal: () => void;
  onEditTask: (task: CampaignTask) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
}

export function TasksPage({
  tasks,
  onOpenCreateModal,
  onEditTask,
  onDeleteTask,
  onUpdateStatus,
}: TasksPageProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [priorityFilter, setPriorityFilter] = React.useState('All');
  const [statusFilter, setStatusFilter] = React.useState('All');
  const [categoryFilter, setCategoryFilter] = React.useState('All');
  const [viewMode, setViewMode] = React.useState<'list' | 'board'>('list');

  // Filtered Tasks
  const filteredTasks = React.useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.assignee.toLowerCase().includes(searchTerm.toLowerCase());

      const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
      const matchStatus = statusFilter === 'All' || t.status === statusFilter;
      const matchCategory = categoryFilter === 'All' || t.category === categoryFilter;

      return matchSearch && matchPriority && matchStatus && matchCategory;
    });
  }, [tasks, searchTerm, priorityFilter, statusFilter, categoryFilter]);

  const todoCount = tasks.filter((t) => t.status === 'To Do').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const doneCount = tasks.filter((t) => t.status === 'Done').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Operations & Logistics
            </span>
            <span className="text-xs text-neutral-400">·</span>
            <span className="text-xs text-neutral-500 font-mono tabular-nums">{tasks.length} Action Items</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-0.5">
            Campaign Action Tasks
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600">
            Track sound gear, police permits, manifesto print runs, agent training, and field mobilization duties.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center bg-neutral-100 p-1 rounded-lg border border-neutral-200">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'board' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Board View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          <Button onClick={onOpenCreateModal} className="gap-2 shrink-0 bg-emerald-700 hover:bg-emerald-800 text-white">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Status Counters Strip */}
      <div className="grid grid-cols-3 gap-3">
        <div 
          onClick={() => setStatusFilter(statusFilter === 'To Do' ? 'All' : 'To Do')}
          className={`p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'To Do' 
              ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600' 
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="font-semibold uppercase tracking-wider">To Do</span>
            <span className="h-2 w-2 rounded-full bg-neutral-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
            {todoCount}
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter(statusFilter === 'In Progress' ? 'All' : 'In Progress')}
          className={`p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'In Progress' 
              ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600' 
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-700">
            <span className="font-semibold uppercase tracking-wider">In Progress</span>
            <span className="h-2 w-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
            {inProgressCount}
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter(statusFilter === 'Done' ? 'All' : 'Done')}
          className={`p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'Done' 
              ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600' 
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-800">
            <span className="font-semibold uppercase tracking-wider">Completed</span>
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
            {doneCount}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-white">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search tasks, assignee, details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            {/* Priority Filter */}
            <div>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-xs"
              >
                <option value="All">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </Select>
            </div>

            {/* Category Filter */}
            <div>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs"
              >
                <option value="All">All Categories</option>
                <option value="Grassroots Mobilization">Grassroots Mobilization</option>
                <option value="Logistics & Sound">Logistics & Sound</option>
                <option value="Communications & Media">Communications & Media</option>
                <option value="Security & Permits">Security & Permits</option>
                <option value="Manifesto & Policy">Manifesto & Policy</option>
                <option value="Volunteer Coordination">Volunteer Coordination</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Rendering: List or Board */}
      {filteredTasks.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <CheckSquare className="h-8 w-8 text-neutral-400" />
            <h3 className="text-base font-semibold text-neutral-900">No tasks match criteria</h3>
            <p className="text-xs text-neutral-500">Try adjusting your filters or assign a new task.</p>
            <Button onClick={onOpenCreateModal} size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Task
            </Button>
          </div>
        </Card>
      ) : viewMode === 'board' ? (
        /* Board Columns */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['To Do', 'In Progress', 'Done'] as TaskStatus[]).map((columnStatus) => {
            const columnTasks = filteredTasks.filter((t) => t.status === columnStatus);
            return (
              <div key={columnStatus} className="space-y-3">
                <div className="flex items-center justify-between px-2 text-xs font-bold uppercase tracking-wider text-neutral-700">
                  <span>{columnStatus}</span>
                  <span className="font-mono text-neutral-500">({columnTasks.length})</span>
                </div>
                <div className="space-y-2.5">
                  {columnTasks.map((task) => (
                    <Card key={task.id} className="p-4 hover:border-neutral-300 transition-all space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <StatusTag status={task.priority} />
                        <span className="text-[11px] font-medium text-neutral-500 truncate max-w-[120px]">
                          {task.category}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-neutral-900 leading-snug">
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className="text-xs text-neutral-600 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                        <span className="flex items-center gap-1 font-medium text-neutral-800">
                          <User className="h-3.5 w-3.5 text-neutral-400" />
                          {task.assignee}
                        </span>
                        <span className="font-mono text-[11px]">Due {formatDate(task.dueDate)}</span>
                      </div>

                      {/* Status Transition buttons */}
                      <div className="flex items-center justify-between pt-1 gap-1">
                        <select
                          value={task.status}
                          onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
                          className="text-[11px] font-medium border border-neutral-200 rounded px-1.5 py-1 bg-neutral-50"
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onEditTask(task)}
                            className="p-1 text-neutral-500 hover:text-neutral-900"
                            title="Edit"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete task "${task.title}"?`)) onDeleteTask(task.id);
                            }}
                            className="p-1 text-neutral-400 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2.5">
          {filteredTasks.map((task) => {
            const isDone = task.status === 'Done';
            return (
              <Card
                key={task.id}
                className={`transition-all ${
                  isDone ? 'bg-neutral-50/70 border-neutral-200' : 'bg-white hover:border-neutral-300'
                }`}
              >
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Checkbox & Info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(task.id, isDone ? 'To Do' : 'Done')}
                      className={`mt-1 h-5 w-5 rounded border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                        isDone
                          ? 'bg-emerald-700 border-emerald-700 text-white'
                          : 'border-neutral-300 bg-white hover:border-emerald-600'
                      }`}
                      aria-label="Toggle task completed"
                    >
                      {isDone && <CheckCircle2 className="h-4 w-4" />}
                    </button>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusTag status={task.priority} />
                        <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                          {task.category}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {task.subCounty}
                        </span>
                      </div>

                      <h3
                        className={`text-sm sm:text-base font-bold leading-snug ${
                          isDone ? 'line-through text-neutral-400' : 'text-neutral-900'
                        }`}
                      >
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="text-xs text-neutral-600 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 pt-1">
                        <span className="flex items-center gap-1 font-medium text-neutral-800">
                          <User className="h-3.5 w-3.5 text-neutral-400" />
                          Assignee: {task.assignee}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="h-3.5 w-3.5 text-neutral-400" />
                          Due: {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status Switcher & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 shrink-0">
                    <Select
                      value={task.status}
                      onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
                      className="text-xs h-8 w-32"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </Select>

                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEditTask(task)}
                        className="h-8 w-8 p-0 text-neutral-600 hover:text-neutral-900"
                        title="Edit Task"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm(`Delete task "${task.title}"?`)) onDeleteTask(task.id);
                        }}
                        className="h-8 w-8 p-0 text-neutral-400 hover:text-red-700"
                        title="Delete Task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
