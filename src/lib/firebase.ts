import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHn11FEpUWicuHq4m1S2AinbeBQOVL2Ts",
  authDomain: "test-project-update.firebaseapp.com",
  projectId: "test-project-update",
  storageBucket: "test-project-update.firebasestorage.app",
  messagingSenderId: "121992987103",
  appId: "1:121992987103:web:595e279068301a3b29c46a",
  measurementId: "G-NJC3PNJ32F"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
