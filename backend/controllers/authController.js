// const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");

// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) return res.status(400).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d"
//     });

//     res.json({
//       token,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email
//       }
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server Error");
//   }
// };

// const getMe = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     res.json(user);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server Error");
//   }
// };

// module.exports = { loginUser, getMe };
