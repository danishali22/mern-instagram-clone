import { Reply } from "../models/reply.js";
import { Post } from "../models/post.js";
import { User } from "../models/user.js";
import { ErrorHandler, success, TryCatch } from "../utils/features.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const getRepliesOfPost = TryCatch(async (req, res, next) => {
  const postId = req.params.id;
  const replies = await Reply.find({ post: postId }).populate({
    path: "author",
    select: "username, profilePicture",
  });
  return success(res, "Replies fetched successfully", 200, replies);
});

export const addReply = TryCatch(async (req, res, next) => {
  const replyUserId = req.user;
  const postId = req.params.id;
  const { text } = req.body;
  if (!text) return next(new ErrorHandler("Text is required", 400));
  const post = await Post.findById(postId);
  if (!post) return next(new ErrorHandler("Post not found", 404));

  let reply = await Reply.create({
    author: replyUserId,
    post: postId,
    text,
  });

  reply = await reply.populate({
    path: "author",
    select: "username profilePicture",
  });

  post.replies.push(reply._id);
  await post.save();

  const user = await User.findById(replyUserId).select(
    "username profilePicture"
  );

  const postOwnerId = post.author.toString();

  if (postOwnerId !== replyUserId) {
    const notification = {
      type: "reply",
      user,
      post,
      reply,
      message: `${user.username} replyed on your post.`,
    };

    const postOwnerSocketId = getReceiverSocketId(postOwnerId);
    io.to(postOwnerSocketId).emit("notification", notification);
  }

  return success(res, "Reply Added", 201, reply);
});

export const deleteReply = TryCatch(async (req, res, next) => {
  const replyUserId = req.user;
  const replyId = req.params.id;
  const reply = await Reply.findById(replyId);
  if (!reply) return next(new ErrorHandler("Reply not found", 404));
  if (reply.author.toString() !== replyUserId)
    return next(
      new ErrorHandler("You are not authorized to delete this reply", 403)
    );

  await Reply.findByIdAndDelete(replyId);

  const post = await Post.findById(reply.post);
  if (post) {
    post.replies = post.replies.filter((id) => id.toString() !== replyId);
    await post.save();
  }

  const user = await User.findById(replyUserId).select(
    "username profilePicture"
  );

  const postOwnerId = post.author.toString();

  if (postOwnerId !== replyUserId) {
    const notification = {
      type: "delete_reply",
      user,
      post,
      reply,
      message: `${user.username} delete reply from your post.`,
    };

    const postOwnerSocketId = getReceiverSocketId(postOwnerId);
    io.to(postOwnerSocketId).emit("notification", notification);
  }

  return success(res, "Reply Deleted", 200);
});
