export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  provider: string;
  ai_features_enabled: boolean;
  training_consent: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UserResponse {
  user: User;
}

export interface UpdateProfileRequest {
  name: string;
  avatar_url?: string;
}
