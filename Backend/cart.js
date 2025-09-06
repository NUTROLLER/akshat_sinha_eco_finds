import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {getAuth, onAuthStateChanged,createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, setDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCLkHnlw9-cX6ec-6sEN7akSJe9ysBGoP0",
    authDomain: "first-proj-firebase9.firebaseapp.com",
    projectId: "first-proj-firebase9",
    storageBucket: "first-proj-firebase9.firebasestorage.app",
    messagingSenderId: "849709724050",
    appId: "1:849709724050:web:5a7b5849ff7d7c8924914b"
};
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
            const email = user.email;
        document.querySelector(".profile p").textContent = `Welcome, ${username}!`;
        document.querySelector(".name").textContent = `${username}`;
        document.querySelector(".email").textContent = `${email}`
        await loadUserProfile(user)
    }   else {
            document.querySelector(".profile p").textContent = "Welcome, User!";
            }}
    else{
        window.location.href = "login.html";
    }
}
);

async function loadCartItems() {
  const cartContainer = document.querySelector(".cart-items");
  const totalElement = document.getElementById("total");
  const cart = JSON.parse(localStorage.getItem("cart")) || {};

  let total = 0;
  cartContainer.innerHTML = "";

  for (const listingId in cart) {
    const quantity = cart[listingId];
    const docRef = doc(db, "listings", listingId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const itemTotal = data.price * quantity;
      total += itemTotal;

      const itemDiv = document.createElement("div");
      itemDiv.className = "cart-item";
      itemDiv.innerHTML = `
        <h3>${data.title}</h3>
        <p>Quantity: ${quantity}</p>
        <p>Price per unit: Rs.${data.price.toFixed(2)}</p>
        <p>Subtotal: Rs.${itemTotal.toFixed(2)}</p>
        <hr>
      `;
      cartContainer.appendChild(itemDiv);
    }
  }

  totalElement.textContent = `Total: Rs.${total.toFixed(2)}`;
}

async function purchase() {
  const cart = JSON.parse(localStorage.getItem("cart"));
  if (!cart || Object.keys(cart).length === 0) {
    alert("Your cart is empty.");
    return;
  }

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("You must be logged in to make a purchase.");
      return;
    }

    const items = [];
    let total = 0;

    for (const listingId in cart) {
      const quantity = cart[listingId];
      const docRef = doc(db, "listings", listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        items.push({
          id: listingId,
          title: data.title,
          price: data.price,
          quantity,
        });
        total += data.price * quantity;
      }
    }

    // Save the order
    await addDoc(collection(db, "orders"), {
      userId: user.uid,
      items,
      total,
      createdAt: new Date(),
    });

    localStorage.removeItem("cart");
    alert("Purchase successful! Thank you for shopping.");
    window.location.href = "dashboard.html";
  });
}

document.getElementById("purchaseBtn").addEventListener("click", purchase);

loadCartItems();