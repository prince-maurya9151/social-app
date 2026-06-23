import { useState, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import './CreatePost.css'

export default function CreatePost({ onPost, showToast }) {
  const token = localStorage.getItem('token');

  const [text, setText]               = useState('');
  const [image, setImage]             = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading]         = useState(false);
  const [activeTab, setActiveTab]     = useState('all');
  const fileRef = useRef();

  const handleImagePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    fileRef.current.value = '';
  };

  const handlePost = async () => {
    if (!text.trim() && !image) return showToast('Kuch text ya image daalo');
    if (!token) return showToast('Pehle login karo');
    setLoading(true);

    // FormData use karo — image bhi bhejna hai
    const formData = new FormData();
    if (text)  formData.append('text', text);
    if (image) formData.append('image', image);

    try {
      await axios.post(`${API_URL}/api/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setText('');
      removeImage();
      showToast('Post ho gaya! 🎉');
      onPost(); // Feed refresh karo
    } catch {
      showToast('Post nahi ho saka, dobara try karo');
    }
    setLoading(false);
  };

  const isReady = text.trim() || image;

  return (
    <div className="create-post-card">

      {/* Header row */}
      <div className="create-post-header">
        <h2>Create Post</h2>
        <div className="tab-group">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >All Posts</button>
          <button
            className={`tab-btn ${activeTab === 'promo' ? 'active' : ''}`}
            onClick={() => setActiveTab('promo')}
          >Promotions</button>
        </div>
      </div>
      <textarea
        className="post-textarea"
        placeholder="What's on your mind?"
        value={text}
        onChange={e => setText(e.target.value)}
        rows={3}
      />

      {/* Image preview */}
      {imagePreview && (
        <div className="image-preview-wrap">
          <img src={imagePreview} alt="preview" />
          <button className="remove-img-btn" onClick={removeImage}>Remove</button>
        </div>
      )}

      <hr className="post-divider" />

      {/* Action icons */}
      <div className="post-actions">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImagePick}
        />
        <button className="action-icon" onClick={() => fileRef.current.click()} title="Image add karo">Add image</button>
        

        <button
          className={`post-submit-btn ${isReady ? 'active' : ''}`}
          onClick={handlePost}
          disabled={!isReady || loading}
        >
          {loading ? '...' : 'Post'}
        </button>
      </div>

    </div>
  );
}