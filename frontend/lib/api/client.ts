import {
  CreateExpenseInput,
  CreateSessionInput,
  Expense,
  Session,
  UpdateExpenseInput,
  UpdateSessionInput,
} from "./types";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (process.env.NEXT_PUBLIC_API_KEY) {
    headers["x-api-key"] = process.env.NEXT_PUBLIC_API_KEY;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      ...headers,
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `API error: ${res.status}`);
  }

  return res.json();
}

export const sessionsApi = {
  list: () => request<Session[]>("/sessions"),
  get: (id: number) => request<Session>(`/sessions/${id}`),
  create: (data: CreateSessionInput) =>
    request<Session>("/sessions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: UpdateSessionInput) =>
    request<Session>(`/sessions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  remove: (id: number) => request<void>(`/sessions/${id}`, { method: "DELETE" }),
};

export const expensesApi = {
  list: () => request<Expense[]>("/expenses"),
  create: (data: CreateExpenseInput) =>
    request<Expense>("/expenses", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: UpdateExpenseInput) =>
    request<Expense>(`/expenses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  remove: (id: number) => request<void>(`/expenses/${id}`, { method: "DELETE" }),
};
