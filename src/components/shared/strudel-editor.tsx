'use client';

import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/lib/stores/editor';
import { useAudioStore } from '@/lib/stores/audio';
import { EDITOR } from '@/lib/constants';

interface StrudelEditorProps {
  initialCode?: string;
  readOnly?: boolean;
  onCodeChange?: (code: string) => void;
}

let strudelMirrorInstance: {
  code?: string;
  setCode: (code: string) => void;
  evaluate: () => Promise<void>;
  stop: () => void;
  destroy?: () => void;
} | null = null;

let codePollingInterval: ReturnType<typeof setInterval> | null = null;

export function StrudelEditor({
  initialCode = '',
  readOnly = false,
  onCodeChange,
}: StrudelEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  const { code, setCode } = useEditorStore();
  const { setPlaying, setInitialized, setError } = useAudioStore();

  const onCodeChangeRef = useRef(onCodeChange);
  useEffect(() => {
    onCodeChangeRef.current = onCodeChange;
  }, [onCodeChange]);

  // initialize strudelMirror
  useEffect(() => {
    if (!containerRef.current || initializedRef.current) return;
    initializedRef.current = true;

    // track if this effect is still valid (for StrictMode and cleanup)
    let isMounted = true;

    async function initEditor() {
      try {
        const [
          { StrudelMirror },
          { transpiler },
          webaudioModule,
          { registerSoundfonts },
          coreModule,
        ] = await Promise.all([
          import('@strudel/codemirror'),
          import('@strudel/transpiler'),
          import('@strudel/webaudio'),
          import('@strudel/soundfonts'),
          import('@strudel/core'),
        ]);

        const {
          getAudioContext,
          webaudioOutput,
          initAudioOnFirstClick,
          registerSynthSounds,
          samples,
        } = webaudioModule;
        const { evalScope, silence } = coreModule;

        if (!containerRef.current || !isMounted) return;

        // clear any leftover content from previous instance
        containerRef.current.innerHTML = '';

        // create strudelMirror instance
        const mirror = new StrudelMirror({
          defaultOutput: webaudioOutput,
          getTime: () => getAudioContext().currentTime,
          transpiler,
          root: containerRef.current,
          initialCode: initialCode || code || EDITOR.DEFAULT_CODE,
          pattern: silence,
          drawTime: [-2, 2],
          autodraw: true,
          bgFill: false,
          prebake: async () => {
            // initialize audio on first user interaction
            initAudioOnFirstClick(() => {
              getAudioContext();
            });

            // register all modules in eval scope
            await evalScope(
              import('@strudel/core'),
              import('@strudel/mini'),
              import('@strudel/tonal'),
              import('@strudel/webaudio'),
              import('@strudel/draw')
            );

            // register sounds
            await registerSynthSounds();
            await registerSoundfonts();

            // load samples
            await samples('github:tidalcycles/Dirt-Samples', undefined, { tag: 'main' });
          },
          onToggle: (started: boolean) => {
            setPlaying(started);
            if (started) {
              setError(null);
            }
          },
          onError: (error: Error) => {
            console.error('Strudel error:', error);
            setError(error.message);
          },
        });

        // configure editor appearance
        if (mirror.setFontFamily)
          mirror.setFontFamily('var(--font-geist-mono), monospace');
        if (mirror.setFontSize) mirror.setFontSize(14);
        if (mirror.setLineNumbers) mirror.setLineNumbers(true);
        if (mirror.setLineWrapping) mirror.setLineWrapping(true);

        // enable pattern highlighting and flash effects
        if (mirror.reconfigureExtension) {
          mirror.reconfigureExtension('isPatternHighlightingEnabled', true);
          mirror.reconfigureExtension('isFlashEnabled', true);
        }

        // check if still mounted before modifying module-level state
        if (!isMounted) {
          mirror.stop();
          if (typeof mirror.destroy === 'function') {
            mirror.destroy();
          }
          return;
        }

        strudelMirrorInstance = mirror;
        setInitialized(true);

        // set initial code in store
        if (initialCode) {
          setCode(initialCode, true);
        }

        // sync with current store code (may have changed during async init)
        const currentStoreCode = useEditorStore.getState().code;
        if (currentStoreCode && currentStoreCode !== strudelMirrorInstance?.code) {
          strudelMirrorInstance.setCode(currentStoreCode);
          strudelMirrorInstance.code = currentStoreCode;
        }

        // listen for code changes via polling (strudelMirror doesn't have onChange)
        codePollingInterval = setInterval(() => {
          if (strudelMirrorInstance) {
            const currentCode = strudelMirrorInstance.code || '';
            const storeCode = useEditorStore.getState().code;
            if (currentCode !== storeCode) {
              setCode(currentCode);
              onCodeChangeRef.current?.(currentCode);
            }
          }
        }, 500);
      } catch (error) {
        console.error('Failed to initialize Strudel:', error);
        setError('Failed to initialize audio engine');
      }
    }

    initEditor();

    return () => {
      isMounted = false;
      initializedRef.current = false; // reset so next mount can initialize

      if (codePollingInterval) {
        clearInterval(codePollingInterval);
        codePollingInterval = null;
      }
      if (strudelMirrorInstance) {
        strudelMirrorInstance.stop();

        if (typeof strudelMirrorInstance.destroy === 'function') {
          strudelMirrorInstance.destroy();
        }

        strudelMirrorInstance = null;
      }
    };
  }, []);

  // sync external code changes (from WebSocket)
  useEffect(() => {
    if (!strudelMirrorInstance) return;

    const currentCode = strudelMirrorInstance.code || '';
    if (currentCode !== code && code !== undefined) {
      strudelMirrorInstance.setCode(code);
      strudelMirrorInstance.code = code;
    }
  }, [code]);

  return (
    <div
      ref={containerRef}
      className="strudel-editor h-full w-full overflow-hidden border-t rounded-none"
    />
  );
}

export function evaluateStrudel() {
  if (strudelMirrorInstance) {
    strudelMirrorInstance.evaluate();
  }
}

export function stopStrudel() {
  if (strudelMirrorInstance) {
    strudelMirrorInstance.stop();
  }
}
