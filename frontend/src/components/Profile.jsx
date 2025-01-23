import useGetUserProfile from "@/hooks/useGetUserProfile"
import { useSelector } from "react-redux";
import {useParams} from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign } from "lucide-react";

const Profile = () => {
  const params = useParams();
  const userId = params.id
  useGetUserProfile(userId);

  const {userProfile} = useSelector((store) => store.auth);
  const isLoggedInUserProfile = true;
  const isFollowing = true;

  return (
    <div className="flex justify-center max-w-5xl mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={userProfile?.profilePicture?.url}
                alt="User Image"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      View Archieve
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Ad Tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button variant="secondary">Unfollow</Button>
                    <Button variant="secondary">Message</Button>
                  </>
                ) : (
                  <Button
                    variant="secondary"
                    className="bg-[#0095F6] hover:bg-[#3192d2] h-8 text-white"
                  >
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts?.length}
                  </span>{" "}
                  posts
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.followers?.length}
                  </span>{" "}
                  followers
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following?.length}
                  </span>{" "}
                  following
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  {userProfile?.bio || "bio here..."}
                </span>
                <Badge variant="secondary" className="w-fit mb-1 text-xl">
                  <AtSign />{" "}
                  <span className="pl-1">{userProfile?.username}</span>
                </Badge>
                <span>🤯Learn code with ease</span>
                <span>🤯Turing code into fun</span>
                <span>🤯DM for collaboration</span>
              </div>
            </div>
          </section>
        </div>
        {/* all posts here  */}
        <div></div>
      </div>
    </div>
  );
}

export default Profile