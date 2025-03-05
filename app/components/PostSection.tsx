"use client"
import React, { useEffect, useState } from 'react';
import { revalidatePath } from 'next/cache';
import PostComponent from './Post'; // Ensure the correct import path
import { Post } from '../ts/PostInterface';
import { axiosInstance } from '../axiosInstance/axios';
import CreatePost from './CreatePost';
import { Loader2 } from 'lucide-react';

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
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md rounded-lg">
          <Loader2 className="h-12 w-12 animate-spin text-gray-800" />
        </div>
      ) : (
        <>
        <CreatePost/>
        {posts.map((post) => <PostComponent key={post.id} post={post} fetchData={fetchPosts}/>)}
        </>
      )}
    </div>
  );
}