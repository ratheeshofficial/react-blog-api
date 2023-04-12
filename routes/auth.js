const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).json("user not found");

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json("Wrong password or username");
    const { password, ...others } = user._doc;
    console.log("user", user);
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json({ error: "message" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updateUser = req.params.id;
    console.log("updateUser", updateUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
