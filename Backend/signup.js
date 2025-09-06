import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, updateProfile} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"
import {getFirestore ,doc, setDoc, getDoc} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"

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
initializeApp(firebaseConfig);
//Initialize authentication
const auth = getAuth();
//Initialize Firestore db
const db = getFirestore();
//Sign up part
const signUpForm = document.querySelector(".signupForm")


signUpForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = signUpForm.email.value
  const password = signUpForm.password.value
  const enteredUsername = signUpForm.username.value.trim().toLowerCase();
  const confirmPassword = signUpForm.confirmPass.value;
  if(!enteredUsername){
    alert("Username cannot be empty!");
    return;
  }
  const usernameRef = doc(db, "username",enteredUsername)
  const usernameSnap = await getDoc(usernameRef);
  //Username not available!
  if (usernameSnap.exists()) {
    alert("Username is already taken. Please choose another one.");
    return;
  }
  if(password!=confirmPassword){
    alert("Passwords do not match. Please try again.");
    return;
  }
  //The below case is for when username is available
  createUserWithEmailAndPassword(auth, email, password)
  .then(async (cred) => {
    // console.log('user created:', cred)
    await setDoc(usernameRef, {
      email: email,
      uid: cred.user.uid
    });
    await updateProfile(cred.user, {
    displayName: enteredUsername,
  });
    console.log("Account created successfully!")
    alert("Account created successfully!")
    signUpForm.reset()
    window.location.href = "dashboard.html"
  })
  .catch((err)=>{
    let errMessage = "Unexpected error occurred";
    switch (err.code) {
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