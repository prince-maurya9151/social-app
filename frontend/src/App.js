import { useState } from 'react';
import './styles/main.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';

export default function App() {
  // Check karo — token hai toh seedha feed pe jao
  const [page, setPage] = useState(() =>
    localStorage.getItem('token') ? 'feed' : 'login'
  );

  const handleLogin = () => setPage('feed');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setPage('login');
  };

  if (page === 'feed')   return <Feed onLogout={handleLogout} />;
  if (page === 'signup') return <Signup onSwitch={() => setPage('login')} onLogin={handleLogin} />;
  return <Login onSwitch={() => setPage('signup')} onLogin={handleLogin} />;
}