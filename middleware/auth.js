const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // 1. Get token from header (Support both 'x-auth-token' and 'Authorization: Bearer')
  let token = req.header("x-auth-token");
  
  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. Check if no token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // 3. Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 🚨 THIS WAS THE BUG:
    // Old: req.user = decoded; 
    // New: We extract the 'user' object from the payload
    req.user = decoded.user; 
    
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};