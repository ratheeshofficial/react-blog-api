const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
const Joi = require("joi");

const validateData = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    // repeat_password: Joi.ref('password'),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

const getUser = async (email) => {
  return await User.findOne({ email });
};

// REGISTER
router.post("/register", validateData, async (req, res) => {
  try {
    const isEmailExist = await getUser(req.body.email);

    if (isEmailExist) {
      return res.status(500).json({ message: "email exist" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });
    const user = await newUser.save();
    res.status(200).json(user);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: newUser.email,
      from: "rubeshrasiah@gmail.com", // Use the email address or domain you verified above
      subject: "Sending with Twilio SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    };
    sgMail.send(msg).then(
      (res) => {
        console.log("res", res);
      },
      (error) => {
        console.error(error);

        if (error.response) {
          console.error(error.response.body);
        }
      }
    );
    // sendDridMail();
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
    // console.log("others", others);
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

router.post("/admin", async (req, res) => {
  try {
    const newAdmin = new User({
      username: req.body.username,
      password: req.body.password,
      role: req.body.role,
    });
    const admin = await newAdmin.save();
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
