// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "talkbridge-nnbj9",
  "appId": "1:268251072968:web:0344be70e25c59e9a958fd",
  "apiKey": "AIzaSyB_U-NmcAMFd4Ywa9M1ZjPdqpUiy10R3Is",
  "authDomain": "talkbridge-nnbj9.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "268251072968"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
