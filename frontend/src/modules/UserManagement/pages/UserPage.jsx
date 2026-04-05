import React, { useEffect, useState, useMemo } from 'react';
import { getUsers, getRoles, updateUserRole, deleteUser } from '../api';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal, { ModalBody, ModalFooter } from '../../../components/ui/Modal';
import { MdDelete, MdShield, MdPerson, MdCheck, MdEmail } from 'react-icons/md';

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRoleId, setNewRoleId] = useState('');
    const [updating, setUpdating] = useState(false);

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

    const handleDeleteUser = async (userId) => {
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
                        <div className="fw-bold">{u.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}><MdEmail size={12} className="me-1" />{u.email}</div>
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
                    <Button variant="outline" size="sm" onClick={() => handleOpenRoleModal(u)} icon={<MdShield />}>Change Role</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteUser(u._id)} icon={<MdDelete />} />
                </div>
            )
        }
    ], []);

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h4 className="fw-bold mb-1">User Management</h4>
                <p className="text-muted-crm mb-0">Assign system roles and manage user accounts.</p>
            </div>

            <div className="card-crm shadow-sm border-0 p-4">
                <Table columns={columns} data={users} loading={loading} />
            </div>

            <Modal show={showRoleModal} onClose={() => setShowRoleModal(false)} title="Update User Role" size="sm">
                <ModalBody>
                    <div className="mb-4 text-center">
                        <div className="avatar-placeholder mx-auto mb-3" style={{ width: 60, height: 60 }}>
                            <MdPerson size={30} />
                        </div>
                        <h6 className="fw-bold mb-1">{selectedUser?.name}</h6>
                        <p className="text-muted-crm small mb-0">{selectedUser?.email}</p>
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-bold text-muted text-uppercase">Assign Role</label>
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

                    <div className="bg-light p-3 rounded small">
                        {newRoleId && (
                            <>
                                <div className="fw-bold mb-2 text-primary-crm">Permissions for {roles.find(r => r._id === newRoleId)?.name}:</div>
                                <div className="d-flex flex-wrap gap-1">
                                    {roles.find(r => r._id === newRoleId)?.permissions?.map(p => (
                                        <Badge key={p._id} status="Selected" label={p.name} style={{ fontSize: '0.6rem' }} />
                                    ))}
                                </div>
                            </>
                        )}
                        {!newRoleId && <div className="text-muted fst-italic">Select a role to see its permissions.</div>}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" onClick={() => setShowRoleModal(false)} disabled={updating}>Cancel</Button>
                    <Button onClick={handleRoleUpdate} disabled={updating || !newRoleId} icon={<MdCheck />}>
                        {updating ? 'Updating...' : 'Update Role'}
                    </Button>
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
                .form-select-crm {
                    border: 1px solid #e0e0e0;
                    padding: 0.6rem;
                    border-radius: 8px;
                    font-size: 0.85rem;
                }
                .form-select-crm:focus {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 0.2rem rgba(var(--primary-rgb), 0.1);
                }
            `}</style>
        </div>
    );
};

export default UserPage;
