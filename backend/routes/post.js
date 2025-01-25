import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import {
  addComment,
  bookmarkPost,
  createPost,
  deletePost,
  dislikePost,
  getAllPosts,
  getCommentsOfPost,
  getUsersPosts,
  likePost,
} from "../controllers/post.js";

const app = express();

app.use(isAuthenticated);
app.post("/new", upload.single("image"), createPost);
app.get("/all", getAllPosts);
app.get("/all/user", getUsersPosts);
app.get("/:id/like", likePost);
app.get("/:id/dislike", dislikePost);
app.post("/:id/comment", addComment);
app.get("/:id/comment/all", getCommentsOfPost);
app.delete("/:id/delete", deletePost);
app.get("/:id/bookmark", bookmarkPost);

export default app;
