// config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_FIRE_BASE_API_KEY}`,
  authDomain: "vocalytics-711d6.firebaseapp.com",
  projectId: "vocalytics-711d6",
  storageBucket: "vocalytics-711d6.appspot.com",
  messagingSenderId: "476393770219",
  appId: "1:476393770219:web:81e98d6946e5d3281e02ae",
  measurementId: "G-0Y97LT359V",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
export const db = getFirestore(app);
export { app, auth, storage };
