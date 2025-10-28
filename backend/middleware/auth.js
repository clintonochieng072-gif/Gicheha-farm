const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired",
        code: "TOKEN_EXPIRED",
      });
    }
    res.status(401).json({ message: "Token is not valid" });
  }
};

const admin = (req, res, next) => {
  if (!req.admin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

module.exports = { protect, admin };
