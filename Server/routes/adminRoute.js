const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, createUser, updateUser, deleteUser, login } = require('../controllers/adminController');
const { JWTauth, isAdmin } = require('../middleware/authMiddleware.js');
const multer=require('multer');
const path=require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); 
    },
  });
  
const upload = multer({ storage: storage });

router.post('/login', login);
router.get('/users',JWTauth,isAdmin, getAllUsers);
router.get('/users/:userId',JWTauth,isAdmin, getUserById);
router.post('/users',JWTauth,isAdmin,upload.single('profilePhoto'), createUser);
router.put('/users/:userId',JWTauth,isAdmin,upload.single('profilePhoto'), updateUser);
router.delete('/users/:userId',JWTauth,isAdmin, deleteUser);

module.exports = router;