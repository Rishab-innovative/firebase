import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAVAjO7500o2y3NLTw51PkeNRli8ZInPL8",
  authDomain: "fir-react-295f0.firebaseapp.com",
  projectId: "fir-react-295f0",
  storageBucket: "fir-react-295f0.appspot.com",
  messagingSenderId: "669539652050",
  appId: "1:669539652050:web:dfee029e9237ee7127f80b",
  measurementId: "G-C7457966ET",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const imageDb = getStorage(app);
export { auth, app, imageDb };
