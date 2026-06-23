import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import './PostCard.css'


function getInitial(name) {
  return name ? name[0].toUpperCase() : '?';
}



export default function PostCard({ post, onUpdate, showToast }) {
  const token    = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText]   = useState('');
  const [submitting, setSubmitting]     = useState(false);
  const [deleting, setDeleting]         = useState(false);
const [showConfirm, setShowConfirm]   = useState(false);

  const isLiked = post.likes?.some(l => l.username === username);

  const isMyPost = post.username === username
  const handleLike = async () => {
    if (!token) return showToast('Please login for like');
    try {
      await axios.post(
        `${API_URL}/api/posts/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(); // Feed refresh
    } catch {
      showToast('Like nahi hua');
    }
  };

  // Comment submit
  const handleComment = async () => {
    if (!commentText.trim()) return;
    if (!token) return showToast('Please login for comment');
    setSubmitting(true);
    try {
      await axios.post(
        `${API_URL}/api/posts/${post._id}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText('');
      onUpdate();
    } catch {
      showToast(' No Comment added ');
    }
    setSubmitting(false);
  };

   const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(
        `${API_URL}/api/posts/${post._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast('Post delete ho gaya 🗑️');
      setShowConfirm(false);
      onUpdate(); // Feed refresh
    } catch {
      showToast('post not deleted, try again');
    }
    setDeleting(false);
  };


 
  const renderText = (text) => {
    if (!text) return null;
    return text.split(/(\s#\w+)/g).map((part, i) =>
      part.trim().startsWith('#')
        ? <span key={i} style={{ color: 'var(--blue)' }}>{part}</span>
        : <span key={i}>{part}</span>
    );
  };

  return (
    <div className="post-card">

      {/* ── HEADER ── */}
      <div className="post-card-header">

      
        <div className="post-avatar">{getInitial(post.username)}</div>

        
        <div className="post-user-info">
          <div className="post-name-row">
            <span className="post-username">{post.username}</span>
            
          </div>
          <div className="post-handle">
            @{post.username?.toLowerCase()}
          </div>
         
        </div>

        {isMyPost ? (
          <button
            className="delete-post-btn"
            onClick={() => setShowConfirm(true)}
            title="Delete post"
          >
            🗑️
          </button>
        ): (
          username && (
            <button className="follow-btn">Follow</button>
          )
        )
         }

      </div>
       {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p className="confirm-title">Post delete</p>
            <p className="confirm-msg">this post is deleted forever</p>
            <div className="confirm-btns">
              <button
                className="confirm-cancel-btn"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="confirm-delete-btn"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONTENT ── */}
      {post.text && (
        <div className="post-content">
          {renderText(post.text)}
        </div>
      )}

      {/* ── IMAGE ── */}
      {post.image && (
        <img
          src={`${API_URL}${post.image}`}
          alt="post"
          className="post-image"
        />
      )}

      {/* ── FOOTER: LIKE + COMMENT ── */}
      <div className="post-footer">

        <button
          className={`like-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          {/* <span className="like-icon">{isLiked ? '❤️' : '🤍'}</span> */}
          {post.likes?.length || 0} Likes
        </button>

        <button
          className="comment-toggle-btn"
          onClick={() => setShowComments(!showComments)}
        >
           {post.comments?.length || 0} Comments
        </button>

      </div>

      {/* ── COMMENTS (toggle) ── */}
      {showComments && (
        <div className="comments-section">

          {post.comments?.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
              No comment yet!
            </p>
          )}

          {/* Comments list */}
          {post.comments?.map((c, i) => (
            <div className="comment-item" key={i}>
              <div className="comment-avatar">{getInitial(c.username)}</div>
              <div className="comment-bubble">
                <div className="comment-user">{c.username}</div>
                <div className="comment-text">{c.text}</div>
              </div>
            </div>
          ))}

          {/* Add comment input */}
          {token && (
            <div className="add-comment-row">
              <input
                className="comment-input"
                placeholder="please write comment..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleComment()}
              />
              <button
                className="send-comment-btn"
                onClick={handleComment}
                disabled={submitting}
              >
                comment
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
}