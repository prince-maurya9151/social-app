const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
     console.log(' new Signup request :', req.body);

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ msg: 'fill these fields' });
    }
    if (password.length < 6) {
      return res.status(400).json({ msg: 'Password must be atleast 6 character' });
    }

    
    
    const existing = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existing) {
      return res.status(400).json({ msg: 'Email or username  have already  taken' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // User save karo
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Token banao — 7 din ke liye valid
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, username: user.username });

  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ msg: err.message });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password both required' });
    }

    // User dhundo
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Either email or passwoard is wrong' });
    }

    // Password match karo
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Either email or password is wrong' });
    }

    // create token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
      );

    res.json({ token, username: user.username });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;