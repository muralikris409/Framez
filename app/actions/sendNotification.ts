'use server';

import admin from 'firebase-admin';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from './userActions';
import { SendNotificationProps } from '../ts/props';
const prisma = new PrismaClient();

if (!admin.apps.length) {
  const serviceAccount = require('@/service_key.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}


export async function sendNotificationToUsers({
  usernames,
  title,
  message,
  link="https://framez-git-development-muralis-projects-156594ad.vercel.app/home",
  logo="https://img.icons8.com/?size=80&id=eSXhmlFhLvqI&format=png",
}: SendNotificationProps) {
  try {
    await verifyToken();

    if (!usernames || usernames.length === 0) {
      return { success: false, error: 'Usernames array is required.' };
    }

    const users = await prisma.user.findMany({
      where: { username: { in: usernames } },
      select: { id: true, username: true },
    });

    if (users.length === 0) {
      return { success: false, error: 'No users found for the given usernames.' };
    }

    const skippedUsers: string[] = [];
    const tokensToSend: string[] = [];

    for (const user of users) {
      const userTokens = await prisma.fCMToken.findMany({
        where: { userId: user.id },
        select: { token: true },
      });

      if (userTokens.length === 0) {
        skippedUsers.push(user.username);
        continue;
      }

      tokensToSend.push(...userTokens.map((t) => t.token));
    }

    if (tokensToSend.length === 0) {
      return { success: false, error: 'No valid FCM tokens found for any users.' };
    }

    const payload = {
      notification: {
        title,
        body: message,
      },
      webpush: {
        notification: {
          icon: logo,
          badge: logo,
          click_action: link,
        },
        fcmOptions: {
          link,
        },
      },
    };

    const sendResults = await Promise.allSettled(
      tokensToSend.map((token) =>
        admin.messaging().send({
          ...payload,
          token,
        })
      )
    );

    const failedTokens = sendResults
      .map((result, index) => (result.status === 'rejected' ? tokensToSend[index] : null))
      .filter(Boolean);

    return {
      success: true,
      message: `Notifications sent to ${tokensToSend.length} devices.`,
      failedTokens,
      skippedUsers,
    };
  } catch (error) {
    console.error('Error sending notifications:', error);
    return { success: false, error: 'Failed to send notifications.' };
  }
}
