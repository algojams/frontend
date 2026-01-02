"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { strudelsApi } from "@/lib/api/strudels";
import type { CreateStrudelRequest, UpdateStrudelRequest } from "@/lib/api/strudels.types";

export const strudelKeys = {
  all: ["strudels"] as const,
  lists: () => [...strudelKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...strudelKeys.lists(), filters] as const,
  details: () => [...strudelKeys.all, "detail"] as const,
  detail: (id: string) => [...strudelKeys.details(), id] as const,
  public: () => [...strudelKeys.all, "public"] as const,
};

export function useStrudels(params?: {
  page?: number;
  page_size?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: strudelKeys.list(params || {}),
    queryFn: () => strudelsApi.list(params),
  });
}

export function useStrudel(id: string) {
  return useQuery({
    queryKey: strudelKeys.detail(id),
    queryFn: () => strudelsApi.get(id),
    enabled: !!id,
  });
}

export function useCreateStrudel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStrudelRequest) => strudelsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: strudelKeys.lists() });
    },
  });
}

export function useUpdateStrudel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStrudelRequest }) =>
      strudelsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: strudelKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: strudelKeys.lists() });
    },
  });
}

export function useDeleteStrudel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => strudelsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: strudelKeys.lists() });
    },
  });
}

export function usePublicStrudels(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: [...strudelKeys.public(), params],
    queryFn: () => strudelsApi.listPublic(params),
  });
}

export function useForkStrudel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => strudelsApi.fork(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: strudelKeys.lists() });
    },
  });
}
