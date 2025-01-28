const User = require('../models/User');
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
