import { useSelector } from "react-redux"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";

const SuggestedUsers = () => {
    const {suggestedUsers} = useSelector((store)=> store.auth);
  return (
    <div className="my-6">
      <div className="flex items-center justify-between text-sm gap-5">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUsers.map((user)=>{
        return (
          <div
            key={user?._id}
            className="flex items-center justify-between my-6"
          >
            <div className="flex items-center gap-2">
              <Link to={`${user?._id}/profile`}>
                <Avatar>
                  <AvatarImage
                    src={user?.profilePicture?.url}
                    alt="User Image"
                  />
                  <AvatarFallback />
                </Avatar>
              </Link>
              <div className="">
                <h1 className="text-sm font-semibold">
                  <Link to={`/${user?._id}/profile`}>{user?.username}</Link>
                </h1>
                <span className="text-sm text-gray-600">
                  {user?.bio || "Bio here..."}
                </span>
              </div>
            </div>
            <span className="text-[#3BADF8] hover:text-[#3495d6] text-sm font-bold cursor-pointer">
              Follow
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default SuggestedUsers