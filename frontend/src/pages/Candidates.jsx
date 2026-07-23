import { useEffect, useState, useMemo } from 'react';
import { Row, Form } from 'react-bootstrap';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdDownload, MdContentCopy, MdCheck, MdMessage } from 'react-icons/md';
import {
  getCandidates, createCandidate, updateCandidate,
  deleteCandidate, exportCandidates
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal, { ModalBody, ModalFooter } from '../components/ui/Modal';
import CandidateProfileDrawer from '../components/ui/CandidateProfileDrawer';
import { copyToClipboard } from '../utils/clipboard';


const TECH_OPTIONS = ['Java', 'Python', 'React', '.NET', 'Angular', 'Node.js', 'DevOps', 'QA', 'Data Science', 'Other'];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

// Full name + abbreviation for DL dropdown
const DL_STATES = [
  { label: 'Alabama (AL)',        value: 'AL' },
  { label: 'Alaska (AK)',         value: 'AK' },
  { label: 'Arizona (AZ)',        value: 'AZ' },
  { label: 'Arkansas (AR)',       value: 'AR' },
  { label: 'California (CA)',     value: 'CA' },
  { label: 'Colorado (CO)',       value: 'CO' },
  { label: 'Connecticut (CT)',    value: 'CT' },
  { label: 'Delaware (DE)',       value: 'DE' },
  { label: 'Florida (FL)',        value: 'FL' },
  { label: 'Georgia (GA)',        value: 'GA' },
  { label: 'Hawaii (HI)',         value: 'HI' },
  { label: 'Idaho (ID)',          value: 'ID' },
  { label: 'Illinois (IL)',       value: 'IL' },
  { label: 'Indiana (IN)',        value: 'IN' },
  { label: 'Iowa (IA)',           value: 'IA' },
  { label: 'Kansas (KS)',         value: 'KS' },
  { label: 'Kentucky (KY)',       value: 'KY' },
  { label: 'Louisiana (LA)',      value: 'LA' },
  { label: 'Maine (ME)',          value: 'ME' },
  { label: 'Maryland (MD)',       value: 'MD' },
  { label: 'Massachusetts (MA)', value: 'MA' },
  { label: 'Michigan (MI)',       value: 'MI' },
  { label: 'Minnesota (MN)',      value: 'MN' },
  { label: 'Mississippi (MS)',    value: 'MS' },
  { label: 'Missouri (MO)',       value: 'MO' },
  { label: 'Montana (MT)',        value: 'MT' },
  { label: 'Nebraska (NE)',       value: 'NE' },
  { label: 'Nevada (NV)',         value: 'NV' },
  { label: 'New Hampshire (NH)', value: 'NH' },
  { label: 'New Jersey (NJ)',     value: 'NJ' },
  { label: 'New Mexico (NM)',     value: 'NM' },
  { label: 'New York (NY)',       value: 'NY' },
  { label: 'North Carolina (NC)', value: 'NC' },
  { label: 'North Dakota (ND)',   value: 'ND' },
  { label: 'Ohio (OH)',           value: 'OH' },
  { label: 'Oklahoma (OK)',       value: 'OK' },
  { label: 'Oregon (OR)',         value: 'OR' },
  { label: 'Pennsylvania (PA)',   value: 'PA' },
  { label: 'Rhode Island (RI)',   value: 'RI' },
  { label: 'South Carolina (SC)', value: 'SC' },
  { label: 'South Dakota (SD)',   value: 'SD' },
  { label: 'Tennessee (TN)',      value: 'TN' },
  { label: 'Texas (TX)',          value: 'TX' },
  { label: 'Utah (UT)',           value: 'UT' },
  { label: 'Vermont (VT)',        value: 'VT' },
  { label: 'Virginia (VA)',       value: 'VA' },
  { label: 'Washington (WA)',     value: 'WA' },
  { label: 'West Virginia (WV)', value: 'WV' },
  { label: 'Wisconsin (WI)',      value: 'WI' },
  { label: 'Wyoming (WY)',        value: 'WY' },
];

// Removed statusClass as it is now inside the Badge component.

const defaultForm = {
  fullName: '', email: '', phoneNumber: '', whatsappNumber: '', technology: '',
  experience: '', linkedinProfile: '', location: '',
  drivingLicense: ''
};

const Candidates = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterTech, setFilterTech] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [resumeFile, setResumeFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getCandidates({ search: debouncedSearch, technology: filterTech, page });
      setCandidates(data.data);
      setTotal(data.total);
      setPages(data.pages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [debouncedSearch, filterTech, page]);

  const openAdd = () => { setEditing(null); setForm(defaultForm); setResumeFile(null); setShowModal(true); };
  const openEdit = (c) => { setEditing(c); setForm({ ...c, drivingLicense: c.drivingLicense?.join(', ') || '' }); setResumeFile(null); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (resumeFile) fd.append('resume', resumeFile);

      if (editing) {
        await updateCandidate(editing._id, form);
      } else {
        await createCandidate(fd);
      }
      setShowModal(false);
      fetchData();
    } catch (e) { alert(e.response?.data?.error || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this candidate?')) return;
    await deleteCandidate(id);
    fetchData();
  };

  const handleExport = async () => {
    const { data } = await exportCandidates();
    const url = URL.createObjectURL(new Blob([data]));
    const a = document.createElement('a'); a.href = url; a.download = 'candidates.csv'; a.click();
  };

  const handleCopy = (c) => {
    const lines = [
      `📋 CANDIDATE PROFILE`,
      `─────────────────────────────`,
      `Name        : ${c.fullName}`,
      `Email       : ${c.email}`,
      `Phone       : ${c.phoneNumber}`,
      `Technology  : ${c.technology}`,
      `Experience  : ${c.experience} year${c.experience !== 1 ? 's' : ''}`,
      `Location    : ${c.location || 'N/A'}`,
      `DL State(s) : ${c.drivingLicense?.length > 0 ? c.drivingLicense.join(', ') : 'None'}`,
      `WhatsApp    : ${c.whatsappNumber || 'N/A'}`,
      c.linkedinProfile ? `LinkedIn    : ${c.linkedinProfile}` : null,
      `─────────────────────────────`,
    ].filter(Boolean).join('\n');

    copyToClipboard(lines).then((success) => {
      if (success) {
        setCopiedId(c._id);
        setTimeout(() => setCopiedId(null), 2000);
      } else {
        alert('Could not copy to clipboard. Please try again.');
      }
    });

  };

  const columns = useMemo(() => [
    { header: 'Name', render: (c) => (<div style={{cursor:'pointer'}} onClick={() => setSelectedCandidateId(c._id)}><div style={{fontWeight:600,color:'var(--primary)'}}>{c.fullName}</div><div style={{fontSize:'0.75rem',color:'var(--text-secondary)'}}>{c.email}</div></div>) },
    { header: 'Location', render: (c) => <Badge status="mock" label={c.location || '—'} className="badge-mock" /> },
    { header: 'Phone', accessor: 'phoneNumber' },
    { header: 'Technology', accessor: 'technology' },
    { header: 'Exp', render: (c) => `${c.experience} yr${c.experience !== 1 ? 's' : ''}` },
    { header: 'DL', render: (c) => (
      <div className="d-flex flex-wrap gap-1">
        {c.drivingLicense?.length > 0
          ? c.drivingLicense.map(dl => <Badge key={dl} status="Selected" label={dl} style={{ padding: '2px 6px', fontSize: '0.65rem' }} className="badge-selected"/>)
          : <Badge status="Rejected" label="None" style={{ padding: '2px 6px', fontSize: '0.65rem' }} className="badge-rejected"/>}
      </div>
    )},
    { header: 'WhatsApp', accessor: 'whatsappNumber' },
    { header: 'Actions', render: (c) => (
      <div className="d-flex gap-1 align-items-center">
        {c.whatsappNumber && (
          <Button variant="icon" onClick={() => window.open(`https://wa.me/${c.whatsappNumber.replace(/\D/g, '')}`, '_blank')} title="WhatsApp Candidate" icon={<MdMessage size={15} color="#25D366" />} />
        )}
        <Button variant="icon" onClick={() => handleCopy(c)} title="Copy Profile" icon={copiedId === c._id ? <MdCheck size={15} color="var(--success)" /> : <MdContentCopy size={15} />} />
        <Button variant="icon" onClick={() => openEdit(c)} icon={<MdEdit size={15} />} />
        {(user?.role?.name || user?.role) === 'Admin' && (
          <Button variant="icon-danger" onClick={() => handleDelete(c._id)} icon={<MdDelete size={15} />} />
        )}
      </div>
    )}
  ], [copiedId, user]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h5>Candidates</h5>
          <p>
            {loading ? 'Calculating...' : (
              filterTech || debouncedSearch 
                ? `Found ${total} ${filterTech || ''} candidate${total !== 1 ? 's' : ''}${debouncedSearch ? ` matching "${debouncedSearch}"` : ''}`
                : `${total} total candidates in system`
            )}
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn-icon" onClick={handleExport} title="Export CSV"><MdDownload /></button>
          <button className="btn-primary-crm" onClick={openAdd}><MdAdd /> Add Candidate</button>
        </div>
      </div>

      {/* Filters */}
      <div className="crm-card mb-3">
        <div className="d-flex flex-wrap gap-3 align-items-center">
          <div className="search-wrapper">
            <MdSearch className="search-icon" />
            <input placeholder="Search name or email…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select form-select-sm" style={{ width: 140, background: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            value={filterTech} onChange={e => { setFilterTech(e.target.value); setPage(1); }}>
            <option value="">All Tech</option>
            {TECH_OPTIONS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="crm-card">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" style={{ color: 'var(--primary)' }} /></div>
        ) : (
          <Table columns={columns} data={candidates} page={page} pages={pages} setPage={setPage} />
        )}
      </div>

      {/* Modal */}
      <Modal show={showModal} title={editing ? 'Edit Candidate' : 'Add New Candidate'} onClose={() => setShowModal(false)}>
        <Form onSubmit={handleSave} className="crm-form">
          <ModalBody>
            <Row className="g-3">
              <Input colMd={6} label="Full Name" required value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="John Doe" />
              <Input colMd={6} label="Email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@email.com" />
              <Input colMd={6} label="Phone Number" required value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} placeholder="+1 555 000 0000" />
              <Input colMd={6} label="Technology" type="select" required value={form.technology} onChange={e => setForm({ ...form, technology: e.target.value })} options={[{value: '', label: 'Select Technology'}, ...TECH_OPTIONS.map(t => ({value: t, label: t}))]} />
              <Input colMd={6} label="Experience (Years)" type="number" required value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} />
              <Input colMd={6} label="WhatsApp Number" value={form.whatsappNumber} onChange={e => setForm({ ...form, whatsappNumber: e.target.value })} placeholder="e.g. +1 555 123 4567" />
              <Input colMd={6} label="LinkedIn Profile" value={form.linkedinProfile} onChange={e => setForm({ ...form, linkedinProfile: e.target.value })} placeholder="https://linkedin.com/in/..." />
              <Input colMd={6} label="Location (State)" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. TX, NY, CA" />
              <Input colMd={6} label="DL States (Comma separated)" value={form.drivingLicense} onChange={e => setForm({ ...form, drivingLicense: e.target.value })} placeholder="e.g. TX, FL, MA" />
              {!editing && (
                <Input colMd={6} label="Upload Resume (PDF)" type="file" onChange={e => setResumeFile(e.target.files[0])} />
              )}
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" className="btn-icon px-4" onClick={() => setShowModal(false)} label="Cancel" />
            <Button type="submit" variant="primary" loading={saving} label={editing ? 'Update' : 'Create'} />
          </ModalFooter>
        </Form>
      </Modal>

      {/* Candidate Profile Drawer */}
      {selectedCandidateId && (
        <CandidateProfileDrawer
          candidateId={selectedCandidateId}
          onClose={() => setSelectedCandidateId(null)}
        />
      )}
    </div>
  );
};

export default Candidates;
