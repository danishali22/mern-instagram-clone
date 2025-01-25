/* eslint-disable react/prop-types */
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {Link} from "react-router-dom"
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import useGetAllMessages from "@/hooks/useGetAllMessages";
import useGetRTM from "@/hooks/useGetRTM";

const Messages = ({selectedUser}) => {
  useGetRTM();
  useGetAllMessages();

  const {messages} = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex flex-col items-center justify-center">
        <Avatar className="h-32 w-32">
          <AvatarImage
            src={selectedUser?.profilePicture?.url}
            alt="User Image"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="font-bold text-2xl mt-3">
          {selectedUser?.username}
        </span>
        <Link to={`profile/${selectedUser?._id}`}>
          <Button className="h-8 my-2" variant="secondary">
            View Profile
          </Button>
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {messages &&
          messages.map((msg) => {
            return (
              <div
                key={msg?._id}
                className={`flex ${
                  msg?.senderId === user?._id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-2 rounded max-w-xs break-words ${
                    msg?.senderId === user?._id ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Messages