import * as React from 'react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input, Textarea } from '../ui/input';
import { Select } from '../ui/select';
import { TeamMember, CountyInfo } from '../../types/campaign';

interface TeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  countyInfo: CountyInfo;
  onSave: (member: TeamMember) => void;
  initialData?: TeamMember | null;
}

export function TeamModal({ open, onOpenChange, countyInfo, onSave, initialData }: TeamModalProps) {
  const [fullName, setFullName] = React.useState('');
  const [roleTitle, setRoleTitle] = React.useState('');
  const [category, setCategory] = React.useState<TeamMember['category']>('Ward Coordinators');
  const [subCounty, setSubCounty] = React.useState(countyInfo.subCounties[0]?.name || 'Makueni');
  const [ward, setWard] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [volunteersLed, setVolunteersLed] = React.useState('25');
  const [keyFocus, setKeyFocus] = React.useState('');
  const [status, setStatus] = React.useState<'Active' | 'Standby'>('Active');
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const availableWards = React.useMemo(() => {
    const sc = countyInfo.subCounties.find((s) => s.name === subCounty);
    return sc ? sc.wards : [];
  }, [countyInfo, subCounty]);

  React.useEffect(() => {
    if (initialData) {
      setFullName(initialData.fullName);
      setRoleTitle(initialData.roleTitle);
      setCategory(initialData.category);
      setSubCounty(initialData.subCounty);
      setWard(initialData.ward);
      setPhone(initialData.phone);
      setVolunteersLed(String(initialData.volunteersLed));
      setKeyFocus(initialData.keyFocus);
      setStatus(initialData.status);
    } else {
      setFullName('');
      setRoleTitle('');
      setCategory('Ward Coordinators');
      setSubCounty(countyInfo.subCounties[0]?.name || 'Makueni');
      setWard(countyInfo.subCounties[0]?.wards[0] || 'Wote');
      setPhone('');
      setVolunteersLed('30');
      setKeyFocus('');
      setStatus('Active');
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
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!roleTitle.trim()) newErrors.roleTitle = 'Role title is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const member: TeamMember = {
      id: initialData ? initialData.id : `tm-${Date.now()}`,
      fullName: fullName.trim(),
      roleTitle: roleTitle.trim(),
      category,
      subCounty,
      ward: ward || availableWards[0] || 'General Ward',
      phone: phone.trim(),
      volunteersLed: parseInt(volunteersLed, 10) || 0,
      keyFocus: keyFocus.trim() || 'Community voter engagement and mobilization',
      joinedDate: initialData ? initialData.joinedDate : new Date().toISOString().split('T')[0],
      status,
    };

    onSave(member);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? 'Edit Team Member Profile' : 'Enroll Field Mobilization Leader'}
      description="Register ward captains, youth leaders, women leagues, and community networks."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
            Full Name *
          </label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Sammy Kaloki"
            error={errors.fullName}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Designation / Role Title *
            </label>
            <Input
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. Kathonzweni Ward Mobilizer"
              error={errors.roleTitle}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Field Pillar / Category
            </label>
            <Select value={category} onChange={(e) => setCategory(e.target.value as TeamMember['category'])}>
              <option value="Sub-County Leads">Sub-County Leads</option>
              <option value="Ward Coordinators">Ward Coordinators</option>
              <option value="Youth League">Youth League</option>
              <option value="Women League">Women League</option>
              <option value="Special Interest Groups">Special Interest Groups (Boda, PWD, Elders)</option>
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Phone Number *
            </label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+254 7XX XXX XXX"
              error={errors.phone}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Volunteers Led
            </label>
            <Input
              type="number"
              value={volunteersLed}
              onChange={(e) => setVolunteersLed(e.target.value)}
              placeholder="35"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Mobilization Status
            </label>
            <Select value={status} onChange={(e) => setStatus(e.target.value as 'Active' | 'Standby')}>
              <option value="Active">Active Field</option>
              <option value="Standby">Standby / Reserve</option>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
            Key Mobilization Focus / Ground Base
          </label>
          <Textarea
            value={keyFocus}
            onChange={(e) => setKeyFocus(e.target.value)}
            rows={2}
            placeholder="e.g. Livestock auction market vendors, church women fellowships, boda boda stages..."
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Save Member' : 'Enlist to Team'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
