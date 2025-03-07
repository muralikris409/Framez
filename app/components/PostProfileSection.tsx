"use client"
import React, { useEffect, useState } from 'react';
import PostComponent from './Post'; 
import { fetchFollowPosts } from '../actions/userActions';
import { Loader2 } from 'lucide-react';

 export  function PostSection({username}:any) {
  const [posts, setPosts] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchPosts = async () => {
    try {
      const response = await fetchFollowPosts(username);
      console.log("hello",response);
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
 <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md rounded-lg">
 <Loader2 className="h-12 w-12 animate-spin text-gray-800" />
</div>      ) : (
        <>
        {posts.length>0 ? (posts.map((post) => <PostComponent  key={post.id} post={post} fetchData={fetchPosts}/>)
        ):
       (
        <>
         <div className="flex items-center justify-center bg-white/30 rounded-lg">
 <span className="h-12   text-gray-800" >No posts</span>
</div>
        </>
       )
        }
        </>
      )}
    </div>
  );
}