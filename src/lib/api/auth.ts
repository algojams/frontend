import { apiClient } from "./client";
import { API_BASE_URL } from "@/lib/constants";
import type { MeResponse, UpdateUserRequest, User } from "./auth.types";

export const authApi = {
  getMe: () =>
    apiClient.get<MeResponse>("/api/v1/auth/me", { requireAuth: true }),

  updateMe: (data: UpdateUserRequest) =>
    apiClient.put<{ user: User }>("/api/v1/auth/me", data, {
      requireAuth: true,
    }),

  getOAuthUrl: (provider: "github" | "google") => {
    return `${API_BASE_URL}/api/v1/auth/${provider}`;
  },

  logout: () => {
    // Client-side only - just clear the token
    // Backend doesn't have a logout endpoint since JWTs are stateless
  },
};
