export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ValidateTokenResponse {
  userId: string;
  isValid: boolean;
  expiresIn: number;
}

export interface AuthResponse<T> {
  data: T;
  statusCode?: number;
  message?: string;
}
