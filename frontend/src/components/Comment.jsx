/* eslint-disable react/prop-types */

import { setSelectedPosts } from "@/redux/postSlice";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/utils";
import { Trash, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";

const Comment = ({ comment }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { selectedPost } = useSelector((store) => store.post);
  const [deleting, setDeleting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // Control dialog

  const canDelete = user?._id === comment?.author?._id;

  const handleDelete = async () => {
    setDeleting(true);
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
      setDeleting(false);
      setOpenDialog(false);
    }
  };

  return (
    <div className="flex items-center gap-3 my-2 group p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
      <Avatar>
        <AvatarImage
          src={comment.author?.profilePicture?.url}
          alt="User Image"
        />
        <AvatarFallback>
          {comment.author?.username?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h1 className="font-bold text-sm">{comment.author.username}</h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {comment.text}
        </p>
      </div>

      {/* Delete Button */}
      {canDelete && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <button className="ml-auto opacity-50 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700">
              <Trash size={16} />
            </button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle></DialogTitle>
            <h2 className="text-lg font-semibold">Delete Comment?</h2>
            <p className="text-gray-500">
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Comment;
