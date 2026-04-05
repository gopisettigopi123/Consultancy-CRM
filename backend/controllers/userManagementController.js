const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

// --- PERMISSIONS ---

// @desc    Get all permissions
// @route   GET /api/user-management/permissions
// @access  Private/Admin
exports.getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.json({ success: true, data: permissions });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Create new permission
// @route   POST /api/user-management/permissions
// @access  Private/Admin
exports.createPermission = async (req, res) => {
    try {
        const permission = await Permission.create(req.body);
        res.status(201).json({ success: true, data: permission });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// --- ROLES ---

// @desc    Get all roles
// @route   GET /api/user-management/roles
// @access  Private/Admin
exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find().populate('permissions');
        res.json({ success: true, data: roles });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Create new role
// @route   POST /api/user-management/roles
// @access  Private/Admin
exports.createRole = async (req, res) => {
    try {
        const { name, permissions, description } = req.body;
        const role = await Role.create({ name, permissions, description });
        res.status(201).json({ success: true, data: role });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update role
// @route   PUT /api/user-management/roles/:id
// @access  Private/Admin
exports.updateRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('permissions');
        
        if (!role) {
            return res.status(404).json({ success: false, error: 'Role not found' });
        }
        res.json({ success: true, data: role });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// --- USERS ---

// @desc    Get all users with roles
// @route   GET /api/user-management/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().populate({
            path: 'role',
            populate: { path: 'permissions' }
        });
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update user role
// @route   PUT /api/user-management/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, {
            new: true,
            runValidators: true
        }).populate({
            path: 'role',
            populate: { path: 'permissions' }
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/user-management/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
