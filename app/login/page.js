"use client";

import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  const login = async () => {
    const auth = getAuth(app);

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      alert("Login OK");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Erro ao logar");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl text-white w-80">
        
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">Login</h2>
          <p className="text-gray-400 text-sm mt-1">
            By Maycon Azevedo
          </p>
        </div>

        <input
          className="w-full mb-2 p-2 bg-gray-700"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 p-2 bg-gray-700"
          placeholder="Senha"
          onChange={(e) => setSenha(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 p-2 rounded"
          onClick={login}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}