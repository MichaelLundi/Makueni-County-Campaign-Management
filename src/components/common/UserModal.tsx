import * as React from 'react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { CampaignUser, UserRole, CountyInfo } from '../../types/campaign';

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  countyInfo: CountyInfo;
  onSave: (user: CampaignUser) => void;
  initialData?: CampaignUser | null;
}

export function UserModal({ open, onOpenChange, countyInfo, onSave, initialData }: UserModalProps) {
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [role, setRole] = React.useState<UserRole>('Field Mobilizer');
  const [subCounty, setSubCounty] = React.useState('All County');
  const [status, setStatus] = React.useState<'Active' | 'Inactive'>('Active');
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (initialData) {
      setFullName(initialData.fullName);
      setEmail(initialData.email);
      setPhone(initialData.phone);
      setRole(initialData.role);
      setSubCounty(initialData.subCounty);
      setStatus(initialData.status);
    } else {
      setFullName('');
      setEmail('');
      setPhone('');
      setRole('Field Mobilizer');
      setSubCounty('All County');
      setStatus('Active');
    }
    setErrors({});
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const defaultPermissionsMap: Record<UserRole, string[]> = {
      'Campaign Manager': ['Full Admin', 'Budget Approvals', 'Strategic Planning', 'User Management'],
      'Sub-County Director': ['Activity Logging', 'Task Management', 'Community Issues', 'Field Team Lead'],
      'Communications Lead': ['Media Releases', 'Manifesto Content', 'Social Media Strategy'],
      'Logistics Coordinator': ['PA & Rigs Sound', 'Fleet Management', 'Banner & Collateral Logistics'],
      'Volunteer Supervisor': ['Youth League Marshals', 'Polling Station Marshals', 'Grassroots Logistics'],
      'Field Mobilizer': ['Baraza Coordination', 'Door-to-Door Canvassing', 'Issue Reporting'],
    };

    const user: CampaignUser = {
      id: initialData ? initialData.id : `usr-${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      subCounty,
      status,
      lastActive: initialData ? initialData.lastActive : 'Just added',
      permissions: initialData ? initialData.permissions : defaultPermissionsMap[role] || ['Field Data Entry'],
    };

    onSave(user);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? 'Edit Campaign User Account' : 'Add New Campaign Staff / Coordinator'}
      description="Assign roles, access privileges, and sub-county jurisdictions."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
            Full Name *
          </label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Grace Mwende Muthiani"
            error={errors.fullName}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Official Email *
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. g.mwende@makueni-campaign.ke"
              error={errors.email}
            />
          </div>

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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Campaign Role
            </label>
            <Select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              <option value="Campaign Manager">Campaign Manager (Executive)</option>
              <option value="Sub-County Director">Sub-County Director</option>
              <option value="Field Mobilizer">Field Mobilizer</option>
              <option value="Communications Lead">Communications Lead</option>
              <option value="Logistics Coordinator">Logistics Coordinator</option>
              <option value="Volunteer Supervisor">Volunteer Supervisor</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
              Jurisdiction / Sub-County
            </label>
            <Select value={subCounty} onChange={(e) => setSubCounty(e.target.value)}>
              <option value="All County">All County (HQ)</option>
              {countyInfo.subCounties.map((sc) => (
                <option key={sc.name} value={sc.name}>
                  {sc.name} Sub-County
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-1">
            Account Status
          </label>
          <Select value={status} onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}>
            <option value="Active">Active (Full Access)</option>
            <option value="Inactive">Inactive / Suspended</option>
          </Select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Save Changes' : 'Create User Account'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
