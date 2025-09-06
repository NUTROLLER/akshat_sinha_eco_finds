import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"
const firebaseConfig = {
  apiKey: "AIzaSyCLkHnlw9-cX6ec-6sEN7akSJe9ysBGoP0",
  authDomain: "first-proj-firebase9.firebaseapp.com",
  projectId: "first-proj-firebase9",
  storageBucket: "first-proj-firebase9.firebasestorage.app",
  messagingSenderId: "849709724050",
  appId: "1:849709724050:web:5a7b5849ff7d7c8924914b"
};
console.log("JS loaded")
// Initialize Firebase
const app = initializeApp(firebaseConfig);
//Initialize authentication
const auth = getAuth()

const loginForm = document.querySelector(".login")
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const email = loginForm.email.value
  const password = loginForm.password.value
  signInWithEmailAndPassword(auth, email, password)
  .then((cred)=>{
    // console.log("user logged in successfully")
    alert("Logged in successfully!")
    window.location.href = "dashboard.html"
  })
  .catch((err)=>{
    let errMessage = "Unexpected error occurred";
    switch (err.code) {
      case 'auth/invalid-credential':
        errMessage = "Invalid Credentials. Please try again.";
        break;
      case 'auth/invalid-email':
        errMessage = "The email address you entered is not valid.";
        break;
      case 'auth/user-disabled':
        errMessage = "Your account has been disabled. Please contact support.";
        break;
      case 'auth/user-not-found':
        errMessage = "No user found with that email address.";
        break;
      case 'auth/wrong-password':
        errMessage = "The password you entered is incorrect.";
        break;
      case 'auth/email-already-in-use':
        errMessage = "This email address is already in use.";
        break;
      case 'auth/weak-password':
        errMessage = "The password should be at least 6 characters long."
        break;
      default:
        // For any other error code not explicitly handled
        errMessage = "An unexpected error occurred. Please try again.";
      console.log(err.message, err.value)
    }
    alert(errMessage)
  })
})