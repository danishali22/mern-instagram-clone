/* eslint-disable react/prop-types */
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";

const Following = ({ userProfile }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filterFollowers = userProfile?.following.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="border-t border-gray-300 w-full"></div>
      <div>
        <div className="relative mt-3">
          <Search className="absolute left-2 top-1" />
          <Input
            type="text"
            placeholder="Search"
            className="pl-10 font-normal focus-visible:ring-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {filterFollowers.length > 0 ? (
          filterFollowers.map((user) => {
            console.log("user", user);
            return (
              <div
                key={user?._id}
                className="flex items-center justify-between mt-5"
              >
                <div className="flex items-center gap-2">
                  <Link to={`profile/${user?._id}`}>
                    <Avatar>
                      <AvatarImage
                        src={user?.profilePicture?.url}
                        alt="User Image"
                      />
                      <AvatarFallback />
                    </Avatar>
                  </Link>
                  <div>
                    <p className="font-semibold">{user?.username}</p>
                    <span className="text-gray-500 text-sm">{user?.bio}</span>
                  </div>
                </div>
                <Button variant="secondary" className="hover:bg-gray-200 h-8">
                  Remove
                </Button>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-500 mt-3">
            No user found matching &quot;{searchTerm}&quot;.
          </p>
        )}
      </div>
    </div>
  );
};

export default Following;
