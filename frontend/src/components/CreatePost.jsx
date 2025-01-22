import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { useRef } from "react";


// eslint-disable-next-line react/prop-types
const CreatePost = ({open, setOpen}) => {
    const imageRef = useRef();
    const createPostHandler = async (e) => {
        e.preventDefault();
        try {
            console.log("ok");
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-semibold">
          Create New Post
        </DialogHeader>
        <div className="flex gap-3 items-center" onClick={createPostHandler}>
          <Avatar>
            <AvatarImage src="" alt="img" />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">Username</h1>
            <span className="text-gray-600 text-xs">Bio Here..</span>
          </div>
        </div>
        <Textarea
          className="focus-visible:ring-transparent border-none"
          placeholder="Write a caption..."
        />
        <input ref={imageRef} type="file" className="hidden" />
        <Button onClick={()=> imageRef.current.click()} className="w-fit mx-auto bg-[#0095F6] hover:bg-[#42b3ff]">
          Select from computer
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePost