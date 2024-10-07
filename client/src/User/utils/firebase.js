// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from "firebase/auth"; // Import the Auth SDK and signInWithPhoneNumber

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDE_kVZ6Jn83KXCoqLiZMkh2ii2jqLshE0",
  authDomain: "ecommmerce-cdd38.firebaseapp.com",
  projectId: "ecommmerce-cdd38",
  storageBucket: "ecommmerce-cdd38.appspot.com",
  messagingSenderId: "1066670081669",
  appId: "1:1066670081669:web:4b11b9c68188c194340bec",
  measurementId: "G-6SK1178H53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
