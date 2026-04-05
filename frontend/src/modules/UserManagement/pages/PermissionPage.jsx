import React, { useEffect, useState, useMemo } from 'react';
import { getRoles, getPermissions, createRole, updateRole } from '../api';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal, { ModalBody, ModalFooter } from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import { MdAdd, MdEdit, MdSecurity, MdCheck, MdClose } from 'react-icons/md';

const PermissionPage = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
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

    const columns = useMemo(() => [
        { header: 'Role Name', accessor: 'name', render: (r) => <div className="fw-bold text-primary">{r.name}</div> },
        { header: 'Description', accessor: 'description' },
        { 
            header: 'Permissions', 
            render: (r) => (
                <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '400px' }}>
                    {r.permissions.map(p => (
                        <Badge key={p._id} status="Selected" label={p.name} style={{ fontSize: '0.65rem' }} />
                    ))}
                </div>
            )
        },
        {
            header: 'Actions',
            render: (r) => (
                <Button variant="outline" size="sm" onClick={() => handleOpenModal(r)} icon={<MdEdit />}>
                    Edit Role
                </Button>
            )
        }
    ], []);

    // Group permissions by module for better UI
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
                    <h4 className="fw-bold mb-1">Roles & Permissions</h4>
                    <p className="text-muted-crm mb-0">Define system roles and assign granular access rights.</p>
                </div>
                <Button onClick={() => handleOpenModal()} icon={<MdAdd />}>Create New Role</Button>
            </div>

            <div className="card-crm shadow-sm border-0 p-4">
                <Table columns={columns} data={roles} loading={loading} />
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)} title={editingRole ? 'Edit Role' : 'Create Role'} size="lg">
                <form onSubmit={handleSave}>
                    <ModalBody>
                        <div className="row g-3">
                            <div className="col-12">
                                <Input 
                                    label="Role Name" 
                                    value={roleForm.name} 
                                    onChange={e => setRoleForm({ ...roleForm, name: e.target.value })} 
                                    required
                                    placeholder="e.g., Sales Manager"
                                />
                            </div>
                            <div className="col-12">
                                <Input 
                                    label="Description" 
                                    value={roleForm.description} 
                                    onChange={e => setRoleForm({ ...roleForm, description: e.target.value })} 
                                    placeholder="Briefly describe what this role does"
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-bold mb-3 d-block">Assign Permissions</label>
                                {Object.keys(groupedPermissions).map(module => (
                                    <div key={module} className="mb-4">
                                        <h6 className="text-primary-crm border-bottom pb-2 mb-3" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            {module}
                                        </h6>
                                        <div className="row g-2">
                                            {groupedPermissions[module].map(p => {
                                                const isSelected = roleForm.permissions.includes(p._id);
                                                return (
                                                    <div key={p._id} className="col-md-4 col-sm-6">
                                                        <div 
                                                            className={`p-2 border rounded d-flex align-items-center justify-content-between cursor-pointer permission-item ${isSelected ? 'border-primary bg-light' : 'bg-white'}`}
                                                            onClick={() => handleTogglePermission(p._id)}
                                                            style={{ transition: 'all 0.2s' }}
                                                        >
                                                            <div style={{ fontSize: '0.8rem' }}>
                                                                <div className="fw-bold">{p.name}</div>
                                                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>{p.slug}</div>
                                                            </div>
                                                            {isSelected ? <MdCheck className="text-success" /> : <div style={{ width: 16 }}></div>}
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
                        <Button variant="outline" onClick={() => setShowModal(false)} disabled={saving}>Cancel</Button>
                        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Role'}</Button>
                    </ModalFooter>
                </form>
            </Modal>

            <style>{`
                .permission-item:hover {
                    border-color: var(--primary-color) !important;
                    background-color: var(--primary-light) !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                }
                .cursor-pointer {
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default PermissionPage;
