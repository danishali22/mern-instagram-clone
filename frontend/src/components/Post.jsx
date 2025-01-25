/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { axiosInstance } from "@/lib/utils";
import { setPosts, setSelectedPosts } from "@/redux/postSlice";
import { Bookmark, Loader2, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import CommentDialog from "./CommentDialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { BookmarkCheck } from "lucide-react";


const Post = ({post}) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {user} = useSelector((store)=> store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLikeCount, setPostLikeCount] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  const changeEventHandler= (e) => {
    e.preventDefault();
    const inputText = e.target.value;
    inputText.trim() ? setText(inputText) : setText("");
  }

  const deletePostHandler = async () => {
    setLoading(true); 
    try {
      const res = await axiosInstance.delete(`/post/${post?._id}/delete`);

      if (res.data.success) {
        const updatedPosts = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("Error deleting post", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  const likeOrDislikePostHandler = async () => {
    try {
      const action = liked ? 'dislike' : 'like'
      const res = await axiosInstance.get(`/post/${post?._id}/${action}`);
      if (res.data.success) {
        const updatedLikes = liked ? postLikeCount - 1 : postLikeCount + 1
        setPostLikeCount(updatedLikes);
        setLiked(!liked);
        // update post data
        const updatedPostData = posts.map((p) => 
          p._id === post._id ? {
            ...p,
            likes: liked ? p.likes.filter((id)=>id!==user._id) : [...p.likes, user._id]
          } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("Error perform action on this post", error);
      toast.error(error.response.data.message);
    }
  }

  const commentHandler = async () => {
    try {
      const res = await axiosInstance.post(`/post/${post?._id}/comment`, {text});
      if(res.data.success){
        const updatedCommentData = [...comment, res.data.data];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p)=> 
          p._id === post._id ? {...p, comments: updatedCommentData} : p
        );
        dispatch(setPosts(updatedPostData));
        setText("");
        toast.success(res.data.message);
      }
    } catch (error) {
       console.log("error comment on post");
       toast.error(error.response.data.message); 
    }
  }

  const bookmarkHandler = async () => {
    try {
      const res = await axiosInstance.get(`/post/${post?._id}/bookmark`);
      if(res.data.success){
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("error on bookmark post", error);
    }
  }

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={post?.author?.profilePicture?.url}
              alt="User Image"
            />
            <AvatarFallback />
          </Avatar>
          <div className="flex items-center gap-3">
            <h1>{post.author.username}</h1>
            {user?._id === post?.author?._id && (
              <Badge variant="secondary">Author</Badge>
            )}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {user && user?._id !== post?.author?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold"
              >
                Unfollow
              </Button>
            )}
            <Button variant="ghost" className="cursor-pointer w-fit">
              Add to Favouties
            </Button>
            {user && user?._id === post?.author?._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="cursor-pointer w-fit"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  "Delete"
                )}
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post.image[0].url}
        alt="Post Image"
      />
      <div className="flex justify-between items-center my-2">
        <div className="flex gap-3 items-center">
          {liked ? (
            <FaHeart
              onClick={likeOrDislikePostHandler}
              size={"24px"}
              className="cursor-pointer text-red-600"
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikePostHandler}
              size={"24px"}
              className="cursor-pointer"
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPosts(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <BookmarkCheck
          onClick={bookmarkHandler}
          className="cursor-pointer hover:text-gray-600"
        />
      </div>
      <span className="font-medium mb-2 block">{postLikeCount} Like</span>
      <p>
        <span className="font-medium mr-2">{post.author.username}</span>
        {post?.caption}
      </p>

      {comment.length !== 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPosts(post));
            setOpen(true);
          }}
          className="cursor-pointer text-gray-400 text-sm"
        >
          View all {comment.length} comments
        </span>
      )}

      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Write a comment"
          value={text}
          onChange={changeEventHandler}
          className="outline-none w-full text-sm"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="cursor-pointer text-[#3BADF8]"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
}

export default Post