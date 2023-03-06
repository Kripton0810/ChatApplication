import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import { getStorage } from "firebase/storage";

/**
 * Firebase configuration object containing keys and identifiers for your app
 * that we copied from our app's Firebase config object
 */
export const auth = firebase.initializeApp ({
  apiKey: "AIzaSyBLjo_WIvh-ciiIKMF4wCbNN8ICc9FDc00",
  authDomain: "arrowhead-4a36b.firebaseapp.com",
  projectId: "arrowhead-4a36b",
  storageBucket: "arrowhead-4a36b.appspot.com",
  messagingSenderId: "950575106026",
  appId: "1:950575106026:web:faddbb0ab2a19d6f10d493"
}).auth();

export const storage = getStorage();
