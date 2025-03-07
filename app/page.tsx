"use client";
import { useEffect } from "react";
import { requestFCMToken } from "./lib/firebase";
import { registerFcmToken } from "./actions/registerUserFCMToken";
import { redirect } from "next/navigation";

export default function Page() {

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((err) => {
          console.error('Service Worker registration failed:', err);
        });
    }

    requestFCMToken().then((token) => {
      if (token) {
        registerFcmToken(token);
      }
    });
    
  }, []);
  redirect("/home");
  return <></>;
}
