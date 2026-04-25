"use client";

import { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "../../lib/firebase";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [lancados, setLancados] = useState("");
  const [convertidos, setConvertidos] = useState("");

  const salvar = async () => {
    const db = getFirestore(app);

    await addDoc(collection(db, "registros"), {
      nome,
      lancados: Number(lancados),
      convertidos: Number(convertidos),
      data: new Date()
    });

    alert("Salvo!");
  };

  return (
    <div className="p-10 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl mb-4">Cadastro</h1>

      <input placeholder="Nome" onChange={(e) => setNome(e.target.value)} />
      <input placeholder="Lançados" onChange={(e) => setLancados(e.target.value)} />
      <input placeholder="Convertidos" onChange={(e) => setConvertidos(e.target.value)} />

      <button onClick={salvar} className="bg-green-600 p-2 mt-2">
        Salvar
      </button>
    </div>
  );
}