
// // router.post('/upload-profile-image', authMiddleware, upload.single('image'), uploadProfileImage);
// // router.put('/update-profile', authMiddleware, updateProfileDetails);



const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {signupAsEmployer ,VerifyOtp,loginAsEmployer ,resetPassword , updatePassword ,googleLogin,getUserById,updateProfileDetails,verifyToken} = require('../controllers/userController');

router.post('/signup-employer', signupAsEmployer);
router.post('/verify-otp' , VerifyOtp );
router.post('/login', loginAsEmployer);
router.post('/reset-password', resetPassword);
router.put('/update-password', updatePassword);
router.post('/GoogleLogin',googleLogin )
router.get('/:id',getUserById);
router.post('/verify-token',verifyToken);

router.put("/updateProfileDetails",authMiddleware,updateProfileDetails)
module.exports = router;