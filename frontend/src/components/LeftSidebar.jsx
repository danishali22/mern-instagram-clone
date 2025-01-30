import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { axiosInstance } from "@/lib/utils";
import { setAuthUser, setSuggestedUsers, setUserProfile } from "@/redux/authSlice";
import { setPosts, setSelectedPosts } from "@/redux/postSlice";
import {
  Bell,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreatePost from "./CreatePost";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { FaInstagram } from "react-icons/fa";


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
        dispatch(setUserProfile(null));
        dispatch(setSuggestedUsers([]));
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
    { icon: <Bell />, text: "Notifications" },
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

  const mobileSidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <PlusSquare />, text: "Create" },
    { icon: <MessageCircle />, text: "Messages" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture?.url} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
  ];

  const mobileNavbarItems = [
    { icon: <Bell />, text: "Notifications" },
    { icon: <LogOut />, text: "Logout" },
  ];
  return (
    <div>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 z-10 px-4 border-r border-gray-400 lg:w-[20%] h-screen flex-col">
        <div className="flex flex-col">
          <FaInstagram className="h-8 w-14 mt-10 mb-7 pr-4 lg:hidden flex" />
          <h1 className="text-3xl font-bold hidden lg:flex mt-10 mb-7 ">
            {" "}
            Instagram{" "}
          </h1>
          {sidebarItems.map((item, index) => {
            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                className="flex item-center gap-4 my-2 relative cursor-pointer hover:bg-gray-100 p-2"
                key={index}
              >
                {item.icon}
                <span className="hidden lg:flex">{item.text}</span>
                {item.text === "Notifications" &&
                  likeNotification.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          className="rounded-full h-5 w-5 absolute bg-red-600 hover:bg-red-600 left-5 bottom-5"
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
                                className="flex items-center gap-2 my-2"
                              >
                                <Avatar className="w-8 h-8">
                                  <AvatarImage
                                    src={
                                      notification?.userDetails?.profilePicture
                                        ?.url
                                    }
                                    alt="User Image"
                                  />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className="text-sm">
                                  <span className="font-bold">
                                    {notification?.userDeatils?.username}{" "}
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
      </div>

      {/* Mobile Top Navigation */}
      <nav className="border-b border-gray-300 px-6 flex justify-between items-center md:hidden">
        <div className="flex items-center gap-2 sm:text-xl font-bold text-secondary">
          <span className="text-2xl">Instagram</span>
        </div>

        <div className="flex items-center gap-4">
          {mobileNavbarItems.map((item, index) => {
            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                className="flex item-center gap-4 my-2 relative cursor-pointer hover:bg-gray-100 p-2"
                key={index}
              >
                {item.icon}
                <span className="hidden md:block">{item.text}</span>
                {item.text === "Notifications" &&
                  likeNotification.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          className="rounded-full h-5 w-5 absolute bg-red-600 hover:bg-red-600 left-5 bottom-5"
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
                                className="flex items-center gap-2 my-2"
                              >
                                <Avatar className="w-8 h-8">
                                  <AvatarImage
                                    src={
                                      notification?.userDetails?.profilePicture
                                        ?.url
                                    }
                                    alt="User Image"
                                  />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className="text-sm">
                                  <span className="font-bold">
                                    {notification?.userDeatils?.username}{" "}
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
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed md:hidden bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around h-full">
          {mobileSidebarItems.map((item, index) => (
            <div
              onClick={() => sidebarHandler(item.text)}
              className="flex items-center justify-center relative cursor-pointer p-2"
              key={index}
            >
              {item.text === "Profile" ? (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.profilePicture?.url} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              ) : (
                item.icon
              )}
            </div>
          ))}
        </div>
      </div>
      {open && <CreatePost open={open} setOpen={setOpen} />}
    </div>
  );
};

export default LeftSidebar;
