import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjF9p_70xLdrXVjbSV1DyF-xT1QBn8VSY",
  authDomain: "property-management-55622.firebaseapp.com",
  projectId: "property-management-55622",
  storageBucket: "property-management-55622.firebasestorage.app",
  messagingSenderId: "17332829100",
  appId: "1:17332829100:web:b4cef92a99ecf0c4ca1809"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
