export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  github_username?: string;
  google_id?: string;
  tier: "free" | "pro" | "byok";
  created_at: string;
  updated_at: string;
}

export interface UpdateUserRequest {
  display_name?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface MeResponse {
  user: User;
}
