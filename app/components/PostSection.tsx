"use client"
import React, { useEffect, useState } from 'react';
import { revalidatePath } from 'next/cache';
import PostComponent from './Post'; // Ensure the correct import path
import { Post } from '../ts/PostInterface';
import { axiosInstance } from '../axiosInstance/axios';
import CreatePost from './CreatePost';

export default function PostSection() {
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get('/api/post');
      setPosts(response.data);
      revalidatePath('/post'); 
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
    <div className='grid grid-cols-1 gap-4 items-center p-2 overflow-y-scroll scrollbar-hide max-h-screen'>
      {loading ? (
        <div className='text-blue-500'>Loading...</div>
      ) : (
        <>
        <CreatePost/>
        {posts.map((post) => <PostComponent key={post.id} post={post} fetchData={fetchPosts}/>)}
        </>
      )}
    </div>
  );
}