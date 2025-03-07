"use client";
import { useEffect } from "react";
import { requestFCMToken } from "./lib/firebase";
import { registerFcmToken } from "./actions/registerUserFCMToken";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const setupFCM = async () => {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log('Service Worker registered with scope:', registration.scope);
        } catch (err) {
          console.error('Service Worker registration failed:', err);
        }
      }

      const token = await requestFCMToken();
      if (token) {
        await registerFcmToken(token);
      }

      router.replace("/home");
    };

    setupFCM();
  }, []);

  return <></>;
}
