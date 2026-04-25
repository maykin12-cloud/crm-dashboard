import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "./firebase";

export function checkAuth(router) {
  const auth = getAuth(app);

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push("/login");
    }
  });
}