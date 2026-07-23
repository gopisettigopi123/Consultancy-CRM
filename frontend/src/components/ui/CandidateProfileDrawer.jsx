import React, { useState, useEffect, useCallback } from 'react';
import {
  MdClose, MdEmail, MdPhone, MdLocationOn, MdSchool, MdQuiz,
  MdCampaign, MdSend, MdCheckCircle, MdCancel, MdAccessTime,
  MdPerson, MdLink, MdContentCopy, MdCheck, MdMessage,
  MdDownload, MdEvent, MdBusiness, MdTrendingUp, MdStar,
  MdDescription, MdArrowForward
} from 'react-icons/md';
import {
  getCandidate, getTrainingByCandidate,
  getMocksByCandidate, getMarketingByCandidate,
  getSubmissionsByCandidate
} from '../../services/api';
import Badge from './Badge';
import { copyToClipboard } from '../../utils/clipboard';
import moment from 'moment';

// ─── Skeleton Loader ───
const Skeleton = ({ width = '100%', height = 16, radius = 6 }) => (
  <div className="skeleton-pulse" style={{ width, height, borderRadius: radius }} />
);

const SkeletonProfile = () => (
  <div className="cpd-skeleton">
    <div className="d-flex align-items-center gap-3 mb-4">
      <Skeleton width={72} height={72} radius={36} />
      <div className="flex-fill">
        <Skeleton width="60%" height={20} />
        <Skeleton width="40%" height={14} />
        <Skeleton width="50%" height={14} />
      </div>
    </div>
    {[1,2,3,4,5].map(i => <Skeleton key={i} height={18} />)}
  </div>
);

// ─── Empty State ───
const EmptyState = ({ icon: Icon, message }) => (
  <div className="cpd-empty-state">
    <Icon size={40} />
    <p>{message}</p>
  </div>
);

// ─── Stat Mini Card ───
const StatMini = ({ icon, label, value, color = 'purple' }) => (
  <div className="cpd-stat-mini">
    <div className={`cpd-stat-icon ${color}`}>{icon}</div>
    <div>
      <div className="cpd-stat-value">{value ?? 0}</div>
      <div className="cpd-stat-label">{label}</div>
    </div>
  </div>
);

// ─── Timeline Item ───
const TimelineItem = ({ date, title, subtitle, status, isLast }) => (
  <div className={`cpd-timeline-item ${isLast ? 'last' : ''}`}>
    <div className="cpd-timeline-dot">
      {status === 'Selected' ? <MdCheckCircle size={16} className="text-success" /> :
       status === 'Rejected' ? <MdCancel size={16} className="text-danger" /> :
       status === 'Interview Scheduled' ? <MdEvent size={16} className="text-warning" /> :
       <MdAccessTime size={16} />}
    </div>
    <div className="cpd-timeline-content">
      <div className="cpd-timeline-date">{date ? moment(date).format('DD MMM YYYY') : '—'}</div>
      <div className="cpd-timeline-title">{title}</div>
      {subtitle && <div className="cpd-timeline-subtitle">{subtitle}</div>}
      {status && <Badge status={status} style={{ fontSize: '0.65rem', padding: '2px 8px', marginTop: 4 }} />}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const CandidateProfileDrawer = ({ candidateId, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState(null);
  const [training, setTraining] = useState([]);
  const [mocks, setMocks] = useState([]);
  const [marketing, setMarketing] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [copied, setCopied] = useState(false);

  // Fetch all candidate data
  const fetchData = useCallback(async () => {
    if (!candidateId) return;
    setLoading(true);
    try {
      const [candRes, trainRes, mockRes, mktRes, subRes] = await Promise.all([
        getCandidate(candidateId),
        getTrainingByCandidate(candidateId).catch(() => ({ data: { data: [] } })),
        getMocksByCandidate(candidateId).catch(() => ({ data: { data: [] } })),
        getMarketingByCandidate(candidateId).catch(() => ({ data: { data: [] } })),
        getSubmissionsByCandidate(candidateId).catch(() => ({ data: { data: [] } })),
      ]);
      setCandidate(candRes.data.data || candRes.data);
      setTraining(Array.isArray(trainRes.data.data) ? trainRes.data.data : [trainRes.data.data].filter(Boolean));
      setMocks(Array.isArray(mockRes.data.data) ? mockRes.data.data : [mockRes.data.data].filter(Boolean));
      setMarketing(Array.isArray(mktRes.data.data) ? mktRes.data.data : [mktRes.data.data].filter(Boolean));
      setSubmissions(Array.isArray(subRes.data.data) ? subRes.data.data : [subRes.data.data].filter(Boolean));
    } catch (e) {
      console.error('Error loading candidate profile:', e);
    } finally {
      setLoading(false);
    }
  }, [candidateId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Escape key support
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Copy profile
  const handleCopyProfile = () => {
    if (!candidate) return;
    const text = [
      `📋 CANDIDATE PROFILE`,
      `Name: ${candidate.fullName}`, `Email: ${candidate.email}`,
      `Phone: ${candidate.phoneNumber}`, `Tech: ${candidate.technology}`,
      `Exp: ${candidate.experience} yr(s)`, `Location: ${candidate.location || 'N/A'}`,
      `DL: ${candidate.drivingLicense?.join(', ') || 'None'}`,
    ].join('\n');
    copyToClipboard(text).then(ok => {
      if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
    });
  };

  // Derived stats
  const totalSubs = submissions.length;
  const selectedSubs = submissions.filter(s => s.status === 'Selected').length;
  const rejectedSubs = submissions.filter(s => s.status === 'Rejected').length;
  const interviewSubs = submissions.filter(s => s.status === 'Interview Scheduled').length;
  const mocksPassed = mocks.filter(m => m.status === 'Pass').length;
  const mocksFailed = mocks.filter(m => m.status === 'Fail').length;
  const avgScore = mocks.length > 0 ? (mocks.reduce((a, m) => a + (m.score || 0), 0) / mocks.length).toFixed(1) : '—';

  // Determine pipeline status
  const getPipelineStatus = () => {
    if (selectedSubs > 0) return 'Selected';
    if (interviewSubs > 0) return 'Interview Scheduled';
    if (totalSubs > 0) return 'Submitted to Vendor';
    if (marketing.length > 0) return 'Moved to Marketing';
    if (mocks.some(m => m.status === 'Pass' && m.mockType === 'Final')) return 'Final Mock Cleared';
    if (mocks.length > 0) return 'Mock Completed';
    if (training.length > 0) return 'Training';
    return 'New';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <MdPerson size={16} /> },
    { id: 'training', label: 'Training', icon: <MdSchool size={16} />, count: training.length },
    { id: 'interviews', label: 'Interviews', icon: <MdSend size={16} />, count: totalSubs },
    { id: 'activity', label: 'Activity', icon: <MdTrendingUp size={16} /> },
  ];

  return (
    <div className="cpd-overlay" onClick={onClose}>
      <div className="cpd-drawer" onClick={(e) => e.stopPropagation()}>

        {/* ─── Close Button ─── */}
        <button className="cpd-close-btn" onClick={onClose} title="Close (ESC)">
          <MdClose size={20} />
        </button>

        {loading ? <SkeletonProfile /> : !candidate ? (
          <EmptyState icon={MdPerson} message="Candidate not found" />
        ) : (
          <>
            {/* ═══════ PROFILE HEADER ═══════ */}
            <div className="cpd-header">
              <div className="cpd-avatar">
                {candidate.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="cpd-header-info">
                <h5 className="cpd-name">{candidate.fullName}</h5>
                <div className="cpd-tech-badge">
                  <Badge status={candidate.technology} label={candidate.technology} />
                  <span className="cpd-exp">{candidate.experience} yr{candidate.experience !== 1 ? 's' : ''} exp</span>
                </div>
                <Badge status={getPipelineStatus()} style={{ marginTop: 6 }} />
              </div>
            </div>

            {/* ─── Quick Actions ─── */}
            <div className="cpd-quick-actions">
              {candidate.email && (
                <a href={`mailto:${candidate.email}`} className="cpd-action-btn" title="Send Email">
                  <MdEmail size={16} /> Email
                </a>
              )}
              {candidate.whatsappNumber && (
                <a href={`https://wa.me/${candidate.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="cpd-action-btn whatsapp" title="WhatsApp">
                  <MdMessage size={16} /> WhatsApp
                </a>
              )}
              {candidate.linkedinProfile && (
                <a href={candidate.linkedinProfile} target="_blank" rel="noreferrer" className="cpd-action-btn linkedin" title="LinkedIn">
                  <MdLink size={16} /> LinkedIn
                </a>
              )}
              <button className="cpd-action-btn" onClick={handleCopyProfile} title="Copy Profile">
                {copied ? <MdCheck size={16} /> : <MdContentCopy size={16} />} {copied ? 'Copied!' : 'Copy'}
              </button>
              {candidate.resumeUrl && (
                <a href={candidate.resumeUrl} target="_blank" rel="noreferrer" className="cpd-action-btn resume" title="Download Resume">
                  <MdDownload size={16} /> Resume
                </a>
              )}
            </div>

            {/* ─── Contact Details ─── */}
            <div className="cpd-contact-strip">
              <div className="cpd-contact-item">
                <MdEmail size={14} /><span>{candidate.email}</span>
              </div>
              <div className="cpd-contact-item">
                <MdPhone size={14} /><span>{candidate.phoneNumber}</span>
              </div>
              {candidate.location && (
                <div className="cpd-contact-item">
                  <MdLocationOn size={14} /><span>{candidate.location}</span>
                </div>
              )}
              {candidate.drivingLicense?.length > 0 && (
                <div className="cpd-contact-item">
                  <MdDescription size={14} />
                  <span>DL: {candidate.drivingLicense.join(', ')}</span>
                </div>
              )}
            </div>

            {/* ═══════ STATS ROW ═══════ */}
            <div className="cpd-stats-row">
              <StatMini icon={<MdSend size={16} />} label="Submissions" value={totalSubs} color="purple" />
              <StatMini icon={<MdEvent size={16} />} label="Interviews" value={interviewSubs} color="cyan" />
              <StatMini icon={<MdCheckCircle size={16} />} label="Selected" value={selectedSubs} color="green" />
              <StatMini icon={<MdQuiz size={16} />} label="Mock Score" value={avgScore} color="amber" />
            </div>

            {/* ═══════ TAB BAR ═══════ */}
            <div className="cpd-tab-bar">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`cpd-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count > 0 && <span className="cpd-tab-count">{tab.count}</span>}
                </button>
              ))}
            </div>

            {/* ═══════ TAB CONTENT ═══════ */}
            <div className="cpd-tab-content">
              {/* ──── OVERVIEW TAB ──── */}
              {activeTab === 'overview' && (
                <div className="cpd-tab-panel">
                  {/* Performance Score */}
                  <div className="cpd-section">
                    <h6 className="cpd-section-title"><MdStar size={16} /> Performance Score</h6>
                    <div className="cpd-performance-bar">
                      <div className="cpd-perf-track">
                        <div
                          className="cpd-perf-fill"
                          style={{
                            width: `${mocks.length > 0 ? (mocksPassed / mocks.length) * 100 : 0}%`
                          }}
                        />
                      </div>
                      <span className="cpd-perf-text">
                        {mocks.length > 0 ? `${((mocksPassed / mocks.length) * 100).toFixed(0)}%` : 'No data'}
                      </span>
                    </div>
                    <div className="cpd-perf-detail">
                      <span><MdCheckCircle size={12} className="text-success" /> {mocksPassed} passed</span>
                      <span><MdCancel size={12} className="text-danger" /> {mocksFailed} failed</span>
                      <span><MdQuiz size={12} /> {mocks.length} total</span>
                    </div>
                  </div>

                  {/* Submission Success Rate */}
                  {totalSubs > 0 && (
                    <div className="cpd-section">
                      <h6 className="cpd-section-title"><MdTrendingUp size={16} /> Submission Analytics</h6>
                      <div className="cpd-analytics-grid">
                        <div className="cpd-analytics-item">
                          <div className="cpd-analytics-value">{totalSubs}</div>
                          <div className="cpd-analytics-label">Total</div>
                        </div>
                        <div className="cpd-analytics-item success">
                          <div className="cpd-analytics-value">{selectedSubs}</div>
                          <div className="cpd-analytics-label">Selected</div>
                        </div>
                        <div className="cpd-analytics-item warning">
                          <div className="cpd-analytics-value">{interviewSubs}</div>
                          <div className="cpd-analytics-label">Interviewing</div>
                        </div>
                        <div className="cpd-analytics-item danger">
                          <div className="cpd-analytics-value">{rejectedSubs}</div>
                          <div className="cpd-analytics-label">Rejected</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Skills / Tech Stack */}
                  <div className="cpd-section">
                    <h6 className="cpd-section-title"><MdSchool size={16} /> Technology & Skills</h6>
                    <div className="d-flex flex-wrap gap-2">
                      <Badge status="Selected" label={candidate.technology} />
                      {candidate.drivingLicense?.map(dl => (
                        <Badge key={dl} status="mock" label={`DL: ${dl}`} style={{ fontSize: '0.7rem' }} />
                      ))}
                    </div>
                  </div>

                  {/* Marketing Info */}
                  {marketing.length > 0 && (
                    <div className="cpd-section">
                      <h6 className="cpd-section-title"><MdCampaign size={16} /> Marketing Status</h6>
                      {marketing.map((m, i) => (
                        <div key={i} className="cpd-detail-row">
                          <div className="cpd-detail-item">
                            <span className="cpd-detail-label">Marketing Email</span>
                            <span className="cpd-detail-value">{m.marketingEmailId}</span>
                          </div>
                          <div className="cpd-detail-item">
                            <span className="cpd-detail-label">Start Date</span>
                            <span className="cpd-detail-value">{m.marketingStartDate ? moment(m.marketingStartDate).format('DD MMM YYYY') : '—'}</span>
                          </div>
                          <div className="cpd-detail-item">
                            <span className="cpd-detail-label">Vendor Submissions</span>
                            <Badge status="Submitted" label={`${m.vendorSubmissionCount || 0} total`} />
                          </div>
                          {m.notes && (
                            <div className="cpd-detail-item full">
                              <span className="cpd-detail-label">Notes</span>
                              <span className="cpd-detail-value">{m.notes}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Candidate Info */}
                  <div className="cpd-section">
                    <h6 className="cpd-section-title"><MdPerson size={16} /> Details</h6>
                    <div className="cpd-detail-row">
                      <div className="cpd-detail-item">
                        <span className="cpd-detail-label">Candidate ID</span>
                        <span className="cpd-detail-value cpd-mono">{candidate._id?.slice(-8).toUpperCase()}</span>
                      </div>
                      <div className="cpd-detail-item">
                        <span className="cpd-detail-label">Registered</span>
                        <span className="cpd-detail-value">{moment(candidate.createdAt).format('DD MMM YYYY')}</span>
                      </div>
                      <div className="cpd-detail-item">
                        <span className="cpd-detail-label">Last Updated</span>
                        <span className="cpd-detail-value">{moment(candidate.updatedAt).fromNow()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ──── TRAINING TAB ──── */}
              {activeTab === 'training' && (
                <div className="cpd-tab-panel">
                  {training.length === 0 && mocks.length === 0 ? (
                    <EmptyState icon={MdSchool} message="No training or mock data found for this candidate" />
                  ) : (
                    <>
                      {/* Training Records */}
                      {training.length > 0 && (
                        <div className="cpd-section">
                          <h6 className="cpd-section-title"><MdSchool size={16} /> Training Records</h6>
                          {training.map((t, i) => (
                            <div key={i} className="cpd-card-item">
                              <div className="cpd-card-header">
                                <span className="fw-bold">{t.batchName}</span>
                                <Badge status={t.finalMock ? 'Final Mock Cleared' : t.mockGiven ? 'Mock Completed' : 'Training'} />
                              </div>
                              <div className="cpd-detail-row">
                                <div className="cpd-detail-item">
                                  <span className="cpd-detail-label">1st Session</span>
                                  <span className="cpd-detail-value">{t.firstSession ? moment(t.firstSession).format('DD MMM YY') : '—'}</span>
                                </div>
                                <div className="cpd-detail-item">
                                  <span className="cpd-detail-label">2nd Session</span>
                                  <span className="cpd-detail-value">{t.secondSession ? moment(t.secondSession).format('DD MMM YY') : '—'}</span>
                                </div>
                                <div className="cpd-detail-item">
                                  <span className="cpd-detail-label">Marks</span>
                                  <span className="cpd-detail-value fw-bold">{t.marks || '—'}</span>
                                </div>
                              </div>
                              <div className="d-flex gap-2 mt-2">
                                <Badge status={t.mockGiven ? 'Selected' : 'Rejected'} label={t.mockGiven ? 'Mock Given' : 'Mock Pending'} style={{ fontSize: '0.65rem' }} />
                                <Badge status={t.movedToCallTraining ? 'Selected' : 'Rejected'} label={t.movedToCallTraining ? 'Call Training ✓' : 'No Call Training'} style={{ fontSize: '0.65rem' }} />
                                <Badge status={t.finalMock ? 'Selected' : 'Rejected'} label={t.finalMock ? 'Final Mock ✓' : 'Final Pending'} style={{ fontSize: '0.65rem' }} />
                              </div>
                              {t.notes && <div className="cpd-note">{t.notes}</div>}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Mock Interview Results */}
                      {mocks.length > 0 && (
                        <div className="cpd-section">
                          <h6 className="cpd-section-title"><MdQuiz size={16} /> Mock Interview Results</h6>
                          {mocks.map((m, i) => (
                            <div key={i} className="cpd-card-item">
                              <div className="cpd-card-header">
                                <span className="fw-bold">{m.mockType} Mock</span>
                                <Badge status={m.status === 'Pass' ? 'Selected' : 'Rejected'} label={m.status} />
                              </div>
                              <div className="cpd-detail-row">
                                <div className="cpd-detail-item">
                                  <span className="cpd-detail-label">Score</span>
                                  <span className="cpd-detail-value fw-bold cpd-score">{m.score ?? '—'}<span className="cpd-score-max">/10</span></span>
                                </div>
                                <div className="cpd-detail-item">
                                  <span className="cpd-detail-label">Date</span>
                                  <span className="cpd-detail-value">{m.date ? moment(m.date).format('DD MMM YYYY') : '—'}</span>
                                </div>
                              </div>
                              {m.feedback && <div className="cpd-note">{m.feedback}</div>}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* ──── INTERVIEWS TAB ──── */}
              {activeTab === 'interviews' && (
                <div className="cpd-tab-panel">
                  {submissions.length === 0 ? (
                    <EmptyState icon={MdSend} message="No submissions or interview data found" />
                  ) : (
                    <>
                      {/* Summary Stats */}
                      <div className="cpd-stats-row compact">
                        <StatMini icon={<MdSend size={14} />} label="Submitted" value={submissions.filter(s=>s.status==='Submitted').length} color="purple" />
                        <StatMini icon={<MdEvent size={14} />} label="Interview" value={interviewSubs} color="cyan" />
                        <StatMini icon={<MdCheckCircle size={14} />} label="Selected" value={selectedSubs} color="green" />
                        <StatMini icon={<MdCancel size={14} />} label="Rejected" value={rejectedSubs} color="red" />
                      </div>

                      {/* Interview Timeline */}
                      <div className="cpd-section">
                        <h6 className="cpd-section-title"><MdAccessTime size={16} /> Submission Timeline</h6>
                        <div className="cpd-timeline">
                          {submissions.map((s, i) => (
                            <TimelineItem
                              key={s._id || i}
                              date={s.submissionDate}
                              title={`${s.clientName} — ${s.vendor?.vendorName || 'Unknown Vendor'}`}
                              subtitle={s.rate ? `Rate: $${s.rate}/hr` : null}
                              status={s.status}
                              isLast={i === submissions.length - 1}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ──── ACTIVITY TAB ──── */}
              {activeTab === 'activity' && (
                <div className="cpd-tab-panel">
                  <div className="cpd-section">
                    <h6 className="cpd-section-title"><MdAccessTime size={16} /> Recent Activity</h6>
                    <div className="cpd-timeline">
                      {/* Build unified timeline from all data */}
                      {[
                        ...submissions.map(s => ({
                          date: s.submissionDate || s.createdAt,
                          title: `Submission: ${s.clientName}`,
                          subtitle: `via ${s.vendor?.vendorName || 'Vendor'}`,
                          status: s.status,
                        })),
                        ...mocks.map(m => ({
                          date: m.date || m.createdAt,
                          title: `${m.mockType} Mock Interview`,
                          subtitle: `Score: ${m.score ?? '—'}/10`,
                          status: m.status === 'Pass' ? 'Selected' : 'Rejected',
                        })),
                        ...training.map(t => ({
                          date: t.firstSession || t.createdAt,
                          title: `Training: ${t.batchName}`,
                          subtitle: t.marks ? `Marks: ${t.marks}` : null,
                          status: t.finalMock ? 'Final Mock Cleared' : 'Training',
                        })),
                        ...marketing.map(m => ({
                          date: m.marketingStartDate || m.createdAt,
                          title: 'Moved to Marketing',
                          subtitle: `Email: ${m.marketingEmailId}`,
                          status: 'Moved to Marketing',
                        })),
                      ]
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((item, i, arr) => (
                        <TimelineItem key={i} {...item} isLast={i === arr.length - 1} />
                      ))}
                      {submissions.length === 0 && mocks.length === 0 && training.length === 0 && marketing.length === 0 && (
                        <EmptyState icon={MdTrendingUp} message="No activity recorded yet" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CandidateProfileDrawer;
