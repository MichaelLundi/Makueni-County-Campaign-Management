import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { 
  CheckCircle2, 
  RotateCcw, 
  Smartphone, 
  Monitor, 
  Calendar, 
  CheckSquare, 
  AlertCircle, 
  Users, 
  ShieldCheck 
} from 'lucide-react';

interface TestingGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResetData: () => void;
}

export function TestingGuideModal({ open, onOpenChange, onResetData }: TestingGuideModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="How to Test County Campaign Manager"
      description="Quick interactive verification guide for all modules on mobile and desktop."
    >
      <div className="space-y-5 text-sm text-neutral-700 max-h-[70vh] overflow-y-auto pr-1">
        {/* Device Switcher tip */}
        <div className="rounded-lg bg-emerald-50/80 border border-emerald-200/80 p-3.5 flex items-start gap-3">
          <Smartphone className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-emerald-950 text-xs uppercase tracking-wider">
              Mobile & Desktop Testing
            </h4>
            <p className="text-xs text-emerald-900 mt-1">
              On mobile viewports (or your browser&apos;s device toolbar in DevTools <code>Cmd+Option+I</code> / <code>Ctrl+Shift+I</code>), 
              the app activates a bottom navigation bar and touch-friendly header menu with 44px+ touch targets. On desktop, it expands to a full command sidebar with dense data tables.
            </p>
          </div>
        </div>

        {/* Step-by-step tests */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-900 text-white font-mono text-xs font-bold shrink-0">
              1
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-700" />
                <h4 className="font-semibold text-neutral-900">Test Dashboard & Quick Actions</h4>
              </div>
              <p className="text-xs text-neutral-600 mt-1">
                Explore the mobilization metrics (voter outreach, completed rallies, urgent community issues, pending tasks). 
                Click any of the quick action buttons: <strong>+ Log Activity</strong> or <strong>+ Report Issue</strong> to open live forms directly from the dashboard.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-900 text-white font-mono text-xs font-bold shrink-0">
              2
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-700" />
                <h4 className="font-semibold text-neutral-900">Test Activities Page</h4>
              </div>
              <p className="text-xs text-neutral-600 mt-1">
                Navigate to <strong>Activities</strong>. Filter events by sub-county (e.g., <em>Makueni</em> or <em>Kibwezi West</em>) or by event type. 
                Click <strong>+ Log New Activity</strong> to create a campaign rally or town hall. Edit an activity or change its status to <em>Completed</em> or <em>In Progress</em>.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-900 text-white font-mono text-xs font-bold shrink-0">
              3
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-emerald-700" />
                <h4 className="font-semibold text-neutral-900">Test Tasks Management</h4>
              </div>
              <p className="text-xs text-neutral-600 mt-1">
                Switch to <strong>Tasks</strong>. Click checkboxes to mark logistics, media, or permit tasks as <em>Done</em>. 
                Filter by priority (High / Medium / Low). Add a new task assigned to an officer with a due date.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-900 text-white font-mono text-xs font-bold shrink-0">
              4
            </div>
            <div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-emerald-700" />
                <h4 className="font-semibold text-neutral-900">Test Community Issues</h4>
              </div>
              <p className="text-xs text-neutral-600 mt-1">
                Click <strong>Community Issues</strong> to inspect citizen grievances logged across wards (water boreholes, feeder roads, dispensary drug stockouts). 
                Click <strong>+ Report Issue</strong> to log a local problem, or click status dropdowns to escalate an issue to <em>Manifesto Priority</em> or <em>Resolved</em>.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-900 text-white font-mono text-xs font-bold shrink-0">
              5
            </div>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                <h4 className="font-semibold text-neutral-900">Test User Management & Team Directory</h4>
              </div>
              <p className="text-xs text-neutral-600 mt-1">
                On <strong>User Management</strong>, toggle coordinator access (Active / Inactive) and add staff. 
                On <strong>Team</strong>, view grassroots field mobilizers, volunteer counts, and ward captain contacts.
              </p>
            </div>
          </div>
        </div>

        {/* Data Persistence & Reset */}
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              <span className="font-semibold text-neutral-900 text-xs">Local Data Persistence</span>
            </div>
            <span className="text-[11px] text-neutral-500 font-mono">browser localStorage</span>
          </div>
          <p className="text-xs text-neutral-600">
            All additions and modifications are saved to your browser so they remain intact when refreshing. 
            You can restore the pristine sample dataset anytime by clicking below.
          </p>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => {
              onResetData();
              onOpenChange(false);
            }}
            className="w-full gap-2 text-neutral-700 border-neutral-300 hover:bg-neutral-100"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset All Sample Data to Default
          </Button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <Monitor className="h-3.5 w-3.5" />
            <span>Responsive Layout</span>
          </div>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Start Testing
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
