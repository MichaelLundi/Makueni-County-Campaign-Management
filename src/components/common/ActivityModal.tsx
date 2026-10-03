import * as React from 'react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input, Textarea } from '../ui/input';
import { Select } from '../ui/select';
import { CampaignActivity, ActivityType, ActivityStatus } from '../../types/campaign';
import { CountyInfo } from '../../types/campaign';

interface ActivityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  countyInfo: CountyInfo;
  onSave: (activity: CampaignActivity) => void;
  initialData?: CampaignActivity | null;
}

export function ActivityModal({ open, onOpenChange, countyInfo, onSave, initialData }: ActivityModalProps) {
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState<ActivityType>('Town Hall');
  const [subCounty, setSubCounty] = React.useState(countyInfo.subCounties[0]?.name || 'Makueni');
  const [ward, setWard] = React.useState('');
  const [venue, setVenue] = React.useState('');
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = React.useState('10:00 AM');
  const [coordinator, setCoordinator] = React.useState('');
  const [estimatedReach, setEstimatedReach] = React.useState('1000');
  const [budgetKsh, setBudgetKsh] = React.useState('75000');
  const [status, setStatus] = React.useState<ActivityStatus>('Scheduled');
  const [notes, setNotes] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const availableWards = React.useMemo(() => {
    const sc = countyInfo.subCounties.find((s) => s.name === subCounty);
    return sc ? sc.wards : [];
  }, [countyInfo, subCounty]);

  React.useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setType(initialData.type);
      setSubCounty(initialData.subCounty);
      setWard(initialData.ward);
      setVenue(initialData.venue);
      setDate(initialData.date);
      setTime(initialData.time);
      setCoordinator(initialData.coordinator);
      setEstimatedReach(String(initialData.estimatedReach));
      setBudgetKsh(String(initialData.budgetKsh));
      setStatus(initialData.status);
      setNotes(initialData.notes || '');
    } else {
      setTitle('');
      setType('Town Hall');
      setSubCounty(countyInfo.subCounties[0]?.name || 'Makueni');
      setWard(countyInfo.subCounties[0]?.wards[0] || 'Wote');
      setVenue('');
      setDate(new Date().toISOString().split('T')[0]);
      setTime('10:00 AM');
      setCoordinator('');
      setEstimatedReach('1200');
      setBudgetKsh('80000');
      setStatus('Scheduled');
      setNotes('');
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
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!venue.trim()) newErrors.venue = 'Venue location is required';
    if (!coordinator.trim()) newErrors.coordinator = 'Field coordinator is required';
    if (!date) newErrors.date = 'Date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const activity: CampaignActivity = {
      id: initialData ? initialData.id : `act-${Date.now()}`,
      title: title.trim(),
      type,
      subCounty,
      ward: ward || availableWards[0] || 'Central',
      venue: venue.trim(),
      date,
      time,
      coordinator: coordinator.trim(),
      estimatedReach: parseInt(estimatedReach, 10) || 500,
      actualTurnout: initialData?.actualTurnout,
      budgetKsh: parseInt(budgetKsh, 10) || 0,
      status,
      notes: notes.trim(),
      createdAt: initialData ? initialData.createdAt : new Date().toISOString().split('T')[0],
    };

    onSave(activity);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? 'Edit Campaign Activity' : 'Log New Campaign Activity'}
      description="Record rallies, town halls, door-to-door barazas, and grassroots mobilizations."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
            Activity Title *
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Wote Market Day Traders Forum"
            error={errors.title}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Event Type
            </label>
            <Select value={type} onChange={(e) => setType(e.target.value as ActivityType)}>
              <option value="Town Hall">Town Hall</option>
              <option value="Rally">Campaign Rally</option>
              <option value="Door-to-Door">Door-to-Door Canvassing</option>
              <option value="Market Walkabout">Market Walkabout</option>
              <option value="Youth Forum">Youth Forum</option>
              <option value="Women Group Meet">Women Group Meet</option>
              <option value="Stakeholder Roundtable">Stakeholder Roundtable</option>
              <option value="Church Visit">Church / Community Visit</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Status
            </label>
            <Select value={status} onChange={(e) => setStatus(e.target.value as ActivityStatus)}>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Postponed">Postponed</option>
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

        <div>
          <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
            Venue / Ground Location *
          </label>
          <Input
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="e.g. Makindu Social Grounds / Kathonzweni Market"
            error={errors.venue}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Date *
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              error={errors.date}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Start Time
            </label>
            <Input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 10:00 AM"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Lead Coordinator *
            </label>
            <Input
              value={coordinator}
              onChange={(e) => setCoordinator(e.target.value)}
              placeholder="e.g. Faith Mutua"
              error={errors.coordinator}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Target Turnout
            </label>
            <Input
              type="number"
              value={estimatedReach}
              onChange={(e) => setEstimatedReach(e.target.value)}
              placeholder="1500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Est. Budget (KSh)
            </label>
            <Input
              type="number"
              value={budgetKsh}
              onChange={(e) => setBudgetKsh(e.target.value)}
              placeholder="80000"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
            Mobilization Notes / Demands Pledged
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Key community delegations, sound system needs, or local priorities raised..."
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update Activity' : 'Save & Publish Activity'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
