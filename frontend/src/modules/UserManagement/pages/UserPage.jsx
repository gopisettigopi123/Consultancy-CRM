import React, { useEffect, useState, useMemo } from 'react';
import { getUsers, getRoles, updateUserRole, deleteUser, createUser } from '../api';
import { useAuth } from '../../../context/AuthContext';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal, { ModalBody, ModalFooter } from '../../../components/ui/Modal';
import { MdDelete, MdShield, MdPerson, MdCheck, MdEmail, MdAdd, MdLock } from 'react-icons/md';

const UserPage = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRoleId, setNewRoleId] = useState('');
    const [updating, setUpdating] = useState(false);
    
    // Create User Form State
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, rolesRes] = await Promise.all([getUsers(), getRoles()]);
            setUsers(usersRes.data.data);
            setRoles(rolesRes.data.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenRoleModal = (user) => {
        setSelectedUser(user);
        setNewRoleId(user.role?._id || '');
        setShowRoleModal(true);
    };

    const handleRoleUpdate = async () => {
        if (!newRoleId) return;
        setUpdating(true);
        try {
            await updateUserRole(selectedUser._id, newRoleId);
            setShowRoleModal(false);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Role update failed');
        } finally {
            setUpdating(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!newUser.role) return alert('Please select a role');
        setUpdating(true);
        try {
            await createUser(newUser);
            setShowCreateModal(false);
            setNewUser({ name: '', email: '', password: '', role: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'User creation failed');
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (userId === currentUser?._id) {
            return alert('You cannot delete your own account for safety reasons.');
        }
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await deleteUser(userId);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Delete failed');
        }
    };

    const columns = useMemo(() => [
        { 
            header: 'User', 
            render: (u) => (
                <div className="d-flex align-items-center">
                    <div className="avatar-placeholder me-3">
                        <MdPerson size={20} />
                    </div>
                    <div>
                        <div className="fw-bold">{u.name} {u._id === currentUser?._id && <span className="badge bg-primary-crm ms-1" style={{fontSize:'0.6rem'}}>You</span>}</div>
                        <div className="text-muted-crm" style={{ fontSize: '0.75rem' }}><MdEmail size={12} className="me-1" />{u.email}</div>
                    </div>
                </div>
            )
        },
        { 
            header: 'Role', 
            render: (u) => (
                <Badge 
                    status={u.role?.name === 'Admin' ? 'Completed' : 'Upcoming'} 
                    label={u.role?.name || 'No Role'} 
                    className={u.role?.name === 'Admin' ? 'badge-completed' : 'badge-upcoming'}
                />
            )
        },
        { 
            header: 'Permissions', 
            render: (u) => (
                <small className="text-muted-crm">
                    {u.role?.permissions?.length || 0} active permissions
                </small>
            )
        },
        {
            header: 'Actions',
            render: (u) => (
                <div className="d-flex gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleOpenRoleModal(u)} 
                        icon={<MdShield />} 
                        label="Change Role" 
                    />
                    <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => handleDeleteUser(u._id)} 
                        icon={<MdDelete />}
                        label="Delete"
                        disabled={u._id === currentUser?._id}
                        title={u._id === currentUser?._id ? "Cannot delete self" : "Delete User"}
                    />
                </div>
            )
        }
    ], [currentUser]);

    return (
        <div className="container-fluid py-4">
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>User Management</h4>
                    <p className="text-muted-crm mb-0">Assign system roles and manage user accounts.</p>
                </div>
                <Button 
                    variant="primary" 
                    icon={<MdAdd />} 
                    onClick={() => setShowCreateModal(true)} 
                    label="Create New User" 
                />
            </div>

            <div className="card-crm shadow-sm border-0 p-4">
                <Table columns={columns} data={users} loading={loading} />
            </div>

            {/* Create User Modal */}
            <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New User" size="md">
                <form onSubmit={handleCreateUser}>
                    <ModalBody>
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="form-label">Full Name</label>
                                <div className="input-group">
                                    <span className="input-group-text"><MdPerson /></span>
                                    <input type="text" className="form-control form-control-crm" required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} placeholder="Enter name" />
                                </div>
                            </div>
                            <div className="col-12">
                                <label className="form-label">Email Address</label>
                                <div className="input-group">
                                    <span className="input-group-text"><MdEmail /></span>
                                    <input type="email" className="form-control form-control-crm" required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="user@company.com" />
                                </div>
                            </div>
                            <div className="col-12">
                                <label className="form-label">Password</label>
                                <div className="input-group">
                                    <span className="input-group-text"><MdLock /></span>
                                    <input type="password" className="form-control form-control-crm" required value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} placeholder="••••••••" />
                                </div>
                            </div>
                            <div className="col-12">
                                <label className="form-label">Assigned Role</label>
                                <select 
                                    className="form-select form-select-crm" 
                                    required
                                    value={newUser.role} 
                                    onChange={e => setNewUser({...newUser, role: e.target.value})}
                                >
                                    <option value="">Select a role...</option>
                                    {roles.map(r => (
                                        <option key={r._id} value={r._id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowCreateModal(false)} label="Cancel" disabled={updating} />
                        <Button type="submit" disabled={updating} icon={<MdCheck />} label={updating ? 'Creating...' : 'Create User'} />
                    </ModalFooter>
                </form>
            </Modal>

            {/* Update Role Modal */}
            <Modal show={showRoleModal} onClose={() => setShowRoleModal(false)} title="Update User Role" size="sm">
                <ModalBody>
                    <div className="mb-4 text-center">
                        <div className="avatar-placeholder mx-auto mb-3" style={{ width: 60, height: 60 }}>
                            <MdPerson size={30} />
                        </div>
                        <h6 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>{selectedUser?.name}</h6>
                        <p className="text-muted-crm small mb-0">{selectedUser?.email}</p>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Assign Role</label>
                        <select 
                            className="form-select form-select-crm" 
                            value={newRoleId} 
                            onChange={e => setNewRoleId(e.target.value)}
                        >
                            <option value="">Select a role...</option>
                            {roles.map(r => (
                                <option key={r._id} value={r._id}>{r.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-light-crm p-3 rounded small">
                        {newRoleId && (
                            <>
                                <div className="fw-bold mb-2" style={{ color: 'var(--primary)' }}>Permissions for {roles.find(r => r._id === newRoleId)?.name}:</div>
                                <div className="d-flex flex-wrap gap-1">
                                    {roles.find(r => r._id === newRoleId)?.permissions?.map(p => (
                                        <Badge key={p._id} status="Selected" label={p.name} style={{ fontSize: '0.6rem' }} />
                                    ))}
                                </div>
                            </>
                        )}
                        {!newRoleId && <div className="text-muted-crm fst-italic">Select a role to see its permissions.</div>}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" onClick={() => setShowRoleModal(false)} label="Cancel" disabled={updating} />
                    <Button 
                        onClick={handleRoleUpdate} 
                        disabled={updating || !newRoleId} 
                        icon={<MdCheck />} 
                        label={updating ? 'Updating...' : 'Update Role'} 
                    />
                </ModalFooter>
            </Modal>

            <style>{`
                .avatar-placeholder {
                    width: 40px;
                    height: 40px;
                    background-color: var(--primary-light);
                    color: var(--primary-color);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .form-select-crm, .form-control-crm {
                    border: 1px solid #e0e0e0;
                    padding: 0.6rem;
                    border-radius: 8px;
                    font-size: 0.85rem;
                }
                .form-select-crm:focus, .form-control-crm:focus {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 0.2rem rgba(var(--primary-rgb), 0.1);
                }
                .input-group-text {
                    background-color: #f8f9fa;
                    border: 1px solid #e0e0e0;
                    border-right: none;
                    color: var(--text-secondary);
                }
                .form-control-crm {
                    border-left: none;
                }
            `}</style>
        </div>
    );
};

export default UserPage;
