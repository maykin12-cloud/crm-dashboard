"use client";

import { PieChart, Pie, Cell } from "recharts";

export default function Chart({ convertidos, naoConvertidos }) {
  const data = [
    { name: "Convertidos", value: convertidos },
    { name: "Não convertidos", value: naoConvertidos },
  ];

  return (
    <PieChart width={300} height={300}>
      <Pie data={data} dataKey="value">
        <Cell fill="#3b82f6" />
        <Cell fill="#ef4444" />
      </Pie>
    </PieChart>
  );
}