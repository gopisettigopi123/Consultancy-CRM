import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCompany } from '../../context/CompanyContext';
import { 
  MdDashboard, MdPeople, MdSchool, MdCampaign,
  MdBusiness, MdSend, MdLogout, MdExpandMore, MdChevronRight, MdQuiz,
  MdPerson, MdPayments, MdAssignmentInd, MdManageAccounts, MdSecurity, MdHistory
} from 'react-icons/md';

const navGroups = [
  { 
    label: 'Dashboard', 
    icon: <MdDashboard />, 
    to: '/', 
    permission: 'view_dashboard'
  },
  {
    category: 'Training Team',
    icon: <MdSchool />,
    permission: 'view_training',
    items: [
      { label: 'Training', to: '/training', icon: <MdSchool />, permission: 'view_training' },
      { label: 'Mock Interviews', to: '/mocks', icon: <MdQuiz />, permission: 'view_mocks' },
    ]
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
    ]
  },
  {
    category: 'HR Team',
    icon: <MdPerson />,
    permission: 'view_hr', // Planned
    items: [
      { label: 'Employees', to: '#', icon: <MdPerson /> },
      { label: 'Payroll', to: '#', icon: <MdPayments /> },
      { label: 'Attendance', to: '#', icon: <MdAssignmentInd /> },
    ]
  },
  {
    category: 'User Management',
    icon: <MdManageAccounts />,
    permission: 'manage_users',
    items: [
      { label: 'Users', to: '/users', icon: <MdPerson />, permission: 'manage_users' },
      { label: 'Permission', to: '/permissions', icon: <MdSecurity />, permission: 'manage_roles' },
    ]
  },
  {
    category: 'Admin Team',
    icon: <MdManageAccounts />,
    roles: ['Admin', 'Admin Team'],
    items: [
      { label: 'System Logs', to: '#', icon: <MdHistory /> },
    ]
  },
   {
    category: 'Account',
    icon: <MdManageAccounts />,
    roles: ['Admin', 'Admin Team'],
    items: [
      { label: 'System Logs', to: '#', icon: <MdHistory /> },
    ]
  }
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { activeCompany } = useCompany();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // State to handle collapsible groups
  const [expanded, setExpanded] = useState(() => {
    const initial = {};
    navGroups.forEach(group => {
      if (group.items) {
        const isActive = group.items.some(item => pathname === item.to);
        initial[group.category] = isActive;
      }
    });
    return initial;
  });

  const toggleGroup = (category) => {
    setExpanded(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const hasPermission = (permSlug) => {
    if (!user || !user.role) return false;
    if (user.role.name === 'Admin') return true;
    if (!user.role.permissions) return false;
    return user.role.permissions.some(p => p.slug === permSlug);
  };

  const allowedGroups = navGroups.filter(group => {
    if (group.roles && group.roles.includes(user?.role?.name)) return true;
    if (group.permission && hasPermission(group.permission)) return true;
    if (group.items && group.items.some(item => item.permission ? hasPermission(item.permission) : true)) return true;
    return false;
  });

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand d-flex align-items-center" style={{ gap: "6px" }}>
        <img
          src="\dist\assets\logo.png"
          alt="KNR Logo"
          style={{ width: "150px", height: "150px", objectFit: "contain" ,marginTop:"10px"}}
        />

        <span style={{ fontSize: "15px", color: "#aaa", lineHeight: "1" ,paddingBottom: "20px" }}>
          Recruitment Management
        </span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>
        {allowedGroups.map((group, idx) => {
          // If it's a standalone link
          if (group.to) {
            return (
              <NavLink
                key={group.to}
                to={group.to}
                end={group.to === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {group.icon}
                {group.label}
              </NavLink>
            );
          }

          // If it's a category
          const isExpanded = expanded[group.category];
          // Filter items based on permissions
          const visibleItems = group.items.filter(item => item.permission ? hasPermission(item.permission) : true);

          if (visibleItems.length === 0 && !group.roles?.includes(user?.role?.name)) return null;

          return (
            <div key={idx} className="nav-group mb-1">
              <div 
                className={`nav-link group-header ${isExpanded ? 'group-active' : ''}`}
                onClick={() => toggleGroup(group.category)}
                style={{ cursor: 'pointer', justifyContent: 'space-between' }}
              >
                <div className="d-flex align-items-center gap-2">
                  {group.icon}
                  <span>{group.category}</span>
                </div>
                {isExpanded ? <MdExpandMore size={18} /> : <MdChevronRight size={18} />}
              </div>
              
              {isExpanded && (
                <div className="nav-sub-menu">
                  {visibleItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) => `nav-link sub-link ${isActive ? 'active' : ''}`}
                    >
                      {item.icon}
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer" style={{ padding: '12px 16px' }}>
        <div className="user-badge mb-2 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)', gap: '8px' }}>
          <div className="user-avatar" style={{ width: 32, height: 32, fontSize: '0.9rem' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user?.name}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{user?.role?.name || user?.role}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn-icon d-flex align-items-center justify-content-center gap-2"
          style={{ width: '100%', borderRadius: 8, padding: '8px', fontSize: '0.85rem', background: 'transparent' }}
        >
          <MdLogout size={16} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
