const router = require('express').Router();
const multer = require('multer');
const path   = require('path');
const Post   = require('../models/Post');
const auth   = require('../middleware/auth');
const storage = multer.diskStorage({
 
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
   filename: (req, file, cb) => {
    const ext      = path.extname(file.originalname); // .jpg, .png etc
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },

});
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const isValid = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error('only image can be uploaded (jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
});
router.get('/', async (req, res) => {
  try {
    // Newest first, max 50 posts
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;

    
    if (!text?.trim() && !req.file) {
      return res.status(400).json({ msg: 'fill text or image' });
    }

    const post = await Post.create({
      user:     req.user.id,       
      username: req.user.username, 
      text:     text?.trim() || '',
      image:    req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json(post);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

   
    const alreadyLikedIndex = post.likes.findIndex(
      (l) => l.username === req.user.username
    );

    if (alreadyLikedIndex >= 0) {
     
      post.likes.splice(alreadyLikedIndex, 1);
    } else {
      
      post.likes.push({ username: req.user.username });
    }

    await post.save();
    res.json(post);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ msg: 'Comment should not be empty' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'post not found !' });
    }

    // Comment add karo
    post.comments.push({
      username: req.user.username,
      text:     text.trim(),
    });

    await post.save();
    res.json(post);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'post not found ' });
    }

    
    if (post.username !== req.user.username) {
      return res.status(403).json({ msg: 'you can delete your own post only' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Post deleted' });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;