const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if authorization header exists
    if (!authHeader) {
      return res.status(401).json({ message: "Access Denied: No Token Provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract the token

    if (!token) {
      return res.status(401).json({ message: "Access Denied: Malformed Token." });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Validate the token structure
      if (!decoded || !decoded.id || !decoded.role) {
        return res.status(401).json({ message: "Invalid Token: Missing Payload Information." });
      }

      // Attach the user info to the request object
      req.user = decoded;

      // Check if the user has the required role
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access Denied: Insufficient Permissions." });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Access Denied: Token Expired." });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Access Denied: Invalid Token." });
      }

      res.status(500).json({ message: "An error occurred during token verification." });
    }
  };
};


module.exports = authMiddleware