"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import app from "../../lib/firebase";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [dados, setDados] = useState([]);
  const [menuAberto, setMenuAberto] = useState(true);
  const [filtroColaborador, setFiltroColaborador] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const router = useRouter();
  const db = getFirestore(app);

  const carregarDados = async () => {
    const snapshot = await getDocs(collection(db, "registros"));

    const lista = snapshot.docs.map((documento) => ({
      id: documento.id,
      ...documento.data(),
    }));

    setDados(lista);
  };

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      carregarDados();
    });

    return () => unsubscribe();
  }, []);

  const sair = async () => {
    const auth = getAuth(app);
    await signOut(auth);
    router.push("/login");
  };

  const formatarData = (data) => {
    if (!data) return "";
    if (typeof data === "string") return data;
    if (data?.toDate) return data.toDate().toLocaleDateString("pt-BR");
    return "";
  };

  const dataParaFiltro = (data) => {
    if (!data) return "";
    if (typeof data === "string") return data;
    if (data?.toDate) return data.toDate().toISOString().split("T")[0];
    return "";
  };

  const dadosFiltrados = dados.filter((item) => {
    const dataItem = dataParaFiltro(item.data);

    const dataOk =
      (!dataInicio || dataItem >= dataInicio) &&
      (!dataFim || dataItem <= dataFim);

    const colaboradorOk =
      !filtroColaborador ||
      item.colaborador === filtroColaborador;

    return dataOk && colaboradorOk;
  });

  const totalLancados = dadosFiltrados.reduce(
    (acc, item) => acc + Number(item.lancados || 0),
    0
  );

  const totalConvertidos = dadosFiltrados.reduce(
    (acc, item) => acc + Number(item.convertidos || 0),
    0
  );

  const totalNaoConvertidos = totalLancados - totalConvertidos;

  const taxa =
    totalLancados > 0
      ? ((totalConvertidos / totalLancados) * 100).toFixed(1)
      : 0;

  const graficoPizza = [
    { name: "Convertidos", value: totalConvertidos },
    { name: "Não convertidos", value: totalNaoConvertidos },
  ];

  const excluir = async (id) => {
    const confirmar = confirm("Tem certeza que deseja excluir este registro?");
    if (!confirmar) return;

    await deleteDoc(doc(db, "registros", id));
    carregarDados();
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
          <Link
            href="/dashboard"
            className="bg-blue-600/20 text-blue-300 p-3 rounded-lg hover:bg-blue-600/30"
          >
            {menuAberto ? "📊 Dashboard" : "📊"}
          </Link>

          <Link
            href="/cadastro"
            className="p-3 rounded-lg hover:bg-gray-800"
          >
            {menuAberto ? "➕ Cadastro" : "➕"}
          </Link>

          <button
            onClick={sair}
            className="p-3 rounded-lg hover:bg-red-900/30 text-red-300 text-left"
          >
            {menuAberto ? "🚪 Sair" : "🚪"}
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400 mt-1">
              Resumo do desempenho dos colaboradores
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <select
            className="p-3 bg-[#101c30] border border-blue-900/40 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={filtroColaborador}
            onChange={(e) => setFiltroColaborador(e.target.value)}
          >
            <option value="">Todos os colaboradores</option>
            <option value="JORDANO MONÇÃO">JORDANO MONÇÃO</option>
            <option value="VIVIANE LIMA">VIVIANE LIMA</option>
            <option value="RAIANE CARLA">RAIANE CARLA</option>
          </select>

          <input
            type="date"
            className="p-3 bg-[#101c30] border border-blue-900/40 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />

          <input
            type="date"
            className="p-3 bg-[#101c30] border border-blue-900/40 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#101c30] border border-blue-900/40 p-6 rounded-2xl shadow-lg">
            <p className="text-gray-400">Total Lançados</p>
            <h2 className="text-4xl font-bold mt-2">{totalLancados}</h2>
          </div>

          <div className="bg-[#101c30] border border-green-900/40 p-6 rounded-2xl shadow-lg">
            <p className="text-gray-400">Convertidos</p>
            <h2 className="text-4xl font-bold mt-2 text-green-400">
              {totalConvertidos}
            </h2>
          </div>

          <div className="bg-[#101c30] border border-purple-900/40 p-6 rounded-2xl shadow-lg">
            <p className="text-gray-400">Taxa de Conversão</p>
            <h2 className="text-4xl font-bold mt-2 text-purple-400">
              {taxa}%
            </h2>
          </div>
        </div>

        <div className="bg-[#101c30] border border-blue-900/40 p-6 rounded-2xl mb-8">
          <h2 className="text-xl font-bold mb-2">Visão Geral</h2>
          <p className="text-gray-400 mb-6">Distribuição de resultados</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={graficoPizza}
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    dataKey="value"
                    label={({ percent }) =>
                      `${(percent * 100).toFixed(1)}%`
                    }
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#3b82f6" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between bg-gray-900/50 p-4 rounded-lg">
                <span className="text-green-400">Convertidos</span>
                <span>
                  {totalConvertidos} ({taxa}%)
                </span>
              </div>

              <div className="flex justify-between bg-gray-900/50 p-4 rounded-lg">
                <span className="text-blue-400">Não convertidos</span>
                <span>{totalNaoConvertidos}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#101c30] border border-blue-900/40 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Registros</h2>

          <div className="grid grid-cols-5 gap-4 text-gray-400 border-b border-gray-700 pb-2 mb-2">
            <span>Colaborador</span>
            <span>Data</span>
            <span>Lançados</span>
            <span>Convertidos</span>
            <span>Ações</span>
          </div>

          {dadosFiltrados.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-5 gap-4 border-b border-gray-800 py-3"
            >
              <span>{item.colaborador}</span>
              <span>{formatarData(item.data)}</span>
              <span>{item.lancados}</span>
              <span className="text-green-400">{item.convertidos}</span>

              <button
                onClick={() => excluir(item.id)}
                className="text-red-400 hover:text-red-300"
              >
                Excluir
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}