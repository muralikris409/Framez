"use client";

import { useState, useEffect } from "react";
import { Home, Search, Users, Star, MessageCircle, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { getFollowing } from "@/app/actions/userActions";

const menuItems = [
  { name: "Home", icon: Home },
  { name: "Explore", icon: Search },
  { name: "Groups", icon: Users },
  { name: "My favorites", icon: Star },
  { name: "Messages", icon: MessageCircle },
  { name: "Settings", icon: Settings },
];

function Menu() {
  const pathname = usePathname();

  return (
    <div className="space-y-4">
      {menuItems.map((item, index) => (
        <div 
          key={index} 
          className={`flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer 
            ${pathname.includes(item.name.toLowerCase()) ? "bg-gray-200" : ""}`}>
          <item.icon className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700 font-medium text-sm">{item.name}</span>
        </div>
      ))}
    </div>
  );
}

function Contacts() {
  const [followings, setFollowings] = useState<{ id: string; username: string; image: string | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFollowings() {
      try {
        const data = await getFollowing();
        setFollowings(data);
      } catch (err) {
        setError("Failed to load contacts.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchFollowings();
  }, []);

  return (
    <div className="mt-6">
      <h3 className="text-gray-500 text-sm font-semibold mb-2">My Following</h3>

      <div className="overflow-y-scroll max-h-[20rem] scrollbar-hide">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading contacts...</p>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : followings.length === 0 ? (
          <p className="text-gray-500 text-sm">No followings found.</p>
        ) : (
          followings.map((contact) => (
            <div key={contact.id} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
              <img 
                src={contact.image || "/user.gif"} 
                alt={contact.username} 
                className="w-8 h-8 rounded-full" 
              />
              <div>
                <p className="text-gray-700 font-medium text-sm">{contact.username}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function Sidebar() {
  return (
    <div className="w-64 p-4 bg-white border-r h-screen hidden md:block">
      <Menu />
      <Contacts />
    </div>
  );
}
