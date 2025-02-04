const User = require('../models/User');
const {sendOTP,verifyOTP} =  require('../utils/sendEmail')
const argon2 = require('argon2')
const Employee = require('../models/Employee');
const faceapi = require("face-api.js");

exports.getEmployers = async (req, res) => {
    try {
        const employers = await User.find({ role: 'employer' });
        res.status(200).json(employers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employers', error });
    }
};
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
exports.editDepartment = async (req, res) => {
    const { oldDepartment, newDepartment, id } = req.body;
  
    // Find the user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
  
    // Check if the old department exists
    if (!user.department.includes(oldDepartment)) {
      return res.status(400).json({ success: false, message: "Department does not exist" });
    }
  
    // Update the department
    user.department = user.department.map((dept) =>
      dept === oldDepartment ? newDepartment : dept
    );
  
    await user.save();
  
    return res.status(200).json({ success: true, message: "Department updated successfully" });
  }
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
exports.checkEmployeeFace = async (req, res) => {
    try {
        const { embedding, id } = req.body;
      

        // Validate employer ID
        if (!id) {
            return res.status(400).json({ message: "Employer ID is required." });
        }

        // Convert embedding object to an array
        let parsedEmbedding;
        try {
            if (Array.isArray(embedding)) {
                parsedEmbedding = embedding.map(Number);
            } else if (embedding instanceof Float32Array) {
                parsedEmbedding = Array.from(embedding);
            } else if (typeof embedding === "object" && embedding !== null) {
                parsedEmbedding = Object.keys(embedding).map(key => Number(embedding[key]));
            } else {
                throw new Error("Invalid embedding format.");
            }
        } catch (err) {
            return res.status(400).json({ message: "Invalid embedding format. Expected an array of numbers." });
        }

        // Ensure parsed embedding contains only valid numbers
        if (!parsedEmbedding.every(num => typeof num === "number" && !isNaN(num))) {
            return res.status(400).json({ message: "Embedding array contains invalid values." });
        }

      
        // Fetch all employees under the given employer
        let employees = await Employee.find({ employer: id });

        if (!employees.length) {
            // If no employees exist, create a new one
            const newEmployee = new Employee({
                employer: id,
                embeddings: [parsedEmbedding],
            });

            await newEmployee.save();

            return res.status(201).json({
                message: "New face registered successfully",
                success : true ,
                employeeId: newEmployee._id
            });
        }

        // Check if embedding already exists in any employee
        for (let employee of employees) {
            if (!employee.embeddings || employee.embeddings.length === 0) continue;

            for (let storedEmbedding of employee.embeddings) {
                const distance = faceapi.euclideanDistance(parsedEmbedding, storedEmbedding);

                if (distance < 0.5) {  // Threshold for similarity
                    return res.status(200).json({
                        message: "Face already exists",
                        success : false,
                        employeeId: employee._id
                    });
                }
            }
        }

        // If no match is found, add new embedding to the first employee
        employees[0].embeddings.push(parsedEmbedding);
        await employees[0].save();

        return res.status(201).json({
            message: "New face registered successfully",
            success : true ,
            employeeId: employees[0]._id
        });

    } catch (error) {
        console.error("Error in face recognition:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.addEmployee = async (req, res) => {
    try {
        const { name, email, phone, password, employeeId } = req.body;

        // Ensure employeeId is provided
        if (!employeeId) {
            return res.status(400).json({ message: "Employee ID is required." });
        }

        // Check if user already exists with the same email or phone
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email or phone number already exists." });
        }

        // Hash the password using Argon2
        const hashedPassword = await argon2.hash(password);

        // Create a new user with the role set to 'employee' and link to employeeId
        const user = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            role: "employee", // Fixed the incorrect comment (was 'employer')
            employeeId, // Store employeeId to link with face recognition data
        });

        // Save the user to the database
        await user.save();
        await sendOTP(email)
        

        // Return success response
        res.status(201).json({
            message: "User data has been saved. Enter OTP to verify now.",
            userId: user._id, // Return only necessary user info
            email : email ,
            employeeId, // Ensure the front-end retains employee linkage
        });
    } catch (error) {
        console.error("Error adding employee:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.assignWork = async (req, res) => {
    try {
        const { formSData, employeeId } = req.body;
        
        // Find the employee by ID
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(400).json({ message: "No employee found" });
        }

        // Update only the specific employee
        await Employee.updateOne(
            { _id: employeeId }, 
            { $set: { shift: formSData.shift, department: formSData.department, tasks: formSData.task } }
        );

        return res.status(200).json({
            success : true ,
            message: "Successfully registered employee and assigned work",
        });

    } catch (error) {
       
        console.error("Error assigning work:", error);
        return res.status(500).json({ message: "Error assigning work" , success : false  });
    }
};

exports.getEmployees = async (req,res) =>{
    const {id} = req.body;

    const employees = await Employee.findOne({employer : id})
    if(!employees){
        return res.status(200).json({
            message : "No Employees Found"
        })
    }
    
    
    return res.status(200).json({
        success : true,
        employees,
        message : "Succesfully got the data"
    })


};

exports.employeeCheckin = async (req,res)=>{
    const { embedding, id } = req.body;
    try {
        const { embedding, id } = req.body;
      

        // Validate employer ID
        if (!id) {
            return res.status(400).json({ message: "Employer ID is required." });
        }

        // Convert embedding object to an array
        let parsedEmbedding;
        try {
            if (Array.isArray(embedding)) {
                parsedEmbedding = embedding.map(Number);
            } else if (embedding instanceof Float32Array) {
                parsedEmbedding = Array.from(embedding);
            } else if (typeof embedding === "object" && embedding !== null) {
                parsedEmbedding = Object.keys(embedding).map(key => Number(embedding[key]));
            } else {
                throw new Error("Invalid embedding format.");
            }
        } catch (err) {
            return res.status(400).json({ message: "Invalid embedding format. Expected an array of numbers." });
        }

        // Ensure parsed embedding contains only valid numbers
        if (!parsedEmbedding.every(num => typeof num === "number" && !isNaN(num))) {
            return res.status(400).json({ message: "Embedding array contains invalid values." });
        }

      
        // Fetch all employees under the given employer
        let employees = await Employee.find({ employer: id });

      // Check if embedding already exists in any employee
for (let employee of employees) {
    if (!employee.embeddings || employee.embeddings.length === 0) continue;

    for (let storedEmbedding of employee.embeddings) {
        const distance = faceapi.euclideanDistance(parsedEmbedding, storedEmbedding);

        if (distance < 0.5) {  // Threshold for similarity

            // Get today's date in YYYY-MM-DD format
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // Check if employee has already checked in today
            let latestCheckIn = employee.checkInOut.find(entry => {
                const entryDate = new Date(entry.date);
                entryDate.setHours(0, 0, 0, 0);
                return entryDate.getTime() === today.getTime();
            });

            if (latestCheckIn) {
                return res.status(200).json({
                    message: "Already checked in for today.",
                    success : false,
                    employeeId: employee._id,
                    latestCheckIn: {
                        date: latestCheckIn.date,
                        checkIn: latestCheckIn.checkIn,
                        checkOut: latestCheckIn.checkOut
                    }
                });
            }

            // Mark check-in
            const newCheckIn = {
                date: new Date(),
                checkIn: new Date(),
                checkOut: null // Not checked out yet
            };

            employee.checkInOut.push(newCheckIn);

            await employee.save(); // Save the updated employee record

            return res.status(200).json({
                message: "Check-in successful.",
                success: true,
                employeeId: employee._id,
                checkInTime: newCheckIn.checkIn
            });
        }
    }
}

    
    }
    catch(error){
        return res.status(400).json({
            message : "Server error "
        })
    }

    
}
exports.employeeCheckOut = async (req, res) => {
    const { embedding, id } = req.body;
    try {
        if (!id) {
            return res.status(400).json({ message: "Employer ID is required." });
        }

        let parsedEmbedding;
        try {
            if (Array.isArray(embedding)) {
                parsedEmbedding = embedding.map(Number);
            } else if (embedding instanceof Float32Array) {
                parsedEmbedding = Array.from(embedding);
            } else if (typeof embedding === "object" && embedding !== null) {
                parsedEmbedding = Object.keys(embedding).map(key => Number(embedding[key]));
            } else {
                throw new Error("Invalid embedding format.");
            }
        } catch (err) {
            return res.status(400).json({ message: "Invalid embedding format. Expected an array of numbers." });
        }

        if (!parsedEmbedding.every(num => typeof num === "number" && !isNaN(num))) {
            return res.status(400).json({ message: "Embedding array contains invalid values." });
        }

        let employees = await Employee.find({ employer: id });

        for (let employee of employees) {
            if (!employee.embeddings || employee.embeddings.length === 0) continue;

            for (let storedEmbedding of employee.embeddings) {
                const distance = faceapi.euclideanDistance(parsedEmbedding, storedEmbedding);

                if (distance < 0.5) {  // Threshold for similarity
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    let latestEntry = employee.checkInOut.find(entry => {
                        const entryDate = new Date(entry.date);
                        entryDate.setHours(0, 0, 0, 0);
                        return entryDate.getTime() === today.getTime();
                    });

                    if (latestEntry) {
                        if (latestEntry.checkOut) {
                            return res.status(200).json({
                                message: "Already checked out for today.",
                                success: false,
                                employeeId: employee._id,
                                latestEntry
                            });
                        }
                        
                        latestEntry.checkOut = new Date();
                        await employee.save();
                        return res.status(200).json({
                            message: "Check-out successful.",
                            success: true,
                            employeeId: employee._id,
                            checkOutTime: latestEntry.checkOut
                        });
                    }

                    const newCheckIn = {
                        date: new Date(),
                        checkIn: new Date(),
                        checkOut: null
                    };

                    employee.checkInOut.push(newCheckIn);
                    await employee.save();

                    return res.status(200).json({
                        message: "Check-in successful.",
                        success: true,
                        employeeId: employee._id,
                        checkInTime: newCheckIn.checkIn
                    });
                }
            }
        }

        return res.status(400).json({ message: "Face not recognized." });
    } catch (error) {
        return res.status(500).json({ message: "Server error." });
    }
};




exports.getEmployee = async (req,res) =>{
    const {id , employeeId} = req.body;

    const employees = await Employee.findOne({employer : id})
    if(!employees){
        return res.status(200).json({
            message : "No Employees Found"
        })
    }
    // let userdata =[]
    // let noOfemployees = employees.length()
    // for(i;i>=noOfemployees,i++){
    //     const employee = await User.findOne({employeeId})
    //     if(employee)
    // }
    return res.status(200).json({
        success : true,
        employees,
        message : "Succesfully got the data"
    })


};



