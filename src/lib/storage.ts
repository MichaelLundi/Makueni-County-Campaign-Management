import { 
  CampaignActivity, 
  CampaignTask, 
  CommunityIssue, 
  CampaignUser, 
  TeamMember,
  CountyInfo
} from '../types/campaign';
import { 
  INITIAL_ACTIVITIES, 
  INITIAL_TASKS, 
  INITIAL_ISSUES, 
  INITIAL_USERS, 
  INITIAL_TEAM,
  INITIAL_COUNTY_INFO
} from '../data/mockData';

const STORAGE_KEYS = {
  ACTIVITIES: 'county_camp_activities_v1',
  TASKS: 'county_camp_tasks_v1',
  ISSUES: 'county_camp_issues_v1',
  USERS: 'county_camp_users_v1',
  TEAM: 'county_camp_team_v1',
  COUNTY: 'county_camp_info_v1',
};

export const getStoredCountyInfo = (): CountyInfo => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COUNTY);
    return raw ? JSON.parse(raw) : INITIAL_COUNTY_INFO;
  } catch {
    return INITIAL_COUNTY_INFO;
  }
};

export const getStoredActivities = (): CampaignActivity[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return raw ? JSON.parse(raw) : INITIAL_ACTIVITIES;
  } catch {
    return INITIAL_ACTIVITIES;
  }
};

export const saveActivities = (data: CampaignActivity[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(data));
  } catch (e) {
    console.error('Storage save error:', e);
  }
};

export const getStoredTasks = (): CampaignTask[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    return raw ? JSON.parse(raw) : INITIAL_TASKS;
  } catch {
    return INITIAL_TASKS;
  }
};

export const saveTasks = (data: CampaignTask[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(data));
  } catch (e) {
    console.error('Storage save error:', e);
  }
};

export const getStoredIssues = (): CommunityIssue[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ISSUES);
    return raw ? JSON.parse(raw) : INITIAL_ISSUES;
  } catch {
    return INITIAL_ISSUES;
  }
};

export const saveIssues = (data: CommunityIssue[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(data));
  } catch (e) {
    console.error('Storage save error:', e);
  }
};

export const getStoredUsers = (): CampaignUser[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
};

export const saveUsers = (data: CampaignUser[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data));
  } catch (e) {
    console.error('Storage save error:', e);
  }
};

export const getStoredTeam = (): TeamMember[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEAM);
    return raw ? JSON.parse(raw) : INITIAL_TEAM;
  } catch {
    return INITIAL_TEAM;
  }
};

export const saveTeam = (data: TeamMember[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(data));
  } catch (e) {
    console.error('Storage save error:', e);
  }
};

export const resetAllDataToDefault = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.ISSUES);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.TEAM);
    localStorage.removeItem(STORAGE_KEYS.COUNTY);
  } catch (e) {
    console.error('Reset error:', e);
  }
};
