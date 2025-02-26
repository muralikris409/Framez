import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";
import { getToken } from "@/app/actions/cookieHandler";
const prisma=new PrismaClient();
export async function GET(req) {
    try {
      console.log("afsal",await getToken("token"))
      const token = (await req.headers.get("authorization"))?.split(" ")[1].trim();
      console.log("token:",token);

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      
      const userId = payload.id;
      
      const followingUsers = await prisma.follower.findMany({
        where: { followerId: userId },
        select: { followingId: true }
      });
  
      const followingIds = followingUsers.map(follow => follow.followingId);
  
      const posts = await prisma.post.findMany({
        where: { authorId: { in: followingIds } },
        include: {
          author: { select: { username: true, image: true } },
          likes: {
            include: {
              user: { select: { username: true, image: true } }, // Fetch user info for likes
            },
          },
          comments: {
            include: {
              author: { select: { username: true, image: true } }, // Fetch author info for comments
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      
      const formattedPosts = posts.map(post => ({
        author: {
          name: post.author.username,
          image: post.author.image,
        },
        createdAt: post.createdAt,
        caption: post.caption,
        imageUrl: post.imageUrl,
        likes: post.likes.map(like => ({
          name: like.user.username,
          image: like.user.image,
          createdAt: like.createdAt,
        })),
        comments: post.comments.map(comment => ({
          name: comment.author.username,
          image: comment.author.image,
          createdAt: comment.createdAt,
          text: comment.text,
        })),
      }));
      
      console.log(formattedPosts);
      
  
      return NextResponse.json(posts, { status: 200 });
    } catch (error) {
      console.log("catching",error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  export async function POST(req) {
    try {
      const token = (await req.headers.get("authorization"))?.split(" ")[1].trim();
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      
      const { caption, imageUrl } = await req.json();
      const userId = payload.id;
  
      const newPost = await prisma.post.create({
        data: {
          caption,
          imageUrl,
          authorId: userId
        }
      });
  
      return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  