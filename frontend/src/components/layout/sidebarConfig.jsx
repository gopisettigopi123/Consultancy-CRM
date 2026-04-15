import {
  MdDashboard,
  MdSchool,
  MdQuiz,
  MdPeople,
  MdBusiness,
  MdCampaign,
  MdSend,
  MdPerson,
  MdPayments,
  MdAssignmentInd,
  MdManageAccounts,
  MdSecurity,
  MdHistory,
  MdAccountBalance,
} from 'react-icons/md';

export const navGroups = [
  {
    label: 'Dashboard',
    icon: <MdDashboard />,
    to: '/',
    permission: 'view_dashboard',
  },
  {
    category: 'Training Team',
    icon: <MdSchool />,
    permission: 'view_training',
    items: [
      { label: 'Training', to: '/training', icon: <MdSchool />, permission: 'view_training' },
      { label: 'Mock Interviews', to: '/mocks', icon: <MdQuiz />, permission: 'view_mocks' },
    ],
  },
  {
    category: 'Marketing Team',
    icon: <MdCampaign />,
    permission: 'view_candidates',
    items: [
      { label: 'Candidates', to: '/candidates', icon: <MdPeople />, permission: 'view_candidates' },
      { label: 'Vendors', to: '/vendors', icon: <MdBusiness />, permission: 'view_vendors' },
      { label: 'Marketing', to: '/marketing', icon: <MdCampaign />, permission: 'view_marketing' },
      { label: 'Submissions', to: '/submissions', icon: <MdSend />, permission: 'view_submissions' },
    ],
  },
  {
    category: 'HR Team',
    icon: <MdPerson />,
    permission: 'view_hr',
    items: [
      { label: 'Employees', to: '/employees', icon: <MdPeople /> },
      { label: 'Payroll', to: '/payroll', icon: <MdPayments /> },
      { label: 'Attendance', to: '/attendance', icon: <MdAssignmentInd /> },
    ],
  },
  {
    category: 'User Management',
    icon: <MdManageAccounts />,
    permission: 'manage_users',
    items: [
      { label: 'Users', to: '/users', icon: <MdPerson />, permission: 'manage_users' },
      { label: 'Permission', to: '/permissions', icon: <MdSecurity />, permission: 'manage_roles' },
    ],
  },
  {
    category: 'Admin Team',
    icon: <MdSecurity />,
    roles: ['Admin', 'Admin Team'],
    items: [
      { label: 'System Logs', to: '/system-logs', icon: <MdHistory /> },
    ],
  },
  {
    category: 'Account',
    icon: <MdPayments />,
    roles: ['Admin', 'Account'],
    items: [
      { label: 'Finance Details', to: '/balance', icon: <MdAccountBalance /> },
    ],
  },
];
