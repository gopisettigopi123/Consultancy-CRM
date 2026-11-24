import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { MdHistory, MdRefresh } from 'react-icons/md';
import { getActivityLogs } from '../services/api';

const SystemLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getActivityLogs();
            if (res.data?.success) {
                setLogs(res.data.data || []);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load activity logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const columns = [
        {
            header: 'User',
            render: (l) => (
                <div>
                    <div className="fw-bold">{l.user?.name || 'System'}</div>
                    {l.user?.email && <div className="text-muted-crm small">{l.user.email}</div>}
                </div>
            )
        },
        {
            header: 'Action / Event',
            render: (l) => (
                <div>
                    <div className="fw-600">{l.action}</div>
                    <div className="text-muted-crm small">{l.details}</div>
                </div>
            )
        },
        {
            header: 'Timestamp',
            render: (l) => (
                <span className="text-muted-crm small">
                    {l.timestamp ? moment(l.timestamp).format('YYYY-MM-DD HH:mm:ss') : '-'}
                </span>
            )
        },
        {
            header: 'Status',
            render: () => <Badge status="Selected" label="Recorded" />
        }
    ];

    return (
        <div className="container-fluid py-4">
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="fw-bold mb-1"><MdHistory className="me-2 text-primary" />System Audit Logs</h4>
                    <p className="text-muted-crm mb-0">Trace all administrative actions and security events.</p>
                </div>
                <button className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1" onClick={fetchLogs} disabled={loading}>
                    <MdRefresh /> Refresh
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="crm-card">
                {loading ? (
                    <p className="p-3 text-muted-crm mb-0">Loading activity logs...</p>
                ) : logs.length === 0 ? (
                    <p className="p-3 text-muted-crm mb-0">No activity logs recorded yet.</p>
                ) : (
                    <Table columns={columns} data={logs} keyField="_id" />
                )}
            </div>
        </div>
    );
};

export default SystemLogs;
