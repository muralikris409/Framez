// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRjI_gc_blkL57Arv0yn3q8btexal5KLI",
  authDomain: "framez-38a41.firebaseapp.com",
  projectId: "framez-38a41",
  storageBucket: "framez-38a41.firebasestorage.app",
  messagingSenderId: "3193071616",
  appId: "1:3193071616:web:ffa115b31c289b192c50e5",
  measurementId: "G-0P39GG1QTM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);