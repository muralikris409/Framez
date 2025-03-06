"use server"
import { verifyToken } from './userActions';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function registerFcmToken(token: string) {
  try {
    const { id: userId } = await verifyToken();
    console.log('User ID:', userId);

    if (!userId) {
      return { success: false, error: 'Invalid or missing user token.' };
    }

    const existingToken = await prisma.fCMToken.findUnique({
      where: { token },
    });

    if (existingToken) {
      if (existingToken.userId !== userId) {
        await prisma.fCMToken.update({
          where: { token },
          data: { userId },
        });
        return { success: true, message: 'FCM token reassigned to current user.' };
      } else {
        return { success: true, message: 'FCM token already registered for this user.' };
      }
    }

    await prisma.fCMToken.create({
      data: { userId, token },
    });

    return { success: true, message: 'FCM token registered successfully.' };
  } catch (error) {
    console.error('Error registering FCM token:', error);
    return { success: false, error: 'Failed to register FCM token.' };
  }
}
