export type SessionDrop = {
  case_name: string;
  amount: number;
  percentage: number;
};

export type SessionSkin = {
  skin_name: string;
  amount: number;
  price: number;
};

export type CreateSessionDTO = {
  date_from: string;
  date_to: string;
  accounts_count: number;
  total_value: number;
  total_cases: number;
  avg_case_price: number;
  avg_drop_price: number;
  is_final?: boolean;
  notes?: string;
  drops: SessionDrop[];
  skins?: SessionSkin[];
};

export type UpdateSessionDTO = {
  accounts_count?: number;
  total_value?: number;
  total_cases?: number;
  avg_case_price?: number;
  avg_drop_price?: number;
  is_final?: boolean;
  notes?: string;
};
