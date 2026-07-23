import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, getCandidates } from '../services/api';
import { useCompany } from '../context/CompanyContext';
import { useAuth } from '../context/AuthContext';
import { copyToClipboard } from '../utils/clipboard';
import { 
  MdPeople, MdSchool, MdCampaign, MdSend, MdEvent, MdTrendingUp, 
  MdSearch, MdFilterList, MdLocationOn, MdMessage, MdContentCopy, MdCheck,
  MdBusiness, MdQuiz, MdManageAccounts, MdSecurity, MdPayments,
  MdAssignmentInd, MdHistory, MdArrowForward, MdCheckCircle, MdCancel
} from 'react-icons/md';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import StatsChart from '../components/ui/StatsChart';
import CandidateProfileDrawer from '../components/ui/CandidateProfileDrawer';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { activeCompany } = useCompany();
  const { user } = useAuth();
  
  // Search state
  const [searchName, setSearchName] = useState('');
  const [searchTech, setSearchTech] = useState('');
  const [searchLoc, setSearchLoc] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  useEffect(() => {
    getDashboardStats()
      .then(({ data }) => setStats(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Debounced search effect
  useEffect(() => {
    const hasQuery = searchName.trim() || searchTech.trim() || searchLoc.trim();
    if (!hasQuery) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { data } = await getCandidates({ 
          search: searchName, 
          technology: searchTech, 
          location: searchLoc,
          limit: 5 
        });
        setResults(data.data);
      } catch (e) {
        console.error('Dashboard search error:', e);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchName, searchTech, searchLoc]);

  const handleCopy = (c) => {
    const row = [
      c.fullName, c.email, c.phoneNumber,
      c.whatsappNumber || 'N/A', c.technology,
      `${c.experience} yr${c.experience !== 1 ? 's' : ''}`,
      c.location || 'N/A',
      c.drivingLicense?.length > 0 ? c.drivingLicense.join(', ') : 'None',
   ].join('\t');
    copyToClipboard(row).then((success) => {
      if (success) {
        setCopiedId(c._id);
        setTimeout(() => setCopiedId(null), 2000);
      } else {
        alert('Could not copy. Please try again.');
      }
    });
  };

  // ── Stat Cards covering ALL sidebar modules ──
  const primaryCards = [
    { icon: <MdPeople />, label: 'Candidates', key: 'totalCandidates', color: 'purple' },
    { icon: <MdSchool />, label: 'In Training', key: 'candidatesInTraining', color: 'cyan' },
    { icon: <MdQuiz />, label: 'Mock Tests', key: 'totalMocks', color: 'amber' },
    { icon: <MdCampaign />, label: 'In Marketing', key: 'candidatesInMarketing', color: 'green' },
    { icon: <MdBusiness />, label: 'Vendors', key: 'totalVendors', color: 'red' },
    { icon: <MdSend />, label: 'Submissions', key: 'totalSubmissions', color: 'purple' },
    { icon: <MdEvent />, label: 'Interviews', key: 'interviewScheduled', color: 'cyan' },
  ];

  const resultsColumns = [
    { header: 'Name', render: (c) => (<div style={{cursor:'pointer'}} onClick={() => setSelectedCandidateId(c._id)}><div style={{fontWeight:600,color:'var(--primary)'}}>{c.fullName}</div><div style={{fontSize:'0.72rem',color:'var(--text-secondary)'}}>{c.email}</div></div>)},
    { header: 'Phone', accessor: 'phoneNumber' },
    { header: 'Technology', accessor: 'technology' },
    { header: 'Exp', render: (c) => `${c.experience} yr${c.experience !== 1 ? 's' : ''}` },
    { header: 'Location', render: (c) => <Badge status="mock" label={c.location || '—'} className="badge-mock" /> },
    { header: 'Actions', render: (c) => (
      <div className="d-flex align-items-center gap-2">
        {c.whatsappNumber ? (
          <a href={`https://wa.me/${c.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#25D366' }}>
            <MdMessage size={18} />
          </a>
        ) : null}
        <Button 
          variant="icon" 
          onClick={() => handleCopy(c)} 
          icon={copiedId === c._id ? <MdCheck color="var(--success)" /> : <MdContentCopy />} 
        />
      </div>
    )}
  ];

  // Helper for the Quick Navigate links section
  const QuickLink = ({ to, icon, label, count }) => (
    <Link to={to} className="text-decoration-none">
      <div className="crm-card h-100 d-flex align-items-center gap-3 dashboard-quick-link" 
           style={{ padding: '12px 16px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
        <div className="stat-icon purple" style={{ width: 36, height: 36, fontSize: '1rem', flexShrink: 0 }}>{icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="fw-bold" style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>{label}</div>
          {count !== undefined && <div className="text-muted-crm" style={{ fontSize: '0.7rem' }}>{count}</div>}
        </div>
        <MdArrowForward size={16} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
      </div>
    </Link>
  );

  return (
    <div className="pb-4">
      {/* Header + Search */}
      <div className="page-header mb-3 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-2">
        <div style={{ flexShrink: 0 }}>
          <h5 className="fw-bold mb-0">Dashboard: <span className="text-primary">{activeCompany}</span> <span className="text-muted-crm ms-2">({stats?.totalCandidates || 0})</span></h5>
          <p className="mb-0 text-muted-crm" style={{ fontSize: '0.78rem' }}>Comprehensive recruitment pipeline analytics</p>
        </div>
        <div className="d-flex flex-wrap gap-2 align-items-center" style={{ flex: 1, maxWidth: '700px' }}>
          <div className="search-wrapper" style={{ flex: 1, minWidth: '130px' }}>
            <MdSearch className="search-icon" />
            <input placeholder="Name..." value={searchName} onChange={e => setSearchName(e.target.value)} className="py-1" style={{ fontSize: '0.82rem' }} />
          </div>
          <div className="search-wrapper" style={{ flex: 1, minWidth: '130px' }}>
            <MdFilterList className="search-icon" />
            <input placeholder="Technology..." value={searchTech} onChange={e => setSearchTech(e.target.value)} className="py-1" style={{ fontSize: '0.82rem' }} />
          </div>
          <div className="search-wrapper" style={{ flex: 1, minWidth: '130px' }}>
            <MdLocationOn className="search-icon" />
            <input placeholder="Location..." value={searchLoc} onChange={e => setSearchLoc(e.target.value)} className="py-1" style={{ fontSize: '0.82rem' }} />
          </div>
        </div>
      </div>

      {/* Search Results */}
      {(searchName || searchTech || searchLoc) && (
        <div className="crm-card mb-4 border-primary">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0 text-primary fw-bold" style={{ fontSize: '0.9rem' }}><MdSearch className="me-2" /> Live Search Results</h6>
            {isSearching && <div className="spinner-border spinner-border-sm text-primary" />}
          </div>
          <Table columns={resultsColumns} data={results} keyField="_id" />
          <div className="text-center mt-2 border-top pt-2">
            <small className="text-muted-crm" style={{ fontSize: '0.75rem' }}>
              Showing top 5 matches. Visit <Link to="/candidates" className="text-primary fw-bold">Candidates Menu</Link> for full list.
            </small>
          </div>
        </div>
      )}

      {loading ? (
        <div className="d-flex justify-content-center py-5"><div className="spinner-border" style={{ color: 'var(--primary)' }} /></div>
      ) : (
        <>
          {/* ═══════ ROW 1: Primary Stat Cards ═══════ */}
          <div className="row g-3">
            {primaryCards.map((c) => (
              <div key={c.key} className="col-6 col-sm-4 col-md-3 col-xl">
                <Card icon={c.icon} value={stats?.[c.key]} label={c.label} colorClass={c.color} />
              </div>
            ))}
          </div>

          {/* ═══════ ROW 2: Charts — Trends + Pipeline + Tech ═══════ */}
          {stats && (
            <div className="row g-3 mt-1">
              <div className="col-12 col-xl-5">
                <StatsChart 
                  type="area" 
                  title="Submission Trends (Last 6 Months)" 
                  data={stats.monthlyStats} 
                  dataKey="submissions" 
                  nameKey="month" 
                />
              </div>
              <div className="col-12 col-xl-3">
                <StatsChart 
                  type="pie" 
                  title="Candidate Pipeline" 
                  data={stats.distribution} 
                  dataKey="value" 
                  nameKey="name" 
                  height={220}
                />
              </div>
              <div className="col-12 col-xl-4">
                <StatsChart 
                  type="bar" 
                  title="Candidates by Technology" 
                  data={stats.techBreakdown} 
                  dataKey="count" 
                  nameKey="name" 
                />
              </div>
            </div>
          )}

          {/* ═══════ ROW 3: Module Deep-Dive Panels ═══════ */}
          <div className="row g-3 mt-1">
            {/* Training & Mocks Panel */}
            <div className="col-12 col-lg-4">
              <div className="crm-card h-100">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <MdSchool size={18} className="text-primary" /> Training & Mocks
                </h6>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted-crm" style={{ fontSize: '0.8rem' }}>Active Training Records</span>
                    <span className="fw-bold">{stats?.candidatesInTraining || 0}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted-crm" style={{ fontSize: '0.8rem' }}>Total Mock Interviews</span>
                    <span className="fw-bold">{stats?.totalMocks || 0}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted-crm" style={{ fontSize: '0.8rem' }}>
                      <MdCheckCircle size={14} className="text-success me-1" />Passed
                    </span>
                    <Badge status="Selected" label={`${stats?.mocksPassed || 0} passed`} />
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted-crm" style={{ fontSize: '0.8rem' }}>
                      <MdCancel size={14} className="text-danger me-1" />Failed
                    </span>
                    <Badge status="Rejected" label={`${stats?.mocksFailed || 0} failed`} />
                  </div>
                  <div className="d-flex justify-content-between align-items-center border-top pt-2">
                    <span className="text-muted-crm" style={{ fontSize: '0.8rem' }}>Avg. Mock Score</span>
                    <span className="fw-bold text-primary" style={{ fontSize: '1.1rem' }}>{stats?.avgMockScore || '0'}<span className="text-muted-crm fw-normal" style={{ fontSize: '0.7rem' }}>/10</span></span>
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <Link to="/training" className="btn-primary-crm flex-fill text-center text-decoration-none" style={{ fontSize: '0.75rem', padding: '6px',width:'5px' }}>Training →</Link>
                  <Link to="/mocks" className="btn-primary-crm flex-fill text-center text-decoration-none" style={{ fontSize: '0.75rem', padding: '6px',width:'5px' }}>Mocks →</Link>
                </div>
              </div>
            </div>

            {/* Marketing & Vendors Panel */}
            <div className="col-12 col-lg-4">
              <div className="crm-card h-100">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <MdCampaign size={18} className="text-primary" /> Marketing & Vendors
                </h6>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted-crm" style={{ fontSize: '0.8rem' }}>Candidates in Marketing</span>
                    <span className="fw-bold">{stats?.candidatesInMarketing || 0}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted-crm" style={{ fontSize: '0.8rem' }}>Total Vendor Partners</span>
                    <span className="fw-bold">{stats?.totalVendors || 0}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted-crm" style={{ fontSize: '0.8rem' }}>Vendor Submissions</span>
                    <Badge status="Submitted" label={`${stats?.totalMarketingSubmissions || 0} total`} />
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted-crm" style={{ fontSize: '0.8rem' }}>Total Submissions</span>
                    <span className="fw-bold">{stats?.totalSubmissions || 0}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center border-top pt-2">
                    <span className="text-muted-crm" style={{ fontSize: '0.8rem' }}>Selected / Rejected</span>
                    <div className="d-flex gap-2">
                      <Badge status="Selected" label={stats?.selectedCount || 0} />
                      <Badge status="Rejected" label={stats?.rejectedCount || 0} />
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <Link to="/marketing" className="btn-primary-crm flex-fill text-center text-decoration-none" style={{ fontSize: '0.75rem', padding: '6px' }}>Marketing →</Link>
                  <Link to="/vendors" className="btn-primary-crm flex-fill text-center text-decoration-none" style={{ fontSize: '0.75rem', padding: '6px' }}>Vendors →</Link>
                  <Link to="/submissions" className="btn-primary-crm flex-fill text-center text-decoration-none" style={{ fontSize: '0.75rem', padding: '6px' }}>Submissions →</Link>
                </div>
              </div>
            </div>

            {/* Submission Status Donut */}
            <div className="col-12 col-lg-4">
              {stats?.submissionBreakdown?.length > 0 ? (
                <StatsChart
                  type="pie"
                  title="Submission Status Breakdown"
                  data={stats.submissionBreakdown}
                  dataKey="value"
                  nameKey="name"
                  height={220}
                />
              ) : (
                <div className="crm-card h-100 d-flex align-items-center justify-content-center">
                  <div className="text-center text-muted-crm">
                    <MdSend size={40} className="mb-2 opacity-50" />
                    <div style={{ fontSize: '0.8rem' }}>No submissions data yet</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ═══════ ROW 4: Admin / HR / Quick Navigate ═══════ */}
          <div className="row g-3 mt-1">
            {/* Admin & User Management Panel */}
            <div className="col-12 col-lg-4">
              <div className="crm-card h-100">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <MdSecurity size={18} className="text-primary" /> Admin & User Management
                </h6>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted-crm" style={{ fontSize: '0.8rem' }}>
                      <MdManageAccounts size={14} className="me-1" />Registered Users
                    </span>
                    <span className="fw-bold">{stats?.totalUsers || 0}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted-crm" style={{ fontSize: '0.8rem' }}>
                      <MdSecurity size={14} className="me-1" />Active Roles
                    </span>
                    <span className="fw-bold">{stats?.totalRoles || 0}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted-crm" style={{ fontSize: '0.8rem' }}>
                      <MdTrendingUp size={14} className="me-1" />Today's Submissions
                    </span>
                    <Badge status="Selected" label={`${stats?.totalSubmissionsToday || 0} today`} />
                  </div>
                  <div className="d-flex justify-content-between align-items-center border-top pt-2">
                    <span className="text-muted-crm" style={{ fontSize: '0.8rem' }}>Current User</span>
                    <div className="d-flex align-items-center gap-2">
                      <div className="user-avatar" style={{ width: 22, height: 22, fontSize: '0.6rem' }}>{user?.name?.charAt(0)}</div>
                      <span className="fw-bold" style={{ fontSize: '0.8rem' }}>{user?.role?.name || 'User'}</span>
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <Link to="/users" className="btn-primary-crm flex-fill text-center text-decoration-none" style={{ fontSize: '0.75rem', padding: '6px' }}>Users →</Link>
                  <Link to="/permissions" className="btn-primary-crm flex-fill text-center text-decoration-none" style={{ fontSize: '0.75rem', padding: '6px' }}>Roles →</Link>
                  <Link to="/system-logs" className="btn-primary-crm flex-fill text-center text-decoration-none" style={{ fontSize: '0.75rem', padding: '6px' }}>Logs →</Link>
                </div>
              </div>
            </div>

            {/* Quick Navigate — All Sidebar Modules */}
            <div className="col-12 col-lg-8">
              <div className="crm-card h-100">
                <h6 className="fw-bold mb-3" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  ⚡ Quick Navigate — All Modules
                </h6>
                <div className="row g-2">
                  <div className="col-6 col-md-4"><QuickLink to="/candidates" icon={<MdPeople />} label="Candidates" count={`${stats?.totalCandidates || 0} total`} /></div>
                  <div className="col-6 col-md-4"><QuickLink to="/training" icon={<MdSchool />} label="Training" count={`${stats?.candidatesInTraining || 0} active`} /></div>
                  <div className="col-6 col-md-4"><QuickLink to="/mocks" icon={<MdQuiz />} label="Mock Interviews" count={`${stats?.totalMocks || 0} conducted`} /></div>
                  <div className="col-6 col-md-4"><QuickLink to="/marketing" icon={<MdCampaign />} label="Marketing" count={`${stats?.candidatesInMarketing || 0} active`} /></div>
                  <div className="col-6 col-md-4"><QuickLink to="/vendors" icon={<MdBusiness />} label="Vendors" count={`${stats?.totalVendors || 0} partners`} /></div>
                  <div className="col-6 col-md-4"><QuickLink to="/submissions" icon={<MdSend />} label="Submissions" count={`${stats?.totalSubmissions || 0} total`} /></div>
                  <div className="col-6 col-md-4"><QuickLink to="/employees" icon={<MdAssignmentInd />} label="HR - Employees" count="View directory" /></div>
                  <div className="col-6 col-md-4"><QuickLink to="/payroll" icon={<MdPayments />} label="HR - Payroll" count="View payroll" /></div>
                  <div className="col-6 col-md-4"><QuickLink to="/balance" icon={<MdPayments />} label="Account & Finance" count="View details" /></div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════ ROW 5: Pipeline Labels ═══════ */}
          
        </>
      )}

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

export default Dashboard;
