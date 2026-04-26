"use client";

import { useState } from "react";
import Link from "next/link";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "../../lib/firebase";

export default function Cadastro() {
  const [menuAberto, setMenuAberto] = useState(true);
  const [colaborador, setColaborador] = useState("");
  const [data, setData] = useState("");
  const [lancados, setLancados] = useState("");
  const [convertidos, setConvertidos] = useState("");
  const [salvando, setSalvando] = useState(false);

  const salvar = async () => {
    if (salvando) return;

    if (!colaborador || !data || !lancados || !convertidos) {
      alert("Preencha todos os campos.");
      return;
    }

    const totalLancados = Number(lancados);
    const totalConvertidos = Number(convertidos);

    if (totalConvertidos > totalLancados) {
      alert("Convertidos não pode ser maior que lançados.");
      return;
    }

    setSalvando(true);

    const db = getFirestore(app);

    await addDoc(collection(db, "registros"), {
      colaborador,
      data,
      lancados: totalLancados,
      convertidos: totalConvertidos,
      naoConvertidos: totalLancados - totalConvertidos,
      criadoEm: new Date(),
    });

    setColaborador("");
    setData("");
    setLancados("");
    setConvertidos("");
    setSalvando(false);

    alert("Registro salvo com sucesso!");
  };

  return (
    <div className="min-h-screen bg-[#08111f] text-white flex">
      <aside
        className={`${
          menuAberto ? "w-64" : "w-20"
        } bg-[#0b1628] border-r border-blue-900/40 transition-all duration-300 min-h-screen p-5`}
      >
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="mb-8 bg-blue-600 hover:bg-blue-700 active:scale-95 transition px-3 py-2 rounded"
        >
          ☰
        </button>

        <div className="mb-10">
          <h1 className="text-xl font-bold text-blue-400">
            {menuAberto ? "DataPulse" : "DP"}
          </h1>
        </div>

        <nav className="flex flex-col gap-3">
          <Link href="/dashboard" className="p-3 rounded-lg hover:bg-gray-800">
            {menuAberto ? "📊 Dashboard" : "📊"}
          </Link>

          <Link
            href="/cadastro"
            className="bg-blue-600/20 text-blue-300 p-3 rounded-lg hover:bg-blue-600/30"
          >
            {menuAberto ? "➕ Cadastro" : "➕"}
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Cadastro</h1>
          <p className="text-gray-400 mt-1">
            Adicione novos registros de desempenho dos colaboradores
          </p>
        </div>

        <div className="bg-[#101c30] border border-blue-900/40 rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-6">Novo Registro</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <div>
              <label className="text-gray-400 text-sm">Colaborador</label>
            <select
  className="w-full mt-2 p-3 bg-[#08111f] border border-blue-900/40 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
  value={colaborador}
  onChange={(e) => setColaborador(e.target.value)}
>
  <option value="">Selecione</option>
  <option value="JORDANO MONÇÃO">JORDANO MONÇÃO</option>
  <option value="VIVIANE LIMA">VIVIANE LIMA</option>
  <option value="RAIANE CARLA">RAIANE CARLA</option>
</select>

            </div>

            <div>
              <label className="text-gray-400 text-sm">Data</label>
              <input
                type="date"
                className="w-full mt-2 p-3 bg-[#08111f] border border-blue-900/40 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm">Lançados</label>
              <input
                type="number"
                className="w-full mt-2 p-3 bg-[#08111f] border border-blue-900/40 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                value={lancados}
                onChange={(e) => setLancados(e.target.value)}
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm">Convertidos</label>
              <input
                type="number"
                className="w-full mt-2 p-3 bg-[#08111f] border border-blue-900/40 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                value={convertidos}
                onChange={(e) => setConvertidos(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={salvar}
            disabled={salvando}
            className={`mt-6 w-full md:w-56 p-3 rounded-lg font-semibold transition-all active:scale-95 ${
              salvando
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {salvando ? "Salvando..." : "Salvar Registro"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#101c30] border border-blue-900/40 rounded-2xl p-5">
            <p className="text-gray-400">Não convertidos</p>
            <h3 className="text-3xl font-bold mt-2">
              {Number(lancados || 0) - Number(convertidos || 0)}
            </h3>
          </div>

          <div className="bg-[#101c30] border border-green-900/40 rounded-2xl p-5">
            <p className="text-gray-400">Taxa prevista</p>
            <h3 className="text-3xl font-bold mt-2 text-green-400">
              {Number(lancados) > 0
                ? ((Number(convertidos || 0) / Number(lancados)) * 100).toFixed(1)
                : 0}
              %
            </h3>
          </div>

          <div className="bg-[#101c30] border border-purple-900/40 rounded-2xl p-5">
            <p className="text-gray-400">Status</p>
            <h3 className="text-2xl font-bold mt-3 text-purple-400">
              Pronto para salvar
            </h3>
          </div>
        </div>
      </main>
    </div>
  );
}