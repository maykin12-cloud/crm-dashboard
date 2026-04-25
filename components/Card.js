export default function Card({ title, value }) {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full">
      <p className="text-gray-400">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}