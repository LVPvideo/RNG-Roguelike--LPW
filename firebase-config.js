import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDJhxJ8pGXyvruA9Q7umKC6K8DGMytTnWQ",
  authDomain: "rnguelike.firebaseapp.com",
  databaseURL: "https://rnguelike-default-rtdb.firebaseio.com",
  projectId: "rnguelike",
  storageBucket: "rnguelike.firebasestorage.app",
  messagingSenderId: "969084628074",
  appId: "1:969084628074:web:471eea918fadcad4f86e13"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);