// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBfZXBpTRqrbvu5TlXmzs-PnkBKOy15fzA',
  authDomain: 'framez-dd4ba.firebaseapp.com',
  projectId: 'framez-dd4ba',
  storageBucket: 'framez-dd4ba.firebasestorage.app',
  messagingSenderId: '210148100196',
  appId: '1:210148100196:web:0d16180448616bb8b9f771',
  measurementId: 'G-SBB92PDCJ1'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics safely (only on supported environments)
if (typeof window !== 'undefined') {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      const analytics = getAnalytics(app);
      console.log('Firebase Analytics initialized');
    } else {
      console.log('Firebase Analytics is not supported in this environment.');
    }
  });
}

// Initialize Firebase Cloud Messaging
const messaging = getMessaging(app);

// Request FCM Token
export const requestFCMToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
    });
    if (token) {
      console.log('FCM Token:', token);
      return token;
    } else {
      console.warn('No registration token available. Request permission to generate one.');
    }
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
  }
};

// Listen for incoming messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      resolve(payload);
    });
  });
