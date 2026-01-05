import { create } from 'zustand';
import { storage } from '@/lib/utils/storage';

// debounce draft saves to avoid excessive writes
let draftSaveTimeout: ReturnType<typeof setTimeout> | null = null;
const DRAFT_SAVE_DEBOUNCE_MS = 1000;

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
    const result = set({
      code,
      isDirty: !fromRemote && code !== state.lastSavedCode,
      ...(fromRemote ? { lastSyncedCode: code } : {}),
    });

    // save draft to localStorage on local code changes (backup for all users)
    if (!fromRemote) {
      // debounce draft saves
      if (draftSaveTimeout) {
        clearTimeout(draftSaveTimeout);
      }
      draftSaveTimeout = setTimeout(() => {
        const { currentDraftId, currentStrudelId, conversationHistory } = get();
        // use strudel ID as draft ID for saved strudels, otherwise generate/use draft ID
        const draftId = currentStrudelId || currentDraftId || storage.generateDraftId();

        if (!currentDraftId && !currentStrudelId) {
          // store the new draft ID
          storage.setCurrentDraftId(draftId);
          set({ currentDraftId: draftId });
        }

        storage.setDraft({
          id: draftId,
          code,
          conversationHistory,
          updatedAt: Date.now(),
        });
      }, DRAFT_SAVE_DEBOUNCE_MS);
    }

    return result;
  },

  addToHistory: (role, content) => {
    const result = set(state => ({
      conversationHistory: [...state.conversationHistory, { role, content }],
    }));

    // save draft to localStorage when conversation updates (backup for all users)
    const { currentDraftId, currentStrudelId, code, conversationHistory } = get();
    const draftId = currentStrudelId || currentDraftId;
    if (draftId) {
      storage.setDraft({
        id: draftId,
        code,
        conversationHistory,
        updatedAt: Date.now(),
      });
    }

    return result;
  },
}));
