import { apiClient } from '../client';
import type { User } from '../auth/types';
import type {
  UsageResponse,
  TrainingConsentRequest,
  AIFeaturesEnabledRequest,
  UpdateDisplayNameRequest,
} from './types';

export const usersApi = {
  getUsage: () => {
    const url = '/api/v1/users/usage';
    return apiClient.get<UsageResponse>(url, { requireAuth: true });
  },

  updateTrainingConsent: (data: TrainingConsentRequest) => {
    const url = '/api/v1/users/training-consent';
    return apiClient.put<User>(url, data, {
      requireAuth: true,
    });
  },

  updateAIFeaturesEnabled: (data: AIFeaturesEnabledRequest) => {
    const url = '/api/v1/users/ai-features-enabled';
    return apiClient.put<User>(url, data, {
      requireAuth: true,
    });
  },

  updateDisplayName: (data: UpdateDisplayNameRequest) => {
    const url = '/api/v1/users/display-name';
    return apiClient.put<User>(url, data, {
      requireAuth: true,
    });
  },
};
