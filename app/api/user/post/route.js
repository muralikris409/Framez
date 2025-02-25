import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";
const prisma=new PrismaClient();
export async function GET(req) {
    try {
      const token = (await req.headers.get("authorization"))?.split(" ")[1].trim();
      console.log("token:",token);

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      
      const userId = payload.id;
      
    
  console.log("test",userId);
  
  
  const posts = await prisma.post.findMany({
    where: { authorId: userId }, 
    include: {
      author: { select: { username: true, image: true } },
      likes: true,
      comments: true,
    },
    orderBy: { createdAt: "desc" },
  });
  
      console.log("test2");

      return NextResponse.json(posts, { status: 200 });
    } catch (error) {
      console.log("catching",error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }


export async function DELETE(req) {
  try {
    const token = (await req.headers.get("authorization"))?.split(" ")[1].trim();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = payload.id;
    const { postId } = await req.json();

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.authorId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
  } catch (error) {
    console.log("Error deleting post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
