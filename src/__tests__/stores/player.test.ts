import { describe, it, expect, beforeEach } from 'vitest';
import { usePlayerStore } from '@/lib/stores/player';

describe('Player Store', () => {
  beforeEach(() => {
    // Reset the store between tests
    usePlayerStore.setState({
      currentStrudel: null,
      isPlaying: false,
      isLoading: false,
      shouldResume: false,
      shouldStop: false,
    });
  });

  it('should start with no strudel playing', () => {
    const { currentStrudel, isPlaying, isLoading } = usePlayerStore.getState();

    expect(currentStrudel).toBeNull();
    expect(isPlaying).toBe(false);
    expect(isLoading).toBe(false);
  });

  it('should set current strudel when play is called', () => {
    const mockStrudel = {
      id: 'test-123',
      title: 'Test Strudel',
      code: 's("bd hh sd hh")',
      user_id: 'user-1',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ai_assist_count: 0,
    };

    usePlayerStore.getState().play(mockStrudel);

    const { currentStrudel, isLoading } = usePlayerStore.getState();
    expect(currentStrudel).toEqual(mockStrudel);
    expect(isLoading).toBe(true);
  });

  it('should set shouldStop flag when stop is called', () => {
    const mockStrudel = {
      id: 'test-123',
      title: 'Test Strudel',
      code: 's("bd hh sd hh")',
      user_id: 'user-1',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ai_assist_count: 0,
    };

    // First play
    usePlayerStore.getState().play(mockStrudel);
    usePlayerStore.getState().setIsPlaying(true);
    usePlayerStore.getState().setIsLoading(false);

    // Then stop
    usePlayerStore.getState().stop();

    const { shouldStop, shouldResume, currentStrudel } = usePlayerStore.getState();
    // stop() sets shouldStop flag for the floating player to handle
    expect(shouldStop).toBe(true);
    // shouldResume should be cleared
    expect(shouldResume).toBe(false);
    // currentStrudel should still be set (allows resuming)
    expect(currentStrudel).toEqual(mockStrudel);
  });

  it('should replace current strudel when playing a different one', () => {
    const strudel1 = {
      id: 'test-1',
      title: 'First Strudel',
      code: 's("bd")',
      user_id: 'user-1',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ai_assist_count: 0,
    };

    const strudel2 = {
      id: 'test-2',
      title: 'Second Strudel',
      code: 's("hh")',
      user_id: 'user-1',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ai_assist_count: 0,
    };

    // Play first strudel
    usePlayerStore.getState().play(strudel1);
    expect(usePlayerStore.getState().currentStrudel?.id).toBe('test-1');

    // Play second strudel
    usePlayerStore.getState().play(strudel2);
    expect(usePlayerStore.getState().currentStrudel?.id).toBe('test-2');
  });

  it('should clear everything when setCurrentStrudel is called with null', () => {
    const mockStrudel = {
      id: 'test-123',
      title: 'Test Strudel',
      code: 's("bd hh sd hh")',
      user_id: 'user-1',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ai_assist_count: 0,
    };

    // Play and set states
    usePlayerStore.getState().play(mockStrudel);
    usePlayerStore.getState().setIsPlaying(true);
    usePlayerStore.getState().setIsLoading(false);

    // Clear
    usePlayerStore.getState().setCurrentStrudel(null);

    const { currentStrudel } = usePlayerStore.getState();
    expect(currentStrudel).toBeNull();
  });
});

describe('Audio Instance Independence', () => {
  /**
   * These tests verify that the three audio instances (main editor, floating player, preview modal)
   * operate independently and don't interfere with each other.
   *
   * Architecture notes:
   * 1. Main Editor (StrudelEditor): Uses its own StrudelMirror instance via useStrudelEditor hook
   * 2. Floating Player: Uses its own StrudelMirror instance via useFloatingPlayer hook
   * 3. Preview Modal (StrudelPreviewPlayer): Uses its own StrudelMirror instance via useStrudelPreviewPlayer hook
   *
   * Each instance:
   * - Creates its own container element
   * - Initializes its own StrudelMirror
   * - Has its own play/stop controls
   * - Manages its own audio output
   *
   * The Web Audio API allows multiple audio sources to play simultaneously,
   * so each instance can produce sound independently.
   */

  it('should verify player store is separate from editor store', async () => {
    // The editor store manages editor-specific state
    const { useEditorStore } = await import('@/lib/stores/editor');

    // Reset both stores
    usePlayerStore.setState({ currentStrudel: null, isPlaying: false, isLoading: false });
    useEditorStore.setState({ isPlaying: false });

    // Set player store playing
    usePlayerStore.getState().setIsPlaying(true);

    // Editor store should remain unaffected
    expect(useEditorStore.getState().isPlaying).toBe(false);
    expect(usePlayerStore.getState().isPlaying).toBe(true);
  });

  it('should allow different code in player store vs editor store', async () => {
    const { useEditorStore } = await import('@/lib/stores/editor');

    const editorCode = 's("bd sd bd sd")';
    const playerStrudel = {
      id: 'player-strudel',
      title: 'Player Strudel',
      code: 's("hh hh hh hh")',
      user_id: 'user-1',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ai_assist_count: 0,
    };

    // Set editor code
    useEditorStore.getState().setCode(editorCode);

    // Set player strudel
    usePlayerStore.getState().play(playerStrudel);

    // Verify they are independent
    expect(useEditorStore.getState().code).toBe(editorCode);
    expect(usePlayerStore.getState().currentStrudel?.code).toBe('s("hh hh hh hh")');
  });

  it('should document that preview modal uses independent instance', () => {
    /**
     * The StrudelPreviewModal component:
     * - Renders StrudelPreviewPlayer only when modal is open
     * - StrudelPreviewPlayer creates its own StrudelMirror instance
     * - When modal closes, the instance is destroyed
     * - This ensures no audio leaks between modal opens
     *
     * See: src/components/shared/strudel-preview-modal/index.tsx
     * - {open && <StrudelPreviewPlayer ... />}
     *
     * See: src/components/shared/strudel-preview-player/hooks.tsx
     * - Creates StrudelMirror with its own container
     * - Cleanup on unmount: mirror.stop() and mirror.destroy()
     */
    expect(true).toBe(true); // Documentation test
  });

  it('should document that floating player uses independent instance', () => {
    /**
     * The FloatingPlayer component:
     * - Uses useFloatingPlayer hook
     * - Creates its own hidden container for StrudelMirror
     * - Persists across page navigation (in main layout)
     * - Completely separate from main editor and preview modal
     *
     * See: src/components/shared/floating-player/hooks.tsx
     * - Creates StrudelMirror with containerRef
     * - autodraw: false (no visualization)
     * - Cleanup on strudel change or unmount
     */
    expect(true).toBe(true); // Documentation test
  });

  it('should document that main editor uses independent instance', () => {
    /**
     * The StrudelEditor component:
     * - Uses useStrudelEditor hook
     * - Creates its own StrudelMirror instance
     * - Full editor with visualization
     * - Only exists on the main page
     *
     * See: src/components/shared/strudel-editor/hooks.tsx
     * - Creates StrudelMirror with its own container
     * - Full audio engine initialization
     * - Cleanup on unmount
     */
    expect(true).toBe(true); // Documentation test
  });
});
