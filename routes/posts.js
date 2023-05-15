const router = require("express").Router();
const Post = require("../models/Post");

// CREATE POST
router.post("/", async (req, res) => {
  const post = new Post(req.body);
  try {
    const savedPost = await post.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE POST
router.put("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  console.log("post", post);
  if (post.username === req.body.username) {
    try {
      const updatePost = await Post.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatePost);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(500).json("you can update only your post");
  }
});
// DELETE POST
router.delete("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.username === req.body.username) {
    try {
      await Post.findByIdAndDelete(req.params.id);
      res.status(200).json("Deleted Post successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(500).json("you can delete only your post");
  }
});
// GET POST

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET ALL POST
router.get("/", async (req, res) => {
  const userName = req.query.user;
  const catName = req.query.cat;
  // console.log("userName", userName);
  try {
    let posts;
    // if (userName) {
    posts = await Post.findOne({ _id: "645c8e7fa4c42fa48cae3e70" }).populate({
      path: "user",
    });
    // .populate({
    //   path: "user",
    //   option: { strictPopulate: false },
    // });
    // console.log("username", posts);
    // } else if (catName) {
    //   posts = await Post.find({ categories: { $in: [catName] } }); //$in method is to find is there is inside in categories
    //   // console.log("catName", posts);
    // } else {
    //   posts = await Post.find();
    // }
    res.status(200).json(posts);
  } catch (error) {
    res.status(200).json(error);
  }
});

module.exports = router;
