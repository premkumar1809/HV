import { initializeApp } from "firebase/app";
import { getStorage} from 'firebase/storage';
import {getFirestore} from "firebase/firestore"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6wdlkdN3iR8oxDNirrsyhsjL-Mrvh524",
  authDomain: "hole-videos.firebaseapp.com",
  projectId: "hole-videos",
  storageBucket: "hole-videos.appspot.com",
  messagingSenderId: "48275183097",
  appId: "1:48275183097:web:aba2c4d81cd0ea592f5928",
  measurementId: "G-VWP13CZLRL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)
export const db = getFirestore(app)
