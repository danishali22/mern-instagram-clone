/* eslint-disable react/prop-types */

import { setSelectedPosts } from "@/redux/postSlice";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/utils";
import { Check, Heart, Loader2, MoreHorizontal, X } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "./ui/input";

const Comment = ({ comment }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { selectedPost } = useSelector((store) => store.post);
  const [editLoading, setEditLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editComment, setEditComment] = useState(comment.text);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const isAuthoirzed = user?._id === comment?.author?._id;

  const commentsEndRef = useRef(null);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comment]);

  const handleEdit = async () => {
    if (!editComment.trim()) return toast.error("Comment cannot be empty!");
    setEditLoading(true);
    try {
      const res = await axiosInstance.put(`/post/comment/${comment?._id}/update`, {text: editComment});
      if(res.data.success){
        const updatedCommentData = {
          ...selectedPost,
          comments: selectedPost.comments.map((cmnt) =>
            cmnt._id === comment._id ? { ...cmnt,  text: editComment } : cmnt
          )
        };
        dispatch(setSelectedPosts(updatedCommentData));
        setEditMode(false);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("Error updating comment", error);
      toast.error(error.response.data.message);
    } finally {
      setEditLoading(false);
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await axiosInstance.delete(
        `/post/comment/${comment?._id}/delete`
      );
      if (res.data.success) {
        const updatedCommentData = {
          ...selectedPost,
          comments: selectedPost.comments.filter(
            (commentObj) => commentObj._id !== comment._id
          ),
        };

        dispatch(setSelectedPosts(updatedCommentData));
        toast.success("Comment deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("Failed to delete comment");
    } finally {
      setDeleteLoading(false);
      setOpenDialog(false);
    }
  };

  return (
    <div className="flex items-start gap-3 my-2 group p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
      <Avatar>
        <AvatarImage
          src={comment.author?.profilePicture?.url}
          alt="User Image"
        />
        <AvatarFallback>
          {comment.author?.username?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="w-full flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm">
            <span className="font-bold mr-1">{comment.author.username}</span>
            {editMode ? (
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                />
                <button onClick={handleEdit} disabled={editLoading}>
                  <Check className="text-green-500 cursor-pointer" />
                </button>
                <button onClick={() => setEditMode(false)}>
                  <X className="text-red-500 cursor-pointer" />
                </button>
              </div>
            ) : (
              <span className="text-gray-800">{comment.text}</span>
            )}
          </div>
          <div>
            <Heart className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
          <span>56m</span> <span>2 likes</span> <span>Reply</span>{" "}
          <span>
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
          </span>
        </div>
      </div>
      <div ref={commentsEndRef}></div>
    </div>
  );
};

export default Comment;
