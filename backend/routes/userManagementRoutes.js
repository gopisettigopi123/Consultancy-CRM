const express = require('express');
const router = express.Router();
const {
    getPermissions,
    createPermission,
    getRoles,
    createRole,
    updateRole,
    getUsers,
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

// Roles
router.route('/roles')
    .get(getRoles)
    .post(createRole);

router.route('/roles/:id')
    .put(updateRole);

// Users
router.route('/users')
    .get(getUsers);

router.route('/users/:id')
    .delete(deleteUser);

router.route('/users/:id/role')
    .put(updateUserRole);

module.exports = router;
