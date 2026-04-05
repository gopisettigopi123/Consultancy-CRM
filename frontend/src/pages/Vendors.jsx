import { useEffect, useState, useMemo } from 'react';
import { Form, Row } from 'react-bootstrap';
import { MdAdd, MdEdit, MdDelete, MdSearch } from 'react-icons/md';
import { getAllVendors, createVendor, updateVendor, deleteVendor } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal, { ModalBody, ModalFooter } from '../components/ui/Modal';

const defaultForm = {
  vendorName: '', technology: '', location: '',
  rate: '', vendorCompany: '', email: '', client: ''
};

const Vendors = () => {
  const { user } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  
  // No pagination defined in API currently, but Table supports page/pages visually
  const [page, setPage] = useState(1);
  const pages = 1;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getAllVendors({ search: debouncedSearch });
      setVendors(data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [debouncedSearch]);

  const openAdd = () => { setEditing(null); setForm(defaultForm); setShowModal(true); };
  const openEdit = (v) => {
    setEditing(v);
    setForm(v);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await updateVendor(editing._id, form);
      else await createVendor(form);
      setShowModal(false); fetchData();
    } catch (e) { alert(e.response?.data?.error || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vendor?')) return;
    await deleteVendor(id); fetchData();
  };

  const columns = useMemo(() => [
    { header: 'Vendor Name', render: (v) => (<div style={{fontWeight:600}}>{v.vendorName}</div>) },
    { header: 'Vendor Company', accessor: 'vendorCompany' },
    { header: 'Technology', accessor: 'technology' },
    { header: 'Location', render: (v) => <span className="status-badge badge-mock">{v.location || '—'}</span> },
    { header: 'Rate', render: (v) => <span style={{fontWeight:600, color:'var(--success)'}}>{v.rate || '—'}</span> },
    { header: 'Email', render: (v) => <span style={{color:'var(--text-secondary)'}}>{v.email}</span> },
    { header: 'Client', accessor: 'client' },
    { header: 'Actions', render: (v) => (
      <div className="d-flex gap-1 align-items-center">
        <Button variant="icon" onClick={() => openEdit(v)} icon={<MdEdit size={15} />} />
        {(user?.role?.name || user?.role) === 'Admin' && (
          <Button variant="icon-danger" onClick={() => handleDelete(v._id)} icon={<MdDelete size={15} />} />
        )}
      </div>
    )}
  ], [user]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h5>Vendors</h5>
          <p>
            {loading ? 'Calculating...' : (
              debouncedSearch 
                ? `Found ${vendors.length} vendor${vendors.length !== 1 ? 's' : ''} matching "${debouncedSearch}"`
                : `${vendors.length} total vendors in system`
            )}
          </p>
        </div>
        <Button onClick={openAdd} variant="primary" icon={<MdAdd />} label="Add Vendor" />
      </div>

      <div className="crm-card mb-3">
        <div className="search-wrapper">
          <MdSearch className="search-icon" />
          <input placeholder="Search vendors or companies…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="crm-card">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" style={{ color: 'var(--primary)' }} /></div>
        ) : (
          <Table columns={columns} data={vendors} page={page} pages={pages} setPage={setPage} />
        )}
      </div>

      <Modal show={showModal} title={editing ? 'Edit Vendor' : 'Add Vendor'} onClose={() => setShowModal(false)}>
        <Form onSubmit={handleSave} className="crm-form">
          <ModalBody>
            <Row className="g-3">
              <Input colMd={6} label="Vendor Name" required value={form.vendorName} onChange={e => setForm({ ...form, vendorName: e.target.value })} placeholder="Jane Smith" />
              <Input colMd={6} label="Vendor Company" required value={form.vendorCompany} onChange={e => setForm({ ...form, vendorCompany: e.target.value })} placeholder="Tech Corp Inc." />
              <Input colMd={6} label="Email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="vendor@company.com" />
              <Input colMd={6} label="Technology" value={form.technology} onChange={e => setForm({ ...form, technology: e.target.value })} placeholder="e.g. Java, Python" />
              <Input colMd={6} label="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="New York, NY" />
              <Input colMd={6} label="Rate" value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} placeholder="$50/hr" />
              <Input colMd={12} label="Client" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} placeholder="Client Name" />
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" className="btn-icon px-4" onClick={() => setShowModal(false)} label="Cancel" />
            <Button type="submit" variant="primary" loading={saving} label={editing ? 'Update' : 'Create'} />
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
};

export default Vendors;
