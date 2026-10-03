export type PageTab = 
  | 'dashboard' 
  | 'activities' 
  | 'tasks' 
  | 'community-issues' 
  | 'user-management' 
  | 'team';

export type ActivityType = 
  | 'Town Hall' 
  | 'Rally' 
  | 'Door-to-Door' 
  | 'Market Walkabout' 
  | 'Youth Forum' 
  | 'Women Group Meet' 
  | 'Stakeholder Roundtable' 
  | 'Church Visit';

export type ActivityStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Postponed';

export interface CampaignActivity {
  id: string;
  title: string;
  type: ActivityType;
  subCounty: string;
  ward: string;
  venue: string;
  date: string;
  time: string;
  coordinator: string;
  estimatedReach: number;
  actualTurnout?: number;
  budgetKsh: number;
  status: ActivityStatus;
  notes?: string;
  createdAt: string;
}

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export type TaskCategory = 
  | 'Logistics & Sound' 
  | 'Communications & Media' 
  | 'Grassroots Mobilization' 
  | 'Security & Permits' 
  | 'Manifesto & Policy' 
  | 'Volunteer Coordination'
  | 'Voter Outreach';

export interface CampaignTask {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  category: TaskCategory;
  assignee: string;
  subCounty: string;
  ward?: string;
  dueDate: string;
  status: TaskStatus;
  createdAt: string;
}

export type IssueSeverity = 'Critical' | 'Moderate' | 'Low';
export type IssueStatus = 'Open' | 'Investigating' | 'Manifesto Priority' | 'Resolved';
export type IssueCategory = 
  | 'Water & Sanitation' 
  | 'Feeder Roads & Bridges' 
  | 'Healthcare & Dispensaries' 
  | 'Education & Bursaries' 
  | 'Agriculture & Markets' 
  | 'Youth Employment' 
  | 'Security & Solar Lighting';

export interface CommunityIssue {
  id: string;
  title: string;
  category: IssueCategory;
  subCounty: string;
  ward: string;
  reportedBy: string;
  reportedPhone?: string;
  reportedDate: string;
  severity: IssueSeverity;
  status: IssueStatus;
  description: string;
  proposedAction: string;
  resolutionNotes?: string;
}

export type UserRole = 
  | 'Campaign Manager' 
  | 'Sub-County Director' 
  | 'Field Mobilizer' 
  | 'Communications Lead' 
  | 'Logistics Coordinator' 
  | 'Volunteer Supervisor';

export interface CampaignUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  subCounty: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
  permissions: string[];
}

export interface TeamMember {
  id: string;
  fullName: string;
  roleTitle: string;
  category: 'Sub-County Leads' | 'Ward Coordinators' | 'Youth League' | 'Women League' | 'Special Interest Groups';
  subCounty: string;
  ward: string;
  phone: string;
  volunteersLed: number;
  keyFocus: string;
  joinedDate: string;
  status: 'Active' | 'Standby';
}

export interface CountyInfo {
  name: string;
  slogan: string;
  subCounties: {
    name: string;
    wards: string[];
    voterTarget: number;
  }[];
}
