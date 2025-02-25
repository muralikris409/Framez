import { NextResponse } from 'next/server';
import React from 'react'
import jwt from 'jsonwebtoken';

export  async function handler(req) {
  if(req.method=="GET"){
    const token=(await req.headers.get("authorization"))?.split(" ")[1].trim();
    console.log(jwt.verify(token,process.env.JWT_SECRET));
     return new NextResponse(JSON.stringify({ message: `Test ok this is your UID` }), {
            status: 200,
          });
  }
}
export {handler as GET}