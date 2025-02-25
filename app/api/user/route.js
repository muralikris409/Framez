import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";

export async function GET(req) {
    try {
      const prisma=new PrismaClient();
      const token = (await req.headers.get("authorization"))?.split(" ")[1].trim();
      console.log("User GET:", token)
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      console.log("userpayload",payload);
      if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const userId = payload.id;
      const user=await prisma.user.findFirst({
        where:{
            id:userId,
        },
        select:{
            username:true,
            email:true,
            image:true,
            bio:true
        }
      })
      console.log(user);
      
     
  
      return NextResponse.json(user, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }