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
const storage = getStorage();
console.log("JS loaded")
// Initialize Firebase
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

        async function loadPurchaseHistory(userId) {
  const purchasesContainer = document.createElement("div");
  purchasesContainer.className = "purchase-history";

  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    purchasesContainer.innerHTML = "<p>No purchases found.</p>";
  } else {
    querySnapshot.forEach((doc) => {
      const order = doc.data();
      const orderDiv = document.createElement("div");
      orderDiv.className = "order";

      let itemsHTML = "";
      order.items.forEach(item => {
        itemsHTML += `
          <div class="item">
            <strong>${item.title}</strong> x${item.quantity} — Rs.${item.price}
          </div>
        `;
      });

      const date = order.createdAt?.toDate?.().toLocaleString() || "Date unknown";

      orderDiv.innerHTML = `
        <h3>Order ID: ${doc.id}</h3>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Total:</strong> Rs.${order.total.toFixed(2)}</p>
        <div class="items">${itemsHTML}</div>
        <hr>
      `;

      purchasesContainer.appendChild(orderDiv);
    });
  }

  document.querySelector("main").appendChild(purchasesContainer);
}
await loadUserProfile(user);
await loadPurchaseHistory(user.uid);

    }   else {
            document.querySelector(".profile p").textContent = "Welcome, User!";
            }}
    else{
        window.location.href = "login.html";
    }
}
);

//Profile picture
const uploadBtn = document.getElementById('uploadBtn');
const profilePicInput = document.getElementById('profilePicInput');
const profilePicDisplay = document.getElementById('profilePicDisplay');
const user = auth.currentUser; // make sure user is logged in

uploadBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
  if (!profilePicInput.files.length) {
    alert("Please select an image first.");
    return;
  }
  const file = profilePicInput.files[0];
  const storageRef = ref(storage, `profile_pictures/${user.uid}`);

  try {
    // Upload file
    await uploadBytes(storageRef, file);

    // Get download URL
    const photoURL = await getDownloadURL(storageRef);

    // Save URL to Firestore user doc
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, { photoURL }, { merge: true });

    // Update profile picture display
    profilePicDisplay.src = photoURL;
    alert("Profile picture uploaded successfully!");
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    alert("Upload failed. Try again.");
  }
});
async function loadUserProfile() {
  const user = auth.currentUser;
  if (!user) return;

  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const data = userDoc.data();
    if (data.photoURL) {
      profilePicDisplay.src = data.photoURL;
    }
  }
}

//Hamburger
//Hamburger functionality


//Log out
document.addEventListener('DOMContentLoaded', () => {
  const logOutBtn = document.querySelector(".logout");
  if (!logOutBtn) return; // just in case button doesn't exist

  logOutBtn.addEventListener('click', () => {
    signOut(auth)
      .then(() => {
        alert("User signed out!");

        // Update DOM after logout
        const profileP = document.querySelector(".profile p");
        if (profileP) {
          profileP.textContent = "You are logged out.";
        }

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = "../Frontend/login.html";
        }, 1000);
      })
      .catch((err) => {
        alert("Unable to sign out!");
      });
  });
});

