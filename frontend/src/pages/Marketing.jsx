import { useEffect, useState } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import { MdAdd, MdEdit } from 'react-icons/md';
import { getAllMarketing, getCandidates, createMarketing, updateMarketing } from '../services/api';
import moment from 'moment';

const defaultForm = {
  candidate: '', marketingStartDate: '', marketingEmailId: '',
  vendorSubmissionCount: 0, notes: ''
};

const Marketing = () => {
  const [records, setRecords] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mktRes, candRes] = await Promise.all([
        getAllMarketing(),
        getCandidates({ status: 'Moved to Marketing', limit: 200 })
      ]);
      setRecords(mktRes.data.data);
      setCandidates(candRes.data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditing(null); setForm(defaultForm); setShowModal(true); };
  const openEdit = (r) => {
    setEditing(r);
    setForm({
      ...r,
      candidate: r.candidate?._id || r.candidate,
      marketingStartDate: r.marketingStartDate ? moment(r.marketingStartDate).format('YYYY-MM-DD') : '',
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await updateMarketing(editing._id, form);
      else await createMarketing(form);
      setShowModal(false); fetchData();
    } catch (e) { alert(e.response?.data?.error || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h5>Marketing</h5><p>Manage candidates in marketing pipeline</p></div>
        <button className="btn-primary-crm" onClick={openAdd}><MdAdd /> Add Marketing Record</button>
      </div>

      <div className="crm-card">
        {loading ? <div className="text-center py-5"><div className="spinner-border" style={{ color: 'var(--primary)' }} /></div> : (
          <div className="table-responsive">
            <table className="crm-table">
              <thead><tr>
                <th>Candidate</th><th>Marketing Email</th>
                <th>Start Date</th><th>Submissions</th><th>Notes</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {records.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4" style={{ color: 'var(--text-secondary)' }}>No records found</td></tr>
                ) : records.map(r => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 600 }}>{r.candidate?.fullName || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{r.marketingEmailId}</td>
                    <td>{r.marketingStartDate ? moment(r.marketingStartDate).format('DD MMM YYYY') : '—'}</td>
                    <td>
                      <span className="status-badge badge-submitted">{r.vendorSubmissionCount} submissions</span>
                    </td>
                    <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                      {r.notes || '—'}
                    </td>
                    <td><button className="btn-icon" onClick={() => openEdit(r)}><MdEdit size={15} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton><Modal.Title>{editing ? 'Edit Marketing Record' : 'Add Marketing Record'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave} className="crm-form">
            <Row className="g-3">
              <Col md={12}><Form.Group><Form.Label>Candidate *</Form.Label>
                <Form.Select required value={form.candidate} onChange={e => setForm({ ...form, candidate: e.target.value })}>
                  <option value="">Select Candidate</option>
                  {candidates.map(c => <option key={c._id} value={c._id}>{c.fullName} — {c.technology}</option>)}
                </Form.Select></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Marketing Email ID *</Form.Label>
                <Form.Control type="email" required value={form.marketingEmailId} onChange={e => setForm({ ...form, marketingEmailId: e.target.value })} placeholder="marketing@company.com" /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Marketing Start Date</Form.Label>
                <Form.Control type="date" value={form.marketingStartDate} onChange={e => setForm({ ...form, marketingStartDate: e.target.value })} /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Total Vendor Submissions</Form.Label>
                <Form.Control type="number" min={0} value={form.vendorSubmissionCount} onChange={e => setForm({ ...form, vendorSubmissionCount: e.target.value })} /></Form.Group></Col>
              <Col md={12}><Form.Group><Form.Label>Notes</Form.Label>
                <Form.Control as="textarea" rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Additional notes about marketing activities…" /></Form.Group></Col>
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

export default Marketing;
