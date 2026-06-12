import { initializeApp } from “https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js”;
import {
getFirestore
} from “https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js”;

const firebaseConfig = {
apiKey: “TU_API_KEY”,
authDomain: “TU_PROYECTO.firebaseapp.com”,
projectId: “TU_PROYECTO”,
storageBucket: “TU_PROYECTO.appspot.com”,
messagingSenderId: “XXXXXXXX”,
appId: “XXXXXXXX”
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
