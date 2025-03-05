import Image from "next/image";
import PostComponent from "./Post";
import { Post } from "../ts/PostInterface";
import {PostSection} from "../components/PostProfileSection"
import { ProfileFollowing } from "./ProfileFollowSection";
interface User {
  id: string;
  username: string;
  email: string;
  bio: string | null;
  image: string;
  followers: any[];
  following: any[];
  posts: any[];
  createdAt: Date;
  updatedAt: Date;
}



export function ProfileSection(user:any) {
     
    user=user.user;

    
  return (
    <div className="max-w-4xl w-[50rem] bg-white mx-auto p-4 m-4 rounded-md shadow-lg ">
      {/* Profile Top */}
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Profile Image */}
        <div className="flex justify-center md:justify-start">
          <Image
            src={user?.image||"/profile.png"}
            alt={`${user.username}'s profile picture`}
            width={120}
            height={120}
            className="rounded-full object-cover w-28 h-28 md:w-32 md:h-32"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          {/* Username */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h2 className="text-2xl font-semibold">{user.username}</h2>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4">
            <div>
              <span className="font-semibold">{user.posts?.length}</span> posts
            </div>
            <div>
              <span className="font-semibold">{user.followers?.length}</span> followers
            </div>
            <div>
              <span className="font-semibold">{user.following?.length}</span> following
            </div>
          </div>

          {/* Bio */}
          <div className="mt-4">
            <p>{user.bio || "No bio available."}</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t mt-6"></div>

      {/* Placeholder for posts or other content */}
      <div className="flex flex-row justify-between overflow-y-scroll scrollbar-hide h-4/5">
      <div className="w-3/5 max-w-3/4">
       <PostSection username={user.username}/>
       </div>
       <div className="w-2/5 max-w-2/5 overflow-y-scroll h-4/5 scrollbar-hide">
       <ProfileFollowing followings={user.following} />
       </div>
      </div>
    </div>
  );
}
