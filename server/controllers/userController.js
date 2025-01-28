// const User = require('../models/User');
// const { sendOtpEmail } = require('../utils/sendEmail');
// const argon2 = require('argon2');
// // const multer = require('multer');
// // const upload = multer({ storage: multer.memoryStorage() });
// // const {uploadToFirebase , deleteFromFirebase} = require('../Modules/uploadToFirebase.js')
// // const bucket = require('../Modules/FirebaseConfig.js'); // Import Firebase Storage bucket

// // Signup user
// exports.signupAsEmployer = async (req, res) => {
//     try {
//         const { name, email, phone, password, organization } = req.body;

//         // Validate phone number (10 digits only)
//         if (!phone || phone.length !== 10 || isNaN(phone)) {
//             return res.status(400).json({
//                 message: "Phone number is invalid. Please enter a 10-digit number only.",
//             });
//         }

//         // Validate password length
//         if (password.length < 8) {
//             return res.status(400).json({
//                 message: "Password must be at least 8 characters long.",
//             });
//         }

//         // Check if user already exists with the same email or phone
//         const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
//         if (existingUser) {
//             return res.status(400).json({
//                 message: "User with this email or phone number already exists.",
//             });
//         }

//         // Hash the password
//         const hashedPassword = await argon2.hash(password);

//         // Create a new user with the role set to 'employer'
//         const user = new User({
//             name,
//             email,
//             phone,
//             organization,
//             password: hashedPassword,
//             role: 'employer', // Ensure the role is set to 'employer'
//         });

//         // Save the user to the database
//         await user.save();

//         // Send OTP email for verification
//         await sendOtpEmail(email);

//         // Return success response
//         res.status(201).json({
//             message: "User data has been saved. Enter OTP to verify now.",
//             user,
//         });
//     } catch (error) {
//         console.error("Error during signup:", error);
//         res.status(500).json({
//             message: "An error occurred during signup. Please try again.",
//             error: error.message,
//         });
//     }
// };

// // // Login user
// // exports.login = async (req, res) => {
// //     try {
// //         const { email, password } = req.body;
// //         const user = await User.findOne({ email });
// //         if (!user) return res.status(404).json({ message: 'User not found' });

// //         const isPasswordValid = await argon2.verify(user.password, password);
// //         if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

// //         res.status(200).json({ message: 'Login successful', user });
// //     } catch (error) {
// //         res.status(500).json({ message: 'Error during login', error });
// //     }
// // };


// // exports.loginWithGoogle = async (req, res) => {
// //     const { googleId, name, email, picture } = req.body;
  
// //     if (!googleId || !name || !email || !picture) {
// //       return res.status(400).json({ message: "Missing required fields" });
// //     }
  
// //     try {
// //       let user = await User.findOne({ googleId }).lean(); // Avoid redundant queries
  
// //       if (!user) {
// //         // Create a new user if not found
// //         user = await User.create({
// //           name,
// //           email,
// //           googleId,
// //           ProfileUrl: picture,
// //         });
  
// //         const payload = {
// //           userId: user._id,
// //           name: user.name,
// //           ProfileUrl: user.ProfileUrl,
// //           email: user.email,
// //         };
  
// //         const token = generateToken(payload);
// //         return res.status(200).json({
// //           authToken: token,
// //           message: "Account has been created",
// //         });
// //       }
  
// //       // If user exists, generate token
// //       const payload = {
// //         userId: user._id,
// //         name: user.name,
// //         ProfileUrl: user.ProfileUrl,
// //         email: user.email,
// //       };
  
// //       const token = generateToken(payload);
// //       return res.status(200).json({
// //         authToken: token,
// //         message: "Login Successful",
// //       });
// //     } catch (error) {
// //       console.error("Error in GoogleLogin route:", error);
// //       return res.status(500).json({ message: "Internal server error" });
// //     }
// //   }



// // // Reset password
// // exports.resetPassword = async (req, res) => {
// //     try {
// //         const { email, newPassword } = req.body;

// //         const hashedPassword = await argon2.hash(newPassword);
// //         await User.updateOne({ email }, { password: hashedPassword });

// //         res.status(200).json({ message: 'Password reset successful' });
// //     } catch (error) {
// //         res.status(500).json({ message: 'Error resetting password', error });
// //     }
// // };

// // // Update user details
// // exports.updateDetails = async (req, res) => {
// //     try {
// //         const { id } = req.user; // Assumes user ID is in token payload
// //         const updateData = req.body;

// //         const user = await User.findByIdAndUpdate(id, updateData, { new: true });
// //         res.status(200).json({ message: 'User details updated successfully', user });
// //     } catch (error) {
// //         res.status(500).json({ message: 'Error updating details', error });
// //     }
// // };

// // // Update password
// // exports.updatePassword = async (req, res) => {
// //     try {
// //         const { id } = req.user;
// //         const { oldPassword, newPassword } = req.body;

// //         const user = await User.findById(id);
// //         const isPasswordValid = await argon2.verify(user.password, oldPassword);
// //         if (!isPasswordValid) return res.status(400).json({ message: 'Old password is incorrect' });

// //         const hashedPassword = await argon2.hash(newPassword);
// //         user.password = hashedPassword;
// //         await user.save();

// //         res.status(200).json({ message: 'Password updated successfully' });
// //     } catch (error) {
// //         res.status(500).json({ message: 'Error updating password', error });
// //     }
// // };

// // // Verify OTP
// // exports.verifyOtp = async (req, res) => {
// //     try {
// //         const { email, otp } = req.body;

// //         const user = await User.findOne({ email });
// //         if (!user || user.otp !== otp) {
// //             return res.status(400).json({ message: 'Invalid OTP' });
// //         }

// //         user.isVerified = true;
// //         user.otp = undefined;
// //         await user.save();

// //         res.status(200).json({ message: 'OTP verified successfully' });
// //     } catch (error) {
// //         res.status(500).json({ message: 'Error verifying OTP', error });
// //     }
// // };



// // // Upload profile image
// // exports.uploadProfileImage = async (req, res) => {
// //     try {
// //         if (!req.file) {
// //             return res.status(400).json({ message: 'No file uploaded' });
// //         }

// //         // Create file in Firebase Storage
// //         const file = bucket.file(`profile-images/${Date.now()}_${req.file.originalname}`);
// //         const stream = file.createWriteStream({
// //             metadata: {
// //                 contentType: req.file.mimetype,
// //             },
// //         });

// //         stream.on('error', (err) => {
// //             console.error(err);
// //             return res.status(500).json({ message: 'Image upload failed', error: err.message });
// //         });

// //         stream.on('finish', async () => {
// //             try {
// //                 // Make the file publicly accessible
// //                 await file.makePublic();

// //                 // Construct the public URL for the uploaded image
// //                 const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

// //                 // Update the user's profile with the public URL
// //                 const user = await User.findById(req.user.id);
// //                 if (!user) {
// //                     return res.status(404).json({ message: 'User not found' });
// //                 }

// //                 user.profileUrl = publicUrl;
// //                 await user.save();

// //                 res.status(200).json({ message: 'Profile image uploaded successfully', url: publicUrl });
// //             } catch (err) {
// //                 console.error(err);
// //                 res.status(500).json({ message: 'Failed to update user profile', error: err.message });
// //             }
// //         });

// //         stream.end(req.file.buffer);
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Server error', error: error.message });
// //     }
// // };


// // // Update profile details
// // exports.updateProfileDetails = async (req, res) => {
// //     try {
// //         const { name, email, profileUrl } = req.body;

// //         // Find the user in the database
// //         const user = await User.findById(req.user.id);
// //         if (!user) {
// //             return res.status(404).json({ message: 'User not found' });
// //         }

// //         // Update fields if provided in the request
// //         user.name = name || user.name;
// //         user.email = email || user.email;

// //         // Update profile URL if provided (optional)
// //         if (profileUrl) {
// //             user.profileUrl = profileUrl;
// //         }

// //         await user.save();

// //         res.status(200).json({
// //             message: 'Profile updated successfully',
// //             user: {
// //                 id: user.id,
// //                 name: user.name,
// //                 email: user.email,
// //                 profileUrl: user.profileUrl,
// //             },
// //         });
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Server error', error: error.message });
// //     }
// // };



// // exports.uploadProfileImg = upload.single('avatar'), async (req,res) =>{
   
// //         const { username } = req.params;
// //         const file = req.file;
      
// //         if (!file) {
// //           return res.status(400).json({ success: false, message: 'No file uploaded' });
// //         }
      
// //         try {
// //           // Check if user exists
// //           const user = await userModel.findOne({ Username: username });
// //           if (!user) {
// //             return res.status(404).json({ success: false, message: 'User not found' });
// //           }
      
// //           const oldAvatarUrl = user.AvatarUrl;
// //           console.log(`Old Avatar URL - ${oldAvatarUrl}`);
      
// //           // Upload the new avatar to Firebase
// //           const newFolderName = `${username}_avatar_${Date.now()}`;
// //           const newAvatarUrl = await uploadToFirebase(file, `avatars/${newFolderName}`);
// //           console.log(`New Avatar URL - ${newAvatarUrl}`);
      
// //           // If there's an old avatar, delete it from Firebase
// //           if (oldAvatarUrl) {
// //             // Extract the actual file name from the old avatar URL
// //             const oldFileName = oldAvatarUrl.split('/').pop().split('?')[0]; // Extract the file name
// //             // Extract the folder name from the old avatar URL (assuming folder structure follows a pattern)
// //             const oldFolderName = oldAvatarUrl.split('/').slice(-2, -1)[0]; // Extract the folder name
// //             const oldFilePath = `avatars/${oldFolderName}/${oldFileName}`; // Construct the full file path
      
// //             console.log(`Old File Name - ${oldFileName}`);
// //             console.log(`Old Folder Name - ${oldFolderName}`);
// //             console.log(`Old File Path - ${oldFilePath}`);
      
// //             // Delete the old avatar from Firebase
// //             try {
// //               await deleteFromFirebase(oldFilePath);
// //               console.log('Old avatar deleted from Firebase.');
// //             } catch (err) {
// //               console.error('Error deleting old avatar from Firebase:', err);
// //             }
// //           }
      
// //           // Update user's avatar URL in the database
// //           user.AvatarUrl = newAvatarUrl;
// //           await user.save();
      
// //           // // Update the avatar URL in all posts created by this user
// //           // await postModel.updateMany(
// //           //   { PostBy: user._id },
// //           //   { PostByAvtarUrl: newAvatarUrl }
// //           // );
      
// //           await postModel.updateMany(
// //             { "PostBy": user._id, "PostComments.commentBy._id": user._id }, // match posts and comments by user ID
// //             {
// //               $set: {
// //                 "PostByAvtarUrl": newAvatarUrl, // update post avatar
// //                 "PostComments.$[comment].commentBy.avatarUrl": newAvatarUrl // update avatar in comments
// //               }
// //             },
// //             {
// //               arrayFilters: [{ "comment.commentBy._id": user._id }] // filter to update only matching comments
// //             }
// //           );
      
// //           return res.status(200).json({ success: true, avatarUrl: newAvatarUrl });
// //         } catch (error) {
// //           console.error('Error uploading avatar:', error);
// //           return res.status(500).json({ success: false, message: 'Server error' });
// //         }
// // }




