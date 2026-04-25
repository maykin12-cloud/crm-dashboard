"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-950 text-white p-6 fixed">
      <h1 className="text-xl font-bold mb-10">DataPulse</h1>

      <nav className="flex flex-col gap-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/cadastro">Cadastro</Link>
      </nav>
    </div>
  );
}