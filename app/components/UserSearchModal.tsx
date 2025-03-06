'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { closeModal, setSearchText } from '../lib/searchSlice';
import { axiosInstance } from '../axiosInstance/axios';
import { LoaderCircle, X } from 'lucide-react';

const SearchUsersModal = () => {
  const dispatch = useAppDispatch();
  const { searchText, isOpen } = useAppSelector(state => state.search);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchText) return;

      setLoadingData(true);
      setError(null);
      try {
        const response = await axiosInstance.post(`/api/search`, {
          query: searchText
        });
        setUsers(response.data.users);
      } catch (err) {
        console.error("Error fetching users", err);
        setError("Failed to fetch users.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchUsers();
  }, [searchText]);

  const handleFollowToggle = async (followingUsername: string, isFollowing: boolean) => {
    setLoadingFollow(followingUsername);

    try {
      if (isFollowing) {
        await axiosInstance.delete(`/api/follow?followingUsername=${followingUsername}`);
      } else {
        await axiosInstance.post(`/api/follow?followingUsername=${followingUsername}`);
      }
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.username === followingUsername ? { ...user, following: !isFollowing } : user
        )
      );
    } catch (error) {
      console.error("Error toggling follow state", error);
    } finally {
      setLoadingFollow(null);
    }
  };

  const onClose = () => {
    dispatch(setSearchText('')); 
    dispatch(closeModal()); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold">Search Results</h2>
          <button className="text-gray-500" onClick={onClose}><X /></button>
        </div>
        <div className="mt-4 max-h-60 overflow-auto">
          {loadingData ? (
            <LoaderCircle className="animate-spin w-full" />
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : users.length > 0 ? (
            users.map(user => (
              <div key={user.id} className="flex items-center justify-between p-2 border rounded-md mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    {user.image ? (
                      <img src={user.image||"/profile.png"} alt={user.username} className="w-full h-full rounded-full" />
                    ) : (
                      <span className="text-gray-600">U</span>
                    )}
                  </div>
                  <span className="font-medium">{user.username}</span>
                </div>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${user.following ? 'bg-red-500 text-white' : 'bg-pink-500 text-white'}`}
                  onClick={() => handleFollowToggle(user.username, user.following)}
                >
                  {loadingFollow === user.username ? <LoaderCircle className="animate-spin w-full" /> : (user.following ? "Following" : "Follow")}
                </button>
              </div>
            ))
          ) : (
            <p className="text-center">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchUsersModal;