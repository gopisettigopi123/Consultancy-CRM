import React, { useState, useEffect } from 'react';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { MdAccountBalance, MdTrendingUp, MdTrendingDown, MdEvent, MdWarning } from 'react-icons/md';
import { getAllPayments } from '../services/api';

const AccountPage = () => {
    const mockInvoices = [
        { id: 'INV-7701', client: 'Google', amount: '₹12,50,000', type: 'Credit', status: 'Settled', date: '2026-04-01' },
        { id: 'INV-7702', client: 'Microsoft', amount: '₹8,20,000', type: 'Credit', status: 'Pending', date: '2026-04-05' },
        { id: 'INV-7703', client: 'AWS Cloud', amount: '₹1,50,000', type: 'Debit', status: 'Settled', date: '2026-03-28' },
        { id: 'INV-7704', client: 'DigitalOcean', amount: '₹45,000', type: 'Debit', status: 'Settled', date: '2026-03-30' },
        { id: 'INV-7705', client: 'Meta Platforms', amount: '₹15,00,000', type: 'Credit', status: 'Upcoming', date: '2026-04-20' },
    ];

    const columns = [
        { header: 'Invoice #', accessor: 'id' },
        { header: 'Client / Vendor', accessor: 'client' },
        { 
            header: 'Amount', 
            render: (i) => (
                <span className={`fw-bold ${i.type === 'Credit' ? 'text-success' : 'text-danger'}`}>
                    {i.type === 'Credit' ? '+' : '-'} {i.amount}
                </span>
            )
        },
        { 
            header: 'Type', 
            render: (i) => (
                <div className="d-flex align-items-center gap-1 small">
                    {i.type === 'Credit' ? <MdTrendingUp className="text-success" /> : <MdTrendingDown className="text-danger" />}
                    {i.type}
                </div>
            )
        },
        { header: 'Due Date', accessor: 'date' },
        { 
            header: 'Status', 
            render: (i) => <Badge status={i.status === 'Settled' ? 'Selected' : i.status === 'Pending' ? 'Upcoming' : 'Rejected'} label={i.status} />
        }
    ];

    // Candidate Timeline Data
    const [candidatePayments, setCandidatePayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await getAllPayments();
                if (res.data && res.data.success) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const formatted = res.data.data.map(payment => {
                        const dueDate = new Date(payment.dueDate);
                        dueDate.setHours(0, 0, 0, 0);
                        
                        const diffTime = dueDate - today;
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        
                        let timelineStatus = payment.status; // fallback to 'Upcoming' or 'Paid'
                        
                        if (payment.status !== 'Paid') {
                            if (diffDays < 0) timelineStatus = 'Overdue';
                            else if (diffDays <= 2) timelineStatus = 'Due in 2 Days';
                            else if (diffDays <= 7) timelineStatus = 'Next Week';
                            else timelineStatus = 'Upcoming';
                        }
                        
                        return {
                            id: payment._id,
                            candidate: payment.candidate?.fullName || 'Unknown',
                            company: payment.company,
                            amount: `₹${payment.amount.toLocaleString()}`,
                            dueDate: payment.dueDate.split('T')[0],
                            status: timelineStatus
                        };
                    });
                    setCandidatePayments(formatted);
                }
            } catch (error) {
                console.error("Failed to fetch payments", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    const getTimelineBadgeProps = (status) => {
        switch (status) {
            case 'Paid': return { status: 'success', label: 'Paid' };
            case 'Overdue': return { status: 'reject', label: 'Overdue' };
            case 'Due in 2 Days': return { status: 'submit', label: 'Due in 2 Days' };
            case 'Next Week': return { status: 'interview', label: 'Next Week' };
            default: return { status: 'training', label: status };
        }
    };

    const candidateColumns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Candidate Name', accessor: 'candidate' },
        { header: 'Company', accessor: 'company' },
        { 
            header: 'Renewal Amount', 
            render: (i) => <span className="fw-bold">{i.amount}</span>
        },
        { 
            header: 'Due Date', 
            render: (i) => {
                let textClass = 'text-muted-crm';
                if (i.status === 'Overdue') textClass = 'text-danger fw-bold';
                else if (i.status === 'Due in 2 Days') textClass = 'text-warning fw-bold';
                else if (i.status === 'Next Week') textClass = 'text-info fw-bold';
                
                return (
                    <div className={`d-flex align-items-center gap-1 ${textClass}`}>
                        <MdEvent /> {i.dueDate}
                    </div>
                );
            }
        },
        { 
            header: 'Timeline Status', 
            render: (i) => {
                const badgeProps = getTimelineBadgeProps(i.status);
                return (
                    <div className="d-flex align-items-center gap-2">
                        {i.status === 'Overdue' && <MdWarning className="text-danger" />}
                        <Badge status={badgeProps.status} label={badgeProps.label} />
                    </div>
                );
            }
        }
    ];

    return (
        <div className="container-fluid py-4">
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="fw-bold mb-1"><MdAccountBalance className="me-2 text-primary" />Accounts & Finance</h4>
                    <p className="text-muted-crm">Financial records, client invoicing, and vendor payouts.</p>
                </div>
                <div className="stat-card py-2 px-3" style={{ minHeight: 'auto', width: 'auto', gap: '10px' }}>
                    <div className="stat-icon green" style={{ width: 32, height: 32, fontSize: '1rem' }}><MdTrendingUp /></div>
                    <div>
                        <div className="small text-muted-crm">Q2 Revenue</div>
                        <div className="fw-bold">₹28.7L</div>
                    </div>
                </div>
            </div>
            
            <h5 className="fw-bold mb-3 mt-4">Candidate Payment Timeline</h5>
            <div className="crm-card mb-4">
                {loading ? <p className="p-3 text-muted-crm mb-0">Loading timeline...</p> : (
                    <Table columns={candidateColumns} data={candidatePayments} keyField="id" />
                )}
            </div>

            <h5 className="fw-bold mb-3">General Invoices</h5>
            <div className="crm-card">
                <Table columns={columns} data={mockInvoices} keyField="id" />
            </div>
        </div>
    );
};

export default AccountPage;
