import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCompany } from '../../context/CompanyContext';
import { MdNotifications, MdPalette, MdBusiness, MdMenu } from 'react-icons/md';

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
  const title = pageTitles[location.pathname] || 'CRM Pro';

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

        {/* Theme Switcher */}
        <div className="d-flex align-items-center gap-2 me-2">
          <MdPalette size={18} color="var(--text-secondary)" />
          <select
            className="form-select form-select-sm"
            style={{ width: '110px', background: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="dark">Dark 🌙</option>
            <option value="light">Light 🌞</option>
            <option value="corporate">Corp 🏢</option>
          </select>
        </div>

        <button className="btn-icon" title="Notifications">
          <MdNotifications size={18} />
        </button>
        <div className="user-badge">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</div>
            <small>{user?.role?.name || user?.role}</small>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
