import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {Link} from "react-router-dom"
import { Button } from "./ui/button";
import { useState } from "react";
import { useSelector } from "react-redux";
import Comment from "./Comment";
import { axiosInstance } from "@/lib/utils";
import { setPosts } from "@/redux/postSlice";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

// eslint-disable-next-line react/prop-types
const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { posts, selectedPost } = useSelector((store) => store.post);
  const [comment, setComment] = useState(selectedPost?.comments);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    inputText.trim() ? setText(inputText) : setText("")
  }

  const commentHandler = async () => {
    try {
      const res = await axiosInstance.post(
        `/post/${selectedPost?._id}/comment`,
        {
          text,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.data];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );
        dispatch(setPosts(updatedPostData));
        setText("");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("error comment on post");
      toast.error(error.response.data.message);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex flex-col"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              className="h-full w-full object-cover rounded-l-lg"
              src={selectedPost?.image[0].url}
              alt="Post Image"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            {/* Header  */}
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage
                      src={selectedPost?.author?.profilePicture?.url}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">
                    {selectedPost?.author?.username}
                  </Link>
                  {/* <span className="text-sm text-gray-400">Bio here...</span> */}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full">Add to Favourites</div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {comment.map((comment) => {
                return (
                  <div key={comment._id}>
                    <Comment comment={comment} />
                  </div>
                );
              })}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="outline-none w-full border border-gray-300 p-2 rounded"
                  onChange={changeEventHandler}
                  value={text}
                />
                <Button
                  disabled={!text.trim()}
                  variant="outline"
                  onClick={commentHandler}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
