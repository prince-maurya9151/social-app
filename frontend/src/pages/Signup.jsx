import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import './Signup.css'
import './Login.css'


export default function Signup({ onSwitch, onLogin }) {
  const [form, setForm]       = useState({ username: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.username || !form.email || !form.password)
      return setError('Teeno fields fill karo');
    if (form.password.length < 6)
      return setError('Password kam se kam 6 characters ka hona chahiye');
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/api/auth/signup`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      onLogin();
    } catch (e) {
      setError(e.response?.data?.msg || 'Signup failed');
    }
    setLoading(false);
    };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          
          <h1>SocialApp</h1>
          <p>Create your account</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div className="form-group">
          <label>Username</label>
          <input
            className="form-input"
            type="text"
            placeholder="Your name"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
        </div>
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
            placeholder="min 6 characters"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating...' : 'Sign Up'}
          </button>

        <div className="auth-switch">
          Already have Account?{' '}
          <a onClick={onSwitch}> Please Login</a>
        </div>

      </div>
    </div>
  );
}