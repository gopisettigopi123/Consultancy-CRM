import { useEffect, useState, useMemo } from 'react';
import { Form, Row } from 'react-bootstrap';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import { getAllTraining, getCandidates, createTraining, updateTraining } from '../services/api';
import moment from 'moment';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal, { ModalBody, ModalFooter } from '../components/ui/Modal';
import Badge from '../components/ui/Badge';

const defaultForm = {
  candidate: '', batchName: '', firstSession: '', secondSession: '',
  mockGiven: false, movedToCallTraining: false, finalMock: false,
  marks: '', notes: ''
};

const booleanBadge = (val) => val 
  ? <Badge status="Selected" label="Yes" style={{ padding: '3px 8px', fontSize: '0.65rem' }} /> 
  : <Badge status="Rejected" label="No" style={{ padding: '3px 8px', fontSize: '0.65rem' }} />;

const Training = () => {
  const [records, setRecords] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const pages = 1;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [trainingRes, candRes] = await Promise.all([getAllTraining(), getCandidates({ limit: 200 })]);
      setRecords(trainingRes.data.data);
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
      firstSession: r.firstSession ? moment(r.firstSession).format('YYYY-MM-DD') : '',
      secondSession: r.secondSession ? moment(r.secondSession).format('YYYY-MM-DD') : '',
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.firstSession) delete payload.firstSession;
      if (!payload.secondSession) delete payload.secondSession;
      
      if (editing) await updateTraining(editing._id, payload);
      else await createTraining(payload);
      setShowModal(false); fetchData();
    } catch (e) { alert(e.response?.data?.error || 'Save failed'); }
    finally { setSaving(false); }
  };

  const columns = useMemo(() => [
    { header: 'Candidate Name', render: (r) => (<div style={{fontWeight:600}}>{r.candidate?.fullName || '—'}</div>) },
    { header: 'Mobile', render: (r) => r.candidate?.phoneNumber || '—' },
    { header: 'Batch Name', accessor: 'batchName' },
    { header: '1st Session', render: (r) => <span className="status-badge badge-mock">{r.firstSession ? moment(r.firstSession).format('DD MMM YY') : '—'}</span> },
    { header: '2nd Session', render: (r) => <span className="status-badge badge-mock">{r.secondSession ? moment(r.secondSession).format('DD MMM YY') : '—'}</span> },
    { header: 'Mock Given', render: (r) => booleanBadge(r.mockGiven) },
    { header: 'Call Training', render: (r) => booleanBadge(r.movedToCallTraining) },
    { header: 'Final Mock', render: (r) => booleanBadge(r.finalMock) },
    { header: 'Marks', accessor: 'marks' },
    { header: 'Notes', render: (r) => <span style={{fontSize:'0.75rem', color: 'var(--text-secondary)'}}>{r.notes?.substring(0,25)}{r.notes?.length>25?'...':''}</span> },
    { header: 'Actions', render: (r) => (
      <div className="d-flex gap-1 align-items-center">
        <Button variant="icon" onClick={() => openEdit(r)} icon={<MdEdit size={15} />} />
      </div>
    )}
  ], []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h5>Training Pipeline</h5>
          <p>
            {loading ? 'Crunching data...' : (
              `${records.length} active training record${records.length !== 1 ? 's' : ''}`
            )}
          </p>
        </div>
        <Button onClick={openAdd} variant="primary" icon={<MdAdd />} label="Add Training Record" />
      </div>

      <div className="crm-card">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" style={{ color: 'var(--primary)' }} /></div>
        ) : (
          <Table columns={columns} data={records} page={page} pages={pages} setPage={setPage} />
        )}
      </div>

      <Modal show={showModal} title={editing ? 'Edit Training Record' : 'Add Training Record'} onClose={() => setShowModal(false)}>
        <Form onSubmit={handleSave} className="crm-form">
          <ModalBody>
            <Row className="g-2">
              <Input colMd={12} label="Candidate" type="select" required value={form.candidate} onChange={e => setForm({ ...form, candidate: e.target.value })} 
                     options={[{value: '', label: 'Select Candidate'}, ...candidates.map(c => ({value: c._id, label: `${c.fullName} (${c.phoneNumber || 'No phone'})`}))]} />
              
              <Input colMd={12} label="Batch Name" required value={form.batchName} onChange={e => setForm({ ...form, batchName: e.target.value })} placeholder="E.g. Full Stack Feb" />

              <Input colMd={6} label="1st Session Date" type="date" value={form.firstSession} onChange={e => setForm({ ...form, firstSession: e.target.value })} />
              <Input colMd={6} label="2nd Session Date" type="date" value={form.secondSession} onChange={e => setForm({ ...form, secondSession: e.target.value })} />

              <Input colMd={4} type="switch" label="Mock Given" value={form.mockGiven} onChange={e => setForm({ ...form, mockGiven: e.target.checked })} />
              <Input colMd={4} type="switch" label="Moved to Call" value={form.movedToCallTraining} onChange={e => setForm({ ...form, movedToCallTraining: e.target.checked })} />
              <Input colMd={4} type="switch" label="Final Mock" value={form.finalMock} onChange={e => setForm({ ...form, finalMock: e.target.checked })} />

              <Input colMd={12} label="Marks" value={form.marks} onChange={e => setForm({ ...form, marks: e.target.value })} placeholder="E.g. 95/100" />
              <Input colMd={12} label="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Additional training notes..." />
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

export default Training;
