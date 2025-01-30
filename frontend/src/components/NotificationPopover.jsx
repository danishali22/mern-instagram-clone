/* eslint-disable react/prop-types */
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { markLikeNotificationAsRead } from "@/redux/rtmSlice";
import { useDispatch } from "react-redux";

const NotificationPopover = ({
  unreadLikeNotificationCount,
  likeNotification,
}) => {
  const dispatch = useDispatch();

  return (
    <Popover>
      <PopoverTrigger asChild>
        {unreadLikeNotificationCount && (
          <Button
            className="rounded-full h-5 w-5 absolute bg-red-600 hover:bg-red-600 left-5 bottom-5"
            size="icon"
          >
            {unreadLikeNotificationCount}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent>
        <div>
          {unreadLikeNotificationCount === 0 ? (
            <p>No new notifications</p>
          ) : (
            likeNotification.map((notification) => (
              <div
                key={notification.userId}
                className={`flex items-center gap-2 my-2 p-2 cursor-pointer ${
                  !notification.isRead ? "bg-gray-100" : "bg-white"
                }`}
                onClick={() => {
                  if (!notification.isRead) {
                    dispatch(markLikeNotificationAsRead(notification.userId));
                  }
                }}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={notification?.userDetails?.profilePicture?.url}
                    alt="User Image"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className="text-sm">
                  <span className="font-bold">
                    {notification?.userDetails?.username}{" "}
                  </span>
                  liked your post
                </p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;
