export type SessionDrop = { caseName: string; amount: number; percentage: number };
export type SessionSkin = { skinName: string; amount: number; price: number };
export type Session = {
  id: number;
  dateFrom: string;
  dateTo: string;
  accountsCount: number;
  totalValue: string;
  totalCases: number;
  avgCasePrice: string;
  avgDropPrice: string;
  isFinal: boolean;
  notes?: string;
  drops: SessionDrop[];
  skins: SessionSkin[];
};
export type CreateSessionInput = {
  dateFrom: string;
  dateTo: string;
  accountsCount: number;
  totalValue: number;
  totalCases: number;
  avgCasePrice: number;
  avgDropPrice: number;
  isFinal?: boolean;
  notes?: string;
  drops: SessionDrop[];
  skins?: SessionSkin[];
};
export type UpdateSessionInput = {
  accountsCount?: number;
  totalValue?: number;
  totalCases?: number;
  avgCasePrice?: number;
  avgDropPrice?: number;
  isFinal?: boolean;
  notes?: string;
};
export type ExpenseCategory = "accounts" | "proxy" | "subscription" | "other" | "hardware";
export type Expense = {
  id: number;
  description: string;
  amount: string;
  category: ExpenseCategory;
  date: string;
};
export type CreateExpenseInput = {
  amount: number;
  category: ExpenseCategory;
  date: string;
  description: string;
};
export type UpdateExpenseInput = {
  amount?: number;
  category?: ExpenseCategory;
  date?: string;
  description?: string;
};
