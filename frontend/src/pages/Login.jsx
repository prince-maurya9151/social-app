import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import './Login.css'

export default function Login({ onSwitch, onLogin }) {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password)
      return setError('Enter your login info');
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      onLogin();
    } catch (e) {
      setError(e.response?.data?.msg || 'Login failed');
    }
    setLoading(false);
  };
  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <span className="logo-icon"></span>
          <h1>SocialApp</h1>
          <p>Connect with the world</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div className="form-group">
          <label>Email</label>
          <input
            className="form-input"
            type="email"
            placeholder="apna@email.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
          className="form-input"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="auth-switch">
          Don't have account?{' '}
          <a onClick={onSwitch}>Sign up </a>
        </div>

      </div>
    </div>
  );
}