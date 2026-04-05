import { useEffect, useState } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import { MdAdd, MdEdit } from 'react-icons/md';
import { getAllSubmissions, getCandidates, getAllVendors, createSubmission, updateSubmission } from '../services/api';
import moment from 'moment';

const STATUS_OPTIONS = ['Submitted', 'Interview Scheduled', 'Rejected', 'Selected'];

const statusClass = (s) => {
  if (s === 'Selected') return 'badge-selected';
  if (s === 'Rejected') return 'badge-rejected';
  if (s === 'Interview Scheduled') return 'badge-interview';
  return 'badge-submitted';
};

const defaultForm = {
  candidate: '', vendor: '', clientName: '',
  submissionDate: '', rate: '', status: 'Submitted'
};

const Submissions = () => {
  const [records, setRecords] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subRes, candRes, vendRes] = await Promise.all([
        getAllSubmissions({ status: filterStatus, page }),
        getCandidates({ limit: 200 }),
        getAllVendors()
      ]);
      setRecords(subRes.data.data);
      setTotal(subRes.data.total);
      setPages(subRes.data.pages);
      setCandidates(candRes.data.data);
      setVendors(vendRes.data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [filterStatus, page]);

  const openAdd = () => { setEditing(null); setForm(defaultForm); setShowModal(true); };
  const openEdit = (r) => {
    setEditing(r);
    setForm({
      ...r,
      candidate: r.candidate?._id || r.candidate,
      vendor: r.vendor?._id || r.vendor,
      submissionDate: r.submissionDate ? moment(r.submissionDate).format('YYYY-MM-DD') : '',
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await updateSubmission(editing._id, form);
      else await createSubmission(form);
      setShowModal(false); fetchData();
    } catch (e) { alert(e.response?.data?.error || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h5>Submissions</h5><p>{total} total vendor submissions</p></div>
        <button className="btn-primary-crm" onClick={openAdd}><MdAdd /> Add Submission</button>
      </div>

      <div className="crm-card mb-3">
        <select className="form-select form-select-sm" style={{ width: 200, background: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
          value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="crm-card">
        {loading ? <div className="text-center py-5"><div className="spinner-border" style={{ color: 'var(--primary)' }} /></div> : (
          <div className="table-responsive">
            <table className="crm-table">
              <thead><tr>
                <th>Candidate</th><th>Vendor</th><th>Client</th>
                <th>Date</th><th>Rate</th><th>Status</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {records.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-4" style={{ color: 'var(--text-secondary)' }}>No submissions found</td></tr>
                ) : records.map(r => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 600 }}>{r.candidate?.fullName || '—'}</td>
                    <td>
                      <div>{r.vendor?.vendorName || '—'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{r.vendor?.companyName}</div>
                    </td>
                    <td>{r.clientName}</td>
                    <td>{r.submissionDate ? moment(r.submissionDate).format('DD MMM YYYY') : '—'}</td>
                    <td>{r.rate ? `$${r.rate}/hr` : '—'}</td>
                    <td><span className={`status-badge ${statusClass(r.status)}`}>{r.status}</span></td>
                    <td><button className="btn-icon" onClick={() => openEdit(r)}><MdEdit size={15} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <div className="d-flex justify-content-center mt-3">
            <nav><ul className="pagination crm-pagination mb-0">
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                </li>
              ))}
            </ul></nav>
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton><Modal.Title>{editing ? 'Edit Submission' : 'Add Submission'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave} className="crm-form">
            <Row className="g-3">
              <Col md={6}><Form.Group><Form.Label>Candidate *</Form.Label>
                <Form.Select required value={form.candidate} onChange={e => setForm({ ...form, candidate: e.target.value })}>
                  <option value="">Select Candidate</option>
                  {candidates.map(c => <option key={c._id} value={c._id}>{c.fullName} — {c.technology}</option>)}
                </Form.Select></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Vendor *</Form.Label>
                <Form.Select required value={form.vendor} onChange={e => setForm({ ...form, vendor: e.target.value })}>
                  <option value="">Select Vendor</option>
                  {vendors.map(v => <option key={v._id} value={v._id}>{v.vendorName} — {v.companyName}</option>)}
                </Form.Select></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Client Name *</Form.Label>
                <Form.Control required value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} placeholder="Google, Amazon…" /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Submission Date</Form.Label>
                <Form.Control type="date" value={form.submissionDate} onChange={e => setForm({ ...form, submissionDate: e.target.value })} /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Rate ($/hr)</Form.Label>
                <Form.Control type="number" min={0} value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} placeholder="75" /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Status</Form.Label>
                <Form.Select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </Form.Select></Form.Group></Col>
            </Row>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button type="button" className="btn-icon px-4" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary-crm" disabled={saving}>
                {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving…</> : (editing ? 'Update' : 'Create')}
              </button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Submissions;
