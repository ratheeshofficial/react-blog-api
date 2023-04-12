const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Update
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = bcrypt.genSaltSync(10);
      req.body.password = bcrypt.hashSync(req.body.password, salt);
    }

    try {
      updateData = { $set: req.body };
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
        }
      );
      res.status(200).json(updateUser);
    } catch (error) {
      res.status(500).json(error.message);
    }
  } else {
    res.status(401).json("You can update only your account");
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been Deleted...");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(401).json("You can Delete only your account");
  }
});

//GET USER

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET ALL USER
router.get("/", async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
