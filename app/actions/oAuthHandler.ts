"use server"
import { PrismaClient } from "@prisma/client";
import { User } from "../ts/UserInterfaces";
import { storeToken } from "./cookieHandler";
import { createUser } from "./userActions";
import jwt from 'jsonwebtoken';
import { auth } from "@/auth";
import { NextResponse } from "next/server";


export async function handleOAuth() {
  const session = (await auth())?.user || {};

  console.log("testhandle");
  
  const prisma = new PrismaClient();
  console.log(session);

  try {
    console.log("testhandle");

    const password = generatePassword();
    session.password = password;
    console.log("testhandle", session);

    const user = await prisma.user.findFirst({ where: { email: session.email } });
    console.log("testhandle",user);

    if (user) {
      if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing.");
          
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET
      );

      try {
        storeToken("token", token);
        return NextResponse.redirect(new URL("/home","http://localhost:3000"));
      } catch (err) {
        console.error("Error storing token:", err);
      }
      console.log("Logged in...");
    } else {
      await createUser(session);
      console.log("Initial login...");

      const newUser = await prisma.user.findFirst({ where: { email: session.email } });

      if (!newUser) throw new Error("User creation failed. newUser is null.");
      if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing.");

      const token = jwt.sign(
        { id: newUser.id, username: newUser.username},
        process.env.JWT_SECRET
      );

      try {
        storeToken("token", token);
        return NextResponse.redirect("/home");

      } catch (err) {
        console.error("Error storing token:", err);
      }
    }
  } catch (err) {
    console.error("OAuth Handling Error:", err.stack);
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

