import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MdLogout, MdExpandMore, MdChevronRight } from 'react-icons/md';
import { navGroups } from './sidebarConfig';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Escape key support to close Sidebar overlay
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && window.innerWidth <= 768) onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Performance Optimization: Pre-calculate permission Set
  const userPermissions = useMemo(() => {
    if (!user || user.role?.name === 'Admin') return null; // Admin bypasses set
    return new Set(user.role?.permissions?.map((p) => p.slug) || []);
  }, [user]);

  // Dynamic Menu Behavior: Expand correct group automatically on mount or route change
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    setExpanded((prev) => {
      const nextExpanded = { ...prev };
      navGroups.forEach((group) => {
        if (group.items && group.items.some((item) => pathname === item.to || pathname.startsWith(item.to + '/'))) {
          nextExpanded[group.category] = true;
        }
      });
      return nextExpanded;
    });
  }, [pathname]);

  const toggleGroup = useCallback((category) => {
    setExpanded((prev) => ({ ...prev, [category]: !prev[category] }));
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const handleMobileClose = useCallback(() => {
    if (window.innerWidth <= 768) onClose();
  }, [onClose]);

  // Refactored Access Control Logic
  const canAccess = useCallback(
    (item) => {
      if (!user) return false;
      if (user.role?.name === 'Admin') return true;

      // Group-level role override
      if (item.roles && item.roles.includes(user.role?.name)) return true;

      // Direct permission check
      if (item.permission) return userPermissions?.has(item.permission);

      // If it's a category, verify if ANY child item is accessible
      if (item.items) {
        return item.items.some((child) => child.permission ? userPermissions?.has(child.permission) : true);
      }

      return false; // Safest fallback
    },
    [user, userPermissions]
  );

  // Memoize visible groups
  const allowedGroups = useMemo(() => navGroups.filter(canAccess), [canAccess]);

  if (!user) return null; // Safety check

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <img
          src="/dist/assets/logo.png"
          alt="CRM Logo"
          className="sidebar-logo"
          onError={(e) => { e.target.src = '/logo.png'; e.target.onerror = null; }}
        />
        <span className="sidebar-subtitle">Recruitment Management</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>
        {allowedGroups.map((group) => {
          const groupKey = group.category || group.label;

          // Render standalone menu link
          if (group.to) {
            return (
              <NavLink
                key={groupKey}
                to={group.to}
                end={group.to === '/'}
                title={group.label}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={handleMobileClose}
              >
                {group.icon}
                {group.label}
              </NavLink>
            );
          }

          // Category with sub-items
          const isExpanded = expanded[group.category];
          const visibleItems = group.items.filter((item) => (item.permission ? canAccess(item) : true));

          if (visibleItems.length === 0) return null;

          return (
            <div key={groupKey} className="nav-group mb-1">
              <div
                className={`nav-link group-header ${isExpanded ? 'group-active' : ''}`}
                onClick={() => toggleGroup(group.category)}
                title={group.category}
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
                      title={item.label}
                      className={({ isActive }) => `nav-link sub-link ${isActive ? 'active' : ''}`}
                      onClick={handleMobileClose}
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

      <div className="sidebar-footer">
        <div className="user-badge mb-2 pb-2 border-bottom border-secondary-subtle gap-2">
          <div className="user-avatar" style={{ width: 32, height: 32, fontSize: '0.9rem' }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user-info cursor-pointer" title="Manage Profile" onClick={() => document.querySelector('.topbar-actions .user-badge')?.click()}>
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-role">{user.role?.name || 'User'}</div>
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
