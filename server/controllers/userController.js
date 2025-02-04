const User = require('../models/User')
const argon2 = require('argon2')
const {sendOTP,verifyOTP} =  require('../utils/sendEmail')
const jwt = require('jsonwebtoken')
const { generateToken, tokenVerify ,generateTokenForPassword} = require('../utils/tokenProvider')
const Employee = require('../models/Employee')
exports.signupAsEmployer = async (req,res) => {
    try {
        const { name, email, phone, password, organization } = req.body;

        // Validate phone number (10 digits only)
        if (!phone || phone.length !== 10 || isNaN(phone)) {
            return res.status(400).json({
                message: "Phone number is invalid. Please enter a 10-digit number only.",
            });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long.",
            });
        }

        // Check if user already exists with the same email or phone
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email or phone number already exists.",
            });
        }

        // Hash the password
        const hashedPassword = await argon2.hash(password);

        // Create a new user with the role set to 'employer'
        const user = new User({
            name,
            email,
            phone,
            organization,
            password: hashedPassword,
            role: 'employer', // Ensure the role is set to 'employer'
        });

        // Save the user to the database
        await user.save();

        // Send OTP email for verification
        await sendOTP(email);

        // Return success response
        res.status(201).json({
            message: "User data has been saved. Enter OTP to verify now.",
            user,
        });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({
            message: "An error occurred during signup. Please try again.",
            error: error.message,
        });
    }
};
exports.VerifyOtp = async (req, res) => {
    try {
      const { email, otp } = req.body;
  
      // Validate input
      if (!email || !otp) {
        return res.status(400).json({
          message: 'Both email and OTP are required.',
        });
      }
  
      // Verify the OTP
      const isOtpValid = await verifyOTP(email, otp);
      if (!isOtpValid) {
        return res.status(401).json({
          message: 'Invalid OTP.',
        });
      }
  
      // Find the user and update isVerified only if it's false
      const user = await User.findOneAndUpdate(
        { email, isVerified: false }, // Query to find the user by email and isVerified: false
        { isVerified: true }, // Update to set isVerified to true
        { new: true } // Return the updated document
      );

      const existingUser = await User.findOne({ email });
  
      if (!existingUser) {
          return res.status(404).json({
            message: 'User not found.',
          });
        
      }
  
      // OTP is valid and user is verified
      return res.status(200).json({
        message: 'OTP successfully verified.',
        existingUser,
      });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return res.status(500).json({
        message: 'An error occurred while verifying the OTP.',
        error: error.message,
      });
    }
  };
exports.loginAsEmployer = async (req, res) => {
        try {
          const { email, password } = req.body;
      
          // Validate input
          if (!email || !password) {
            return res.status(400).json({
              message: 'Email and password are required.',
            });
          }
      
          // Find the user by email
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(404).json({
              message: 'User not found.',
            });
          }
      
          // Check if the user is an employer
          if (user.role !== 'employer') {
            return res.status(403).json({
              message: 'Access denied. This route is for employers only.',
            });
          }
      
          // Check if the user is verified
          if (!user.isVerified) {
            await sendOTP(email); // Send OTP for verification
            return res.status(403).json({
              message: 'User is not verified. An OTP has been sent to your email. Please verify your account.',
            });
          }
      
          // Verify the password
          const isPasswordValid = await argon2.verify(user.password, password);
          if (!isPasswordValid) {
            return res.status(400).json({
              message: 'Invalid credentials.',
            });
          }
      
          // Create a JWT payload
          const payload = {
            userId: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
      
          // Generate a JWT token
          const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
      
          // Return success response
          return res.status(200).json({
            message: 'Login successful.',
            token: token,
          });
        } catch (error) {
          console.error('Error during login:', error);
          return res.status(500).json({
            message: 'An error occurred during login. Please try again.',
            error: error.message,
          });
        }
      };

exports.resetPassword = async (req,res) =>{
    const { email } = req.body;

    // Validate email input
    if (!email) {
        return res.status(400).json({
            message: "Please Provide Email"
        });
    }

    try {
        // Check if user exists in the database
        const isUser = await User.findOne({ email }); // Await the database call
        if (!isUser) {
            return res.status(404).json({
                message: "User Does not exist"
            });
        }
   
        await sendOTP(email);

        // Respond with success message and token
        return res.status(200).json({
            message: `OTP sent successfully to ${email}`,
        });
    } catch (error) {
        // console.error("Error in forgot-password route:", error.message);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

exports.updatePassword = async (req,res) =>{
    const { email, password } = req.body;

    // Validate the input
    if (!email || !password) {
        return res.status(400).json({
            message: "userId and password are required",
        });
    }

    try {
        const hashedPassword = await argon2.hash(password);
      
        // Find the user by ID and update the password
        const user = await User.findOneAndUpdate(
            {email},
            { password: hashedPassword },
            { new: true } // Return the updated document
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "Password updated successfully",
        });
    } catch (error) {
        // console.error("Error updating password:", error.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}



exports.googleLogin = async (req, res) => {
  console.log("Received Data:", req.body);
  const { googleId, name, email, profileUrl, organization, phone } = req.body;

  // Check for missing fields
  if (!googleId || !name || !email || !profileUrl || !organization || !phone) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    let user = await User.findOne({ googleId });

    if (!user) {
      // Create a new user if not found
      user = new User({
        name,
        email,
        googleId,
        profileUrl,
        isVerified: true,
        organization,
        phone,
        role: "employer",
      });

      try {
        await user.save(); // Save the new user
      } catch (saveError) {
        console.error("Error creating user:", saveError);
        return res.status(500).json({ success: false, message: "Error creating user" });
      }

      const token = jwt.sign(
        { userId: user._id, name: user.name, profileUrl: user.profileUrl, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.status(201).json({
        success: true,
        token,
        message: "Account has been created successfully",
      });
    }

    
  } catch (error) {
    console.error("Error in GoogleLogin route:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
  
exports.getUserById = async (req, res) => {
    const { id } = req.params; // Extract the user ID from the request parameters
  
    // Validate the input
    if (!id) {
      return res.status(400).json({
        message: "User ID is required.",
      });
    }
  
    try {
      // Find the user by ID
      const user = await User.findById(id).select('-password'); // Exclude the password field
  
      if (!user) {
        return res.status(404).json({
          message: "User not found.",
        });
      }
  
      // Return the user details
      return res.status(200).json({
        message: "User fetched successfully.",
        user,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({
        message: "An error occurred while fetching the user.",
        error: error.message,
      });
    }
  };

exports.verifyToken = async (req,res) =>{
  const {token} = req.body;
  try {
    await tokenVerify(token)
    return res.status(200).json({
      success  : true,
      message : "Token Is valid"
    })
  } catch (error) {
    return res.status(404).json({
      success  : false,
      message : "Token Is invalid",
      error : error
    })
  }
  
  
}
exports.updateProfileDetails  = async (req, res) => {
      const { name, phone, organization } = req.body;
      const userId = req.user.userId; // Use "userId" as defined in the token payload.

     
  
      try {
        // Find the user by ID and update the specified fields
        const user = await User.findByIdAndUpdate(
          userId,
          { $set: { name, phone, organization } },
          { new: true, runValidators: true } // Return updated user and validate fields
        );
  
        if (!user) {
          return res.status(404).json({ success: false, message: "User not found." });
        }
  
        res.status(200).json({ success: true, user });
      } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ success: false, message: "Server error." });
      }
    }

exports.checkForExistence = async (req, res) => {
      try {
          const { email, googleId } = req.body;
  
          if (!email && !googleId) {
              return res.status(400).json({
                  success: false,
                  message: "Email or Google ID is required",
              });
          }
  
          const user = await User.findOne({ $or: [{ email }, { googleId }] });
  
          if (!user) {
              return res.status(404).json({
                  success: false,
                  message: "User does not exist",
              });
          }
                  // If user exists, generate token
            const token = jwt.sign(
              { userId: user._id, name: user.name, profileUrl: user.profileUrl, email: user.email },
              process.env.JWT_SECRET,
              { expiresIn: "24h" }
            );

            return res.status(200).json({
              success: true,
              token,
              message: "Login Successful",
              user
            });
          
                
  
      } catch (error) {
          return res.status(500).json({
              success: false,
              message: "Internal server error",
              error: error.message,
          });
      }
  };
  




  exports.getUserByEmployeeId = async (req, res) => {
    try {
      const { employeeId } = req.body;
      // Find user data by employeeId in the User collection
      const userData = await User.findOne({employeeId});
      if (!userData) {
        return res.status(400).json({
          success: false,
          message: "No user data found for this employee",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "User data found for the given employee ID",
        data: userData,
      });
  
    } catch (error) {
      console.error("Error fetching user data:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while fetching user data",
      });
    }
  };
  