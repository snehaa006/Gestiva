import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBiJ5euN72Y64Fr_-nR4zewBb9y_oS7IBg",
  authDomain: "gestiva-a2aba.firebaseapp.com",
  projectId: "gestiva-a2aba",
  storageBucket: "gestiva-a2aba.appspot.com", 
  messagingSenderId: "917482537229",
  appId: "1:917482537229:web:9fe33502ec68a885747044",
  measurementId: "G-YN6XMQDE73"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
