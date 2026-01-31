const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwtUtil = require('../utils/jwt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({ ...req.body, password: hash });

  const at = jwtUtil.accessToken(user._id);
  const rt = jwtUtil.refreshToken(user._id);

  res.cookie('refreshToken', rt, { httpOnly: true });
  res.json({ token: at, user });
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.sendStatus(401);

  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.sendStatus(401);

  const at = jwtUtil.accessToken(user._id);
  const rt = jwtUtil.refreshToken(user._id);

  res.cookie('refreshToken', rt, { httpOnly: true });
  res.json({ token: at, user });
});

router.post('/refresh', (req, res) => {
  jwt.verify(req.cookies.refreshToken, process.env.JWT_REFRESH_SECRET,
    (err, data) => {
      if (err) return res.sendStatus(403);
      res.json({ token: jwtUtil.accessToken(data.id) });
    });
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json({ user });
});

module.exports = router;
