"use server";

import jwt from "jsonwebtoken";
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { getToken } from "./cookieHandler";
import { User } from "../ts/UserInterfaces";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET as string; // Store in .env

export async function verifyToken() {
  const token = await getToken("token");
  if (!token) throw new Error("Unauthorized");

  try {
    return jwt.verify(token, SECRET_KEY) as { id: string };
  } catch {
    throw new Error("Invalid token");
  }
}

export async function createUser(user: any) {
  try {
    if (!user || !user.password || !user.email || !(user.username || user.name)) {
      throw new Error("Invalid user payload. Required fields: email, password, username.");
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    return await prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        username: user.username || user.name,
        image: user.image || null,
      },
    });

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new Error('A user with this email or username already exists.');
    }
    throw new Error('An unexpected error occurred while creating the user.');
  }
}

 async function fetchUserRelations(type: "followers" | "following") {
  const { id:userId } = await verifyToken();
console.log("useridtest",userId);

  return await prisma.follower.findMany({
    where: type === "followers" ? { followingId: userId } : { followerId: userId },
    include: {
      [type === "followers" ? "follower" : "following"]: {
        select: { id: true, username: true, image: true },
      },
    },
  }).then(data => data.map(f => f[type === "followers" ? "follower" : "following"]));
}

export const getFollowers = async () => fetchUserRelations("followers");

export const getFollowing = async () => fetchUserRelations("following");
export async function getRecommendations() {
  const { id: userId } = await verifyToken();

  const followingIds = (
    await prisma.follower.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    })
  ).map(f => f.followingId);

  const recommendationsRaw = await prisma.follower.findMany({
    where: {
      followerId: { in: followingIds },
      followingId: { not: userId, notIn: followingIds },
    },
    include: {
      following: {
        select: { id: true, username: true, image: true },
      },
    },
  });

  const recommendations = Array.from(
    new Map(
      recommendationsRaw.map(m => [m.following.id, m.following])
    ).values()
  );

  if (recommendations.length === 0) {
    return await prisma.user.findMany({
      where: {
        id: { not: userId, notIn: followingIds },
      },
      select: { id: true, username: true, image: true },
      take: 2,
      orderBy: { id: "asc" },
    });
  }

  return recommendations.slice(0, 5); 
}


export async function fetchUserData(username:string) {
  const userData=await prisma.user.findUnique(
    {
      where:{
        username:username
      },
      include:{
        followers:true,
        following:{
          select:{
            follower:{
              select:{
                username:true,
                image:true
              }
            }
          }
        },
        posts:true,
      }
    }
  );
  return userData;
     
}


export async function fetchFollowPosts(username:string) {
  const posts=await prisma.post.findMany(
    {
     where:{
        author:{
          username:username
        }
     },
     include:{
      author:true,
      likes:true,
      comments:true
     }
    }
  );
  return posts;
     
}