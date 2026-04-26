"use client";

import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const login = async () => {
    if (loading) return;

    const auth = getAuth(app);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Erro ao logar");
      setLoading(false);
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
          className="w-full mb-2 p-2 bg-gray-700 rounded outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          value={email}
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              document.getElementById("senha")?.focus();
            }
          }}
        />

        <input
          id="senha"
          type="password"
          className="w-full mb-4 p-2 bg-gray-700 rounded outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Senha"
          value={senha}
          disabled={loading}
          onChange={(e) => setSenha(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              login();
            }
          }}
        />

        <button
          disabled={loading}
          onClick={login}
          className={`w-full p-2 rounded text-white transition-all duration-100
            ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 active:scale-95 active:translate-y-1 hover:bg-blue-700"
            }
          `}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </div>
  );
}