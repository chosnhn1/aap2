import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createPost, likeUnlikePost, commentOnPost, deletePost, getAllPosts, getLikedPosts, getFollowingsPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
// router.get("/all", protectRoute, getAllPosts);
router.get("/followings", protectRoute, getFollowingsPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost);

export default router;