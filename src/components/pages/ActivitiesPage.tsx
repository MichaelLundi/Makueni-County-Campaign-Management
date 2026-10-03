import * as React from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  MapPin, 
  Clock, 
  User, 
  DollarSign, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Filter,
  Eye
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { StatusTag } from '../ui/status-tag';
import { Dialog } from '../ui/dialog';
import { CampaignActivity, CountyInfo, ActivityStatus } from '../../types/campaign';
import { formatDate, formatNumber } from '../../lib/utils';

interface ActivitiesPageProps {
  countyInfo: CountyInfo;
  activities: CampaignActivity[];
  onOpenCreateModal: () => void;
  onEditActivity: (activity: CampaignActivity) => void;
  onDeleteActivity: (activityId: string) => void;
  onUpdateStatus: (activityId: string, status: ActivityStatus) => void;
}

export function ActivitiesPage({
  countyInfo,
  activities,
  onOpenCreateModal,
  onEditActivity,
  onDeleteActivity,
  onUpdateStatus,
}: ActivitiesPageProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [subCountyFilter, setSubCountyFilter] = React.useState('All');
  const [typeFilter, setTypeFilter] = React.useState('All');
  const [statusFilter, setStatusFilter] = React.useState('All');
  const [selectedActivityForDetails, setSelectedActivityForDetails] = React.useState<CampaignActivity | null>(null);

  // Filtered Activities
  const filteredActivities = React.useMemo(() => {
    return activities.filter((act) => {
      const matchSearch =
        act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.coordinator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.ward.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSubCounty = subCountyFilter === 'All' || act.subCounty === subCountyFilter;
      const matchType = typeFilter === 'All' || act.type === typeFilter;
      const matchStatus = statusFilter === 'All' || act.status === statusFilter;

      return matchSearch && matchSubCounty && matchType && matchStatus;
    });
  }, [activities, searchTerm, subCountyFilter, typeFilter, statusFilter]);

  // Aggregate stats for top bar
  const totalEvents = activities.length;
  const completedCount = activities.filter((a) => a.status === 'Completed').length;
  const scheduledCount = activities.filter((a) => a.status === 'Scheduled').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Grassroots Operations
            </span>
            <span className="text-xs text-neutral-400">·</span>
            <span className="text-xs text-neutral-500 font-mono tabular-nums">{totalEvents} Total Registered</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-0.5">
            Campaign Activities & Field Rallies
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600">
            Schedule, manage, and track attendance for rallies, town halls, youth tournaments, and door-to-door barazas.
          </p>
        </div>

        <Button onClick={onOpenCreateModal} className="gap-2 shrink-0 bg-emerald-700 hover:bg-emerald-800 text-white">
          <Plus className="h-4 w-4" />
          Log New Activity
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-white">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search title, venue, coordinator..."
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

            {/* Type Filter */}
            <div>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-xs"
              >
                <option value="All">All Event Types</option>
                <option value="Town Hall">Town Halls</option>
                <option value="Rally">Campaign Rallies</option>
                <option value="Door-to-Door">Door-to-Door Canvassing</option>
                <option value="Market Walkabout">Market Walkabouts</option>
                <option value="Youth Forum">Youth Forums</option>
                <option value="Women Group Meet">Women Group Meets</option>
                <option value="Stakeholder Roundtable">Stakeholder Roundtables</option>
                <option value="Church Visit">Church Visits</option>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs"
              >
                <option value="All">All Statuses ({activities.length})</option>
                <option value="Scheduled">Scheduled ({scheduledCount})</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed ({completedCount})</option>
                <option value="Postponed">Postponed</option>
              </Select>
            </div>
          </div>

          {/* Active Filters Summary */}
          {(searchTerm || subCountyFilter !== 'All' || typeFilter !== 'All' || statusFilter !== 'All') && (
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs text-neutral-500">
              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-neutral-400" />
                <span>Showing {filteredActivities.length} of {activities.length} activities</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSubCountyFilter('All');
                  setTypeFilter('All');
                  setStatusFilter('All');
                }}
                className="text-emerald-800 hover:text-emerald-950 font-medium underline underline-offset-2"
              >
                Clear Filters
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activities Data List / Table */}
      {filteredActivities.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-neutral-900">No activities found</h3>
            <p className="text-xs text-neutral-500 max-w-sm">
              No campaign activities match your selected filters. Try clearing your search or log a new activity.
            </p>
            <Button onClick={onOpenCreateModal} size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Log New Activity
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {/* Card representation (mobile & desktop friendly) */}
          {filteredActivities.map((act) => (
            <Card key={act.id} className="hover:border-neutral-300 transition-all">
              <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left Info */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusTag status={act.status} />
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {act.type}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {act.subCounty} Sub-County · <strong>{act.ward} Ward</strong>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 leading-snug">
                    {act.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-600">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="h-3.5 w-3.5 text-neutral-400" />
                      {formatDate(act.date)} at {act.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                      {act.venue}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-neutral-400" />
                      Coordinator: <strong>{act.coordinator}</strong>
                    </span>
                    {act.budgetKsh > 0 && (
                      <span className="flex items-center gap-1 font-mono">
                        <DollarSign className="h-3.5 w-3.5 text-neutral-400" />
                        KSh {formatNumber(act.budgetKsh)}
                      </span>
                    )}
                  </div>

                  {act.notes && (
                    <p className="text-xs text-neutral-500 line-clamp-1 italic bg-neutral-50 p-1.5 rounded">
                      &quot;{act.notes}&quot;
                    </p>
                  )}
                </div>

                {/* Right Metrics & Quick Actions */}
                <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100 shrink-0">
                  <div className="text-left md:text-right">
                    <span className="block text-[11px] text-neutral-500 uppercase tracking-wider font-medium">
                      Audience Turnout
                    </span>
                    <span className="text-base font-bold font-mono text-neutral-900 tabular-nums">
                      {formatNumber(act.actualTurnout || act.estimatedReach)}{' '}
                      <span className="text-xs font-normal text-neutral-500">
                        {act.actualTurnout ? '(actual)' : '(est.)'}
                      </span>
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    {act.status !== 'Completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateStatus(act.id, 'Completed')}
                        className="h-8 text-xs text-emerald-800 border-emerald-300 hover:bg-emerald-50 px-2.5"
                        title="Mark Completed"
                      >
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Complete
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedActivityForDetails(act)}
                      className="h-8 w-8 p-0 text-neutral-600 hover:text-neutral-900"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEditActivity(act)}
                      className="h-8 w-8 p-0 text-neutral-600 hover:text-neutral-900"
                      title="Edit Activity"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm(`Delete activity "${act.title}"?`)) {
                          onDeleteActivity(act.id);
                        }
                      }}
                      className="h-8 w-8 p-0 text-neutral-400 hover:text-red-700"
                      title="Delete Activity"
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

      {/* Activity Details Modal */}
      {selectedActivityForDetails && (
        <Dialog
          open={!!selectedActivityForDetails}
          onOpenChange={(open) => !open && setSelectedActivityForDetails(null)}
          title={selectedActivityForDetails.title}
          description={`${selectedActivityForDetails.type} in ${selectedActivityForDetails.subCounty} Sub-County`}
        >
          <div className="space-y-4 text-xs sm:text-sm text-neutral-700">
            <div className="flex items-center gap-2">
              <StatusTag status={selectedActivityForDetails.status} />
              <span className="font-semibold text-neutral-900">{selectedActivityForDetails.type}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <div>
                <span className="text-neutral-500 block text-xs">Sub-County & Ward</span>
                <span className="font-semibold text-neutral-900">
                  {selectedActivityForDetails.subCounty} / {selectedActivityForDetails.ward}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block text-xs">Venue</span>
                <span className="font-semibold text-neutral-900">{selectedActivityForDetails.venue}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-xs">Date & Time</span>
                <span className="font-mono font-medium text-neutral-900">
                  {formatDate(selectedActivityForDetails.date)} at {selectedActivityForDetails.time}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block text-xs">Coordinator</span>
                <span className="font-semibold text-neutral-900">{selectedActivityForDetails.coordinator}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-xs">Target Attendance</span>
                <span className="font-mono font-bold text-neutral-900">
                  {formatNumber(selectedActivityForDetails.estimatedReach)} citizens
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block text-xs">Budget Allocated</span>
                <span className="font-mono font-bold text-neutral-900">
                  KSh {formatNumber(selectedActivityForDetails.budgetKsh)}
                </span>
              </div>
            </div>

            {selectedActivityForDetails.notes && (
              <div>
                <span className="font-semibold text-neutral-800 block mb-1">Field Intelligence & Demands</span>
                <p className="p-3 bg-neutral-50 rounded border border-neutral-200 text-neutral-700 leading-relaxed">
                  {selectedActivityForDetails.notes}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const act = selectedActivityForDetails;
                  setSelectedActivityForDetails(null);
                  onEditActivity(act);
                }}
              >
                Edit Event
              </Button>
              <Button size="sm" onClick={() => setSelectedActivityForDetails(null)}>
                Close
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
