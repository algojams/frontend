"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionsApi } from "@/lib/api/sessions";
import type {
  CreateSessionRequest,
  InviteRequest,
  TransferSessionRequest,
} from "@/lib/api/sessions.types";

export const sessionKeys = {
  all: ["sessions"] as const,
  lists: () => [...sessionKeys.all, "list"] as const,
  details: () => [...sessionKeys.all, "detail"] as const,
  detail: (id: string) => [...sessionKeys.details(), id] as const,
};

export function useSessions() {
  return useQuery({
    queryKey: sessionKeys.lists(),
    queryFn: () => sessionsApi.list(),
  });
}

export function useSession(id: string) {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: () => sessionsApi.get(id),
    enabled: !!id,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data?: CreateSessionRequest) => sessionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => sessionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
}

export function useCreateInvite() {
  return useMutation({
    mutationFn: ({
      sessionId,
      data,
    }: {
      sessionId: string;
      data: InviteRequest;
    }) => sessionsApi.createInvite(sessionId, data),
  });
}

export function useTransferSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransferSessionRequest) => sessionsApi.transfer(data),
    onSuccess: () => {
      // Invalidate strudels list since we created a new one
      queryClient.invalidateQueries({ queryKey: ["strudels"] });
      // Clear the anonymous session from localStorage
      localStorage.removeItem("algorave_session_id");
    },
  });
}
