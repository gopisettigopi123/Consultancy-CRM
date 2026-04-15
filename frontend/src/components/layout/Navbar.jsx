import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCompany } from '../../context/CompanyContext';
import { MdNotifications, MdBusiness, MdMenu, MdLightMode, MdDarkMode, MdCorporateFare } from 'react-icons/md';
import ProfileModal from '../ui/ProfileModal';

const pageTitles = {
  '/': 'Dashboard',
  '/candidates': 'Candidates',
  '/training': 'Training',
  '/mocks': 'Mock Interviews',
  '/marketing': 'Marketing',
  '/vendors': 'Vendors',
  '/submissions': 'Submissions',
  '/users': 'User Management',
  '/permissions': 'Roles & Permissions',
};

const Navbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { activeCompany, setActiveCompany, companies } = useCompany();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Not Found';
  const [showProfile, setShowProfile] = useState(false);

  const toggleTheme = () => {
    const nextTheme = {
        'light': 'dark',
        'dark': 'corporate',
        'corporate': 'light'
    }[theme] || 'light';
    setTheme(nextTheme);
  };

  const ThemeIcon = {
      'light': <MdLightMode size={20} color="#f59e0b" />,
      'dark': <MdDarkMode size={20} color="#8b5cf6" />,
      'corporate': <MdCorporateFare size={20} color="#3b82f6" />
  }[theme] || <MdLightMode size={20} />;

  return (
    <header className="topbar">
      <div className="d-flex align-items-center gap-2">
        <button className="btn-icon hamburger-btn" onClick={onToggleSidebar} title="Toggle Menu">
          <MdMenu size={22} />
        </button>
        <div className="topbar-title">{title}</div>
      </div>
      <div className="topbar-actions">
        {/* Company Switcher */}
        <div className="d-flex align-items-center gap-2 me-0 pe-3 border-end border-secondary-subtle">
          <MdBusiness size={20} color="var(--primary)" />
          <select
            className="form-select form-select-sm fw-bold"
            style={{
              width: '100px',
              background: 'var(--bg-dark)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
            value={activeCompany}
            onChange={(e) => setActiveCompany(e.target.value)}
          >
            {companies.map(c => (
              <option key={c} value={c} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>{c}</option>
            ))}
          </select>
        </div>

        {/* Theme Switcher Toggle */}
        <button 
          className="btn-icon" 
          onClick={toggleTheme} 
          title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)} (Click to change)`}
          style={{ position: 'relative' }}
        >
          {ThemeIcon}
        </button>

        <button className="btn-icon" title="View Notifications" style={{ position: 'relative' }}>
          <MdNotifications size={20} />
          <span className="notification-badge">3</span>
        </button>
        <div 
            className="user-badge" 
            style={{ cursor: 'pointer', padding: '4px' }} 
            onClick={() => setShowProfile(true)}
            title="Manage Profile & Settings"
        >
          <div className="user-avatar" title="Online">
            {user?.name?.charAt(0).toUpperCase()}
            <span className="online-dot" />
          </div>
          <div className="user-info">
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</div>
            <small>{user?.role?.name || user?.role}</small>
          </div>
        </div>
      </div>

      <ProfileModal show={showProfile} onClose={() => setShowProfile(false)} />
    </header>
  );
};

export default Navbar;
