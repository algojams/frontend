import { apiClient } from "./client";
import type {
  Strudel,
  CreateStrudelRequest,
  UpdateStrudelRequest,
  StrudelsResponse,
  StrudelResponse,
} from "./strudels.types";

export const strudelsApi = {
  list: (params?: { page?: number; page_size?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.page_size)
      searchParams.set("page_size", params.page_size.toString());
    if (params?.search) searchParams.set("search", params.search);

    const query = searchParams.toString();
    return apiClient.get<StrudelsResponse>(
      `/api/v1/strudels${query ? `?${query}` : ""}`,
      { requireAuth: true }
    );
  },

  get: (id: string) =>
    apiClient.get<StrudelResponse>(`/api/v1/strudels/${id}`, {
      requireAuth: true,
    }),

  create: (data: CreateStrudelRequest) =>
    apiClient.post<StrudelResponse>("/api/v1/strudels", data, {
      requireAuth: true,
    }),

  update: (id: string, data: UpdateStrudelRequest) =>
    apiClient.put<StrudelResponse>(`/api/v1/strudels/${id}`, data, {
      requireAuth: true,
    }),

  delete: (id: string) =>
    apiClient.delete<void>(`/api/v1/strudels/${id}`, { requireAuth: true }),

  listPublic: (params?: { limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.offset) searchParams.set("offset", params.offset.toString());

    const query = searchParams.toString();
    return apiClient.get<{ strudels: Strudel[] }>(
      `/api/v1/public/strudels${query ? `?${query}` : ""}`
    );
  },

  fork: (id: string) =>
    apiClient.post<StrudelResponse>(`/api/v1/strudels/${id}/fork`, undefined, {
      requireAuth: true,
    }),
};
