    import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCRjI_gc_blkL57Arv0yn3q8btexal5KLI",
  authDomain: "framez-38a41.firebaseapp.com",
  projectId: "framez-38a41",
  storageBucket: "framez-38a41.firebasestorage.app",
  messagingSenderId: "3193071616",
  appId: "1:3193071616:web:ffa115b31c289b192c50e5",
  measurementId: "G-0P39GG1QTM"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);