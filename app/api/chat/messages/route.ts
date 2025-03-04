import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
    try {
      const { senderId, conversationId, text } = await req.json();
  
      const message = await prisma.message.create({
        data: {
          senderId,
          conversationId,
          text,
        },
        include: { sender: true },
      });
  
      return NextResponse.json(message);
    } catch (error) {
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
  }
  export async function GET(req: NextRequest) {
    try {
      const conversationId = req.nextUrl.searchParams.get("conversationId");
  
      if (!conversationId) {
        return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 });
      }
  
      const messages = await prisma.message.findMany({
        where: { conversationId },
        include: { sender: true },
        orderBy: { createdAt: "asc" },
      });
  
      return NextResponse.json(messages);
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
  }
    