const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { register, login, getUserById, editUserById } = require('../controllers/userController.js');
const { JWTauth } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage: storage })

router.post('/login', login);
router.post('/register',upload.single('profilePhoto'), register);
router.get('/getuser/:userId',JWTauth, getUserById); 
router.put('/edituser/:userId',JWTauth,upload.single('profilePhoto'), editUserById); 

module.exports = router;
