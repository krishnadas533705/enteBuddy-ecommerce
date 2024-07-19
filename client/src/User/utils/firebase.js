// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from "firebase/auth"; // Import the Auth SDK and signInWithPhoneNumber

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPzAAVaLE0QcAZ8biyFF6ahxI8nu3lMuk",
  authDomain: "entebuddy-1f191.firebaseapp.com",
  projectId: "entebuddy-1f191",
  storageBucket: "entebuddy-1f191.appspot.com",
  messagingSenderId: "29717603090",
  appId: "1:29717603090:web:7c273c5584c31f00c749cb",
  measurementId: "G-2438W6Q2MX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
