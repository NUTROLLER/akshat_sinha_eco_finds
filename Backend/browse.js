import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {getAuth, onAuthStateChanged,createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCLkHnlw9-cX6ec-6sEN7akSJe9ysBGoP0",
    authDomain: "first-proj-firebase9.firebaseapp.com",
    projectId: "first-proj-firebase9",
    storageBucket: "first-proj-firebase9.firebasestorage.app",
    messagingSenderId: "849709724050",
    appId: "1:849709724050:web:5a7b5849ff7d7c8924914b"
};
initializeApp(firebaseConfig);
const db = getFirestore();

async function displayListings() {
  const listingsContainer = document.querySelector(".products");
  listingsContainer.innerHTML = ''; // clear previous

  const querySnapshot = await getDocs(collection(db, "listings"));
  querySnapshot.forEach((doc) => {
    const listing = doc.data();
    const id = doc.id;

    const listingElement = document.createElement("div");
    listingElement.className = "listing-card";

    listingElement.innerHTML = `
      <h3>${listing.title}</h3>
      <p>${listing.description}</p>
      <p>Price: $${listing.price.toFixed(2)}</p>
      <button data-id="${id}" class="add-to-cart-btn">Add to Cart</button>
    `;

    listingsContainer.appendChild(listingElement);
  });

  // Add event listeners for all Add to Cart buttons
  document.querySelectorAll(".add-to-cart-btn").forEach(button => {
    button.addEventListener("click", () => {
      const listingId = button.dataset.id;
      addToCart(listingId);
    });
  });
}

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
            const email = user.email;
        document.querySelector(".profile p").textContent = `Welcome, ${username}!`;
        document.querySelector(".name").textContent = `${username}`;
        document.querySelector(".email").textContent = `${email}`
        await loadUserProfile(user)
    }   else {
            document.querySelector(".profile p").textContent = "Welcome, User!";
            }}
    // else{
    //     window.location.href = "login.html";
    // }
}
);
displayListings();


//Add to cart functionality
function addToCart(listingId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || {};

  // Add or increment item
  if (cart[listingId]) {
    cart[listingId]++;
  } else {
    cart[listingId] = 1;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Item added to cart!");
}
