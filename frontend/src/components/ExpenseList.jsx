import { useState } from "react";

const CATEGORY_COLORS = {
  Food:          "bg-orange-100 text-orange-700",
  Transport:     "bg-blue-100 text-blue-700",
  Shopping:      "bg-pink-100 text-pink-700",
  Bills:         "bg-red-100 text-red-700",
  Entertainment: "bg-purple-100 text-purple-700",
  Other:         "bg-gray-100 text-gray-600",
};

const fmt = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  if (!expenses.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">No expenses found</p>
        <p className="text-sm mt-1">Add your first expense to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3 text-right">Amount</th>
            <th className="px-4 py-3">Note</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {expenses.map((exp) => (
            <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmtDate(exp.date)}</td>
              <td className="px-4 py-3 font-medium text-gray-800">{exp.title}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[exp.category] || CATEGORY_COLORS.Other}`}>
                  {exp.category}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-medium text-gray-800 whitespace-nowrap">
                {fmt(exp.amount)}
              </td>
              <td className="px-4 py-3 text-gray-400 max-w-[180px] truncate">
                {exp.note || "—"}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onEdit(exp)}
                    className="text-xs px-3 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    disabled={deletingId === exp.id}
                    className="text-xs px-3 py-1 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors"
                  >
                    {deletingId === exp.id ? "..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}