const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {checkForExistence,signupAsEmployer,getUserByEmployeeId ,VerifyOtp,loginAsEmployer ,resetPassword , updatePassword ,googleLogin,getUserById,updateProfileDetails,verifyToken} = require('../controllers/userController');

router.post('/signup-employer', signupAsEmployer);
router.post('/verify-otp' , VerifyOtp );
router.post('/login', loginAsEmployer);
router.post('/reset-password', resetPassword);
router.put('/update-password', updatePassword);
router.post('/GoogleLogin',googleLogin )
router.get('/:id',getUserById);
router.post('/verify-token',verifyToken);
router.put("/updateProfileDetails",authMiddleware,updateProfileDetails)
router.post("/checkForExistence", checkForExistence);
router.post("/getEmployeePersnalData", getUserByEmployeeId);

module.exports = router;