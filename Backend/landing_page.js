import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {getAuth, onAuthStateChanged,createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"
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
const db = getFirestore()
//Initialize authentication
const auth = getAuth()
onAuthStateChanged(auth, async (user)=>{
    if (user){
        console.log("User signed in.")
         const usernamesRef = collection(db, "username"); //
        const q = query(usernamesRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const usernameDoc = querySnapshot.docs[0];
            const username = usernameDoc.id;
        document.querySelector(".profile p").textContent = `Welcome, ${username}!`;
    }   else {
            document.querySelector(".profile p").textContent = "Welcome, User!";
            }}
    else{
        window.location.href = "login.html";
    }
}
);

