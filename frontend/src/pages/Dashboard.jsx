import { useEffect, useState } from 'react';
import { getDashboardStats, getCandidates } from '../services/api';
import { useCompany } from '../context/CompanyContext';
import { copyToClipboard } from '../utils/clipboard';
import { 
  MdPeople, MdSchool, MdCampaign, MdSend, MdEvent, MdTrendingUp, 
  MdSearch, MdFilterList, MdLocationOn, MdMessage, MdContentCopy, MdCheck,
  MdBarChart, MdPieChart, MdTimeline
} from 'react-icons/md';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import StatsChart from '../components/ui/StatsChart';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { activeCompany } = useCompany();
  
  // Search state
  const [searchName, setSearchName] = useState('');
  const [searchTech, setSearchTech] = useState('');
  const [searchLoc, setSearchLoc] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

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
    // Tab-separated row format for Excel paste
    // const headers = 'Name\tEmail\tPhone\tWhatsApp\tTechnology\tExperience\tLocation\tDL States\tLinkedIn';
    const row = [
      c.fullName,
      c.email,
      c.phoneNumber,
      c.whatsappNumber || 'N/A',
      c.technology,
      `${c.experience} yr${c.experience !== 1 ? 's' : ''}`,
      c.location || 'N/A',
      c.drivingLicense?.length > 0 ? c.drivingLicense.join(', ') : 'None',
   ].join('\t');
    const text = `${row}`;
    copyToClipboard(text).then((success) => {
      if (success) {
        setCopiedId(c._id);
        setTimeout(() => setCopiedId(null), 2000);
      } else {
        alert('Could not copy. Please try again.');
      }
    });
  };

  const cards = [
    { icon: <MdPeople />, label: 'Candidates', key: 'totalCandidates', color: 'purple' },
    { icon: <MdSchool />, label: 'Training', key: 'candidatesInTraining', color: 'cyan' },
    { icon: <MdCampaign />, label: 'Marketing', key: 'candidatesInMarketing', color: 'amber' },
    { icon: <MdSend />, label: " Submissions", key: 'totalSubmissionsToday', color: 'green' },
    { icon: <MdEvent />, label: 'Interview', key: 'interviewScheduled', color: 'red' },
    { icon: <MdTrendingUp />, label: 'Selection Rate', key: 'selectionRate', color: 'purple' },
  ];

  const resultsColumns = [
    { header: 'Name', render: (c) => (<><div style={{fontWeight:600}}>{c.fullName}</div><div style={{fontSize:'0.72rem',color:'var(--text-secondary)'}}>{c.email}</div></>) },
    { header: 'Phone', accessor: 'phoneNumber' },
    { header: 'Technology', accessor: 'technology' },
    { header: 'Exp', render: (c) => `${c.experience} yr${c.experience !== 1 ? 's' : ''}` },
    { header: 'Location', render: (c) => <Badge status="mock" label={c.location || '—'} className="badge-mock" /> },
    { header: 'DL', render: (c) => (
      <div className="d-flex flex-wrap gap-1">
        {c.drivingLicense?.length > 0
          ? c.drivingLicense.map(dl => <Badge key={dl} status="Selected" label={dl} style={{ padding: '2px 6px', fontSize: '0.65rem' }} className="badge-selected"/>)
          : <Badge status="Rejected" label="None" style={{ padding: '2px 6px', fontSize: '0.65rem' }} className="badge-rejected"/>}
      </div>
    )},
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

  return (
    <div className="pb-4">
      {/* Integrated Header: Title + Search Row */}
      <div className="page-header mb-3 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-2">
        <div style={{ flexShrink: 0 }}>
          <h5 className="fw-bold mb-0">Dashboard: <span className="text-primary">{activeCompany}</span> <span className="text-muted-crm ms-2">({stats?.totalCandidates || 0})</span></h5>
          <p className="mb-0 text-muted-crm" style={{ fontSize: '0.78rem' }}>Real-time recruitment pipeline analytics</p>
        </div>

        {/* Compact Search Group */}
        <div className="d-flex flex-wrap gap-2 align-items-center" style={{ flex: 1, maxWidth: '700px' }}>
          <div className="search-wrapper" style={{ flex: 1, minWidth: '130px' }}>
            <MdSearch className="search-icon" />
            <input 
              placeholder="Name..." 
              value={searchName} 
              onChange={e => setSearchName(e.target.value)}
              className="py-1"
              style={{ fontSize: '0.82rem' }}
            />
          </div>
          <div className="search-wrapper" style={{ flex: 1, minWidth: '130px' }}>
            <MdFilterList className="search-icon" />
            <input 
              placeholder="Technology..." 
              value={searchTech} 
              onChange={e => setSearchTech(e.target.value)}
              className="py-1"
              style={{ fontSize: '0.82rem' }}
            />
          </div>
          <div className="search-wrapper" style={{ flex: 1, minWidth: '130px' }}>
            <MdLocationOn className="search-icon" />
            <input 
              placeholder="Location..." 
              value={searchLoc} 
              onChange={e => setSearchLoc(e.target.value)}
              className="py-1"
              style={{ fontSize: '0.82rem' }}
            />
          </div>
        </div>
      </div>

      {/* Conditional Search Results Surface */}
      {(searchName || searchTech || searchLoc) && (
        <div className="crm-card mb-4 border-primary">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0 text-primary fw-bold" style={{ fontSize: '0.9rem' }}>
              <MdSearch className="me-2" /> Live Search Results
            </h6>
            {isSearching && <div className="spinner-border spinner-border-sm text-primary" />}
          </div>
          <Table columns={resultsColumns} data={results} keyField="_id" />
          <div className="text-center mt-2 border-top pt-2">
            <small className="text-muted-crm" style={{ fontSize: '0.75rem' }}>
              Showing top 5 matches. Visit <a href="/candidates" className="text-primary decoration-none fw-bold">Candidates Menu</a> for full list.
            </small>
          </div>
        </div>
      )}

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border" style={{ color: 'var(--primary)' }} />
        </div>
      ) : (
        <div className="row g-3">
          {cards.map((c) => (
            <div key={c.key} className="col-12 col-sm-6 col-md-4 col-xl-2">
              <Card
                icon={c.icon}
                value={stats?.[c.key]}
                label={c.label}
                colorClass={c.color}
              />
            </div>
          ))}
        </div>
      )}

      {!loading && stats && (
        <div className="row g-3 mt-1">
          {/* Charts Row */}
          <div className="col-12 col-xl-8">
            <StatsChart 
              type="area" 
              title="Submission Trends (Last 6 Months)" 
              data={stats.monthlyStats} 
              dataKey="submissions" 
              nameKey="month" 
            />
          </div>
          <div className="col-12 col-xl-4">
            <StatsChart 
              type="pie" 
              title="Candidate Pipeline Distribution" 
              data={stats.distribution} 
              dataKey="value" 
              nameKey="name" 
            />
          </div>
        </div>
      )}

      <div className="row g-3 mt-1">
        <div className="col-12">
          <div className="crm-card">
            <h6 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 16 }}>
              Quick Action Pipeline Labels
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {[
                'Training', 'Mock Pending', 'Mock Completed', 'Final Mock Cleared',
                'Moved to Marketing', 'Submitted to Vendor', 'Interview Scheduled',
                'Selected', 'Rejected'
              ].map((s) => (
                <Badge key={s} status={s} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
