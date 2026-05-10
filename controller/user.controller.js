const User = require("../models/user.model");
const { success, error } = require("../services/responseSerivce");

const userController = {
  register: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password || !role) {
        return error(400, "Please provide all required fields", null, res);
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        return error(400, "Invalid email format", null, res);
      }

      if (password.length < 6) {
        return error(400, "Password must be at least 6 characters", null, res);
      }

      const allowedRoles = ["Client", "Freelancer", "Admin"];

      if (!allowedRoles.includes(role)) {
        return error(400, "Invalid role selected", null, res);
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return error(
          400,
          `User already exists with email: ${email}`,
          null,
          res,
        );
      }

      const user = await User.create({
        name,
        email,
        password,
        role,
      });

      const token = user.generateToken();

      const userDetails = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      return success(
        201,
        "User registered successfully",
        { token, userDetails },
        res,
      );
    } catch (err) {
      return error(500, err.message, null, res);
    }
  },
  login: async (req, res) => {
    try {
      let { email, password } = req.body;

      if (!email || !password) {
        return error(400, "Please provide email and password", null, res);
      }

      email = email.toLowerCase();

      const user = await User.findOne({ email });

      if (!user) {
        return error(400, "User not found", null, res);
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return error(400, "Invalid credentials", null, res);
      }

      const token = user.generateToken();

      return success(
        200,
        "Login successful",
        {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
        res,
      );
    } catch (err) {
      return error(500, err.message, null, res);
    }
  },
};

module.exports = userController;
