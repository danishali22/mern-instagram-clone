import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Instagram } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const sidebarItems = [
  { icon: <Home />, text: "Home" },
  { icon: <Search />, text: "Search" },
  { icon: <TrendingUp />, text: "Explore" },
  { icon: <MessageCircle />, text: "Messages" },
  { icon: <Heart />, text: "Notifications" },
  { icon: <PlusSquare />, text: "Create" },
  {
    icon: (
      <Avatar className="w-6 h-6">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    text: "Profile",
  },
  { icon: <LogOut />, text: "Logout" },
];

const LeftSidebar = () => {

  const navigate = useNavigate();

  const sidebarHandler = async (textType) => {
    if (textType === "Logout") logoutHandler();
  };

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/user/logout`, {withCredentials: true});
      if(res.data.message){
        navigate("/login")
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  return (
    <div className="fixed left-0 top-8 z-10 px-4 border-r border-gray-400 w-[16%] h-screen">
      <div className="flex flex-col">
      <h1 className="-mx-6"><Instagram className="h-10 w-20 my-2" /></h1>
      {
        sidebarItems.map((item, index)=> {
          return (
            <div
              onClick={() => sidebarHandler(item.text)}
              className="flex item-center gap-4 my-2 relative cursor-pointer hover:bg-gray-100"
              key={index}
            >
              {item.icon}
              <span>{item.text}</span>
            </div>
          );
        })
      }
    </div>
    </div>
  );
};

export default LeftSidebar;
