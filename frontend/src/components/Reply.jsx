/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "@/components/ui/button";
import { FaHeart } from "react-icons/fa";
import { Check, X, Heart, Loader2, MoreHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedPosts } from "@/redux/postSlice";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

const Reply = ({ reply, commentId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { selectedPost } = useSelector((store) => store.post);

  const [editLoading, setEditLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editReply, setEditReply] = useState(reply.text);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [liked, setLiked] = useState(reply.likes.includes(user?._id) || false);
  const [replyLikeCount, setReplyLikeCount] = useState(reply.likes.length);
  const [openDialog, setOpenDialog] = useState(false);

  const isAuthoirzed = user?._id === reply?.author?._id;

  useEffect(() => {
    setReplyLikeCount(reply.likes.length);
    setLiked(reply.likes.includes(user?._id));
  }, [reply]);

  const handleEdit = async () => {
    if (!editReply.trim()) return toast.error("Reply cannot be empty!");
    setEditLoading(true);
    try {
      const res = await axiosInstance.put(
        `/post/comment/reply/${reply?._id}/update`,
        { text: editReply }
      );
      if (res.data.success) {
        const updatedPostData = {
          ...selectedPost,
          comments: selectedPost.comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  replies: comment.replies.map((rpl) =>
                    rpl._id === reply._id ? { ...rpl, text: editReply } : rpl
                  ),
                }
              : comment
          ),
        };
        dispatch(setSelectedPosts(updatedPostData));
        setEditMode(false);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("Error updating reply", error);
      toast.error(error.response.data.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await axiosInstance.delete(
        `/post/comment/reply/${reply?._id}/delete`
      );
      if (res.data.success) {
        const updatedPostData = {
          ...selectedPost,
          comments: selectedPost.comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  replies: comment.replies.filter(
                    (rpl) => rpl._id !== reply._id
                  ),
                }
              : comment
          ),
        };
        dispatch(setSelectedPosts(updatedPostData));
        toast.success("Reply deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete reply:", error);
      toast.error("Failed to delete reply");
    } finally {
      setDeleteLoading(false);
      setOpenDialog(false);
    }
  };

  const likeOrDislikeReply = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axiosInstance.put(
        `/post/comment/reply/${reply?._id}/${action}`
      );
      if (res.data.success) {
        const updatedReplyLikes = liked
          ? replyLikeCount - 1
          : replyLikeCount + 1;
        setReplyLikeCount(updatedReplyLikes);
        setLiked(!liked);

        const updatedPostData = {
          ...selectedPost,
          comments: selectedPost.comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  replies: comment.replies.map((rpl) =>
                    rpl._id === reply._id
                      ? {
                          ...rpl,
                          likes: liked
                            ? rpl.likes.filter((id) => id !== user?._id)
                            : [...rpl.likes, user?._id],
                        }
                      : rpl
                  ),
                }
              : comment
          ),
        };
        dispatch(setSelectedPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("Error performing action on reply", error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex items-start gap-3 my-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
      <div className="w-full flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm">
            <span className="font-bold mr-1">{reply.author.username}</span>
            {editMode ? (
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={editReply}
                  onChange={(e) => setEditReply(e.target.value)}
                />
                <button onClick={handleEdit} disabled={editLoading}>
                  <Check className="text-green-500 cursor-pointer" />
                </button>
                <button onClick={() => setEditMode(false)}>
                  <X className="text-red-600 cursor-pointer" />
                </button>
              </div>
            ) : (
              <span className="text-gray-800">{reply.text}</span>
            )}
          </div>
          <div>
            {liked ? (
              <FaHeart
                className="h-4 w-4 cursor-pointer text-red-500"
                onClick={likeOrDislikeReply}
              />
            ) : (
              <Heart
                className="h-4 w-4 cursor-pointer"
                onClick={likeOrDislikeReply}
              />
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
          <span>56m</span>
          {replyLikeCount > 0 && (
            <span>
              {replyLikeCount} {replyLikeCount === 1 ? "like" : "likes"}
            </span>
          )}

          {isAuthoirzed && (
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <MoreHorizontal className="cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="max-w-sm flex flex-col items-center">
                <DialogTitle></DialogTitle>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditMode(true);
                    setOpenDialog(false);
                  }}
                  className="cursor-pointer w-fit"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="cursor-pointer w-fit"
                >
                  {deleteLoading ? (
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reply;