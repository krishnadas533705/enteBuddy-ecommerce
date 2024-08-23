// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from "firebase/auth"; // Import the Auth SDK and signInWithPhoneNumber

// Your web app's Firebase configuration
const firebaseConfig =  {
  apiKey: "AIzaSyBZKuMWiWVkpRVFGsTsUCF1QtRsvBDB9Uo",
  authDomain: "entebuddy-2c050.firebaseapp.com",
  projectId: "entebuddy-2c050",
  storageBucket: "entebuddy-2c050.appspot.com",
  messagingSenderId: "987719246996",
  appId: "1:987719246996:web:42dcba7eaab35b8d5e4081",
  measurementId: "G-BSW8487HZT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
