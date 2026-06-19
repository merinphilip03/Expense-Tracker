import { useState } from "react";

const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"];

export default function FilterBar({ onFilter }) {
  const [filters, setFilters] = useState({
    category: "",
    date_from: "",
    date_to: "",
    title_search: "",
  });

  const handleChange = (e) => {
    const updated = { ...filters, [e.target.name]: e.target.value };
    setFilters(updated);
    onFilter(updated);
  };

  const handleClear = () => {
    const cleared = { category: "", date_from: "", date_to: "", title_search: "" };
    setFilters(cleared);
    onFilter(cleared);
  };

  const hasFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
      <div className="flex flex-wrap gap-3 items-end">

        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="text-xs font-medium text-gray-500">Search title</label>
          <input
            type="text"
            name="title_search"
            value={filters.title_search}
            onChange={handleChange}
            placeholder="e.g. Coffee"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div className="flex flex-col gap-1 min-w-[150px]">
          <label className="text-xs font-medium text-gray-500">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">From</label>
          <input
            type="date"
            name="date_from"
            value={filters.date_from}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">To</label>
          <input
            type="date"
            name="date_to"
            value={filters.date_to}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        {hasFilters && (
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}