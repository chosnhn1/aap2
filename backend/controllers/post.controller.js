import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found."});

    if (!text && !img) {
      return res.status(400).json({ error: "Please write post before send it."})
    }

    if (img) {
      // logic on upload img
    }

    let newPost = new Post({
      user: userId,
      text: text,
      img: img
    });
    newPost = await newPost.save();
    return res.status(201).json(newPost);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
  
};

export const likeUnlikePost = async (req, res) => {
  try {
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
  
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({error: "Post not found."});
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({error: "You are not authorized."});
    }

    if (post.img) {
      // logic for delete(unassign) uploaded image
    }

    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Post deleted."});

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!text) return res.status(400).json({ error: "Please fill in the comment."});
    if (!post) return res.status(404).json({ error: "Post not found."});

    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();

    return res.status(200).json(post);
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
