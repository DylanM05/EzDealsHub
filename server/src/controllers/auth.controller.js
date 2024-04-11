import jwt from "jsonwebtoken";
import { expressjwt, ExpressJwtRequest } from "express-jwt";
import User from "../models/user.model";

const login = async (req, res) => {
  try {
      const user = await User.findOne({
      $or: [
        { username: { $regex: new RegExp(req.body.usernameOrEmail, 'i') } },
        { email: { $regex: new RegExp(req.body.usernameOrEmail, 'i') } },
      ],
    });

      if (!user || !user.validatePassword(req.body.password)) {
          return res.status(400).json({ error: "Invalid username or password" });
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

      // Set the token as a cookie
      res.cookie("token", token, { httpOnly: true });
      res.json({ token,
        isAuthenticated: true, 
        user: {
          _id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        }});

  } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logged out" });
};

const requireLogin = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "user",
});

//Will verify jwt. Using this currently in shops user id verification.
const authToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded._id) {
      console.error('Invalid token or missing user ID');
      return res.sendStatus(403);
    }

    req.user = { _id: decoded._id }; 
    next();
  } catch (err) {
    console.error('Error decoding token:', err.message);
    return res.sendStatus(403);
  }
};

//NOTE: Modified to match userProperty user instead of auth
const hasAuthorization = (req, res, next) => {
  const authorized = req.profile._id == req.user._id;
  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }
  next();
};

/*const checkCookie = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded._id };
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};*/

export default { login, logout, requireLogin, authToken, hasAuthorization };
