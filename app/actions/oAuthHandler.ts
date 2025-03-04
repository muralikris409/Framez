"use server"
import { PrismaClient } from "@prisma/client";
import { storeToken } from "./cookieHandler";
import { createUser } from "./userActions";
import jwt from 'jsonwebtoken';
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { getSession } from "next-auth/react";

export async function handleOAuth(session:any) {
  
  
  
  const prisma = new PrismaClient();
  console.log("from auth",session);

  try {

    const password = generatePassword();
  

    const user = await prisma.user.findUnique({ where: { email: session.email} });
    console.log("from user db",user);

    if (user) {
      if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing.");
          
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET
      );

      try {
        // console.log("above tokenstore:",token);
        
        await storeToken("token", token);
        console.log("below tokenstore in login:",token);
        return token;
        // return NextResponse.redirect(new URL("/home","http://localhost:3000"));
      } catch (err) {
        console.error("Error storing token:", err);
      }
      console.log("Logged in...");
    } else {
      await createUser({...session,password});
      console.log("Initial login...");

      const newUser = await prisma.user.findUnique({ where: { email: session.email ||undefined} });
       console.log("from db after create user",newUser);
       
      if (!newUser) throw new Error("User creation failed. newUser is null.");
      if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing.");

      const token = jwt.sign(
        { id: newUser.id, username: newUser.username},
        process.env.JWT_SECRET
      );

      try {
        await storeToken("token", token);
        return token;

        // return NextResponse.redirect("/home");

      } catch (err) {
        console.error("Error storing token:", err);
      }
    }
  } catch (err) {
    console.error("OAuth Handling Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}


function generatePassword(length = 8) {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?/';
    
    const allChars = uppercase + lowercase + numbers + specialChars;
    
    let password = '';
    
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];
    
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    return password;

}

