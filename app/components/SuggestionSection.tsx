"use client";

import React, { useEffect, useState } from "react";
import { getRecommendations } from "../actions/userActions";
import { axiosInstance } from "../axiosInstance/axios";
import { LoaderCircle } from "lucide-react";


const UserSuggestion = ({ user }: any) => {
  console.log(user);
  const [loading,setLoading]=useState(false);
  const [isFollowing, setIsFollowing] = useState(user.following || false);

  const handleFollowToggle = async () => {
    try {
      setLoading(true)
      if (isFollowing) {
        await axiosInstance.delete(`/api/follow?followingUsername=${user.username}`);
      } else {
        await axiosInstance.post(`/api/follow?followingUsername=${user.username}`);
      }

      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error toggling follow state", error);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white m-3">
      <h3 className="text-sm font-semibold">You might like</h3>
      <div className="flex items-center mt-2">
        <img
          src={user.image || "/profile.png"}
          alt={user.username}
          className="w-10 h-10 rounded-full"
        />
        <div className="ml-2">
          <p className="font-medium">{user.username}</p>
          <p className="text-xs text-gray-500">Mutual Connection</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleFollowToggle}
          className={`px-3 py-1 rounded ${
            isFollowing ? "bg-gray-300 text-gray-700" : "bg-pink-500 text-white"
          }`}
        >
{loading ? <LoaderCircle className="animate-spin w-full"/> : (isFollowing ? "Following" : "Follow")}
</button>
        
      </div>
    </div>
  );
};


const SuggestedGroups = ({ groups }:any) => {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white m-3">
      <h3 className="text-sm font-semibold">Suggested Groups</h3>
      {groups.map((group:any, index:number) => (
        <div key={index} className="mt-3 flex items-center">
          <img
            src={group.image||"/groups.gif"}
            alt={group.name}
            className="w-12 h-12 rounded"
          />
          <div className="ml-3">
            <p className="font-medium">{group.name}</p>
            <p className="text-xs text-gray-500">{group.members} Members</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const SuggestionSection = () => {
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const testGroups = [
    {
      name: "Designers UI UX",
      image: "/groups.gif",
      members: 1356,
    },
  ];
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
       
        const res = await getRecommendations();
console.log("Fetched recommendations:", res.length);
setSuggestedUsers(res);

      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  return (
    <div className="w-80">
      <h2 className="text-lg font-semibold p-3">Suggestions</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        suggestedUsers.map((user) => <UserSuggestion key={user.id} user={user} />)
      )}
      <SuggestedGroups groups={testGroups}/>
    </div>
  );
};

export default SuggestionSection;
