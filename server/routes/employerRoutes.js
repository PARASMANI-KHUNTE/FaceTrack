const express = require('express');
const router = express.Router();
const {
    getEmployers,
    getEmployerDetails,
    deleteEmployer,
    OtpVerify,
    OtpSend,
    addDepartment,
    getDepartment,
    deleteDepartment,
    EmployeeRegister,
} = require('../controllers/employerController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected routes
router.use(authMiddleware);

router.get('/', getEmployers);
router.get('/:id', getEmployerDetails);
// router.put('/:id', updateEmployer);
router.delete('/:id', deleteEmployer);
router.post('/OtpSend',OtpSend)
router.post('/verifyOtp',OtpVerify)
router.post('/employee-register',EmployeeRegister)
router.post('/addDepartment',addDepartment)
router.post('/getDepartment',getDepartment)
router.post('/deleteDepartment',deleteDepartment)
module.exports = router;
