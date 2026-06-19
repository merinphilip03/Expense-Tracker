import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});


export const fetchExpenses = (filters = {}) => {
  const params = {};
  if (filters.category)     params.category     = filters.category;
  if (filters.date_from)    params.date_from    = filters.date_from;
  if (filters.date_to)      params.date_to      = filters.date_to;
  if (filters.title_search) params.title_search = filters.title_search;
  return api.get("/expenses/", { params });
};

export const fetchExpenseById = (id) =>
  api.get(`/expenses/${id}`);

export const createExpense = (data) =>
  api.post("/expenses/", data);

export const updateExpense = (id, data) =>
  api.put(`/expenses/${id}`, data);

export const deleteExpense = (id) =>
  api.delete(`/expenses/${id}`);

export const fetchMonthlySummary = (month, year) =>
  api.get("/expenses/summary", { params: { month, year } });