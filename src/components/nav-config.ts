import {
  Bot,
  Brain,
  Building,
  Calendar,
  CheckCircle,
  File,
  FileText,
  Folder,
  Home,
  MessageSquare,
  Settings,
  Terminal,
  Users,
} from 'lucide-react';

export const moduleGroups = [
  {
    name: 'Mission Control',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: Home, path: '/' },
    ],
  },
  {
    name: 'Operations',
    modules: [
      { id: 'tasks', name: 'Tasks', icon: Terminal, path: '/tasks' },
      { id: 'content', name: 'Content', icon: FileText, path: '/content' },
      { id: 'agents', name: 'Agents', icon: Bot, path: '/agents' },
      { id: 'approvals', name: 'Approvals', icon: CheckCircle, path: '/approvals' },
      { id: 'memory', name: 'Memory', icon: Brain, path: '/memory' },
    ],
  },
  {
    name: 'Coordination',
    modules: [
      { id: 'calendar', name: 'Calendar', icon: Calendar, path: '/calendar' },
      { id: 'projects', name: 'Projects', icon: Folder, path: '/projects' },
      { id: 'docs', name: 'Docs', icon: File, path: '/docs' },
    ],
  },
  {
    name: 'Organization',
    modules: [
      { id: 'team', name: 'Team', icon: Users, path: '/team' },
      { id: 'office', name: 'Office', icon: Building, path: '/office' },
      { id: 'system', name: 'System', icon: Settings, path: '/system' },
      { id: 'feedback', name: 'Feedback', icon: MessageSquare, path: '/feedback' },
    ],
  },
];
