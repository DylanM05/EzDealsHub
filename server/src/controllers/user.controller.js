import User from "../models/user.model";
import jwt from "jsonwebtoken";

const createUser = async (req, res) => {
  // before creating a new user, check if username or email already exists
  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "existingUser", message: "Username already exists." });
  }

  const existingEmail = await User.findOne({ email: req.body.email });
  if (existingEmail) {
    return res
      .status(400)
      .json({ error: "existingEmail", message: "Email already exists." });
  }

  // if username and email are unique, create new user
  const newUser = new User(req.body);
  newUser.salt = newUser.generateSalt();
  newUser.hashed_password = newUser.encryptPassword(
    req.body.password,
    newUser.salt
  );
  const savedUser = await newUser.save();
  const token = jwt.sign({ _id: savedUser.id }, process.env.JWT_SECRET);
  res.cookie("token", token, { httpOnly: true });
  res.json({
    token,
    isAuthenticated: true,
    user: {
      _id: savedUser._id,
      username: savedUser.username,
      name: savedUser.name,
      email: savedUser.email,
      avatar: savedUser.avatar,
    },
  });
};

// find user by id and append to req object
const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id);
    if (!user)
      return res.status("400").json({
        error: "User not found",
      });
    req.profile = user;
    next();
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve user",
    });
  }
};

const deleteUser = async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  if (!deletedUser) {
    res.status(404).json({ error: `User with oid:${req.params.id} not found` });
    return;
  }
  res.json({
    message: `Successfully deleted '${deletedUser.name}' with object id:${deletedUser.id}`,
  });
};

const listUsers = async (req, res) => {
  try {
    const users = await User.find({}, { hashed_password: 0, salt: 0 }); // Exclude sensitive information
    res.json(users);
  } catch (error) {
    console.error("Error listing users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchUser = async (req, res) => {
  try {
    const user = await User.findOne(
      { _id: req.params.userId },
      { hashed_password: 0, salt: 0 }
    ); // Exclude sensitive information
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    let updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      projection: { hashed_password: 0, salt: 0 },
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const uploadAvatar = async (req, res) => {
  try {
    if (req.file) {
      req.body.avatar = req.file.filename;
      await User.findByIdAndUpdate(req.user._id, req.body);
      res.json({ message: "File uploaded successfully" });
    } else {
      return res.status(400).json({ error: "File upload error" });
    }
  } catch (error) {
    console.error("Error updating user avatar:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.userId);

    // Check if the current password is correct
    if (!user || !user.validatePassword(currentPassword)) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    // Update the password
    user.hashed_password = user.encryptPassword(newPassword, user.salt);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  createUser,
  userByID,
  deleteUser,
  listUsers,
  updateUser,
  fetchUser,
  uploadAvatar,
  updatePassword,
};
