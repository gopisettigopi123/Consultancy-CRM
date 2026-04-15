import React, { useState, useEffect } from 'react';
import Modal, { ModalBody, ModalFooter } from './Modal';
import Button from './Button';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, forgotPassword, resetPassword } from '../../services/api';
import { MdPerson, MdEmail, MdPhone, MdLock, MdVisibility, MdVisibilityOff, MdCheckCircle } from 'react-icons/md';

const ProfileModal = ({ show, onClose }) => {
    const { user, login } = useAuth();
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'security'
    
    // Profile State
    const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
    const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
    
    // Security State (OTP Flow)
    const [securityStep, setSecurityStep] = useState(1); // 1: Send OTP, 2: Verify & Change
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [securityMsg, setSecurityMsg] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show && user) {
            setProfileForm({ name: user.name || '', phone: user.phone || '' });
            setActiveTab('profile');
            setSecurityStep(1);
            setOtp('');
            setNewPassword('');
            setProfileMsg({ type: '', text: '' });
            setSecurityMsg({ type: '', text: '' });
        }
    }, [show, user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setProfileMsg({ type: '', text: '' });
        try {
            const { data } = await updateProfile(profileForm);
            if (data.success) {
                setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
                
                // Update local context
                const currentToken = localStorage.getItem('crm_token');
                login(data, currentToken);
            }
        } catch (error) {
            setProfileMsg({ type: 'danger', text: error.response?.data?.error || 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async () => {
        setLoading(true);
        setSecurityMsg({ type: '', text: '' });
        try {
            await forgotPassword({ email: user.email });
            setSecurityStep(2);
            setSecurityMsg({ type: 'success', text: 'OTP sent! Please check your terminal/email.' });
        } catch (error) {
            setSecurityMsg({ type: 'danger', text: error.response?.data?.error || 'Failed to send OTP.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSecurityMsg({ type: '', text: '' });
        try {
            await resetPassword({ email: user.email, otp, newPassword });
            setSecurityStep(3); // success view
        } catch (error) {
            setSecurityMsg({ type: 'danger', text: error.response?.data?.error || 'Invalid OTP or failed to change.' });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <Modal show={show} onClose={onClose} title="My Profile Settings" size="md">
            <ModalBody>
                {/* Tabs */}
                <div className="d-flex border-bottom mb-4">
                    <button 
                        className={`btn flex-fill rounded-0 py-2 fw-bold ${activeTab === 'profile' ? 'border-primary border-bottom border-3 text-primary' : 'text-muted-crm border-0'}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile Details
                    </button>
                    <button 
                        className={`btn flex-fill rounded-0 py-2 fw-bold ${activeTab === 'security' ? 'border-primary border-bottom border-3 text-primary' : 'text-muted-crm border-0'}`}
                        onClick={() => setActiveTab('security')}
                    >
                        Security & Password
                    </button>
                </div>

                {activeTab === 'profile' && (
                    <form onSubmit={handleUpdateProfile}>
                        {profileMsg.text && (
                            <div className={`alert alert-${profileMsg.type} py-2 small mb-3`}>{profileMsg.text}</div>
                        )}
                        
                        <div className="mb-3">
                            <label className="form-label">Email Address (Read-only)</label>
                            <div className="search-wrapper">
                                <MdEmail className="search-icon" />
                                <input 
                                    type="email" 
                                    className="bg-light-crm cursor-not-allowed" 
                                    value={user.email} 
                                    readOnly 
                                    disabled
                                    style={{ paddingLeft: '36px' }}
                                />
                            </div>
                            <small className="text-muted-crm" style={{ fontSize: '0.7rem' }}>Email cannot be changed arbitrarily for security.</small>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">System Role</label>
                            <input 
                                type="text" 
                                className="form-control bg-light-crm cursor-not-allowed" 
                                value={user.role?.name || user.role} 
                                readOnly 
                                disabled
                            />
                            <small className="text-muted-crm" style={{ fontSize: '0.7rem' }}>Only Admins can modify your role.</small>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Full Name</label>
                            <div className="search-wrapper">
                                <MdPerson className="search-icon" />
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={profileForm.name} 
                                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                                    required 
                                    style={{ paddingLeft: '36px' }}
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Phone Number</label>
                            <div className="search-wrapper">
                                <MdPhone className="search-icon" />
                                <input 
                                    type="tel" 
                                    className="form-control" 
                                    placeholder="+91 90000 00000"
                                    value={profileForm.phone} 
                                    onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                                    style={{ paddingLeft: '36px' }}
                                />
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="outline" type="button" onClick={onClose} label="Close" disabled={loading} />
                            <Button variant="primary" type="submit" label={loading ? "Updating..." : "Save Changes"} icon={<MdPerson />} disabled={loading} />
                        </div>
                    </form>
                )}

                {activeTab === 'security' && (
                    <div>
                        {securityMsg.text && securityStep !== 3 && (
                            <div className={`alert alert-${securityMsg.type} py-2 small mb-3`}>{securityMsg.text}</div>
                        )}

                        {securityStep === 1 && (
                            <div className="text-center py-4">
                                <div className="mb-3 text-muted-crm">
                                    To change your password, we'll send a secure One-Time Password (OTP) to your registered email address (<strong>{user.email}</strong>).
                                </div>
                                <Button 
                                    variant="primary" 
                                    onClick={handleSendOTP} 
                                    label={loading ? "Sending..." : "Send Reset OTP"} 
                                    icon={<MdEmail />} 
                                    disabled={loading} 
                                    className="w-100 justify-content-center"
                                />
                            </div>
                        )}

                        {securityStep === 2 && (
                            <form onSubmit={handleChangePassword}>
                                <div className="mb-3">
                                    <label className="form-label">Enter 6-digit OTP</label>
                                    <input 
                                        type="text" 
                                        className="form-control text-center fw-bold" 
                                        maxLength={6} 
                                        placeholder="000000"
                                        value={otp}
                                        onChange={e => setOtp(e.target.value)}
                                        required
                                        style={{ letterSpacing: '4px', fontSize: '1.2rem' }}
                                    />
                                    <div className="text-center mt-1" style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>
                                        Check your terminal for the simulated OTP.
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">New Password</label>
                                    <div className="search-wrapper position-relative">
                                        <MdLock className="search-icon" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="form-control"
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            style={{ width: '100%', paddingLeft: '36px', paddingRight: '40px' }}
                                        />
                                        <div 
                                            className="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{ zIndex: 5, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
                                        >
                                            {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end gap-2">
                                    <Button variant="outline" type="button" onClick={() => setSecurityStep(1)} label="Cancel" disabled={loading} />
                                    <Button variant="danger" type="submit" label={loading ? "Updating..." : "Update Password"} icon={<MdLock />} disabled={loading || otp.length !== 6 || newPassword.length < 5} />
                                </div>
                            </form>
                        )}

                        {securityStep === 3 && (
                            <div className="text-center py-4">
                                <MdCheckCircle size={50} color="var(--success)" className="mb-3" />
                                <h5 className="fw-bold mb-2">Password Updated!</h5>
                                <p className="text-muted-crm small">Your secure login credentials have been changed successfully.</p>
                                <Button variant="primary" onClick={onClose} label="Done" />
                            </div>
                        )}
                    </div>
                )}
            </ModalBody>
        </Modal>
    );
};

export default ProfileModal;
