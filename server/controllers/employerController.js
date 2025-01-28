const User = require('../models/User');
const {sendOTP,verifyOTP} =  require('../utils/sendEmail')
// Get all employers
exports.getEmployers = async (req, res) => {
    try {
        const employers = await User.find({ role: 'employer' });
        res.status(200).json(employers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employers', error });
    }
};

// Get employer details by ID
exports.getEmployerDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const employer = await User.findById(id);
        if (!employer || employer.role !== 'employer') {
            return res.status(404).json({ message: 'Employer not found' });
        }
        res.status(200).json(employer);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employer details', error });
    }
};

// // Update employer details
// exports.updateEmployer = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updateData = req.body;
//         const employer = await User.findByIdAndUpdate(id, updateData, { new: true });
//         if (!employer || employer.role !== 'Employer') {
//             return res.status(404).json({ message: 'Employer not found' });
//         }
//         res.status(200).json({ message: 'Employer updated successfully', employer });
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating employer', error });
//     }
// };

// Delete an employer
exports.deleteEmployer = async (req, res) => {
    try {
        const { id } = req.params;
        const employer = await User.findByIdAndDelete(id);
        if (!employer || employer.role !== 'employer') {
            return res.status(404).json({ message: 'Employer not found' });
        }
        res.status(200).json({ message: 'Employer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employer', error });
    }
};




exports.OtpSend = async (req,res) =>{
        const {email} = req.body;
        if(!email){
            return res.status(400).json({
                message : " please provide email"
            })
        }
        try {
            await sendOTP(email)
            return res.status(200).json({
                success : true ,
                message  : "Otp has been sent"
            })
        } catch (error) {
            return res.status(500).json({
                message : error 
            })
        }
}
exports.OtpVerify = async (req,res) =>{
    const {email , otp} = req.body;
    if(!email || !otp){
        return res.status(400).json({
            message  : "please provide  otp "
        })
    }

    try {
        await verifyOTP(email,otp)
        return res.status(200).json({
            success : true ,
            message  : "Otp has been verified"
        })
    } catch (error) {
        return res.status(500).json({
            success : false ,
            message : error 
        })
    }

}
