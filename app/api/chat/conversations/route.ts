import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
  try {
    const { userId, receiverId } = await req.json();
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { user: { connect: { id: userId } } },
            { user: { connect: { id: receiverId } } },
          ],
        },
      },
      include: { participants: true },
    });

    return NextResponse.json(conversation);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
  }
}
export async function GET(req: NextRequest) {
    try {
      const userId = req.nextUrl.searchParams.get("userId");
      if (!userId) return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  
      const conversations = await prisma.conversation.findMany({
        where: {
          participants: { some: { userId } },
        },
        include: { participants: true },
      });
  
      return NextResponse.json(conversations);
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
    }
  }
  