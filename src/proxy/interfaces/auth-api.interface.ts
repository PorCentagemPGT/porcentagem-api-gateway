export interface AuthUser {
  id: string;
  email: string;
  roles: string[];
  accessToken: string;
  refreshToken: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  user?: AuthUser;
}

export type AuthResponse<T> = {
  data: T;
  statusCode?: number;
  message?: string;
};
