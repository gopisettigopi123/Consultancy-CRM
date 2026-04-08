const express = require('express');
const router = express.Router();
const {
    getPermissions,
    createPermission,
    deletePermission,
    getRoles,
    createRole,
    updateRole,
    deleteRole,
    getUsers,
    createUser,
    updateUserRole,
    deleteUser
} = require('../controllers/userManagementController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes are protected and require Admin role
router.use(protect);
router.use(authorize('Admin'));

// Permissions
router.route('/permissions')
    .get(getPermissions)
    .post(createPermission);

router.route('/permissions/:id')
    .delete(deletePermission);

// Roles
router.route('/roles')
    .get(getRoles)
    .post(createRole);

router.route('/roles/:id')
    .put(updateRole)
    .delete(deleteRole);

// Users
router.route('/users')
    .get(getUsers)
    .post(createUser);

router.route('/users/:id')
    .delete(deleteUser);

router.route('/users/:id/role')
    .put(updateUserRole);

module.exports = router;
