export interface CoreUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoreCategory {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type CoreResponse<T> = {
  data: T;
  statusCode?: number;
  message?: string;
};
