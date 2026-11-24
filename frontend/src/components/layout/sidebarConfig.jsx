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
    permissions: ['view_dashboard'],
  },
  {
    category: 'Training Team',
    icon: <MdSchool />,
    items: [
      { label: 'Training', to: '/training', icon: <MdSchool />, permissions: ['view_training', 'manage_training'] },
      { label: 'Mock Interviews', to: '/mocks', icon: <MdQuiz />, permissions: ['view_mocks', 'manage_mocks'] },
    ],
  },
  {
    category: 'Marketing Team',
    icon: <MdCampaign />,
    items: [
      { label: 'Candidates', to: '/candidates', icon: <MdPeople />, permissions: ['view_candidates', 'manage_candidates'] },
      { label: 'Vendors', to: '/vendors', icon: <MdBusiness />, permissions: ['view_vendors', 'manage_vendors'] },
      { label: 'Marketing', to: '/marketing', icon: <MdCampaign />, permissions: ['view_marketing', 'manage_marketing'] },
      { label: 'Submissions', to: '/submissions', icon: <MdSend />, permissions: ['view_submissions', 'manage_submissions'] },
    ],
  },
  {
    category: 'HR Team',
    icon: <MdPerson />,
    items: [
      { label: 'Employees', to: '/employees', icon: <MdPeople />, permissions: ['view_hr', 'manage_hr'] },
      { label: 'Payroll', to: '/payroll', icon: <MdPayments />, permissions: ['view_hr', 'manage_hr'] },
      { label: 'Attendance', to: '/attendance', icon: <MdAssignmentInd />, permissions: ['view_hr', 'manage_hr'] },
    ],
  },
  {
    category: 'User Management',
    icon: <MdManageAccounts />,
    items: [
      { label: 'Users', to: '/users', icon: <MdPerson />, permissions: ['manage_users'] },
      { label: 'Permission', to: '/permissions', icon: <MdSecurity />, permissions: ['manage_roles'] },
    ],
  },
  {
    category: 'Admin Team',
    icon: <MdSecurity />,
    items: [
      { label: 'System Logs', to: '/system-logs', icon: <MdHistory />, permissions: ['view_logs'] },
    ],
  },
  {
    category: 'Account',
    icon: <MdPayments />,
    items: [
      { label: 'Finance Details', to: '/balance', icon: <MdAccountBalance />, permissions: ['view_finance', 'manage_finance'] },
    ],
  },
];
