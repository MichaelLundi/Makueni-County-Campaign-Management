import * as React from 'react';
import { 
  AlertCircle, 
  Plus, 
  Search, 
  MapPin, 
  User, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  FileText, 
  Phone,
  Flame,
  BookOpen
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { StatusTag } from '../ui/status-tag';
import { Dialog } from '../ui/dialog';
import { CommunityIssue, CountyInfo, IssueStatus, IssueSeverity } from '../../types/campaign';
import { formatDate } from '../../lib/utils';

interface CommunityIssuesPageProps {
  countyInfo: CountyInfo;
  issues: CommunityIssue[];
  onOpenCreateModal: () => void;
  onEditIssue: (issue: CommunityIssue) => void;
  onDeleteIssue: (issueId: string) => void;
  onUpdateStatus: (issueId: string, status: IssueStatus) => void;
}

export function CommunityIssuesPage({
  countyInfo,
  issues,
  onOpenCreateModal,
  onEditIssue,
  onDeleteIssue,
  onUpdateStatus,
}: CommunityIssuesPageProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [subCountyFilter, setSubCountyFilter] = React.useState('All');
  const [categoryFilter, setCategoryFilter] = React.useState('All');
  const [severityFilter, setSeverityFilter] = React.useState('All');
  const [statusFilter, setStatusFilter] = React.useState('All');
  const [selectedIssueDetails, setSelectedIssueDetails] = React.useState<CommunityIssue | null>(null);

  const filteredIssues = React.useMemo(() => {
    return issues.filter((iss) => {
      const matchSearch =
        iss.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        iss.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        iss.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        iss.ward.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSubCounty = subCountyFilter === 'All' || iss.subCounty === subCountyFilter;
      const matchCategory = categoryFilter === 'All' || iss.category === categoryFilter;
      const matchSeverity = severityFilter === 'All' || iss.severity === severityFilter;
      const matchStatus = statusFilter === 'All' || iss.status === statusFilter;

      return matchSearch && matchSubCounty && matchCategory && matchSeverity && matchStatus;
    });
  }, [issues, searchTerm, subCountyFilter, categoryFilter, severityFilter, statusFilter]);

  const criticalCount = issues.filter((i) => i.severity === 'Critical').length;
  const manifestoPledgedCount = issues.filter((i) => i.status === 'Manifesto Priority').length;
  const resolvedCount = issues.filter((i) => i.status === 'Resolved').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Grassroots Listening Desk
            </span>
            <span className="text-xs text-neutral-400">·</span>
            <span className="text-xs text-neutral-500 font-mono tabular-nums">{issues.length} Logged Problems</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-0.5">
            Community Grievances & Ward Priorities
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600">
            Citizen issues captured during rallies and barazas (water boreholes, road grading, dispensaries, bursary oversight).
          </p>
        </div>

        <Button onClick={onOpenCreateModal} className="gap-2 shrink-0 bg-emerald-700 hover:bg-emerald-800 text-white">
          <Plus className="h-4 w-4" />
          Report Community Issue
        </Button>
      </div>

      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between text-xs text-rose-700">
            <span className="font-semibold uppercase tracking-wider">Critical Emergencies</span>
            <Flame className="h-4 w-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
            {criticalCount}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Water crises, unpassable bridges, drug stockouts</p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between text-xs text-emerald-800">
            <span className="font-semibold uppercase tracking-wider">Adopted in Manifesto</span>
            <BookOpen className="h-4 w-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
            {manifestoPledgedCount}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Integrated into the 100-day county action pledge</p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between text-xs text-neutral-700">
            <span className="font-semibold uppercase tracking-wider">Actioned / Resolved</span>
            <CheckCircle className="h-4 w-4 text-neutral-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
            {resolvedCount}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Direct intervention delivered or emergency tanks deployed</p>
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
                placeholder="Search issue title, ward, reporter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-xs"
              />
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

            {/* Category Filter */}
            <div>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs"
              >
                <option value="All">All Categories</option>
                <option value="Water & Sanitation">Water & Sanitation</option>
                <option value="Feeder Roads & Bridges">Feeder Roads & Bridges</option>
                <option value="Healthcare & Dispensaries">Healthcare & Dispensaries</option>
                <option value="Education & Bursaries">Education & Bursaries</option>
                <option value="Agriculture & Markets">Agriculture & Markets</option>
                <option value="Youth Employment">Youth Employment</option>
                <option value="Security & Solar Lighting">Security & Solar Lighting</option>
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
                <option value="Open">Open</option>
                <option value="Investigating">Investigating</option>
                <option value="Manifesto Priority">Manifesto Priority</option>
                <option value="Resolved">Resolved</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      {filteredIssues.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <AlertCircle className="h-8 w-8 text-neutral-400" />
            <h3 className="text-base font-semibold text-neutral-900">No community issues match filters</h3>
            <p className="text-xs text-neutral-500">Reset your filters or log a newly reported issue.</p>
            <Button onClick={onOpenCreateModal} size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Report Issue
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredIssues.map((issue) => (
            <Card key={issue.id} className="hover:border-neutral-300 transition-all">
              <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Left: Issue Details */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusTag status={issue.severity} />
                    <StatusTag status={issue.status} />
                    <span className="text-xs font-semibold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded">
                      {issue.category}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {issue.subCounty} · <strong>{issue.ward} Ward</strong>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 leading-snug">
                    {issue.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                    {issue.description}
                  </p>

                  {/* Proposed candidate action */}
                  {issue.proposedAction && (
                    <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950">
                      <span className="font-bold text-emerald-900">Campaign Commitment: </span>
                      {issue.proposedAction}
                    </div>
                  )}

                  {issue.resolutionNotes && (
                    <div className="p-2 rounded bg-neutral-100 text-xs text-neutral-700">
                      <span className="font-semibold">Resolution Action: </span>
                      {issue.resolutionNotes}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 pt-1">
                    <span className="flex items-center gap-1 font-medium text-neutral-800">
                      <User className="h-3.5 w-3.5 text-neutral-400" />
                      Reported by: {issue.reportedBy}
                    </span>
                    {issue.reportedPhone && (
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="h-3.5 w-3.5 text-neutral-400" />
                        {issue.reportedPhone}
                      </span>
                    )}
                    <span className="font-mono">Logged {formatDate(issue.reportedDate)}</span>
                  </div>
                </div>

                {/* Right: Quick Status Actions */}
                <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100 shrink-0">
                  <div className="flex flex-col gap-1 items-start md:items-end">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      Campaign Status
                    </label>
                    <Select
                      value={issue.status}
                      onChange={(e) => onUpdateStatus(issue.id, e.target.value as IssueStatus)}
                      className="text-xs h-8 w-36"
                    >
                      <option value="Open">Open</option>
                      <option value="Investigating">Investigating</option>
                      <option value="Manifesto Priority">Manifesto Priority</option>
                      <option value="Resolved">Resolved</option>
                    </Select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEditIssue(issue)}
                      className="h-8 w-8 p-0 text-neutral-600 hover:text-neutral-900"
                      title="Edit Issue"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm(`Delete issue "${issue.title}"?`)) onDeleteIssue(issue.id);
                      }}
                      className="h-8 w-8 p-0 text-neutral-400 hover:text-red-700"
                      title="Delete Issue"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
