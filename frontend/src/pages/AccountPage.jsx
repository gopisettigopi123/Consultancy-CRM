import React from 'react';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { MdAccountBalance, MdTrendingUp, MdTrendingDown } from 'react-icons/md';

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
            
            <div className="crm-card">
                <Table columns={columns} data={mockInvoices} keyField="id" />
            </div>
        </div>
    );
};

export default AccountPage;
