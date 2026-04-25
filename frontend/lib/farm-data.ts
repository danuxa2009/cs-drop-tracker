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

export const sessions: Session[] = [
  {
    id: "S-2419",
    startDate: "2026-04-22",
    endDate: "2026-04-24",
    accounts: 12,
    totalValue: 246.6,
    isFinal: true,
    drops: [
      { id: "D-1", itemName: "Recoil Case", type: "case", quantity: 8, value: 12.48 },
      { id: "D-2", itemName: "Dreams & Nightmares Case", type: "case", quantity: 4, value: 5.6 },
      { id: "D-3", itemName: "Souvenir Charm", type: "souvenir", quantity: 1, value: 3.4 },
    ],
    skins: [
      {
        id: "K-1",
        name: "AK-47 | Slate",
        wear: "Field-Tested",
        rarity: "mil-spec",
        value: 8.2,
      },
      {
        id: "K-2",
        name: "AWP | Capillary",
        wear: "Minimal Wear",
        rarity: "restricted",
        value: 21.5,
      },
      {
        id: "K-3",
        name: "M4A1-S | Night Terror",
        wear: "Factory New",
        rarity: "classified",
        value: 195.42,
      },
    ],
  },
  {
    id: "S-2418",
    startDate: "2026-04-19",
    endDate: "2026-04-21",
    accounts: 14,
    totalValue: 198.3,
    isFinal: true,
    drops: [
      { id: "D-4", itemName: "Kilowatt Case", type: "case", quantity: 10, value: 18.4 },
      { id: "D-5", itemName: "Graffiti Box", type: "graffiti", quantity: 3, value: 1.2 },
    ],
    skins: [
      { id: "K-4", name: "USP-S | Overgrowth", wear: "Field-Tested", rarity: "mil-spec", value: 4.8 },
      {
        id: "K-5",
        name: "Glock-18 | Umbral Rabbit",
        wear: "Minimal Wear",
        rarity: "restricted",
        value: 32.1,
      },
      {
        id: "K-6",
        name: "Desert Eagle | Ocean Drive",
        wear: "Factory New",
        rarity: "classified",
        value: 141.8,
      },
    ],
  },
  {
    id: "S-2417",
    startDate: "2026-04-15",
    endDate: "2026-04-18",
    accounts: 10,
    totalValue: 87.9,
    isFinal: true,
    drops: [{ id: "D-6", itemName: "Revolution Case", type: "case", quantity: 6, value: 9.0 }],
    skins: [
      { id: "K-7", name: "MAC-10 | Sakkaku", wear: "Battle-Scarred", rarity: "mil-spec", value: 2.4 },
      { id: "K-8", name: "MP9 | Mount Fuji", wear: "Minimal Wear", rarity: "restricted", value: 22.6 },
      { id: "K-9", name: "FAMAS | Meow 36", wear: "Field-Tested", rarity: "classified", value: 53.9 },
    ],
  },
  {
    id: "S-2416",
    startDate: "2026-04-12",
    endDate: "2026-04-14",
    accounts: 12,
    totalValue: 312.4,
    isFinal: true,
    drops: [
      { id: "D-7", itemName: "Anubis Collection Package", type: "case", quantity: 5, value: 7.5 },
      { id: "D-8", itemName: "Recoil Case", type: "case", quantity: 7, value: 10.92 },
    ],
    skins: [
      { id: "K-10", name: "AK-47 | Inheritance", wear: "Factory New", rarity: "covert", value: 240.0 },
      { id: "K-11", name: "P250 | Re.built", wear: "Minimal Wear", rarity: "restricted", value: 18.5 },
      { id: "K-12", name: "Five-SeveN | Hybrid", wear: "Field-Tested", rarity: "mil-spec", value: 35.48 },
    ],
  },
  {
    id: "S-2415",
    startDate: "2026-04-08",
    endDate: "2026-04-11",
    accounts: 14,
    totalValue: 154.2,
    isFinal: true,
    drops: [{ id: "D-9", itemName: "Kilowatt Case", type: "case", quantity: 9, value: 16.56 }],
    skins: [
      { id: "K-13", name: "Galil AR | Destroyer", wear: "Field-Tested", rarity: "mil-spec", value: 3.1 },
      { id: "K-14", name: "AUG | Carved Jade", wear: "Minimal Wear", rarity: "restricted", value: 28.9 },
      { id: "K-15", name: "M4A4 | Etch Lord", wear: "Factory New", rarity: "classified", value: 105.64 },
    ],
  },
  {
    id: "S-2414",
    startDate: "2026-04-05",
    endDate: "2026-04-07",
    accounts: 10,
    totalValue: 58.7,
    isFinal: false,
    drops: [{ id: "D-10", itemName: "Revolution Case", type: "case", quantity: 4, value: 6.0 }],
    skins: [
      { id: "K-16", name: "SG 553 | Heavy Metal", wear: "Battle-Scarred", rarity: "mil-spec", value: 1.9 },
      { id: "K-17", name: "Tec-9 | Rebel", wear: "Minimal Wear", rarity: "restricted", value: 14.3 },
      { id: "K-18", name: "Nova | Wood Fired", wear: "Field-Tested", rarity: "classified", value: 36.5 },
    ],
  },
  {
    id: "S-2413",
    startDate: "2026-04-01",
    endDate: "2026-04-04",
    accounts: 12,
    totalValue: 221.8,
    isFinal: true,
    drops: [
      { id: "D-11", itemName: "Dreams & Nightmares Case", type: "case", quantity: 8, value: 11.2 },
      { id: "D-12", itemName: "Sticker Capsule", type: "sticker", quantity: 2, value: 4.8 },
    ],
    skins: [
      { id: "K-19", name: "AK-47 | Ice Coaled", wear: "Field-Tested", rarity: "covert", value: 165.4 },
      { id: "K-20", name: "P90 | Vent Rush", wear: "Minimal Wear", rarity: "restricted", value: 12.6 },
      { id: "K-21", name: "MP7 | Guerrilla", wear: "Factory New", rarity: "classified", value: 27.8 },
    ],
  },
  {
    id: "S-2412",
    startDate: "2026-03-28",
    endDate: "2026-03-31",
    accounts: 8,
    totalValue: 42.5,
    isFinal: false,
    drops: [{ id: "D-13", itemName: "Recoil Case", type: "case", quantity: 3, value: 4.68 }],
    skins: [
      { id: "K-22", name: "CZ75-Auto | Tacticat", wear: "Field-Tested", rarity: "restricted", value: 9.8 },
      { id: "K-23", name: "PP-Bizon | Space Cat", wear: "Minimal Wear", rarity: "mil-spec", value: 28.02 },
    ],
  },
];

export const weeklyEarnings: { week: string; earned: number }[] = [
  { week: "W09", earned: 312.4 },
  { week: "W10", earned: 287.9 },
  { week: "W11", earned: 401.2 },
  { week: "W12", earned: 358.6 },
  { week: "W13", earned: 442.1 },
  { week: "W14", earned: 389.7 },
  { week: "W15", earned: 512.3 },
  { week: "W16", earned: 517.1 },
];

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

export const totalEarned = sessions.reduce((sum, s) => sum + s.totalValue, 0);
export const totalSessions = sessions.length;
export const avgPerWeek = weeklyEarnings.reduce((sum, w) => sum + w.earned, 0) / weeklyEarnings.length;
export const totalExpenses = initialExpenses.reduce((sum, e) => sum + e.amount, 0);
export const netProfit = totalEarned - totalExpenses;

export const expenseCategories: { value: ExpenseCategory; label: string }[] = [
  { value: "accounts", label: "Accounts" },
  { value: "proxy", label: "Proxy" },
  { value: "subscription", label: "Subscription" },
  { value: "hardware", label: "Hardware" },
  { value: "other", label: "Other" },
];
