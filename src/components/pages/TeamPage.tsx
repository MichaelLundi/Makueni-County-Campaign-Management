import * as React from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  MapPin, 
  UserCheck, 
  Trash2, 
  Edit3, 
  MessageSquare,
  Award,
  Layers
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { StatusTag } from '../ui/status-tag';
import { TeamMember, CountyInfo } from '../../types/campaign';
import { formatNumber, formatDate } from '../../lib/utils';

interface TeamPageProps {
  countyInfo: CountyInfo;
  team: TeamMember[];
  onOpenCreateModal: () => void;
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (memberId: string) => void;
}

export function TeamPage({
  countyInfo,
  team,
  onOpenCreateModal,
  onEditMember,
  onDeleteMember,
}: TeamPageProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('All');
  const [subCountyFilter, setSubCountyFilter] = React.useState('All');
  const [statusFilter, setStatusFilter] = React.useState('All');

  const filteredTeam = React.useMemo(() => {
    return team.filter((m) => {
      const matchSearch =
        m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.roleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.keyFocus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone.includes(searchTerm);

      const matchCategory = categoryFilter === 'All' || m.category === categoryFilter;
      const matchSubCounty = subCountyFilter === 'All' || m.subCounty === subCountyFilter;
      const matchStatus = statusFilter === 'All' || m.status === statusFilter;

      return matchSearch && matchCategory && matchSubCounty && matchStatus;
    });
  }, [team, searchTerm, categoryFilter, subCountyFilter, statusFilter]);

  const totalVolunteers = team.reduce((acc, curr) => acc + curr.volunteersLed, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Grassroots Command
            </span>
            <span className="text-xs text-neutral-400">·</span>
            <span className="text-xs text-neutral-500 font-mono tabular-nums">{team.length} Field Captains</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-0.5">
            Grassroots Mobilization Team & Captains
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600">
            Directory of ward coordinators, youth brigade leaders, women chamas chairs, and community liaisons.
          </p>
        </div>

        <Button onClick={onOpenCreateModal} className="gap-2 shrink-0 bg-emerald-700 hover:bg-emerald-800 text-white">
          <Plus className="h-4 w-4" />
          Enlist Team Member
        </Button>
      </div>

      {/* Team Aggregates */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="font-semibold uppercase tracking-wider">Field Captains</span>
            <Users className="h-4 w-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
            {team.length}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Coordinators across all 6 sub-counties</p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between text-xs text-emerald-800">
            <span className="font-semibold uppercase tracking-wider">Volunteers Marshaled</span>
            <UserCheck className="h-4 w-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
            {formatNumber(totalVolunteers)}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Door-to-door canvassers, boda riders & marshals</p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between text-xs text-neutral-700">
            <span className="font-semibold uppercase tracking-wider">Pillars Covered</span>
            <Layers className="h-4 w-4 text-neutral-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
            5 Wings
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Ward, Youth, Women, PWD, and Sub-County Wings</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-white">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search name, role, ward..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            {/* Category Filter */}
            <div>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs"
              >
                <option value="All">All Wings / Pillars</option>
                <option value="Sub-County Leads">Sub-County Leads</option>
                <option value="Ward Coordinators">Ward Coordinators</option>
                <option value="Youth League">Youth League</option>
                <option value="Women League">Women League</option>
                <option value="Special Interest Groups">Special Interest Groups</option>
              </Select>
            </div>

            {/* Sub-county Filter */}
            <div>
              <Select
                value={subCountyFilter}
                onChange={(e) => setSubCountyFilter(e.target.value)}
                className="text-xs"
              >
                <option value="All">All Sub-Counties</option>
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
                <option value="All">All Statuses</option>
                <option value="Active">Active Field</option>
                <option value="Standby">Standby</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Cards Grid */}
      {filteredTeam.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <Users className="h-8 w-8 text-neutral-400" />
            <h3 className="text-base font-semibold text-neutral-900">No team members match filters</h3>
            <p className="text-xs text-neutral-500">Try clearing filters or enroll a new team leader.</p>
            <Button onClick={onOpenCreateModal} size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Enlist Member
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTeam.map((member) => (
            <Card key={member.id} className="hover:border-neutral-300 transition-all flex flex-col justify-between">
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <StatusTag status={member.status} />
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {member.category}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-neutral-900">
                      {member.fullName}
                    </h3>
                    <p className="text-xs font-medium text-neutral-600">
                      {member.roleTitle}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                      Volunteers
                    </span>
                    <span className="text-base font-bold font-mono text-emerald-800 tabular-nums">
                      {member.volunteersLed}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                    <span>
                      {member.subCounty} Sub-County · <strong>{member.ward} Ward</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                    <span className="line-clamp-2">
                      Focus: {member.keyFocus}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
                  <span className="font-mono flex items-center gap-1 text-neutral-800">
                    <Phone className="h-3.5 w-3.5 text-neutral-400" />
                    {member.phone}
                  </span>
                  <span className="font-mono text-[11px]">Enlisted {formatDate(member.joinedDate)}</span>
                </div>
              </div>

              {/* Bottom Actions Strip */}
              <div className="px-5 py-3 bg-neutral-50/70 border-t border-neutral-100 flex items-center justify-between">
                <a
                  href={`tel:${member.phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Call Captain
                </a>

                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEditMember(member)}
                    className="h-8 w-8 p-0 text-neutral-600 hover:text-neutral-900"
                    title="Edit Member"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (confirm(`Remove team member "${member.fullName}"?`)) onDeleteMember(member.id);
                    }}
                    className="h-8 w-8 p-0 text-neutral-400 hover:text-red-700"
                    title="Delete Member"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
