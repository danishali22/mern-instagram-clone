import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { FaRegHeart } from "react-icons/fa";
import { Bookmark } from "lucide-react";
import { Send } from "lucide-react";
import { MessageCircle } from "lucide-react";
import CommentDialog from "./CommentDialog";
import { useState } from "react";


const Post = () => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const changeEventHandler= (e) => {
    e.preventDefault();
    const inputText = e.target.value;
    inputText.trim() ? setText(inputText) : setText("");
  }
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="" alt="User Image" />
            <AvatarFallback />
          </Avatar>
          <h1>username</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit">
              Add to Favouties
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit">
              Delete
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src="https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg"
        alt="Post Image"
      />
      <div className="flex justify-between items-center my-2">
        <div className="flex gap-3 items-center">
          <FaRegHeart size={"24px"} className="cursor-pointer" />
          <MessageCircle
            onClick={() => setOpen(true)}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium mb-2 block">1k Likes</span>
      <p>
        <span className="font-medium mr-2">username</span>
        caption
      </p>
      <span onClick={()=> setOpen(true)} className="cursor-pointer text-gray-400 text-sm">View all 10 comments</span>
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Write a comment"
          value={text}
          onChange={changeEventHandler}
          className="outline-none w-full text-sm"
        />
        {text && <span className="text-[#3BADF8]">Post</span>}
      </div>
    </div>
  );
}

export default Post