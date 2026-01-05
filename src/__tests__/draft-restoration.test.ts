import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { storage, Draft } from '@/lib/utils/storage';
import { useEditorStore } from '@/lib/stores/editor';
import { useAuthStore } from '@/lib/stores/auth';

// mock constants
vi.mock('@/lib/constants', () => ({
  STORAGE_KEYS: {
    SESSION_ID: 'algorave_session_id',
    REDIRECT_AFTER_LOGIN: 'algorave_redirect',
  },
  WS_BASE_URL: 'ws://localhost:8000',
  WEBSOCKET: {
    PING_INTERVAL_MS: 30000,
    RECONNECT_DELAY_MS: 1000,
    RECONNECT_MAX_ATTEMPTS: 5,
    CONNECTION_TIMEOUT_MS: 10000,
  },
  EDITOR: {
    DEFAULT_CODE: '// default code',
  },
}));

describe('Draft Restoration Logic', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
    // reset zustand stores
    useEditorStore.getState().reset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('local storage draft operations', () => {
    it('should save and retrieve draft correctly', () => {
      const draft: Draft = {
        id: 'test-draft-1',
        code: 's("bd").fast(2)',
        conversationHistory: [{ role: 'user', content: 'test' }],
        updatedAt: Date.now(),
      };

      storage.setDraft(draft);
      expect(storage.getDraft('test-draft-1')).toEqual(draft);
    });

    it('should get latest draft from multiple drafts', () => {
      const oldDraft: Draft = {
        id: 'old-draft',
        code: 'old code',
        conversationHistory: [],
        updatedAt: Date.now() - 10000,
      };

      const newDraft: Draft = {
        id: 'new-draft',
        code: 'new code',
        conversationHistory: [],
        updatedAt: Date.now(),
      };

      storage.setDraft(oldDraft);
      storage.setDraft(newDraft);

      const latest = storage.getLatestDraft();
      expect(latest?.id).toBe('new-draft');
    });
  });

  describe('anonymous user draft restoration', () => {
    beforeEach(() => {
      // Clear auth token to simulate anonymous user
      useAuthStore.getState().clearAuth();
    });

    it('should restore latest draft for anonymous user in new tab', () => {
      // simulate existing draft in localStorage (from previous session)
      const existingDraft: Draft = {
        id: 'anon-draft-1',
        code: 's("hh").fast(4)',
        conversationHistory: [{ role: 'user', content: 'add hi-hat' }],
        updatedAt: Date.now(),
      };
      storage.setDraft(existingDraft);

      // verify the draft can be retrieved
      const latestDraft = storage.getLatestDraft();
      expect(latestDraft).not.toBeNull();
      expect(latestDraft?.code).toBe('s("hh").fast(4)');
    });

    it('should restore same draft on page refresh', () => {
      // setup: anonymous user has a draft in localStorage and draftId in sessionStorage
      const draftId = 'anon-refresh-draft';
      const draft: Draft = {
        id: draftId,
        code: 's("cp")',
        conversationHistory: [],
        updatedAt: Date.now(),
      };
      storage.setDraft(draft);
      storage.setCurrentDraftId(draftId);

      // verify current draft ID is preserved in sessionStorage
      expect(storage.getCurrentDraftId()).toBe(draftId);
      expect(storage.getDraft(draftId)).toEqual(draft);
    });

    it('should preserve forked draft on refresh', () => {
      // simulate fork: new draftId, forked code
      const forkDraftId = storage.generateDraftId();
      const forkedDraft: Draft = {
        id: forkDraftId,
        code: 's("bd", "sd").fast(2)', // forked and modified
        conversationHistory: [],
        updatedAt: Date.now(),
        title: 'Fork of Original',
      };
      storage.setDraft(forkedDraft);
      storage.setCurrentDraftId(forkDraftId);

      // simulate refresh - sessionStorage persists
      expect(storage.getCurrentDraftId()).toBe(forkDraftId);
      const retrieved = storage.getDraft(forkDraftId);
      expect(retrieved?.code).toBe('s("bd", "sd").fast(2)');
      expect(retrieved?.title).toBe('Fork of Original');
    });

    it('should restore forked draft in new tab (via latest draft)', () => {
      // simulate fork with localStorage only (new tab won't have sessionStorage)
      const forkDraftId = storage.generateDraftId();
      const forkedDraft: Draft = {
        id: forkDraftId,
        code: 's("bd", "sd").fast(2)',
        conversationHistory: [],
        updatedAt: Date.now(),
        title: 'Fork of Original',
      };
      storage.setDraft(forkedDraft);
      // no sessionStorage draftId (new tab)

      // new tab should get latest draft
      const latestDraft = storage.getLatestDraft();
      expect(latestDraft?.id).toBe(forkDraftId);
      expect(latestDraft?.code).toBe('s("bd", "sd").fast(2)');
    });
  });

  describe('Authenticated User Draft Restoration', () => {
    beforeEach(() => {
      // simulate authenticated user
      useAuthStore
        .getState()
        .setAuth(
          {
            id: 'user-1',
            name: 'testuser',
            email: 'testuser@example.com',
            provider: 'google',
            ai_features_enabled: true,
            training_consent: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          'test-token'
        );
    });

    it('should restore latest draft for auth user in new tab (no strudel)', () => {
      // auth user has a draft from previous session
      const draft: Draft = {
        id: 'auth-draft-1',
        code: 's("bd").slow(2)',
        conversationHistory: [],
        updatedAt: Date.now(),
      };
      storage.setDraft(draft);
      // no strudelId, no draftId (new tab)

      const latestDraft = storage.getLatestDraft();
      expect(latestDraft).not.toBeNull();
      expect(latestDraft?.code).toBe('s("bd").slow(2)');
    });

    it('should restore same draft on refresh (editing unsaved work)', () => {
      // setup: auth user editing a draft
      const draftId = 'auth-refresh-draft';
      const draft: Draft = {
        id: draftId,
        code: 's("cp").rev()',
        conversationHistory: [],
        updatedAt: Date.now(),
      };
      storage.setDraft(draft);
      storage.setCurrentDraftId(draftId);

      // after refresh, should restore same draft
      expect(storage.getCurrentDraftId()).toBe(draftId);
      expect(storage.getDraft(draftId)?.code).toBe('s("cp").rev()');
    });

    it('should store strudel as backup in localStorage', () => {
      // when auth user loads a saved strudel, it gets backed up to localStorage
      const strudelId = 'strudel-abc-123';
      const strudelCode = 's("bd", "sd", "hh*2", "cp")';

      // simulate strudel being saved as backup
      storage.setDraft({
        id: strudelId,
        code: strudelCode,
        conversationHistory: [],
        updatedAt: Date.now(),
      });

      // verify backup exists
      const backup = storage.getDraft(strudelId);
      expect(backup).not.toBeNull();
      expect(backup?.code).toBe(strudelCode);
    });

    it('should keep draft separate from strudel backup', () => {
      // auth user has both a saved strudel backup and an unsaved draft
      const strudelId = 'strudel-backup';
      const draftId = 'unsaved-draft';

      storage.setDraft({
        id: strudelId,
        code: 'strudel code',
        conversationHistory: [],
        updatedAt: Date.now() - 5000,
      });

      storage.setDraft({
        id: draftId,
        code: 'draft code',
        conversationHistory: [],
        updatedAt: Date.now(),
      });

      storage.setCurrentDraftId(draftId);

      // current draft should be the unsaved draft
      expect(storage.getCurrentDraftId()).toBe(draftId);
      expect(storage.getDraft(draftId)?.code).toBe('draft code');

      // latest draft should be the most recent
      const latest = storage.getLatestDraft();
      expect(latest?.id).toBe(draftId);
    });

    it('should restore forked draft on refresh (auth user)', () => {
      const forkDraftId = storage.generateDraftId();
      storage.setDraft({
        id: forkDraftId,
        code: 'forked and modified',
        conversationHistory: [],
        updatedAt: Date.now(),
        title: 'Fork of Something',
      });
      storage.setCurrentDraftId(forkDraftId);

      // after refresh
      expect(storage.getCurrentDraftId()).toBe(forkDraftId);
      expect(storage.getDraft(forkDraftId)?.code).toBe('forked and modified');
    });

    it('should restore forked draft in new tab (auth user)', () => {
      const forkDraftId = storage.generateDraftId();
      storage.setDraft({
        id: forkDraftId,
        code: 'forked and modified',
        conversationHistory: [],
        updatedAt: Date.now(),
        title: 'Fork of Something',
      });
      // no sessionStorage draftId (new tab)

      // should get via latest draft
      const latest = storage.getLatestDraft();
      expect(latest?.id).toBe(forkDraftId);
    });
  });

  describe('editor store draft saving', () => {
    it('should track dirty state when code changes locally', () => {
      const { setCode, markSaved } = useEditorStore.getState();

      // initially not dirty
      expect(useEditorStore.getState().isDirty).toBe(false);

      // local code change should mark dirty
      setCode('new code', false);
      expect(useEditorStore.getState().isDirty).toBe(true);

      // marking saved should clear dirty
      markSaved();
      expect(useEditorStore.getState().isDirty).toBe(false);
    });

    it('should not mark dirty for remote code changes', () => {
      const { setCode } = useEditorStore.getState();

      // remote code change (fromRemote = true) should not mark dirty
      setCode('remote code', true);
      expect(useEditorStore.getState().isDirty).toBe(false);
    });

    it('should track current strudel ID', () => {
      const { setCurrentStrudel, currentStrudelId } = useEditorStore.getState();

      expect(currentStrudelId).toBeNull();

      setCurrentStrudel('strudel-123', 'Test Strudel');
      expect(useEditorStore.getState().currentStrudelId).toBe('strudel-123');
      expect(useEditorStore.getState().currentStrudelTitle).toBe('Test Strudel');

      // also persists to sessionStorage
      expect(storage.getCurrentStrudelId()).toBe('strudel-123');
    });

    it('should clear strudel ID', () => {
      const { setCurrentStrudel } = useEditorStore.getState();

      setCurrentStrudel('strudel-123', 'Test');
      setCurrentStrudel(null, null);

      expect(useEditorStore.getState().currentStrudelId).toBeNull();
      expect(storage.getCurrentStrudelId()).toBeNull();
    });

    it('should track current draft ID', () => {
      const { setCurrentDraftId } = useEditorStore.getState();

      setCurrentDraftId('draft-xyz');
      expect(useEditorStore.getState().currentDraftId).toBe('draft-xyz');
      expect(storage.getCurrentDraftId()).toBe('draft-xyz');

      setCurrentDraftId(null);
      expect(useEditorStore.getState().currentDraftId).toBeNull();
      expect(storage.getCurrentDraftId()).toBeNull();
    });

    it('should track conversation history', () => {
      const { addToHistory, conversationHistory, clearHistory } =
        useEditorStore.getState();

      expect(conversationHistory).toEqual([]);

      addToHistory('user', 'make it faster');
      expect(useEditorStore.getState().conversationHistory).toEqual([
        { role: 'user', content: 'make it faster' },
      ]);

      addToHistory('assistant', 's("bd").fast(2)');
      expect(useEditorStore.getState().conversationHistory).toHaveLength(2);

      clearHistory();
      expect(useEditorStore.getState().conversationHistory).toEqual([]);
    });

    it('should reset all state', () => {
      const { setCode, setCurrentStrudel, setCurrentDraftId, addToHistory, reset } =
        useEditorStore.getState();

      // set up some state
      setCode('test code', false);
      setCurrentStrudel('strudel-1', 'Test');
      setCurrentDraftId('draft-1');
      addToHistory('user', 'test');

      // reset should clear everything
      reset();
      const state = useEditorStore.getState();
      expect(state.code).toBe('');
      expect(state.isDirty).toBe(false);
      expect(state.currentStrudelId).toBeNull();
      expect(state.currentDraftId).toBeNull();
      expect(state.conversationHistory).toEqual([]);
    });
  });

  describe('sessionStorage vs localStorage behavior', () => {
    it('sessionStorage should be tab-specific (simulated)', () => {
      // this simulates what happens with different tabs
      // in real browser, sessionStorage is per-tab

      storage.setCurrentDraftId('tab1-draft');
      expect(storage.getCurrentDraftId()).toBe('tab1-draft');

      // clearing simulates a new tab (new sessionStorage context)
      sessionStorage.clear();
      expect(storage.getCurrentDraftId()).toBeNull();

      // but localStorage persists
      storage.setDraft({
        id: 'shared-draft',
        code: 'shared code',
        conversationHistory: [],
        updatedAt: Date.now(),
      });

      sessionStorage.clear();
      expect(storage.getDraft('shared-draft')).not.toBeNull();
    });

    it('localStorage should be shared across tabs', () => {
      // draft saved in one "tab"
      storage.setDraft({
        id: 'cross-tab-draft',
        code: 'cross tab code',
        conversationHistory: [],
        updatedAt: Date.now(),
      });

      // clear sessionStorage to simulate new tab
      sessionStorage.clear();

      // localStorage draft should still be accessible
      expect(storage.getDraft('cross-tab-draft')?.code).toBe('cross tab code');
      expect(storage.getLatestDraft()?.id).toBe('cross-tab-draft');
    });
  });

  describe('draft ID generation', () => {
    it('should generate unique draft IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(storage.generateDraftId());
      }
      expect(ids.size).toBe(100);
    });

    it('should generate IDs with correct format', () => {
      const id = storage.generateDraftId();
      expect(id).toMatch(/^draft_\d+_[a-z0-9]+$/);
    });
  });

  /**
   * these tests verify the session_state handler decision logic.
   * the actual logic is in client.ts but we test the conditions here.
   *
   * decision matrix:
   * - anonymous user: ALWAYS restore from localStorage draft (server code ignored)
   * - auth user without strudelId: restore from localStorage draft (server code ignored)
   * - auth user with strudelId: use server code (localStorage is just backup)
   */
  describe('session_state conflict resolution (server vs localStorage)', () => {
    // helper to simulate the decision logic from client.ts
    function shouldRestoreFromDraft(params: {
      hasToken: boolean;
      currentStrudelId: string | null;
      latestDraft: Draft | null;
      currentDraft: Draft | null;
      initialLoadComplete: boolean;
    }): boolean {
      const { hasToken, currentStrudelId, latestDraft, currentDraft, initialLoadComplete } = params;

      const isAnonymousWithDraft = !hasToken && latestDraft !== null;
      const isAuthWithUnsavedDraft =
        hasToken && !currentStrudelId && (currentDraft !== null || latestDraft !== null);

      return !initialLoadComplete && (isAnonymousWithDraft || isAuthWithUnsavedDraft);
    }

    // helper to pick the right draft (matches client.ts logic)
    function pickDraftToRestore(params: {
      hasToken: boolean;
      latestDraft: Draft | null;
      currentDraft: Draft | null;
    }): Draft | null {
      const { hasToken, latestDraft, currentDraft } = params;
      const isAnonymousWithDraft = !hasToken && latestDraft !== null;
      return isAnonymousWithDraft ? latestDraft : currentDraft || latestDraft;
    }

    describe('anonymous user scenarios', () => {
      it('should prefer localStorage draft over server code on initial load', () => {
        const localDraft: Draft = {
          id: 'local-draft',
          code: 's("bd").fast(4)', // user's local work
          conversationHistory: [],
          updatedAt: Date.now(),
        };

        const result = shouldRestoreFromDraft({
          hasToken: false,
          currentStrudelId: null,
          latestDraft: localDraft,
          currentDraft: null,
          initialLoadComplete: false,
        });

        expect(result).toBe(true);
        expect(pickDraftToRestore({
          hasToken: false,
          latestDraft: localDraft,
          currentDraft: null,
        })).toEqual(localDraft);
      });

      it('should use server code when no localStorage draft exists', () => {
        const result = shouldRestoreFromDraft({
          hasToken: false,
          currentStrudelId: null,
          latestDraft: null,
          currentDraft: null,
          initialLoadComplete: false,
        });

        expect(result).toBe(false); // no draft to restore, use server code
      });

      it('should not restore draft on reconnect (initialLoadComplete=true)', () => {
        const localDraft: Draft = {
          id: 'local-draft',
          code: 's("bd").fast(4)',
          conversationHistory: [],
          updatedAt: Date.now(),
        };

        const result = shouldRestoreFromDraft({
          hasToken: false,
          currentStrudelId: null,
          latestDraft: localDraft,
          currentDraft: null,
          initialLoadComplete: true, // already loaded, this is a reconnect
        });

        expect(result).toBe(false); // don't override on reconnect
      });
    });

    describe('authenticated user scenarios (no saved strudel)', () => {
      it('should prefer localStorage draft over server code for unsaved work', () => {
        const localDraft: Draft = {
          id: 'auth-draft',
          code: 's("hh*4")', // user's local unsaved work
          conversationHistory: [{ role: 'user', content: 'add hats' }],
          updatedAt: Date.now(),
        };

        const result = shouldRestoreFromDraft({
          hasToken: true,
          currentStrudelId: null, // no saved strudel being edited
          latestDraft: localDraft,
          currentDraft: localDraft,
          initialLoadComplete: false,
        });

        expect(result).toBe(true);
      });

      it('should prefer currentDraft over latestDraft for same-tab refresh', () => {
        const currentDraft: Draft = {
          id: 'current-tab-draft',
          code: 's("cp").slow(2)',
          conversationHistory: [],
          updatedAt: Date.now() - 1000, // slightly older
        };

        const latestDraft: Draft = {
          id: 'other-tab-draft',
          code: 's("bd")',
          conversationHistory: [],
          updatedAt: Date.now(), // newer but from another tab
        };

        const picked = pickDraftToRestore({
          hasToken: true,
          latestDraft,
          currentDraft,
        });

        // should prefer currentDraft (same tab) over latestDraft
        expect(picked).toEqual(currentDraft);
      });

      it('should fallback to latestDraft in new tab (no currentDraft)', () => {
        const latestDraft: Draft = {
          id: 'latest-draft',
          code: 's("bd")',
          conversationHistory: [],
          updatedAt: Date.now(),
        };

        const picked = pickDraftToRestore({
          hasToken: true,
          latestDraft,
          currentDraft: null, // new tab, no sessionStorage
        });

        expect(picked).toEqual(latestDraft);
      });
    });

    describe('authenticated user scenarios (editing saved strudel)', () => {
      it('should use server code when editing a saved strudel', () => {
        const localDraft: Draft = {
          id: 'strudel-123', // backup of the strudel
          code: 's("bd").fast(2)', // local backup
          conversationHistory: [],
          updatedAt: Date.now(),
        };

        const result = shouldRestoreFromDraft({
          hasToken: true,
          currentStrudelId: 'strudel-123', // editing a saved strudel
          latestDraft: localDraft,
          currentDraft: localDraft,
          initialLoadComplete: false,
        });

        expect(result).toBe(false); // server code wins for saved strudels
      });

      it('should still backup server code to localStorage for safety', () => {
        // This tests that even though we use server code,
        // we still save it to localStorage as a backup
        const strudelId = 'strudel-abc';
        const serverCode = 's("bd", "sd", "hh*2")';

        // Simulate backing up server code
        storage.setDraft({
          id: strudelId,
          code: serverCode,
          conversationHistory: [],
          updatedAt: Date.now(),
        });

        const backup = storage.getDraft(strudelId);
        expect(backup?.code).toBe(serverCode);
      });
    });

    describe('conflict scenarios with different code', () => {
      it('anonymous: localStorage code should win over different server code', () => {
        const serverCode = 's("bd")'; // server has this
        const localCode = 's("bd").fast(8).rev()'; // user modified locally

        const localDraft: Draft = {
          id: 'anon-draft',
          code: localCode,
          conversationHistory: [],
          updatedAt: Date.now(),
        };

        storage.setDraft(localDraft);

        // Verify decision logic
        const shouldRestore = shouldRestoreFromDraft({
          hasToken: false,
          currentStrudelId: null,
          latestDraft: localDraft,
          currentDraft: null,
          initialLoadComplete: false,
        });

        expect(shouldRestore).toBe(true);

        // localStorage code should be what gets used
        const draftToUse = pickDraftToRestore({
          hasToken: false,
          latestDraft: localDraft,
          currentDraft: null,
        });
        expect(draftToUse?.code).toBe(localCode);
        expect(draftToUse?.code).not.toBe(serverCode);
      });

      it('auth (unsaved): localStorage code should win over different server code', () => {
        // server would send: 's("hh")'
        const localCode = 's("hh*4").gain(0.5)';

        const localDraft: Draft = {
          id: 'auth-unsaved-draft',
          code: localCode,
          conversationHistory: [],
          updatedAt: Date.now(),
        };

        storage.setDraft(localDraft);
        storage.setCurrentDraftId('auth-unsaved-draft');

        const shouldRestore = shouldRestoreFromDraft({
          hasToken: true,
          currentStrudelId: null, // not editing a saved strudel
          latestDraft: localDraft,
          currentDraft: localDraft,
          initialLoadComplete: false,
        });

        expect(shouldRestore).toBe(true);

        const draftToUse = pickDraftToRestore({
          hasToken: true,
          latestDraft: localDraft,
          currentDraft: localDraft,
        });
        expect(draftToUse?.code).toBe(localCode);
      });

      it('auth (saved strudel): server code should win, local is just backup', () => {
        // server would send: 's("bd", "sd")' - authoritative version
        const localBackupCode = 's("bd", "sd").fast(2)'; // outdated local backup

        const localBackup: Draft = {
          id: 'my-strudel-id',
          code: localBackupCode,
          conversationHistory: [],
          updatedAt: Date.now() - 60000, // older
        };

        storage.setDraft(localBackup);

        const shouldRestore = shouldRestoreFromDraft({
          hasToken: true,
          currentStrudelId: 'my-strudel-id', // editing this saved strudel
          latestDraft: localBackup,
          currentDraft: localBackup,
          initialLoadComplete: false,
        });

        // Should NOT restore from draft - server is authoritative for saved strudels
        expect(shouldRestore).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('should handle empty code in localStorage draft', () => {
        const emptyDraft: Draft = {
          id: 'empty-draft',
          code: '', // user cleared the code
          conversationHistory: [],
          updatedAt: Date.now(),
        };

        storage.setDraft(emptyDraft);

        // Empty code is still valid - user might have intentionally cleared it
        const shouldRestore = shouldRestoreFromDraft({
          hasToken: false,
          currentStrudelId: null,
          latestDraft: emptyDraft,
          currentDraft: null,
          initialLoadComplete: false,
        });

        expect(shouldRestore).toBe(true);
      });

      it('should handle conversation history in draft', () => {
        const draftWithHistory: Draft = {
          id: 'draft-with-chat',
          code: 's("bd")',
          conversationHistory: [
            { role: 'user', content: 'make it faster' },
            { role: 'assistant', content: 's("bd").fast(2)' },
          ],
          updatedAt: Date.now(),
        };

        storage.setDraft(draftWithHistory);

        const retrieved = storage.getDraft('draft-with-chat');
        expect(retrieved?.conversationHistory).toHaveLength(2);
        expect(retrieved?.conversationHistory[0].role).toBe('user');
      });

      it('should prefer more recent draft when multiple exist', () => {
        const oldDraft: Draft = {
          id: 'old-work',
          code: 's("bd")',
          conversationHistory: [],
          updatedAt: Date.now() - 100000,
        };

        const recentDraft: Draft = {
          id: 'recent-work',
          code: 's("bd", "sd", "hh")',
          conversationHistory: [],
          updatedAt: Date.now(),
        };

        storage.setDraft(oldDraft);
        storage.setDraft(recentDraft);

        const latest = storage.getLatestDraft();
        expect(latest?.id).toBe('recent-work');
        expect(latest?.code).toBe('s("bd", "sd", "hh")');
      });
    });
  });
});
