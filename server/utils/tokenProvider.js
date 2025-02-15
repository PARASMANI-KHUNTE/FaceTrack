const jsonwebtoken = require('jsonwebtoken');

const generateToken = (payload) => {
    return jsonwebtoken.sign(payload, process.env.secretKey, { expiresIn: '1hr' });
}


const generateTokenForPassword = (userId) => {
  const secretKey = process.env.secretKey;
  const token = jsonwebtoken.sign(
    { userId }, // payload
    secretKey,
    { expiresIn: '24h' } // token valid for 24 hours
  );
  return token;
};



const tokenVerify = (token) => {
  if (!token || typeof token !== 'string') {
    throw new jsonwebtoken.JsonWebTokenError('Token must be a string');
  }

  try {
    // Verify the token and decode its payload
    const payload = jsonwebtoken.verify(token, process.env.secretKey);

    // Extract user information or any other payload details
    const user = payload.user || null; // Assuming "user" is a property in the payload

    // Return both user, payload, and verification status (true for valid token)
    return { user, payload, isValid: true };
  } catch (err) {
    // If the token is invalid, return false for isValid and null for user & payload
    return { user: null, payload: null, isValid: false };
  }
};
module.exports = { generateToken, tokenVerify ,generateTokenForPassword};