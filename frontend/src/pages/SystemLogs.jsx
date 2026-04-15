import React from 'react';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { MdHistory, MdSecurity, MdInfo, MdWarning } from 'react-icons/md';

const SystemLogs = () => {
    const mockLogs = [
        { id: 1024, user: 'Admin', action: 'Update Role', target: 'HR Manager', time: '2 mins ago', level: 'Info' },
        { id: 1023, user: 'Gopi Krishna', action: 'Login Success', target: 'System', time: '15 mins ago', level: 'Info' },
        { id: 1022, user: 'System', action: 'Failed Login Attempt', target: 'admin@knr.com', time: '1 hour ago', level: 'Warning' },
        { id: 1021, user: 'Admin', action: 'Delete Candidate', target: 'ID #54228', time: '3 hours ago', level: 'Info' },
        { id: 1020, user: 'Admin', action: 'Change Permission', target: 'Marketing Team', time: 'Yesterday', level: 'Critical' },
    ];

    const columns = [
        { header: 'Log ID', accessor: 'id' },
        { 
            header: 'User', 
            render: (l) => <span className="fw-bold">{l.user}</span>
        },
        { 
            header: 'Action / Event', 
            render: (l) => (
                <div>
                    <div className="fw-600">{l.action}</div>
                    <div className="text-muted-crm small">Target: {l.target}</div>
                </div>
            )
        },
        { header: 'Timestamp', accessor: 'time' },
        { 
            header: 'Level', 
            render: (l) => {
                const colors = { Info: 'Selected', Warning: 'Upcoming', Critical: 'Rejected' };
                const icons = { Info: <MdInfo />, Warning: <MdWarning />, Critical: <MdSecurity /> };
                return (
                    <div className="d-flex align-items-center gap-1">
                        <Badge status={colors[l.level]} label={l.level} />
                    </div>
                );
            }
        }
    ];

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h4 className="fw-bold mb-1"><MdHistory className="me-2 text-primary" />System Audit Logs</h4>
                <p className="text-muted-crm">Trace all administrative actions and security events.</p>
            </div>
            
            <div className="crm-card">
                <Table columns={columns} data={mockLogs} keyField="id" />
            </div>
        </div>
    );
};

export default SystemLogs;
