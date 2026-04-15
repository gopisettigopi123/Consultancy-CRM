import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../services/api';
import { MdEmail, MdLock, MdPeople, MdArrowBack, MdCheckCircle } from 'react-icons/md';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Success
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await forgotPassword({ email });
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP. Check your email.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return setError('Passwords do not match');
        }
        setError('');
        setLoading(true);
        try {
            await resetPassword({ email, otp, newPassword });
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid OTP or reset failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="logo-area">
                    <div className="logo-icon">
                        <MdPeople size={28} color="white" />
                    </div>
                    <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>CRM Pro</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        Account Recovery
                    </p>
                </div>

                {error && (
                    <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '0.85rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleSendOTP} className="crm-form">
                        <div className="mb-4">
                            <label className="form-label">Enter your registered email</label>
                            <div className="search-wrapper">
                                <MdEmail className="search-icon" />
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{ width: '100%', paddingLeft: '36px' }}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary-crm w-100 justify-content-center" disabled={loading}>
                            {loading ? <span className="spinner-border spinner-border-sm me-2" /> : 'Send OTP'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword} className="crm-form">
                        <div className="mb-3">
                            <label className="form-label">Enter 6-digit OTP</label>
                            <input
                                type="text"
                                className="form-control text-center fw-bold"
                                placeholder="000000"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                style={{ letterSpacing: '4px', fontSize: '1.2rem' }}
                            />
                            <div className="text-center mt-2" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                Check your console for the OTP
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="form-label">New Password</label>
                            <div className="search-wrapper">
                                <MdLock className="search-icon" />
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    style={{ width: '100%', paddingLeft: '36px' }}
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Confirm New Password</label>
                            <div className="search-wrapper">
                                <MdLock className="search-icon" />
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    style={{ width: '100%', paddingLeft: '36px' }}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary-crm w-100 justify-content-center" disabled={loading}>
                            {loading ? <span className="spinner-border spinner-border-sm me-2" /> : 'Reset Password'}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <div className="text-center py-4">
                        <MdCheckCircle size={60} color="var(--success)" className="mb-3" />
                        <h5 className="fw-bold mb-2">Password Reset!</h5>
                        <p className="text-muted-crm small mb-4">Your password has been successfully updated.</p>
                        <button onClick={() => navigate('/login')} className="btn-primary-crm w-100 justify-content-center">
                            Back to Login
                        </button>
                    </div>
                )}

                {step !== 3 && (
                    <div className="mt-4 text-center">
                        <Link to="/login" className="text-primary decoration-none small d-flex align-items-center justify-content-center gap-1">
                            <MdArrowBack /> Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
