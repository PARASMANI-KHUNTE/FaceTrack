
// Generate a random OTP
exports.generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};


// Verify the OTP
exports.verifyOtp = (inputOtp, storedHashedOtp) => {
    const hashedInputOtp = crypto.createHash('sha256').update(inputOtp).digest('hex');
    return hashedInputOtp === storedHashedOtp;
};

// Add expiration time to OTP
exports.isOtpExpired = (otpGeneratedAt, expirationTimeInMinutes = 10) => {
    const expirationTime = new Date(otpGeneratedAt).getTime() + expirationTimeInMinutes * 60 * 1000;
    return Date.now() > expirationTime;
};
