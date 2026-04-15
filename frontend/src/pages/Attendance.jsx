import React from 'react';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { MdAccessTime, MdLogin, MdLogout } from 'react-icons/md';

const Attendance = () => {
    const mockAttendance = [
        { id: 1, name: 'Gopi Krishna', date: '2026-04-08', checkIn: '09:05 AM', checkOut: '06:15 PM', status: 'Present', duration: '9h 10m' },
        { id: 2, name: 'Anjali Sharma', date: '2026-04-08', checkIn: '09:15 AM', checkOut: '06:00 PM', status: 'Present', duration: '8h 45m' },
        { id: 3, name: 'Rahul Varma', date: '2026-04-08', checkIn: '-', checkOut: '-', status: 'Absent', duration: '-' },
        { id: 4, name: 'Sneha Reddy', date: '2026-04-08', checkIn: '10:30 AM', checkOut: '07:30 PM', status: 'Late', duration: '9h 00m' },
        { id: 5, name: 'Vikram Singh', date: '2026-04-08', checkIn: '08:50 AM', checkOut: '05:50 PM', status: 'Present', duration: '9h 00m' },
    ];

    const columns = [
        { header: 'Date', accessor: 'date' },
        { header: 'Employee', render: (a) => <span className="fw-bold">{a.name}</span> },
        { 
            header: 'Check In', 
            render: (a) => (
                <span className="text-success small d-flex align-items-center gap-1">
                    <MdLogin /> {a.checkIn}
                </span>
            )
        },
        { 
            header: 'Check Out', 
            render: (a) => (
                <span className="text-danger small d-flex align-items-center gap-1">
                    <MdLogout /> {a.checkOut}
                </span>
            )
        },
        { 
            header: 'Duration', 
            render: (a) => (
                <span className="d-flex align-items-center gap-1 small text-muted-crm">
                    <MdAccessTime /> {a.duration}
                </span>
            )
        },
        { 
            header: 'Status', 
            render: (a) => (
                <Badge 
                    status={a.status === 'Present' ? 'Selected' : a.status === 'Late' ? 'Upcoming' : 'Rejected'} 
                    label={a.status} 
                />
            )
        }
    ];

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h4 className="fw-bold mb-1">Attendance Tracker</h4>
                <p className="text-muted-crm">Daily check-in/out logs for CRM staff.</p>
            </div>
            
            <div className="crm-card">
                <Table columns={columns} data={mockAttendance} keyField="id" />
            </div>
        </div>
    );
};

export default Attendance;
