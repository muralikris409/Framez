"use client";
import { Heart, MessageCircle, Send } from "lucide-react";
import { Post } from "../ts/PostInterface";
import Image from "next/image";
import CaptionSection from "./Caption";
import { useState } from "react";
import { axiosInstance } from "../axiosInstance/axios"; // Import the Axios instance
import { useAppSelector } from "../lib/hooks";
import { FaHeart } from "react-icons/fa";

interface PostComponentProps {
  post: Post;
  fetchData: () => void;
}

const PostComponent: React.FC<PostComponentProps> = ({ post, fetchData }) => {
  const [commentText, setCommentText] = useState<string>("");
  const [loadingLike, setLoadingLike] = useState<boolean>(false);
  const [loadingComment, setLoadingComment] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);

  const currentUser = useAppSelector((state) => state.user.username);

  const liked = post.likes?.some((like) => like.user?.username === currentUser) || false;

  const handleLike = async () => {
    setLoadingLike(true);
    try {
      await axiosInstance.post("/api/like", { postId: post.id });
      fetchData();
    } catch (error: any) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingComment(true);
    try {
      await axiosInstance.post("/api/comment", {
        postId: post.id,
        text: commentText,
      });
      fetchData();
      setCommentText("");
    } catch (error: any) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoadingComment(false);
    }
  };

  const toggleComments = () => setShowComments((prev) => !prev);

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-4">
      {/* User Info */}
      <div className="flex items-center space-x-3">
        <Image
          src={post.author?.image ?? "/user.gif"}
          alt={post.author?.username ?? "User"}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <h3 className="font-semibold">{post.author?.username || "Unknown User"}</h3>
          <p className="text-sm text-gray-500">{post.createdAt}</p>
        </div>
      </div>

      {/* Post Image */}
      {post.imageUrl && (
        <div className="mt-3">
          <Image src={post.imageUrl} alt="Post" width={400} height={250} className="rounded-lg" />
        </div>
      )}

      <CaptionSection caption={post.caption} />

      {/* Actions */}
      <div className="mt-3 flex justify-between border-t pt-3 text-gray-600 text-sm">
        <button className="flex items-center space-x-1" onClick={handleLike} disabled={loadingLike}>
          <span>{post.likes?.length ?? 0}</span>
          {loadingLike ? (
            <div className="animate-pulse">
              <Heart className="text-red-600 fill-red-700" />
            </div>
          ) : liked ? (
            <Heart className="text-red-600 fill-red-600" />
          ) : (
            <Heart className="hover:text-red-900" />
          )}
        </button>
        <button className="flex items-center space-x-1 hover:text-pink-500" onClick={toggleComments}>
          <span>{post.comments?.length ?? 0}</span>
          <MessageCircle />
        </button>
      </div>

      {/* Comment Input */}
      {showComments && (
        <form className="mt-3 flex items-center space-x-2 border-t pt-3" onSubmit={handleCommentSubmit}>
          <Image
            src={post.author?.image ?? "/user.gif"}
            width={32}
            height={32}
            className="rounded-full"
            alt="User Comment"
          />
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-full focus:outline-none"
          />
          <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded-full" disabled={loadingComment}>
            {loadingComment ? (
              <div className="animate-pulse">
                <Send />
              </div>
            ) : (
              <Send />
            )}
          </button>
        </form>
      )}

      {/* Comments List */}
      {showComments && (
        <div className="mt-3">
          {post.comments?.map((comment) => (
            <div key={comment.id} className="flex items-center space-x-2">
              <Image
                src={comment.author?.image ?? "/user.gif"}
                width={32}
                height={32}
                className="rounded-full"
                alt="User Comment"
              />
              <p className="text-sm">{comment.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostComponent;
