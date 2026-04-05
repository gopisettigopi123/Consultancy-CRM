import API from '../../services/api';

const BASE = '/user-management';

// --- ROLES ---
export const getRoles = async () => {
    return await API.get(`${BASE}/roles`);
};

export const createRole = async (roleData) => {
    return await API.post(`${BASE}/roles`, roleData);
};

export const updateRole = async (id, roleData) => {
    return await API.put(`${BASE}/roles/${id}`, roleData);
};

// --- PERMISSIONS ---
export const getPermissions = async () => {
    return await API.get(`${BASE}/permissions`);
};

// --- USERS ---
export const getUsers = async () => {
    return await API.get(`${BASE}/users`);
};

export const updateUserRole = async (userId, roleId) => {
    return await API.put(`${BASE}/users/${userId}/role`, { role: roleId });
};

export const deleteUser = async (userId) => {
    return await API.delete(`${BASE}/users/${userId}`);
};
