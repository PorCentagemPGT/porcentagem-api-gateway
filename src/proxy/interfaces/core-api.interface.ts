export interface CoreUserResponse {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoreResponse<T> {
  data: T;
  statusCode?: number;
  message?: string;
}
