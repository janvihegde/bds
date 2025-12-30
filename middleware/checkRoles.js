module.exports = function (allowedRoles) {
  return (req, res, next) => {
    // 🔍 DEBUG LOGGING
    console.log("--- CheckRole Debug ---");
    console.log("Required Roles:", allowedRoles);
    console.log("User in Request:", req.user);
    
    if (!req.user || !req.user.role) {
      console.log("❌ No user role found on request.");
      return res.status(403).json({ msg: "Access denied: User role missing" });
    }

    console.log("User Role:", req.user.role);

    if (!allowedRoles.includes(req.user.role)) {
      console.log("❌ Role mismatch! Blocking access.");
      return res.status(403).json({ 
        msg: "Access denied: Insufficient permissions",
        expected: allowedRoles,
        got: req.user.role 
      });
    }

    console.log("✅ Access Granted.");
    next();
  };
};