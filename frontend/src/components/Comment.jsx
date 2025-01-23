/* eslint-disable react/prop-types */

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Comment = ({ comment }) => {
  return (
      <div className="flex items-center gap-3 my-2">
        <Avatar>
          <AvatarImage
            src={comment.author?.profilePicture?.url}
            alt="User Image"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1 className="font-bold text-sm">
          {comment.author.username} <span className="font-normal pl-2">{comment.text}</span>
        </h1>
      </div>
  );
};

export default Comment;
