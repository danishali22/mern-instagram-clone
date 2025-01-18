import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  caption: { type: String, default: "" },
  image: [
      {
        public_id: {
          type: String,
          required: [true, "Please add public id"],
        },
        url: {
          type: String,
          required: [true, "Please add image url"],
        },
      },
    ],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});
export const Post = mongoose.model("Post", postSchema);
