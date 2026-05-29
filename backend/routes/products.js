const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Multer config for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG and WebP images allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// GET  /api/products        - get all (with optional ?search=&category=)
router.get('/', getAllProducts);

// GET  /api/products/:id    - get one
router.get('/:id', getProduct);

// POST /api/products        - create (protected + image upload)
router.post('/', auth, upload.single('image'), createProduct);

// PUT  /api/products/:id    - update (protected + image upload)
router.put('/:id', auth, upload.single('image'), updateProduct);

// DELETE /api/products/:id  - delete (protected)
router.delete('/:id', auth, deleteProduct);

module.exports = router;
