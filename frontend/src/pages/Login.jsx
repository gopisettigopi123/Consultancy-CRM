import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import { MdEmail, MdLock, MdPeople } from 'react-icons/md';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      if (data.success) {
        login(
          { _id: data._id, name: data.name, email: data.email, role: data.role },
          data.token
        );
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check credentials.');
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
            Recruitment Management System
          </p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '0.85rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="crm-form">
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <div className="search-wrapper">
              <MdEmail className="search-icon" />
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="admin@company.com"
                value={form.email}
                onChange={handleChange}
                required
                style={{ width: '100%', paddingLeft: '36px' }}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <div className="search-wrapper">
              <MdLock className="search-icon" />
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                style={{ width: '100%', paddingLeft: '36px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary-crm w-100 justify-content-center"
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" /> Signing in...</>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
          Contact your Admin to get access credentials
        </div>
      </div>
    </div>
  );
};

export default Login;
