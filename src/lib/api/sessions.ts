import { apiClient } from "./client";
import type {
  CreateSessionRequest,
  InviteRequest,
  TransferSessionRequest,
  JoinSessionRequest,
  SessionsResponse,
  SessionResponse,
  InviteResponse,
  TransferResponse,
} from "./sessions.types";

export const sessionsApi = {
  list: () =>
    apiClient.get<SessionsResponse>("/api/v1/sessions", { requireAuth: true }),

  get: (id: string) =>
    apiClient.get<SessionResponse>(`/api/v1/sessions/${id}`, {
      requireAuth: true,
    }),

  create: (data?: CreateSessionRequest) =>
    apiClient.post<SessionResponse>("/api/v1/sessions", data, {
      requireAuth: true,
    }),

  update: (id: string, data: { code: string }) =>
    apiClient.put<SessionResponse>(`/api/v1/sessions/${id}`, data, {
      requireAuth: true,
    }),

  delete: (id: string) =>
    apiClient.delete<void>(`/api/v1/sessions/${id}`, { requireAuth: true }),

  createInvite: (sessionId: string, data: InviteRequest) =>
    apiClient.post<InviteResponse>(
      `/api/v1/sessions/${sessionId}/invite`,
      data,
      { requireAuth: true }
    ),

  transfer: (data: TransferSessionRequest) =>
    apiClient.post<TransferResponse>("/api/v1/sessions/transfer", data, {
      requireAuth: true,
    }),

  join: (data: JoinSessionRequest) =>
    apiClient.post<SessionResponse>("/api/v1/sessions/join", data),
};
