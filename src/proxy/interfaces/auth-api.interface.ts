export interface ValidateTokenResponse {
  userId: string;
  isValid: boolean;
  expiresIn?: number;
}

export interface LogoutResponse {
  message: string;
  sessionId: string;
  logoutTime: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface AuthResponse<T> {
  data: T;
  statusCode?: number;
  message?: string;
}
