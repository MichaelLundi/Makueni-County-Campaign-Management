import * as React from 'react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input, Textarea } from '../ui/input';
import { Select } from '../ui/select';
import { CampaignTask, TaskPriority, TaskStatus, TaskCategory, CountyInfo } from '../../types/campaign';

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  countyInfo: CountyInfo;
  onSave: (task: CampaignTask) => void;
  initialData?: CampaignTask | null;
}

export function TaskModal({ open, onOpenChange, countyInfo, onSave, initialData }: TaskModalProps) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [priority, setPriority] = React.useState<TaskPriority>('Medium');
  const [category, setCategory] = React.useState<TaskCategory>('Logistics & Sound');
  const [assignee, setAssignee] = React.useState('');
  const [subCounty, setSubCounty] = React.useState('All County');
  const [ward, setWard] = React.useState('');
  const [dueDate, setDueDate] = React.useState('');
  const [status, setStatus] = React.useState<TaskStatus>('To Do');
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setPriority(initialData.priority);
      setCategory(initialData.category);
      setAssignee(initialData.assignee);
      setSubCounty(initialData.subCounty);
      setWard(initialData.ward || '');
      setDueDate(initialData.dueDate);
      setStatus(initialData.status);
    } else {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setCategory('Grassroots Mobilization');
      setAssignee('');
      setSubCounty('All County');
      setWard('');
      // Default due date to 5 days from now
      const d = new Date();
      d.setDate(d.getDate() + 5);
      setDueDate(d.toISOString().split('T')[0]);
      setStatus('To Do');
    }
    setErrors({});
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Task title is required';
    if (!assignee.trim()) newErrors.assignee = 'Assignee name is required';
    if (!dueDate) newErrors.dueDate = 'Due date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const task: CampaignTask = {
      id: initialData ? initialData.id : `tsk-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      assignee: assignee.trim(),
      subCounty,
      ward: ward.trim() || undefined,
      dueDate,
      status,
      createdAt: initialData ? initialData.createdAt : new Date().toISOString().split('T')[0],
    };

    onSave(task);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? 'Edit Campaign Task' : 'Add Campaign Action Task'}
      description="Assign actionable field assignments, sound logistics, security permits, and materials."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
            Task Title *
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Procure generator & backup battery for Wote rally"
            error={errors.title}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
            Description & Instructions
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Specify deliverables, contact persons, or logistics details..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Category
            </label>
            <Select value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)}>
              <option value="Grassroots Mobilization">Grassroots Mobilization</option>
              <option value="Logistics & Sound">Logistics & Sound</option>
              <option value="Communications & Media">Communications & Media</option>
              <option value="Security & Permits">Security & Permits</option>
              <option value="Manifesto & Policy">Manifesto & Policy</option>
              <option value="Volunteer Coordination">Volunteer Coordination</option>
              <option value="Voter Outreach">Voter Outreach</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Priority
            </label>
            <Select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
              <option value="High">High (Immediate)</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Assignee *
            </label>
            <Input
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="e.g. Mary Mutuku / Brian Makau"
              error={errors.assignee}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Due Date *
            </label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              error={errors.dueDate}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Sub-County Scope
            </label>
            <Select value={subCounty} onChange={(e) => setSubCounty(e.target.value)}>
              <option value="All County">All County (Central Secretariat)</option>
              {countyInfo.subCounties.map((sc) => (
                <option key={sc.name} value={sc.name}>
                  {sc.name} Sub-County
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Status
            </label>
            <Select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update Task' : 'Assign Task'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
