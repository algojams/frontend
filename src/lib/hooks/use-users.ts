"use client";

import { useMutation } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";
import { useAuthStore } from "@/lib/stores/auth";
import type {
  AIFeaturesEnabledRequest,
  UpdateDisplayNameRequest,
} from "@/lib/api/users/types";

export function useUpdateAIFeaturesEnabled() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: AIFeaturesEnabledRequest) =>
      usersApi.updateAIFeaturesEnabled(data),
    onSuccess: (updatedUser) => {
      // update the auth store directly with the returned user
      setUser(updatedUser);
    },
  });
}

export function useUpdateDisplayName() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: UpdateDisplayNameRequest) =>
      usersApi.updateDisplayName(data),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
    },
  });
}
