export interface BelvoWidgetToken {
  access: string;
  refresh: string;
  expiresIn: number;
}

export interface BelvoAccount {
  id: string;
  link: string;
  institution: string;
  category: string;
  type: string;
  number: string;
  balance: {
    current: number;
    available: number;
  };
}

export interface BelvoTransaction {
  id: string;
  account: string;
  amount: number;
  category: string;
  description: string;
  status: string;
  type: string;
  valueDate: string;
}

export type BelvoResponse<T> = {
  data: T;
  statusCode?: number;
  message?: string;
};
