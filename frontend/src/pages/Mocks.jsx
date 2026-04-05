import { useEffect, useState } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import { MdAdd, MdEdit } from 'react-icons/md';
import { getAllMocks, getCandidates, createMock, updateMock } from '../services/api';
import moment from 'moment';

const defaultForm = {
  candidate: '', mockType: 'Technical', score: '',
  feedback: '', date: '', status: 'Pass'
};

const Mocks = () => {
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
      const [mockRes, candRes] = await Promise.all([getAllMocks(), getCandidates({ limit: 200 })]);
      setRecords(mockRes.data.data);
      setCandidates(candRes.data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditing(null); setForm(defaultForm); setShowModal(true); };
  const openEdit = (r) => {
    setEditing(r);
    setForm({ ...r, candidate: r.candidate?._id || r.candidate, date: r.date ? moment(r.date).format('YYYY-MM-DD') : '' });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await updateMock(editing._id, form);
      else await createMock(form);
      setShowModal(false); fetchData();
    } catch (e) { alert(e.response?.data?.error || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h5>Mock Interviews</h5><p>Track technical and final mock results</p></div>
        <button className="btn-primary-crm" onClick={openAdd}><MdAdd /> Add Mock</button>
      </div>

      <div className="crm-card">
        {loading ? <div className="text-center py-5"><div className="spinner-border" style={{ color: 'var(--primary)' }} /></div> : (
          <div className="table-responsive">
            <table className="crm-table">
              <thead><tr>
                <th>Candidate</th><th>Type</th><th>Score</th>
                <th>Date</th><th>Status</th><th>Feedback</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {records.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-4" style={{ color: 'var(--text-secondary)' }}>No records found</td></tr>
                ) : records.map(r => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 600 }}>{r.candidate?.fullName || '—'}</td>
                    <td><span className="status-badge badge-mock">{r.mockType}</span></td>
                    <td style={{ fontWeight: 600 }}>{r.score ?? '—'}<span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>/10</span></td>
                    <td>{r.date ? moment(r.date).format('DD MMM YYYY') : '—'}</td>
                    <td><span className={`status-badge ${r.status === 'Pass' ? 'badge-selected' : 'badge-rejected'}`}>{r.status}</span></td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>{r.feedback}</td>
                    <td><button className="btn-icon" onClick={() => openEdit(r)}><MdEdit size={15} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton><Modal.Title>{editing ? 'Edit Mock Interview' : 'Add Mock Interview'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave} className="crm-form">
            <Row className="g-3">
              <Col md={12}><Form.Group><Form.Label>Candidate *</Form.Label>
                <Form.Select required value={form.candidate} onChange={e => setForm({ ...form, candidate: e.target.value })}>
                  <option value="">Select Candidate</option>
                  {candidates.map(c => <option key={c._id} value={c._id}>{c.fullName} — {c.technology}</option>)}
                </Form.Select></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Mock Type</Form.Label>
                <Form.Select value={form.mockType} onChange={e => setForm({ ...form, mockType: e.target.value })}>
                  <option>Technical</option><option>Final</option>
                </Form.Select></Form.Group></Col>
              <Col md={3}><Form.Group><Form.Label>Score (out of 10)</Form.Label>
                <Form.Control type="number" min={0} max={10} value={form.score} onChange={e => setForm({ ...form, score: e.target.value })} /></Form.Group></Col>
              <Col md={3}><Form.Group><Form.Label>Status</Form.Label>
                <Form.Select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option>Pass</option><option>Fail</option>
                </Form.Select></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Date</Form.Label>
                <Form.Control type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></Form.Group></Col>
              <Col md={12}><Form.Group><Form.Label>Feedback *</Form.Label>
                <Form.Control as="textarea" rows={4} required value={form.feedback} onChange={e => setForm({ ...form, feedback: e.target.value })} placeholder="Detailed feedback from the interviewer…" /></Form.Group></Col>
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

export default Mocks;
