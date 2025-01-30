const User = require('../models/User');
const {sendOTP,verifyOTP} =  require('../utils/sendEmail')
const argon2 = require('argon2')
const Employee = require('../models/Employee');
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



exports.addDepartment = async (req, res) => {
    const { department, id } = req.body;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    // Check if the user is an employer
    if (user.role !== "employer") {
        return res.status(403).json({
            success: false,
            message: "Unauthorized"
        });
    }

    // Check if the department already exists
    if (user.department.includes(department)) {
        return res.status(400).json({
            success: false,
            message: "Department already exists"
        });
    }

    // Add the new department
    user.department.push(department);
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Department has been added"
    });
};


exports.getDepartment = async (req, res) => {
    const { id } = req.body;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    // Check if the user is an employer
    if (user.role !== "employer") {
        return res.status(403).json({
            success: false,
            message: "Unauthorized"
        });
    }

    // Return the list of departments
    return res.status(200).json({
        success: true,
        departments: user.department
    });
};

exports.deleteDepartment = async (req, res) => {
    const { department, id } = req.body;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    // Check if the user is an employer
    if (user.role !== "employer") {
        return res.status(403).json({
            success: false,
            message: "Unauthorized"
        });
    }

    // Check if the department exists
    if (!user.department.includes(department)) {
        return res.status(400).json({
            success: false,
            message: "Department does not exist"
        });
    }

    // Remove the department
    user.department = user.department.filter(dept => dept !== department);
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Department has been deleted"
    });
};


exports.EmployeeRegister = async (req, res) => {
    try {
      console.log("Received req.body:", req.body); // Debugging
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Invalid request body" });
      }
  
      // Destructure directly from req.body (without formData wrapper)
      const { name, email, phone, password, department, shift, task, faceEmbedding, employerId } = req.body;
  
      if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        return res.status(400).json({ message: "User with this email or phone number already exists." });
      }
  
      // Check if employee with the same face embedding exists
      const existingEmployee = await Employee.findOne({ embeddings: faceEmbedding });
      if (existingEmployee) {
        return res.status(400).json({ message: "Employee already exists" });
      }
  
      // Hash password
      const hashedPassword = await argon2.hash(password);
  
      // Create new user
      const newUser = new User({
        name,
        phone,
        email,
        password: hashedPassword,
        role: "employee",
      });
  
      await newUser.save();
  
      // Retrieve newly created user ID
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(500).json({ message: "Error creating user" });
      }
  
      // Create new employee
      const newEmployee = new Employee({
        user: user._id,
        employer: employerId,
        department,
        embeddings: faceEmbedding,
        shift,
        tasks: task,
      });
  
      await newEmployee.save();
  
      // Send OTP for verification
      await sendOTP(email);
  
      return res.status(200).json({ success: true, message: "OTP has been sent to your email" });
  
    } catch (error) {
      console.error("Error in EmployeeRegister:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  
  
