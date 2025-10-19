export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "staff";
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface Item {
  id: number;
  name: string;
  category: string;
  stock: number;
  unit: string;
  threshold: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  item_id: number;
  user_id: number;
  type: "in" | "out";
  quantity: number;
  date: string;
  file_path?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  item?: Item;
  user?: User;
}

export interface DashboardStats {
  summary: {
    total_items: number;
    total_stock: number;
    low_stock_count: number;
    total_transactions: number;
    today_transactions: number;
    month_transactions: number;
  };
  low_stock_items: Item[];
  recent_transactions: Transaction[];
  chart_data: {
    date: string;
    day: string;
    in: number;
    out: number;
  }[];
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
