import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import Cookies from 'js-cookie';  // Import js-cookie

export const prisma = new PrismaClient();

export async function handler(req) {
  if (req.method === 'POST') {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return new NextResponse(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      // { expiresIn: '1h' }
    );
    


   

    return new NextResponse(JSON.stringify({ message: 'Login successful',token }), {
      status: 200,
    });
  }

  return new NextResponse(JSON.stringify({ message: 'Method not allowed' }), {
    status: 405,
  });
}

export { handler as POST };
