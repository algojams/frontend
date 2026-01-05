import { create } from 'zustand';
import { storage } from '@/lib/utils/storage';

interface EditorState {
  code: string;
  cursorLine: number;
  cursorCol: number;
  isDirty: boolean;
  lastSyncedCode: string;
  lastSavedCode: string;
  isAIGenerating: boolean;
  conversationHistory: Array<{ role: string; content: string }>;
  currentStrudelId: string | null;
  currentStrudelTitle: string | null;
  currentDraftId: string | null;

  setCode: (code: string, fromRemote?: boolean) => void;
  setCursor: (line: number, col: number) => void;
  setAIGenerating: (generating: boolean) => void;
  markSynced: () => void;
  markSaved: () => void;
  setCurrentStrudel: (id: string | null, title: string | null) => void;
  setCurrentDraftId: (id: string | null) => void;
  addToHistory: (role: string, content: string) => void;
  setConversationHistory: (history: Array<{ role: string; content: string }>) => void;
  clearHistory: () => void;
  reset: () => void;
}

const initialState = {
  code: '',
  cursorLine: 1,
  cursorCol: 0,
  isDirty: false,
  lastSyncedCode: '',
  lastSavedCode: '',
  isAIGenerating: false,
  conversationHistory: [] as Array<{ role: string; content: string }>,
  currentStrudelId: null as string | null,
  currentStrudelTitle: null as string | null,
  currentDraftId: null as string | null,
};

export const useEditorStore = create<EditorState>((set, get) => ({
  ...initialState,

  reset: () => set(initialState),
  clearHistory: () => set({ conversationHistory: [] }),
  setConversationHistory: conversationHistory => set({ conversationHistory }),
  setAIGenerating: isAIGenerating => set({ isAIGenerating }),
  setCursor: (cursorLine, cursorCol) => set({ cursorLine, cursorCol }),

  markSynced: () => {
    return set(state => ({ lastSyncedCode: state.code }));
  },

  markSaved: () => {
    return set(state => ({ lastSavedCode: state.code, isDirty: false }));
  },

  setCurrentStrudel: (currentStrudelId, currentStrudelTitle) => {
    // persist to localStorage for navigation/refresh recovery
    if (currentStrudelId) {
      storage.setCurrentStrudelId(currentStrudelId);
    } else {
      storage.clearCurrentStrudelId();
    }

    return set({ currentStrudelId, currentStrudelTitle });
  },

  setCurrentDraftId: (currentDraftId) => {
    // persist to localStorage for navigation/refresh recovery
    if (currentDraftId) {
      storage.setCurrentDraftId(currentDraftId);
    } else {
      storage.clearCurrentDraftId();
    }

    return set({ currentDraftId });
  },

  setCode: (code, fromRemote = false) => {
    const state = get();
    return set({
      code,
      isDirty: !fromRemote && code !== state.lastSavedCode,
      ...(fromRemote ? { lastSyncedCode: code } : {}),
    });
  },

  addToHistory: (role, content) => {
    return set(state => ({
      conversationHistory: [...state.conversationHistory, { role, content }],
    }));
  },
}));
