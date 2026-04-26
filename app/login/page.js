"use client";

import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const login = async () => {
    setErro("");

    if (!email || !senha) {
      setErro("Preencha email e senha.");
      return;
    }

    const auth = getAuth(app);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setErro("Email ou senha incorretos.");
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl text-white w-80 shadow-lg">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold">Login</h2>

          <p className="text-gray-400 text-sm mt-1">
            By Maycon Azevedo
          </p>
        </div>

        {erro && (
          <div className="mb-4 bg-red-500/10 border border-red-500/40 text-red-300 text-sm p-3 rounded-lg">
            {erro}
          </div>
        )}

        <input
          className="w-full mb-2 p-2 bg-gray-700 rounded outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          value={email}
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              document.getElementById("senhaInput")?.focus();
            }
          }}
        />

        <input
          id="senhaInput"
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
          className={`w-full p-2 rounded transition active:scale-95 ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
          onClick={login}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </div>
  );
}