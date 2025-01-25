import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { axiosInstance } from "@/lib/utils";
import { setAuthUser } from "@/redux/authSlice";
import { setPosts, setSelectedPosts } from "@/redux/postSlice";
import {
  Home,
  Instagram,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp
} from "lucide-react";
import { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreatePost from "./CreatePost";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";


const LeftSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );

  const [open, setOpen] = useState(false);

  const sidebarHandler = async (textType) => {
    if (textType === "Logout") logoutHandler();
    else if (textType === "Create") setOpen(true);
    else if (textType === "Profile") navigate(`/profile/${user?._id}`);
    else if (textType === "Home") navigate("/");
    else if (textType === "Messages") navigate("/chat");
  };

  const logoutHandler = async () => {
    try {
      const res = await axiosInstance.get("/user/logout");
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setPosts([]));
        dispatch(setSelectedPosts(null));
        navigate("/login");
        toast.success(res.data.message || "An error occurred");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <FaRegHeart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture?.url} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];
  return (
    <div className="fixed left-0 top-8 z-10 px-4 border-r border-gray-400 w-[16%] h-screen">
      <div className="flex flex-col">
        <h1 className="-mx-6">
          <Instagram className="h-10 w-20 my-2" />
        </h1>
        {sidebarItems.map((item, index) => {
          return (
            <div
              onClick={() => sidebarHandler(item.text)}
              className="flex item-center gap-4 my-2 relative cursor-pointer hover:bg-gray-100"
              key={index}
            >
              {item.icon}
              <span>{item.text}</span>
              {item.text === "Notifications" && likeNotification.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className="rounded-full h-5 w-5 absolute bg-red-600 hover:bg-red-600 left-6 bottom-6"
                      size="icon"
                    >
                      {likeNotification.length}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div>
                      {likeNotification.length === 0 ? (
                        <p>No new Notification</p>
                      ) : (
                        likeNotification.map((notification) => (
                          <div
                            key={notification?.userId}
                            className="flex items-center gap-2 p-2 my-2"
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
                                {notification?.userId?.username}
                              </span>
                              liked your post
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          );
        })}
      </div>
      { open && <CreatePost open={open} setOpen={setOpen} /> }
    </div>
  );
};

export default LeftSidebar;
