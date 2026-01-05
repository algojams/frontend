import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage, Draft } from '@/lib/utils/storage';

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  describe('sessionId (sessionStorage)', () => {
    it('should store and retrieve session ID', () => {
      storage.setSessionId('test-session-123');
      expect(storage.getSessionId()).toBe('test-session-123');
    });

    it('should clear session ID', () => {
      storage.setSessionId('test-session-123');
      storage.clearSessionId();
      expect(storage.getSessionId()).toBeNull();
    });
  });

  describe('currentStrudelId (sessionStorage)', () => {
    it('should store and retrieve current strudel ID', () => {
      storage.setCurrentStrudelId('strudel-abc');
      expect(storage.getCurrentStrudelId()).toBe('strudel-abc');
    });

    it('should clear current strudel ID', () => {
      storage.setCurrentStrudelId('strudel-abc');
      storage.clearCurrentStrudelId();
      expect(storage.getCurrentStrudelId()).toBeNull();
    });
  });

  describe('currentDraftId (sessionStorage)', () => {
    it('should store and retrieve current draft ID', () => {
      storage.setCurrentDraftId('draft_123');
      expect(storage.getCurrentDraftId()).toBe('draft_123');
    });

    it('should clear current draft ID', () => {
      storage.setCurrentDraftId('draft_123');
      storage.clearCurrentDraftId();
      expect(storage.getCurrentDraftId()).toBeNull();
    });
  });

  describe('drafts (localStorage)', () => {
    const mockDraft: Draft = {
      id: 'draft_123',
      code: 's("bd").fast(2)',
      conversationHistory: [{ role: 'user', content: 'make it faster' }],
      updatedAt: Date.now(),
    };

    it('should store and retrieve a draft', () => {
      storage.setDraft(mockDraft);
      const retrieved = storage.getDraft('draft_123');
      expect(retrieved).toEqual(mockDraft);
    });

    it('should return null for non-existent draft', () => {
      expect(storage.getDraft('non-existent')).toBeNull();
    });

    it('should delete a draft', () => {
      storage.setDraft(mockDraft);
      storage.deleteDraft('draft_123');
      expect(storage.getDraft('draft_123')).toBeNull();
    });

    it('should get all drafts sorted by updatedAt descending', () => {
      const oldDraft: Draft = {
        id: 'draft_old',
        code: 'old code',
        conversationHistory: [],
        updatedAt: Date.now() - 10000,
      };
      
      const newDraft: Draft = {
        id: 'draft_new',
        code: 'new code',
        conversationHistory: [],
        updatedAt: Date.now(),
      };

      storage.setDraft(oldDraft);
      storage.setDraft(newDraft);

      const allDrafts = storage.getAllDrafts();
      expect(allDrafts).toHaveLength(2);
      expect(allDrafts[0].id).toBe('draft_new');
      expect(allDrafts[1].id).toBe('draft_old');
    });

    it('should generate unique draft IDs', () => {
      const id1 = storage.generateDraftId();
      const id2 = storage.generateDraftId();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^draft_\d+_[a-z0-9]+$/);
    });

    it('should get latest draft', () => {
      const oldDraft: Draft = {
        id: 'draft_old',
        code: 'old code',
        conversationHistory: [],
        updatedAt: Date.now() - 10000,
      };
      const newDraft: Draft = {
        id: 'draft_new',
        code: 'new code',
        conversationHistory: [],
        updatedAt: Date.now(),
      };

      storage.setDraft(oldDraft);
      storage.setDraft(newDraft);

      const latest = storage.getLatestDraft();
      expect(latest?.id).toBe('draft_new');
    });

    it('should return null for latest draft when no drafts exist', () => {
      expect(storage.getLatestDraft()).toBeNull();
    });
  });

  describe('viewerSession (sessionStorage)', () => {
    it('should store and retrieve viewer session', () => {
      storage.setViewerSession('session-123', 'invite-token', 'Guest User');
      const session = storage.getViewerSession();
      expect(session).toEqual({
        sessionId: 'session-123',
        inviteToken: 'invite-token',
        displayName: 'Guest User',
      });
    });

    it('should clear viewer session', () => {
      storage.setViewerSession('session-123', 'invite-token');
      storage.clearViewerSession();
      expect(storage.getViewerSession()).toBeNull();
    });
  });

  describe('previousSessionId (sessionStorage)', () => {
    it('should store and retrieve previous session ID', () => {
      storage.setPreviousSessionId('prev-session-123');
      expect(storage.getPreviousSessionId()).toBe('prev-session-123');
    });

    it('should clear previous session ID', () => {
      storage.setPreviousSessionId('prev-session-123');
      storage.clearPreviousSessionId();
      expect(storage.getPreviousSessionId()).toBeNull();
    });
  });
});
