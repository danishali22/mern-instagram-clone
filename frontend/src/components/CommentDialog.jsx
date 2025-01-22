import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {Link} from "react-router-dom"
import { Button } from "./ui/button";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    inputText.trim() ? setText(inputText) : setText("")
  }

  const sendMessageHandler = () => {

  }

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
              src="https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg"
              alt="Post Image"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
          {/* Header  */}
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">username</Link>
                  {/* <span className="text-sm text-gray-400">Bio here...</span> */}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">Unfollow</div>
                  <div className="cursor-pointer w-full">Add to Favourites</div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              all comments here
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input type="text" placeholder="Write a comment..." className="outline-none w-full border border-gray-300 p-2 rounded" onChange={changeEventHandler} value={text} />
                <Button variant="outline" onClick={sendMessageHandler}>Send</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
