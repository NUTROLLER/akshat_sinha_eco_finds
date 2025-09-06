import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
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

//Add
async function addListing(data) {
  try {
    const docRef = await addDoc(collection(db, "listings"), data);
    console.log("Listing added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding listing: ", e);
  }
}

//View
async function getListings() {
  const querySnapshot = await getDocs(collection(db, "listings"));
  const listings = [];
  querySnapshot.forEach((doc) => {
    listings.push({ id: doc.id, ...doc.data() });
  });
  return listings;
}


//Update
async function updateListing(id, updatedData) {
  const listingRef = doc(db, "listings", id);
  try {
    await updateDoc(listingRef, updatedData);
    console.log("Listing updated!");
  } catch (e) {
    console.error("Error updating listing: ", e);
  }
}


//Delete
async function deleteListing(id) {
  try {
    await deleteDoc(doc(db, "listings", id));
    console.log("Listing deleted!");
  } catch (e) {
    console.error("Error deleting listing: ", e);
  }
}

