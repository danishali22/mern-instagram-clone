import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addReply,
  deleteReply,
  getRepliesOfPost,
} from "../controllers/reply.js";

const app = express();

app.use(isAuthenticated);
app.post("/:id/reply", addReply);
app.delete("/reply/:id/delete", deleteReply);
app.get("/:id/reply/all", getRepliesOfPost);

export default app;
