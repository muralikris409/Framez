"use client"
import { redirect } from "next/navigation";
import { requestFCMToken } from "./lib/firebase";
import { useEffect } from "react";
import { registerFcmToken } from "./actions/registerUserFCMToken";

export default  function Page() {
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((err) => {
      console.error('Service Worker registration failed:', err);
    });
}
useEffect(() => {
  requestFCMToken().then((token) => {
    if (token) {
      registerFcmToken(token);
    }
  });
}, []);
  // redirect("/home");
  return (
   <></>
  );
}
