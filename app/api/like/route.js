import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma=new PrismaClient();
export async function POST(req) {
  try {
    const token = (await req.headers.get("authorization"))?.split(" ")[1].trim();
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { postId } = await req.json();
    const userId = payload.id;
    const username= await prisma.post.findUnique({
      where:{
        id:postId
      },
      select:{
        author:{
          select:{
            username:true,
          }
        }
      }
    });
    const existingLike = await prisma.like.findFirst({
      where: { userId, postId }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      }
      else{
        await prisma.like.create({
          data: { userId, postId }
        });
            await sendNotificationToUsers({usernames:[username.author.username],title:"Framez",message:`${username} liked your post`});
        
      }

   

    return NextResponse.json({ message: existingLike?"Like removed":"Liked successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
