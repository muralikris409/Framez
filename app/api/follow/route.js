import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";
import {sendNotificationToUsers} from '../../actions/sendNotification.ts'
const prisma=new PrismaClient();
export async function POST(req) {
  try {
    console.log("in follow");

    const url = new URL(req.url);
    const followingUsername = url.searchParams.get("followingUsername");
    const token = (await req.headers.get("authorization"))?.split(" ")[1].trim();
    
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId=payload.id;
    const username=payload.username;
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const followingUser = await prisma.user.findUnique({
      where: { username: followingUsername },
    });

    if (!followingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (userId === followingUser.id) {
      return NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 });
    }

    const existingFollow = await prisma.follower.findFirst({
      where: { followerId: userId, followingId: followingUser.id }
    });

    if (existingFollow) {
      return NextResponse.json({ error: "Already following" }, { status: 201 });
    }

    await prisma.follower.create({
      data: { followerId: userId, followingId: followingUser.id }
    });
    console.log("in follow");
    await sendNotificationToUsers({usernames:[followingUsername],title:"Framez",message:`${username} followed you`});
    return NextResponse.json({ message: "Followed successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const followingUsername = url.searchParams.get("followingUsername");
    const token = (await req.headers.get("authorization"))?.split(" ")[1].trim();
    
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId=payload.id;
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const followingUser = await prisma.user.findUnique({
      where: { username: followingUsername },
    });

    if (!followingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const followRecord = await prisma.follower.findFirst({
      where: { followerId: userId, followingId: followingUser.id }
    });

    if (!followRecord) {
      return NextResponse.json({ error: "Not following" }, { status: 400 });
    }

    await prisma.follower.delete({
      where: { id: followRecord.id }
    });

    return NextResponse.json({ message: "Unfollowed successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
