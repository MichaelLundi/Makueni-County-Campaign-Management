import * as React from 'react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input, Textarea } from '../ui/input';
import { Select } from '../ui/select';
import { CommunityIssue, IssueCategory, IssueSeverity, IssueStatus, CountyInfo } from '../../types/campaign';

interface IssueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  countyInfo: CountyInfo;
  onSave: (issue: CommunityIssue) => void;
  initialData?: CommunityIssue | null;
}

export function IssueModal({ open, onOpenChange, countyInfo, onSave, initialData }: IssueModalProps) {
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState<IssueCategory>('Water & Sanitation');
  const [subCounty, setSubCounty] = React.useState(countyInfo.subCounties[0]?.name || 'Makueni');
  const [ward, setWard] = React.useState('');
  const [reportedBy, setReportedBy] = React.useState('');
  const [reportedPhone, setReportedPhone] = React.useState('');
  const [severity, setSeverity] = React.useState<IssueSeverity>('Critical');
  const [status, setStatus] = React.useState<IssueStatus>('Open');
  const [description, setDescription] = React.useState('');
  const [proposedAction, setProposedAction] = React.useState('');
  const [resolutionNotes, setResolutionNotes] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const availableWards = React.useMemo(() => {
    const sc = countyInfo.subCounties.find((s) => s.name === subCounty);
    return sc ? sc.wards : [];
  }, [countyInfo, subCounty]);

  React.useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCategory(initialData.category);
      setSubCounty(initialData.subCounty);
      setWard(initialData.ward);
      setReportedBy(initialData.reportedBy);
      setReportedPhone(initialData.reportedPhone || '');
      setSeverity(initialData.severity);
      setStatus(initialData.status);
      setDescription(initialData.description);
      setProposedAction(initialData.proposedAction);
      setResolutionNotes(initialData.resolutionNotes || '');
    } else {
      setTitle('');
      setCategory('Water & Sanitation');
      setSubCounty(countyInfo.subCounties[0]?.name || 'Makueni');
      setWard(countyInfo.subCounties[0]?.wards[0] || 'Wote');
      setReportedBy('');
      setReportedPhone('');
      setSeverity('Critical');
      setStatus('Open');
      setDescription('');
      setProposedAction('');
      setResolutionNotes('');
    }
    setErrors({});
  }, [initialData, open, countyInfo]);

  React.useEffect(() => {
    if (availableWards.length > 0 && !availableWards.includes(ward)) {
      setWard(availableWards[0]);
    }
  }, [subCounty, availableWards, ward]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Issue title is required';
    if (!reportedBy.trim()) newErrors.reportedBy = 'Reporter or community delegation name is required';
    if (!description.trim()) newErrors.description = 'Please describe the community problem';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const issue: CommunityIssue = {
      id: initialData ? initialData.id : `iss-${Date.now()}`,
      title: title.trim(),
      category,
      subCounty,
      ward: ward || availableWards[0] || 'General Ward',
      reportedBy: reportedBy.trim(),
      reportedPhone: reportedPhone.trim() || undefined,
      reportedDate: initialData ? initialData.reportedDate : new Date().toISOString().split('T')[0],
      severity,
      status,
      description: description.trim(),
      proposedAction: proposedAction.trim(),
      resolutionNotes: resolutionNotes.trim() || undefined,
    };

    onSave(issue);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? 'Edit Community Grievance / Need' : 'Report Community Issue from Field'}
      description="Capture citizen demands, broken infrastructure, or dispensary shortages reported during campaigns."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
            Issue Summary / Need *
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Broken solar borehole in Kathonzweni"
            error={errors.title}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Category
            </label>
            <Select value={category} onChange={(e) => setCategory(e.target.value as IssueCategory)}>
              <option value="Water & Sanitation">Water & Sanitation</option>
              <option value="Feeder Roads & Bridges">Feeder Roads & Bridges</option>
              <option value="Healthcare & Dispensaries">Healthcare & Dispensaries</option>
              <option value="Education & Bursaries">Education & Bursaries</option>
              <option value="Agriculture & Markets">Agriculture & Markets</option>
              <option value="Youth Employment">Youth Employment</option>
              <option value="Security & Solar Lighting">Security & Solar Lighting</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Urgency / Severity
            </label>
            <Select value={severity} onChange={(e) => setSeverity(e.target.value as IssueSeverity)}>
              <option value="Critical">Critical (Affects Daily Life)</option>
              <option value="Moderate">Moderate Priority</option>
              <option value="Low">Low / Long Term</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Campaign Status
            </label>
            <Select value={status} onChange={(e) => setStatus(e.target.value as IssueStatus)}>
              <option value="Open">Open (Pending Review)</option>
              <option value="Investigating">Investigating</option>
              <option value="Manifesto Priority">Manifesto Priority</option>
              <option value="Resolved">Resolved / Actioned</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Sub-County
            </label>
            <Select value={subCounty} onChange={(e) => setSubCounty(e.target.value)}>
              {countyInfo.subCounties.map((sc) => (
                <option key={sc.name} value={sc.name}>
                  {sc.name} Sub-County
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Ward
            </label>
            <Select value={ward} onChange={(e) => setWard(e.target.value)}>
              {availableWards.map((w) => (
                <option key={w} value={w}>
                  {w} Ward
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Reported By (Group / Elder / Mobilizer) *
            </label>
            <Input
              value={reportedBy}
              onChange={(e) => setReportedBy(e.target.value)}
              placeholder="e.g. Kavatini Water Committee / Chair Mutinda"
              error={errors.reportedBy}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Contact Phone (Optional)
            </label>
            <Input
              value={reportedPhone}
              onChange={(e) => setReportedPhone(e.target.value)}
              placeholder="+254 7XX XXX XXX"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
            Community Grievance Details *
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Explain the background, how many people are affected, and what the community is demanding..."
            error={errors.description}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
            Candidate Response / Manifesto Commitment
          </label>
          <Textarea
            value={proposedAction}
            onChange={(e) => setProposedAction(e.target.value)}
            rows={2}
            placeholder="e.g. Candidate committed to solar replacement in 100-day development plan..."
          />
        </div>

        {initialData && (
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Resolution or Progress Notes
            </label>
            <Input
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="e.g. Temporary water bowsers deployed; included in ward budget charter."
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update Issue' : 'Submit Issue to Campaign Desk'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
