"use client";

import { useState, useEffect } from "react";
import { MessageCircle, ChevronLeft, SendIcon } from "lucide-react";
import { getFollowing } from "@/app/actions/userActions";

function ChatSection({ onChatSelect }: { onChatSelect: (chat: any) => void }) {
  const [followings, setFollowings] = useState<{ id: string; username: string; image: string | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFollowings() {
      try {
        const data = await getFollowing();
        setFollowings(data);
      } catch (err) {
        setError("Failed to load messages.");
      } finally {
        setLoading(false);
      }
    }

    fetchFollowings();
  }, []);

  return (
    <div className="mt-6">
      <h3 className="text-gray-500 text-sm font-semibold mb-2">Messages</h3>

      <div className="overflow-y-scroll max-h-[30rem] scrollbar-hide">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading messages...</p>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : followings.length === 0 ? (
          <p className="text-gray-500 text-sm">No messages found.</p>
        ) : (
          followings.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer"
              onClick={() => onChatSelect(chat)}
            >
              <div className="flex w-3/4">
                <img src={chat.image || "/profile.png"} alt={chat.username} className="w-8 h-8 rounded-full" />
                <div className="w-full mx-2">
                  <p className="text-gray-700 font-medium text-sm truncate">{chat.username}</p>
                  <p className="text-gray-500 text-xs truncate">Tap to chat</p>
                </div>
              </div>
              <MessageCircle className="text-gray-600" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ChatView({ chat, onClose }: { chat: any; onClose: () => void }) {
  return (
    <div className="h-[35rem] w-64 bg-gray-100 flex flex-col p-4 rounded-md">
      <div className="flex items-center space-x-3 mb-4">
        <ChevronLeft className="cursor-pointer" onClick={onClose} />
        <img src={chat.image || "/profile.png"} alt={chat.username} className="w-8 h-8 rounded-full" />
        <p className="text-gray-700 font-medium truncate">{chat.username}</p>
      </div>
      <div className="flex-1  rounded-md p-4 overflow-y-auto">
        <p className="text-gray-500 text-sm text-center">Start a conversation</p>
      </div>
      <div className="flex flex-row  rounded-md justify-between overflow-y-auto">
      <input
        type="text"
        placeholder="Type a message..."
        className="w-full px-3 h-10 border rounded-full focus:outline-none"
      />
     <button className="bg-pink-500 text-white px-2  py-1 rounded-full w-10">
              <SendIcon />
          </button>
        </div>
    </div>
  );
}

export default function MessageBar() {
  const [selectedChat, setSelectedChat] = useState<any>(null);

  return (
    <div className={selectedChat?"w-80 p-4 bg-white border-l h-screen hidden md:block":"w-64 p-4 bg-white border-l h-screen hidden md:block"}>
      {selectedChat ? (
        <ChatView chat={selectedChat} onClose={() => setSelectedChat(null)} />
      ) : (
        <ChatSection onChatSelect={setSelectedChat} />
      )}
    </div>
  );
}
