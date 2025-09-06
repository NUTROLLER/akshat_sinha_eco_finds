import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, addDoc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {getAuth, onAuthStateChanged,signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"

const firebaseConfig = {
  apiKey: "AIzaSyCLkHnlw9-cX6ec-6sEN7akSJe9ysBGoP0",
  authDomain: "first-proj-firebase9.firebaseapp.com",
  projectId: "first-proj-firebase9",
  storageBucket: "first-proj-firebase9.firebasestorage.app",
  messagingSenderId: "849709724050",
  appId: "1:849709724050:web:5a7b5849ff7d7c8924914b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const addListingForm = document.querySelector(".addListing");
const readDiv = document.querySelector(".read");
//Navbar

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



//Add
addListingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputs = addListingForm.querySelectorAll("input");
  const newListing = {
    title: inputs[0].value.trim(),
    category: inputs[1].value.trim(),
    description: inputs[2].value.trim(),
    price: parseFloat(inputs[3].value),
    quantity: parseInt(inputs[4].value, 10),
    condition: inputs[5].value.trim(),
    createdAt: new Date(),
  };
//Warning
  if (!newListing.title || isNaN(newListing.price) || isNaN(newListing.quantity)) {
    alert("Please fill in valid Title, Price, and Quantity.");
    return;
  }

  try {
    await addDoc(collection(db, "listings"), newListing);
    alert("Listing added successfully!");
    addListingForm.reset();
    displayListings(); // refresh after adding
  } catch (error) {
    alert("Error adding listing: " + error.message);
  }
});

// Fetch and display listings
async function displayListings() {
  readDiv.innerHTML = "<h1>View, Update and Modify Listings</h1>"; // reset

  const querySnapshot = await getDocs(collection(db, "listings"));

  if (querySnapshot.empty) {
    readDiv.innerHTML += "<p>No listings found.</p>";
    return;
  }

  querySnapshot.forEach(docSnap => {
    const listing = { id: docSnap.id, ...docSnap.data() };

    // Create container for each listing
    const listingDiv = document.createElement("div");
    listingDiv.classList.add("listing");
    listingDiv.dataset.id = listing.id;

    // Show fields, inputs 
    listingDiv.innerHTML = `
      <p><strong>Title:</strong> <span class="field title">${escapeHtml(listing.title)}</span>
      <input class="edit-input title" type="text" value="${escapeHtml(listing.title)}" style="display:none;"></p>

      <p><strong>Category:</strong> <span class="field category">${escapeHtml(listing.category)}</span>
      <input class="edit-input category" type="text" value="${escapeHtml(listing.category)}" style="display:none;"></p>

      <p><strong>Description:</strong> <span class="field description">${escapeHtml(listing.description)}</span>
      <input class="edit-input description" type="text" value="${escapeHtml(listing.description)}" style="display:none;"></p>

      <p><strong>Price:</strong> Rs.<span class="field price">${listing.price}</span>
      <input class="edit-input price" type="number" step="0.01" value="${listing.price}" style="display:none;"></p>

      <p><strong>Quantity:</strong> <span class="field quantity">${listing.quantity}</span>
      <input class="edit-input quantity" type="number" value="${listing.quantity}" style="display:none;"></p>

      <p><strong>Condition:</strong> <span class="field condition">${escapeHtml(listing.condition)}</span>
      <input class="edit-input condition" type="text" value="${escapeHtml(listing.condition)}" style="display:none;"></p>

      <button class="edit-btn">Edit</button>
      <button class="save-btn" style="display:none;">Save</button>
      <button class="cancel-btn" style="display:none;">Cancel</button>
      <button class="delete-btn">Delete</button>
      <hr>
    `;
    const editBtn = listingDiv.querySelector(".edit-btn");
    const saveBtn = listingDiv.querySelector(".save-btn");
    const cancelBtn = listingDiv.querySelector(".cancel-btn");
    const deleteBtn = listingDiv.querySelector(".delete-btn");

    editBtn.addEventListener("click", () => enterEditMode(listingDiv));
    saveBtn.addEventListener("click", () => saveEdit(listingDiv));
    cancelBtn.addEventListener("click", () => cancelEdit(listingDiv));
    deleteBtn.addEventListener("click", () => deleteListing(listing.id));

    readDiv.appendChild(listingDiv);
  });
}

// Escape HTML (idk wtf this is lol)
function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/[&<>"']/g, function(m) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m];
  });
}

// Write (EditMode)
function enterEditMode(container) {
  container.querySelectorAll(".field").forEach(el => el.style.display = "none");
  container.querySelectorAll(".edit-input").forEach(el => el.style.display = "inline-block");

  container.querySelector(".edit-btn").style.display = "none";
  container.querySelector(".save-btn").style.display = "inline-block";
  container.querySelector(".cancel-btn").style.display = "inline-block";
}

// Cancel editing:
function cancelEdit(container) {
  container.querySelectorAll(".edit-input").forEach(input => {
    const fieldName = input.classList[1];
    const span = container.querySelector(`.field.${fieldName}`);
    input.value = span.textContent; // revert input to original
    input.style.display = "none";
  });

  container.querySelectorAll(".field").forEach(el => el.style.display = "inline");
  container.querySelector(".edit-btn").style.display = "inline-block";
  container.querySelector(".save-btn").style.display = "none";
  container.querySelector(".cancel-btn").style.display = "none";
}

// Save edits to Firestore
async function saveEdit(container) {
  const id = container.dataset.id;

  // Collect new values from inputs
  const updatedData = {
    title: container.querySelector(".edit-input.title").value.trim(),
    category: container.querySelector(".edit-input.category").value.trim(),
    description: container.querySelector(".edit-input.description").value.trim(),
    price: parseFloat(container.querySelector(".edit-input.price").value),
    quantity: parseInt(container.querySelector(".edit-input.quantity").value, 10),
    condition: container.querySelector(".edit-input.condition").value.trim(),
  };

  if (!updatedData.title || isNaN(updatedData.price) || isNaN(updatedData.quantity)) {
    alert("Please fill in valid Title, Price, and Quantity.");
    return;
  }

  try {
    await updateDoc(doc(db, "listings", id), updatedData);
    alert("Listing updated!");
    displayListings();
  } catch (e) {
    alert("Error updating listing: " + e.message);
  }
}

// Delete listing
async function deleteListing(id) {
  if (!confirm("Are you sure you want to delete this listing?")) return;

  try {
    await deleteDoc(doc(db, "listings", id));
    alert("Listing deleted!");
    displayListings();
  } catch (e) {
    alert("Error deleting listing: " + e.message);
  }
}

//Jesus just display the stuff
displayListings();
