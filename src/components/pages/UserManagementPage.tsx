import * as React from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle,
  Key
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { StatusTag } from '../ui/status-tag';
import { CampaignUser, CountyInfo, UserRole } from '../../types/campaign';

interface UserManagementPageProps {
  countyInfo: CountyInfo;
  users: CampaignUser[];
  onOpenCreateModal: () => void;
  onEditUser: (user: CampaignUser) => void;
  onDeleteUser: (userId: string) => void;
  onToggleStatus: (userId: string) => void;
}

export function UserManagementPage({
  countyInfo,
  users,
  onOpenCreateModal,
  onEditUser,
  onDeleteUser,
  onToggleStatus,
}: UserManagementPageProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState('All');
  const [subCountyFilter, setSubCountyFilter] = React.useState('All');
  const [statusFilter, setStatusFilter] = React.useState('All');

  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone.includes(searchTerm);

      const matchRole = roleFilter === 'All' || u.role === roleFilter;
      const matchSubCounty = subCountyFilter === 'All' || u.subCounty === subCountyFilter;
      const matchStatus = statusFilter === 'All' || u.status === statusFilter;

      return matchSearch && matchRole && matchSubCounty && matchStatus;
    });
  }, [users, searchTerm, roleFilter, subCountyFilter, statusFilter]);

  const activeUsersCount = users.filter((u) => u.status === 'Active').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Access Control & Permissions
            </span>
            <span className="text-xs text-neutral-400">·</span>
            <span className="text-xs text-neutral-500 font-mono tabular-nums">{users.length} Authorized Accounts</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-0.5">
            Campaign User Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600">
            Manage system access for sub-county directors, logistics coordinators, communications staff, and field mobilizers.
          </p>
        </div>

        <Button onClick={onOpenCreateModal} className="gap-2 shrink-0 bg-emerald-700 hover:bg-emerald-800 text-white">
          <Plus className="h-4 w-4" />
          Add Campaign User
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-white">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            {/* Role Filter */}
            <div>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-xs"
              >
                <option value="All">All Roles</option>
                <option value="Campaign Manager">Campaign Manager</option>
                <option value="Sub-County Director">Sub-County Director</option>
                <option value="Field Mobilizer">Field Mobilizer</option>
                <option value="Communications Lead">Communications Lead</option>
                <option value="Logistics Coordinator">Logistics Coordinator</option>
                <option value="Volunteer Supervisor">Volunteer Supervisor</option>
              </Select>
            </div>

            {/* Sub-county Filter */}
            <div>
              <Select
                value={subCountyFilter}
                onChange={(e) => setSubCountyFilter(e.target.value)}
                className="text-xs"
              >
                <option value="All">All Jurisdictions</option>
                <option value="All County">All County (HQ)</option>
                {countyInfo.subCounties.map((sc) => (
                  <option key={sc.name} value={sc.name}>
                    {sc.name} Sub-County
                  </option>
                ))}
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs"
              >
                <option value="All">All Account Statuses</option>
                <option value="Active">Active ({activeUsersCount})</option>
                <option value="Inactive">Inactive ({users.length - activeUsersCount})</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table / Responsive Cards */}
      {filteredUsers.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <ShieldCheck className="h-8 w-8 text-neutral-400" />
            <h3 className="text-base font-semibold text-neutral-900">No users match filters</h3>
            <p className="text-xs text-neutral-500">Try modifying search or add a new staff account.</p>
            <Button onClick={onOpenCreateModal} size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Add User
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => {
            const isActive = user.status === 'Active';
            return (
              <Card key={user.id} className="hover:border-neutral-300 transition-all">
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: User Info */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusTag status={user.status} />
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {user.role}
                      </span>
                      <span className="text-xs text-neutral-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-neutral-400" />
                        {user.subCounty}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-neutral-900">
                      {user.fullName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-600">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-neutral-400" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="h-3.5 w-3.5 text-neutral-400" />
                        {user.phone}
                      </span>
                      <span className="text-neutral-400">·</span>
                      <span className="text-neutral-500 text-[11px]">
                        Last active: {user.lastActive}
                      </span>
                    </div>

                    {/* Permissions list */}
                    {user.permissions && user.permissions.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-neutral-600">
                        <Key className="h-3 w-3 text-neutral-400" />
                        <span className="font-medium text-neutral-700">Permissions:</span>
                        {user.permissions.map((perm, idx) => (
                          <span key={perm} className="text-neutral-600">
                            {perm}{idx < user.permissions.length - 1 ? ' · ' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onToggleStatus(user.id)}
                      className={`h-8 text-xs px-2.5 ${
                        isActive
                          ? 'text-neutral-700 hover:bg-neutral-100'
                          : 'text-emerald-800 border-emerald-300 hover:bg-emerald-50'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <XCircle className="h-3.5 w-3.5 mr-1 text-neutral-500" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                          Activate
                        </>
                      )}
                    </Button>

                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEditUser(user)}
                        className="h-8 w-8 p-0 text-neutral-600 hover:text-neutral-900"
                        title="Edit User"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm(`Remove user "${user.fullName}"?`)) onDeleteUser(user.id);
                        }}
                        className="h-8 w-8 p-0 text-neutral-400 hover:text-red-700"
                        title="Delete User"
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
