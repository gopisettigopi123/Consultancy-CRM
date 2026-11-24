/**
 * Evaluates whether the authenticated user has access based on role or permission slugs.
 * Supports Admin bypass, role-name arrays, a single permission slug, or an array of permission slugs (any match).
 */
export const hasAccess = (user, { roles, permission, permissions } = {}) => {
  if (!user) return false;

  const roleName = user.role?.name || user.role;
  if (roleName === 'Admin') return true;

  if (roles && !roles.includes(roleName)) {
    return false;
  }

  const userSlugs = new Set(user.role?.permissions?.map((p) => p.slug) || []);

  if (permission && !userSlugs.has(permission)) {
    return false;
  }

  if (permissions && permissions.length > 0) {
    const hasAny = permissions.some((slug) => userSlugs.has(slug));
    if (!hasAny) return false;
  }

  return true;
};

const ROUTE_PRIORITY = [
  { path: '/', label: 'Dashboard', permissions: ['view_dashboard'] },
  { path: '/candidates', label: 'Candidates', permissions: ['view_candidates', 'manage_candidates'] },
  { path: '/marketing', label: 'Marketing', permissions: ['view_marketing', 'manage_marketing'] },
  { path: '/vendors', label: 'Vendors', permissions: ['view_vendors', 'manage_vendors'] },
  { path: '/submissions', label: 'Submissions', permissions: ['view_submissions', 'manage_submissions'] },
  { path: '/training', label: 'Training', permissions: ['view_training', 'manage_training'] },
  { path: '/mocks', label: 'Mock Interviews', permissions: ['view_mocks', 'manage_mocks'] },
  { path: '/employees', label: 'HR Portal', permissions: ['view_hr', 'manage_hr'] },
  { path: '/balance', label: 'Finance', permissions: ['view_finance', 'manage_finance'] },
  { path: '/users', label: 'User Management', permissions: ['manage_users'] },
  { path: '/permissions', label: 'Permissions', permissions: ['manage_roles'] },
  { path: '/system-logs', label: 'System Logs', permissions: ['view_logs'] },
];

/**
 * Returns the first route the current user is permitted to access,
 * preventing redirect loops when a user lacks Dashboard permission.
 */
export const getFirstAccessibleRoute = (user) => {
  if (!user) return { path: '/login', label: 'Login', isDashboard: false };

  for (const route of ROUTE_PRIORITY) {
    if (hasAccess(user, { permissions: route.permissions })) {
      return {
        path: route.path,
        label: route.label,
        isDashboard: route.path === '/',
      };
    }
  }

  return { path: '/login', label: 'Login', isDashboard: false };
};
