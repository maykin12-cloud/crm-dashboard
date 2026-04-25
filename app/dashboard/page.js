"use client";

import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";
import Chart from "../../components/Chart";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { checkAuth } from "../../lib/auth";

export default function Dashboard() {
  const [dados, setDados] = useState([]);
  const router = useRouter();

  useEffect(() => {
    checkAuth(router);

    const carregar = async () => {
      const db = getFirestore(app);
      const snapshot = await getDocs(collection(db, "registros"));

      const lista = [];
      snapshot.forEach((doc) => lista.push(doc.data()));
      setDados(lista);
    };

    carregar();
  }, []);

  const totalLancados = dados.reduce(
  (acc, d) => acc + Number(d.lancados || 0),
  0
);

const totalConvertidos = dados.reduce(
  (acc, d) => acc + Number(d.convertidos || 0),
  0
);

  const taxa =
    totalLancados > 0
      ? ((totalConvertidos / totalLancados) * 100).toFixed(1)
      : 0;

  return (
    <div className="flex bg-gray-900 min-h-screen text-white">
      <Sidebar />

      <div className="ml-64 p-10 w-full">
        <h1 className="text-2xl mb-6">Dashboard</h1>

        <div className="grid grid-cols-3 gap-6 mb-10">
          <Card title="Total Lançados" value={totalLancados} />
          <Card title="Convertidos" value={totalConvertidos} />
          <Card title="Taxa de Conversão" value={taxa + "%"} />
        </div>

        <Chart
          convertidos={totalConvertidos}
          naoConvertidos={totalLancados - totalConvertidos}
        />
      </div>
    </div>
  );
}