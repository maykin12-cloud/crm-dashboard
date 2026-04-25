import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAlA4rbKbVQ2pwzsDtC5m4JnzTBBdcDgTI",
  authDomain: "crm-dashboard-4d2dc.firebaseapp.com",
  projectId: "crm-dashboard-4d2dc",
  storageBucket: "crm-dashboard-4d2dc.firebasestorage.app",
  messagingSenderId: "1062148866498",
  appId: "1:1062148866498:web:b687d175beb6f96529965b",
  measurementId: "G-CD4Z0N8Z22"
};

const app = initializeApp(firebaseConfig);

export default app;