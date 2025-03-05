"use client"
import React, { useEffect, useState } from 'react';
import PostComponent from './Post'; 
import { fetchFollowPosts } from '../actions/userActions';

 export  function PostSection({username}:any) {
  const [posts, setPosts] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchPosts = async () => {
    try {
      const response = await fetchFollowPosts(username);
      console.log(response);
      setPosts(response||{});
    } catch (error) {
      console.log('Error fetching posts:', error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchPosts(); 
  }, []);

  return (
    <div className='grid grid-cols-1 gap-4 items-center p-2 overflow-y-scroll scrollbar-hide max-h-full'>
      {loading ? (
        <div className='text-blue-500'>Loading...</div>
      ) : (
        <>
        {posts.map((post) => <PostComponent  key={post.id} post={post} fetchData={fetchPosts}/>)}
        </>
      )}
    </div>
  );
}