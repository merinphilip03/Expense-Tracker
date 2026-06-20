import { useState, useEffect, useCallback } from "react";
import ExpenseForm    from "./components/ExpenseForm";
import ExpenseList    from "./components/ExpenseList";
import FilterBar      from "./components/FilterBar";
import MonthlySummary from "./components/MonthlySummary";
import {
  fetchExpenses,
  fetchMonthlySummary,
  createExpense,
  updateExpense,
  deleteExpense,
} from "./api/expenses";

const fmt = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

const fmtDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export default function App() {
  const [expenses, setExpenses]     = useState([]);
  const [summary,  setSummary]      = useState(null);
  const [filters,  setFilters]      = useState({});
  const [editing,  setEditing]      = useState(null);
  const [showForm, setShowForm]     = useState(false);
  const [loading,  setLoading]      = useState(false);
  const [error,    setError]        = useState("");


  const loadExpenses = useCallback(async (f = filters) => {
    try {
      const res = await fetchExpenses(f);
      setExpenses(res.data);
    } catch {
      setError("Failed to load expenses.");
    }
  }, [filters]);

  const loadSummary = useCallback(async () => {
    try {
      const t = new Date();
      const res = await fetchMonthlySummary(t.getMonth() + 1, t.getFullYear());
      setSummary(res.data);
    } catch {
      setError("Failed to load summary.");
    }
  }, []);

  useEffect(() => {
    loadExpenses();
    loadSummary();
  }, [loadExpenses, loadSummary]);

  const handleFilter = (f) => {
    setFilters(f);
    loadExpenses(f);
  };

  const handleCreate = async (data) => {
    setLoading(true);
    try {
      await createExpense(data);
      setShowForm(false);
      await loadExpenses();
      await loadSummary();
    } catch {
      setError("Failed to add expense.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setLoading(true);
    try {
      await updateExpense(editing.id, data);
      setEditing(null);
      await loadExpenses();
      await loadSummary();
    } catch {
      setError("Failed to update expense.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      await loadExpenses();
      await loadSummary();
    } catch {
      setError("Failed to delete expense.");
    }
  };

  const handleEdit = (expense) => {
    setEditing(expense);
    setShowForm(false);
  };

  const handleCancelEdit = () => setEditing(null);
  const handleCancelAdd  = () => setShowForm(false);

  const filteredTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const hasFilters = Object.values(filters).some((v) => v !== "");

  const getFilterDescription = () => {
    const parts = [];
    if (filters.category) {
      parts.push(`Category: ${filters.category}`);
    }
    if (filters.date_from || filters.date_to) {
      const fromStr = filters.date_from ? fmtDate(filters.date_from) : "Start";
      const toStr = filters.date_to ? fmtDate(filters.date_to) : "End";
      parts.push(`Date range: ${fromStr} to ${toStr}`);
    }
    if (filters.title_search) {
      parts.push(`Title matching "${filters.title_search}"`);
    }
    return parts.length > 0 ? parts.join(" • ") : "All expenses";
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">💰 Expense Tracker</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); }}
          className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {showForm ? "Cancel" : "+ Add expense"}
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex justify-between">
            {error}
            <button onClick={() => setError("")} className="ml-4 text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Add new expense</h2>
            <ExpenseForm
              onSubmit={handleCreate}
              onCancel={handleCancelAdd}
              loading={loading}
            />
          </div>
        )}

        {editing && (
          <div className="bg-white border border-indigo-200 rounded-xl p-5 mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Edit expense</h2>
            <ExpenseForm
              initial={{ ...editing, date: editing.date?.split("T")[0] }}
              onSubmit={handleUpdate}
              onCancel={handleCancelEdit}
              loading={loading}
            />
          </div>
        )}

        <MonthlySummary summary={summary} />

        <FilterBar onFilter={handleFilter} />

        {hasFilters && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-5 mb-6 shadow-sm transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm">
                  Active Filter Summary
                </span>
                <h3 className="text-lg font-semibold mt-2">
                  {getFilterDescription()}
                </h3>
                <p className="text-white/80 text-xs mt-1">
                  Showing {expenses.length} matching expense{expenses.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="text-left sm:text-right border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                <p className="text-xs text-white/70 uppercase tracking-wider font-semibold">Total Spent</p>
                <p className="text-3xl font-extrabold mt-0.5">{fmt(filteredTotal)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-3 bg-white border border-gray-200 rounded-xl px-4 py-3">
          <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            {hasFilters ? "Filtered expenses" : "All expenses"}
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-normal">
              {expenses.length}
            </span>
          </h2>
          <div className="text-right">
            <span className="text-xs text-gray-400 uppercase tracking-wider block">Total Spent</span>
            <span className="text-base font-bold text-gray-900">{fmt(filteredTotal)}</span>
          </div>
        </div>

        <ExpenseList
          expenses={expenses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

      </main>
    </div>
  );
}