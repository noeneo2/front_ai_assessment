import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAkUgybj5u87z8anqjBv8vyxuZ-NC1nVrs",
  authDomain: "pruebas-genai.firebaseapp.com",
  databaseURL: "https://pruebas-genai-default-rtdb.firebaseio.com",
  projectId: "pruebas-genai",
  storageBucket: "pruebas-genai.firebasestorage.app",
  messagingSenderId: "125734547785",
  appId: "1:125734547785:web:fd68b282d81321eb136a98"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
