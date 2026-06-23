import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { API_URL } from '../config';
import './Feed.css'

const FILTERS = ['All Post', 'For You', 'Most Liked', 'Most Commented'];

export default function Feed({ onLogout }) {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('All Post');
  const [dark, setDark]       = useState(false);
  const [search, setSearch]   = useState('');
  const [toast, setToast]     = useState('');
  const username = localStorage.getItem('username');

  // Toast helper — 2.5 sec mein gayab ho jaata hai
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // Backend se posts laao
  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/posts`);
      setPosts(res.data);
    } catch {
      showToast('Posts load nahi hue, dobara try karo');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // Dark mode body pe toggle
  useEffect(() => {
     document.body.classList.toggle('dark', dark);
  }, [dark]);

  // Filter + Search logic
  const getFilteredPosts = () => {
    let list = [...posts];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.text?.toLowerCase().includes(q) ||
        p.username?.toLowerCase().includes(q)
      );
    }

    if (filter === 'Most Liked')
      return list.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    if (filter === 'Most Commented')
      return list.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
    if (filter === 'For You')
      return list.filter(p => p.username !== username);

    return list; // All Post
  };
  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="search-bar">
          <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>🔍</span>
          <input
            placeholder="Search promotions, users, posts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="nav-icon-btn">🔍</button>
        
        <div className="avatar-btn">
          {username ? username[0].toUpperCase() : '?'}
         
        </div>
      </nav>
      <div className="main-content">

        {/* Create Post */}
        <CreatePost onPost={fetchPosts} showToast={showToast} />

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="loading-wrap">
            <div className="spinner" />
            <p>Posts loading...</p>
          </div>
          ) : getFilteredPosts().length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No post yet. create your first post!</p>
          </div>
        ) : (
          getFilteredPosts().map(post => (
            <PostCard
              key={post._id}
              post={post}
              onUpdate={fetchPosts}
              showToast={showToast}
            />
          ))
        )}

      </div>

      {/* ── BOTTOM NAV ── */}
      <nav className="bottom-nav">
        <button className="bottom-nav-item">
          Home
        </button>
        <button className="bottom-nav-item">
         Tasks
          </button>
        <button className="bottom-nav-item">
          Promote
        </button>
        <button className="bottom-nav-item active">
          Social
        </button>
        <button className="bottom-nav-item">
         Leader Board
        </button>
        <button className="bottom-nav-item" onClick={onLogout}>
         Logout
        </button>
      </nav>

      
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </>
  );
}