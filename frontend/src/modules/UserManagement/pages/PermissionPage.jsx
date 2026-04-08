import React, { useEffect, useState, useMemo } from 'react';
import { getRoles, getPermissions, createRole, updateRole, deleteRole, deletePermission } from '../api';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal, { ModalBody, ModalFooter } from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import { MdAdd, MdEdit, MdSecurity, MdCheck, MdDelete } from 'react-icons/md';

const PermissionPage = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('roles');
    const [editingRole, setEditingRole] = useState(null);
    const [roleForm, setRoleForm] = useState({ name: '', description: '', permissions: [] });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [rolesRes, permsRes] = await Promise.all([getRoles(), getPermissions()]);
            setRoles(rolesRes.data.data);
            setPermissions(permsRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (role = null) => {
        if (role) {
            setEditingRole(role);
            setRoleForm({
                name: role.name,
                description: role.description || '',
                permissions: role.permissions.map(p => p._id)
            });
        } else {
            setEditingRole(null);
            setRoleForm({ name: '', description: '', permissions: [] });
        }
        setShowModal(true);
    };

    const handleDeleteRole = async (id) => {
        if (!window.confirm('Are you sure you want to delete this role? Users assigned to this role will lose access.')) return;
        try {
            await deleteRole(id);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Delete failed');
        }
    };

    const handleDeletePermission = async (id) => {
        if (!window.confirm('CRITICAL: Deleting a system permission will remove it from ALL roles. Are you sure?')) return;
        try {
            await deletePermission(id);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Delete failed');
        }
    };

    const handleTogglePermission = (permId) => {
        setRoleForm(prev => {
            const hasPerm = prev.permissions.includes(permId);
            if (hasPerm) {
                return { ...prev, permissions: prev.permissions.filter(id => id !== permId) };
            } else {
                return { ...prev, permissions: [...prev.permissions, permId] };
            }
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingRole) {
                await updateRole(editingRole._id, roleForm);
            } else {
                await createRole(roleForm);
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    const roleColumns = useMemo(() => [
        { header: 'Role Name', accessor: 'name', render: (r) => <div className="fw-bold text-primary">{r.name}</div> },
        { header: 'Description', accessor: 'description' },
        { 
            header: 'Permissions', 
            render: (r) => (
                <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '350px' }}>
                    {r.permissions.map(p => (
                        <Badge key={p._id} status="Selected" label={p.name} style={{ fontSize: '0.55rem', padding: '2px 6px' }} />
                    ))}
                </div>
            )
        },
        {
            header: 'Actions',
            render: (r) => (
                <div className="d-flex gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleOpenModal(r)} 
                        icon={<MdEdit />} 
                        label="Edit Role" 
                    />
                    <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => handleDeleteRole(r._id)} 
                        icon={<MdDelete />} 
                        label="Delete" 
                    />
                </div>
            )
        }
    ], []);

    const permissionColumns = useMemo(() => [
        { header: 'Module', accessor: 'module', render: (p) => <Badge status="Selected" label={p.module} /> },
        { header: 'Permission Name', accessor: 'name', render: (p) => <div className="fw-bold">{p.name}</div> },
        { header: 'Identifier (Slug)', accessor: 'slug', render: (p) => <code className="text-muted small">{p.slug}</code> },
        {
            header: 'Actions',
            render: (p) => (
                <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDeletePermission(p._id)} 
                    icon={<MdDelete />} 
                    label="Delete" 
                />
            )
        }
    ], []);

    const groupedPermissions = useMemo(() => {
        return permissions.reduce((acc, p) => {
            if (!acc[p.module]) acc[p.module] = [];
            acc[p.module].push(p);
            return acc;
        }, {});
    }, [permissions]);

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>Access Management</h4>
                    <p className="text-muted-crm mb-0">Configure system roles and granular permissions.</p>
                </div>
                {activeTab === 'roles' && (
                    <Button onClick={() => handleOpenModal()} icon={<MdAdd />} label="Create New Role" />
                )}
            </div>

            {/* Tabs */}
            <div className="d-flex gap-4 border-bottom mb-4">
                <button 
                    className={`pb-2 border-0 bg-transparent fw-bold ${activeTab === 'roles' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`}
                    onClick={() => setActiveTab('roles')}
                    style={{ transition: 'all 0.2s' }}
                >
                    System Roles ({roles.length})
                </button>
                <button 
                    className={`pb-2 border-0 bg-transparent fw-bold ${activeTab === 'perms' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`}
                    onClick={() => setActiveTab('perms')}
                    style={{ transition: 'all 0.2s' }}
                >
                    System Permissions ({permissions.length})
                </button>
            </div>

            <div className="card-crm shadow-sm border-0 p-3">
                {activeTab === 'roles' ? (
                    <Table columns={roleColumns} data={roles} loading={loading} />
                ) : (
                    <Table columns={permissionColumns} data={permissions} loading={loading} />
                )}
            </div>

            {/* Role Modal */}
            <Modal show={showModal} onClose={() => setShowModal(false)} title={editingRole ? 'Edit Role' : 'Create Role'} size="lg">
                <form onSubmit={handleSave}>
                    <ModalBody>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Role Name</label>
                                <Input 
                                    value={roleForm.name} 
                                    onChange={e => setRoleForm({ ...roleForm, name: e.target.value })} 
                                    required
                                    placeholder="e.g., Sales Manager"
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Description</label>
                                <Input 
                                    value={roleForm.description} 
                                    onChange={e => setRoleForm({ ...roleForm, description: e.target.value })} 
                                    placeholder="Briefly describe access"
                                />
                            </div>
                            <div className="col-12 mt-4">
                                <label className="form-label fw-bold mb-3 d-block border-bottom pb-2">Assign Permissions</label>
                                {Object.keys(groupedPermissions).map(module => (
                                    <div key={module} className="mb-3">
                                        <div className="text-muted-crm small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>
                                            {module}
                                        </div>
                                        <div className="row g-2">
                                            {groupedPermissions[module].map(p => {
                                                const isSelected = roleForm.permissions.includes(p._id);
                                                return (
                                                    <div key={p._id} className="col-md-3 col-sm-6">
                                                        <div 
                                                            className={`p-2 border rounded d-flex align-items-center justify-content-between cursor-pointer permission-item-compact ${isSelected ? 'border-primary bg-light-crm' : ''}`}
                                                            onClick={() => handleTogglePermission(p._id)}
                                                            style={{ 
                                                                transition: 'all 0.15s', 
                                                                height: '100%',
                                                                borderColor: 'var(--border-color)',
                                                                backgroundColor: isSelected ? 'var(--sidebar-hover-bg)' : 'transparent'
                                                            }}
                                                        >
                                                            <div className="pe-2">
                                                                <div className="fw-bold text-truncate" style={{ fontSize: '0.7rem', maxWidth: '120px' }} title={p.name}>{p.name}</div>
                                                                <div className="text-muted" style={{ fontSize: '0.6rem' }}>{p.slug}</div>
                                                            </div>
                                                            {isSelected && <MdCheck className="text-success" size={12} />}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowModal(false)} label="Cancel" disabled={saving} />
                        <Button type="submit" disabled={saving} label={saving ? 'Saving...' : 'Save Role'} />
                    </ModalFooter>
                </form>
            </Modal>

            <style>{`
                .permission-item-compact:hover {
                    border-color: var(--primary-color) !important;
                    background-color: #f0f7ff !important;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                .cursor-pointer { cursor: pointer; }
                .border-bottom { border-bottom: 1px solid var(--border-color) !important; }
            `}</style>
        </div>
    );
};

export default PermissionPage;
