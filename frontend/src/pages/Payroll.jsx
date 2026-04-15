import React from 'react';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { MdPayments, MdCalendarMonth, MdReceiptLong } from 'react-icons/md';

const Payroll = () => {
    const mockPayroll = [
        { id: 'PAY-001', employee: 'Gopi Krishna', amount: '₹85,000', month: 'March 2026', status: 'Paid', date: '2026-03-31' },
        { id: 'PAY-002', employee: 'Anjali Sharma', amount: '₹72,000', month: 'March 2026', status: 'Paid', date: '2026-03-31' },
        { id: 'PAY-003', employee: 'Rahul Varma', month: 'March 2026', amount: '₹65,000', status: 'Processing', date: '-' },
        { id: 'PAY-004', employee: 'Sneha Reddy', amount: '₹58,000', month: 'March 2026', status: 'Paid', date: '2026-03-31' },
        { id: 'PAY-005', employee: 'Suresh Kumar', amount: '₹45,000', month: 'March 2026', status: 'On Hold', date: '-' },
    ];

    const columns = [
        { header: 'Payment ID', accessor: 'id' },
        { header: 'Employee Name', accessor: 'employee' },
        { header: 'Gross Amount', accessor: 'amount' },
        { 
            header: 'Pay Period', 
            render: (p) => (
                <span className="d-flex align-items-center gap-1 small">
                    <MdCalendarMonth /> {p.month}
                </span>
            )
        },
        { 
            header: 'Disbursement Date', 
            render: (p) => <span className="text-muted-crm small">{p.date}</span>
        },
        { 
            header: 'Status', 
            render: (p) => (
                <Badge 
                    status={p.status === 'Paid' ? 'Selected' : p.status === 'Processing' ? 'Upcoming' : 'Rejected'} 
                    label={p.status} 
                />
            )
        }
    ];

    return (
        <div className="container-fluid py-4">
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="fw-bold mb-1">Payroll Management</h4>
                    <p className="text-muted-crm">Track salary disbursements and monthly compensation.</p>
                </div>
                <div className="stat-card py-2 px-3" style={{ minHeight: 'auto', width: 'auto', gap: '10px' }}>
                    <div className="stat-icon purple" style={{ width: 32, height: 32, fontSize: '1rem' }}><MdPayments /></div>
                    <div>
                        <div className="small text-muted-crm">Total Payout (Mar)</div>
                        <div className="fw-bold">₹3,25,000</div>
                    </div>
                </div>
            </div>
            
            <div className="crm-card">
                <Table columns={columns} data={mockPayroll} keyField="id" />
            </div>
        </div>
    );
};

export default Payroll;
