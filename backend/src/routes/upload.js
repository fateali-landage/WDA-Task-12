const router = require('express').Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const auth = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const upload = multer({ dest: 'uploads/' });

router.post('/', auth, upload.single('file'), async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path, {
    resource_type: 'auto'
  });
  res.json({ url: result.secure_url });
});

module.exports = router;
