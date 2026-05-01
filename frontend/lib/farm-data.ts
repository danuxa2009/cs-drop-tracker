export type SessionDrop = {
  id: string;
  itemName: string;
  type: "case" | "graffiti" | "souvenir" | "sticker";
  quantity: number;
  value: number;
};

export type SessionSkin = {
  id: string;
  name: string;
  wear: string;
  rarity: "consumer" | "industrial" | "mil-spec" | "restricted" | "classified" | "covert";
  value: number;
};

export type Session = {
  id: string;
  startDate: string;
  endDate: string;
  accounts: number;
  totalValue: number;
  isFinal: boolean;
  drops: SessionDrop[];
  skins: SessionSkin[];
};

export type ExpenseCategory = "accounts" | "proxy" | "subscription" | "hardware" | "other";

export type Expense = {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
};

export const initialExpenses: Expense[] = [
  {
    id: "E-001",
    amount: 240,
    category: "accounts",
    description: "8 prime accounts batch purchase",
    date: "2026-04-21",
  },
  {
    id: "E-002",
    amount: 49,
    category: "proxy",
    description: "Residential proxy plan – April",
    date: "2026-04-15",
  },
  {
    id: "E-003",
    amount: 14.99,
    category: "subscription",
    description: "Inventory tracker Pro",
    date: "2026-04-10",
  },
  {
    id: "E-004",
    amount: 320,
    category: "hardware",
    description: "Spare SSD for farm rig",
    date: "2026-04-03",
  },
  {
    id: "E-005",
    amount: 12.5,
    category: "other",
    description: "Steam wallet top-up fees",
    date: "2026-03-29",
  },
];

export const totalExpenses = initialExpenses.reduce((sum, e) => sum + e.amount, 0);

export const expenseCategories: { value: ExpenseCategory; label: string }[] = [
  { value: "accounts", label: "Accounts" },
  { value: "proxy", label: "Proxy" },
  { value: "subscription", label: "Subscription" },
  { value: "hardware", label: "Hardware" },
  { value: "other", label: "Other" },
];
