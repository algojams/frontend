import { create } from 'zustand';
import type { SessionRole } from '@/lib/api/sessions/types';
import type { ConnectionStatus, ChatMessage } from '@/lib/websocket/types';

interface Participant {
  id: string;
  userId?: string;
  displayName: string;
  role: SessionRole;
}

interface WebSocketState {
  status: ConnectionStatus;
  sessionId: string | null;
  error: string | null;
  participants: Participant[];
  messages: ChatMessage[];
  myRole: SessionRole | null;
  sessionStateReceived: boolean;

  setStatus: (status: ConnectionStatus) => void;
  setSessionId: (id: string | null) => void;
  setError: (error: string | null) => void;
  setMyRole: (role: SessionRole | null) => void;
  setParticipants: (participants: Participant[]) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (id: string | undefined, displayName?: string) => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  setSessionStateReceived: (received: boolean) => void;
  reset: () => void;
}

const initialState = {
  status: 'disconnected' as ConnectionStatus,
  sessionId: null,
  error: null,
  participants: [],
  messages: [],
  myRole: null,
  sessionStateReceived: false,
};

export const useWebSocketStore = create<WebSocketState>(set => ({
  ...initialState,

  reset: () => set(initialState),
  setError: error => set({ error }),
  setMyRole: myRole => set({ myRole }),
  setStatus: status => set({ status }),
  clearMessages: () => set({ messages: [] }),
  setSessionId: sessionId => set({ sessionId }),
  setParticipants: participants => set({ participants }),
  setSessionStateReceived: sessionStateReceived => set({ sessionStateReceived }),

  addParticipant: participant => {
    return set(state => {
      // Check for existing participant to prevent duplicates
      const exists = state.participants.some(p =>
        // Match by userId if both have it (registered users)
        (participant.userId && p.userId && p.userId === participant.userId) ||
        // Match by displayName for guests (no userId)
        (!participant.userId && !p.userId && p.displayName === participant.displayName)
      );

      if (exists) {
        return state; // Don't add duplicate
      }

      return {
        participants: [...state.participants, participant],
      };
    });
  },

  removeParticipant: (id, displayName) => {
    return set(state => ({
      participants: state.participants.filter(p => {
        // Try to match by id/userId first
        if (id && (p.id === id || p.userId === id)) {
          return false; // Remove this participant
        }
        // Fall back to displayName match for guests
        if (!id && displayName && !p.userId && p.displayName === displayName) {
          return false; // Remove this participant
        }
        return true; // Keep this participant
      }),
    }));
  },
  
  addMessage: message => {
    return set(state => ({
      messages: [...state.messages, message],
    }));
  },
}));
