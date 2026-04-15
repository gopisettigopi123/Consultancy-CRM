import React from 'react';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { MdPerson, MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

const Employees = () => {
    const mockEmployees = [
        { id: 'KNR001', name: 'Gopi Krishna', role: 'Full Stack Developer', email: 'gopi@knr.com', phone: '+91 98765 43210', status: 'Active', location: 'Hyderabad' },
        { id: 'KNR002', name: 'Anjali Sharma', role: 'HR Manager', email: 'anjali@knr.com', phone: '+91 98765 43211', status: 'Active', location: 'Bangalore' },
        { id: 'KNR003', name: 'Rahul Varma', role: 'Recruitment Lead', email: 'rahul@knr.com', phone: '+91 98765 43212', status: 'On Leave', location: 'Hyderabad' },
        { id: 'KNR004', name: 'Sneha Reddy', role: 'Marketing Specialist', email: 'sneha@knr.com', phone: '+91 98765 43213', status: 'Active', location: 'Pune' },
        { id: 'KNR005', name: 'Vikram Singh', role: 'System Admin', email: 'vikram@knr.com', phone: '+91 98765 43214', status: 'Terminated', location: 'Delhi' },
    ];

    const columns = [
        { 
            header: 'Employee', 
            render: (e) => (
                <div className="d-flex align-items-center">
                    <div className="user-avatar me-2" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>{e.name.charAt(0)}</div>
                    <div>
                        <div className="fw-bold">{e.name}</div>
                        <div className="text-muted-crm small">{e.id}</div>
                    </div>
                </div>
            )
        },
        { header: 'Role', accessor: 'role' },
        { 
            header: 'Contact', 
            render: (e) => (
                <div style={{ fontSize: '0.8rem' }}>
                    <div className="d-flex align-items-center gap-1"><MdEmail size={12} /> {e.email}</div>
                    <div className="d-flex align-items-center gap-1 text-muted-crm"><MdPhone size={12} /> {e.phone}</div>
                </div>
            )
        },
        { 
            header: 'Location', 
            render: (e) => (
                <div className="d-flex align-items-center gap-1 small">
                    <MdLocationOn className="text-danger" /> {e.location}
                </div>
            )
        },
        { 
            header: 'Status', 
            render: (e) => (
                <Badge 
                    status={e.status === 'Active' ? 'Selected' : e.status === 'On Leave' ? 'Upcoming' : 'Rejected'} 
                    label={e.status} 
                />
            )
        }
    ];

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h4 className="fw-bold mb-1">Employee Directory</h4>
                <p className="text-muted-crm">Manage internal HR records and employee information.</p>
            </div>
            
            <div className="crm-card">
                <Table columns={columns} data={mockEmployees} keyField="id" />
            </div>
        </div>
    );
};

export default Employees;
