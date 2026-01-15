'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePlayerStore } from '@/lib/stores/player';
import { EDITOR } from '@/lib/constants';
import {
  SAMPLE_SOURCES,
  INSTRUMENT_SHORTCUTS,
  DRUM_MACHINE_ALIASES,
  DRUM_HIT_TYPES,
  SUPPRESSED_ERROR_PATTERNS,
} from '@/components/shared/strudel-editor/hooks';

export function useFloatingPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<InstanceType<typeof import('@strudel/codemirror').StrudelMirror> | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    currentStrudel,
    isPlaying,
    isLoading,
    shouldResume,
    shouldStop,
    setIsPlaying,
    setIsLoading,
    setCurrentStrudel,
    setShouldResume,
    setShouldStop,
  } = usePlayerStore();

  // initialize the player when a strudel is selected
  useEffect(() => {
    if (!currentStrudel || !containerRef.current) return;

    let isMounted = true;

    async function initPlayer() {
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

        if (!containerRef.current || !isMounted) return;

        const { evalScope, silence } = coreModule;

        containerRef.current.innerHTML = '';

        const mirror = new StrudelMirror({
          transpiler,
          defaultOutput: webaudioOutput,
          getTime: () => getAudioContext().currentTime,
          root: containerRef.current,
          initialCode: currentStrudel?.code || EDITOR.DEFAULT_CODE,
          pattern: silence,
          drawTime: [-2, 2],
          autodraw: false, // no visualization for mini player
          bgFill: false,
          prebake: async () => {
            initAudioOnFirstClick();

            const { doughSamples: ds, uzuDrumkit: tc, dirtSamples } = SAMPLE_SOURCES;

            await Promise.all([
              evalScope(
                import('@strudel/core'),
                import('@strudel/codemirror'),
                import('@strudel/webaudio'),
                import('@strudel/draw'),
                import('@strudel/mini'),
                import('@strudel/tonal')
              ),

              registerSynthSounds(),
              registerSoundfonts(),

              samples(`${ds}/tidal-drum-machines.json`),
              samples(`${ds}/piano.json`),
              samples(`${ds}/vcsl.json`),
              samples(`${ds}/Dirt-Samples.json`),
              samples(`${ds}/EmuSP12.json`),
              samples(`${ds}/mridangam.json`),

              samples(`${dirtSamples}?v=${Date.now()}`),
              samples(`${tc}/strudel.json`),
              samples('github:tidalcycles/dirt-samples'),
            ]);

            const soundAlias = (webaudioModule as Record<string, unknown>).soundAlias as
              | ((from: string, to: string) => void)
              | undefined;

            if (soundAlias) {
              for (const [shorthand, full] of Object.entries(DRUM_MACHINE_ALIASES)) {
                for (const hit of DRUM_HIT_TYPES) {
                  soundAlias(`${full}_${hit}`, `${shorthand}_${hit}`);
                }
              }
            }

            const setLogger = (webaudioModule as Record<string, unknown>).setLogger as
              | ((fn: (msg: string) => void) => void)
              | undefined;

            if (process.env.NODE_ENV === 'development') {
              setLogger?.((msg: string) => {
                if (!SUPPRESSED_ERROR_PATTERNS.some(pattern => msg.includes(pattern))) {
                  console.log('[floating-player]', msg);
                }
              });
            }

            const { Pattern } = await import('@strudel/core');
            const proto = Pattern.prototype as Record<string, (name: string) => unknown>;

            for (const inst of INSTRUMENT_SHORTCUTS) {
              if (!proto[inst]) {
                proto[inst] = function () {
                  return proto.s.call(this, inst);
                };
              }
            }
          },

          onToggle: (started: boolean) => {
            if (isMounted) {
              setIsPlaying(started);
              setIsLoading(false);
              if (started) setError(null);
            }
          },

          onError: (err: Error) => {
            console.error('floating player error:', err);
            setError(err.message);
            setIsLoading(false);
          },
        });

        // hide the editor - we just need the audio engine
        if (containerRef.current) {
          containerRef.current.style.display = 'none';
        }

        if (!isMounted) {
          mirror.stop();
          mirror.destroy?.();
          return;
        }

        mirrorRef.current = mirror;
        setIsInitialized(true);

        // auto-play after initialization
        try {
          const ctx = getAudioContext();
          if (ctx.state === 'suspended') {
            await ctx.resume();
          }
          mirror.evaluate();
        } catch (err) {
          console.error('failed to auto-play:', err);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('failed to initialize floating player:', err);
        setError('Failed to initialize audio engine');
        setIsLoading(false);
      }
    }

    initPlayer();

    return () => {
      isMounted = false;
      if (mirrorRef.current) {
        mirrorRef.current.stop();
        mirrorRef.current.destroy?.();
        mirrorRef.current = null;
      }
      setIsInitialized(false);
    };
  }, [currentStrudel, setIsPlaying, setIsLoading]);

  // Handle resume requests (when same strudel is clicked again)
  useEffect(() => {
    if (shouldResume && mirrorRef.current && isInitialized) {
      setShouldResume(false);
      (async () => {
        try {
          const { getAudioContext } = await import('@strudel/webaudio');
          const ctx = getAudioContext();
          if (ctx.state === 'suspended') {
            await ctx.resume();
          }
          mirrorRef.current?.evaluate();
        } catch (err) {
          console.error('failed to resume:', err);
        }
      })();
    }
  }, [shouldResume, isInitialized, setShouldResume]);

  // Handle stop requests (when pause is clicked from list item)
  useEffect(() => {
    if (shouldStop && mirrorRef.current) {
      setShouldStop(false);
      mirrorRef.current.stop();
    }
  }, [shouldStop, setShouldStop]);

  const handlePlay = useCallback(async () => {
    if (!mirrorRef.current) return;

    try {
      const { getAudioContext } = await import('@strudel/webaudio');
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      mirrorRef.current.evaluate();
    } catch (err) {
      console.error('failed to play:', err);
    }
  }, []);

  const handleStop = useCallback(() => {
    mirrorRef.current?.stop();
  }, []);

  const handleClose = useCallback(() => {
    mirrorRef.current?.stop();
    mirrorRef.current?.destroy?.();
    mirrorRef.current = null;
    setCurrentStrudel(null);
    setIsPlaying(false);
    setIsLoading(false);
  }, [setCurrentStrudel, setIsPlaying, setIsLoading]);

  return {
    containerRef,
    currentStrudel,
    isPlaying,
    isLoading,
    isInitialized,
    error,
    handlePlay,
    handleStop,
    handleClose,
  };
}
