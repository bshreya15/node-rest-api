const jwt = require("jsonwebtoken");
const process = require("../../nodemon.json");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.spilt(" ")[1];
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    next();
  } catch {
    return res.status(401).json({
      message: "Authentication failed",
      
    });
  }
};
