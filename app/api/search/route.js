import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";
const prisma=new PrismaClient();
export async function POST(req) {
  try {
    const { query } = await req.json();

    const token = (await req.headers.get("authorization"))?.split(" ")[1].trim();
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!query) {
      return NextResponse.json({ users: [] }, { status: 200 });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          
        ],
       NOT:{
        id:payload.id
       }
      },
      select: {
        id: true,
        username: true,
        image: true,
      },
   
    });
console.log("test",payload)
    const usersWithFollowingStatus = await Promise.all(
      users.map(async (user) => {

        const isFollowing = await prisma.follower.findFirst({
          where: {
            followerId: payload.id,
            followingId: user.id,
            
          },
        });
        console.log("test2",isFollowing)

        return {
          ...user,
          following: !!isFollowing, 
        };
      })
    );
   console.log(usersWithFollowingStatus);
   
    return NextResponse.json({ users: usersWithFollowingStatus }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
