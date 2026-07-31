import { useRef, useCallback, useEffect } from 'react';

/**
 * Custom Hook: useBackgroundMusic
 * Manages romantic instrumental background music with fade-in and fade-out effects.
 * Uses Web Audio API for synthetic soft ambient chords as a fail-safe fallback,
 * while allowing custom audio file URLs.
 */
export function useBackgroundMusic(audioUrl?: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthGainRef = useRef<GainNode | null>(null);
  const synthOscillatorsRef = useRef<OscillatorNode[]>([]);
  const fadeIntervalRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  // Initialize or preload audio resources
  const preloadAudio = useCallback(() => {
    if (audioUrl && !audioRef.current) {
      const audio = new Audio(audioUrl);
      audio.loop = true;
      audio.volume = 0;
      audioRef.current = audio;
    }
  }, [audioUrl]);

  // Create Web Audio synthesized gentle romantic ambient music pad
  const startSynthPad = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Master Gain Node for volume control
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.connect(ctx.destination);
      synthGainRef.current = masterGain;

      // Soft romantic harmony frequencies (Fmaj9 chord: F3, A3, C4, E4, G4)
      const frequencies = [174.61, 220.0, 261.63, 329.63, 392.0];
      const oscs: OscillatorNode[] = [];

      frequencies.forEach((freq) => {
        const osc = ctx.createOscillator();
        const subGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;
        subGain.gain.value = 0.05; // Gentle volume per tone

        // Low-pass filter for warm, dreamy atmospheric sound
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;

        osc.connect(subGain);
        subGain.connect(filter);
        filter.connect(masterGain);

        osc.start();
        oscs.push(osc);
      });

      synthOscillatorsRef.current = oscs;
    } catch (e) {
      console.warn('Web Audio synthesis notice:', e);
    }
  }, []);

  const stopSynthPad = useCallback(() => {
    synthOscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (_) {}
    });
    synthOscillatorsRef.current = [];
  }, []);

  // Play background music with a 2-second Fade-In effect
  const playMusic = useCallback(() => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    if (audioUrl) {
      preloadAudio();
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.volume = 0;
        audio.play().catch(() => {
          // Fallback to synthesized ambient music if media play is blocked
          startSynthPad();
        });

        const targetVol = 0.35;
        const duration = 2000; // 2 seconds
        const stepTime = 50;
        const increment = targetVol / (duration / stepTime);

        fadeIntervalRef.current = window.setInterval(() => {
          if (audio.volume + increment < targetVol) {
            audio.volume += increment;
          } else {
            audio.volume = targetVol;
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
          }
        }, stepTime);
      }
    } else {
      // Use synthesized soft romantic background music pad
      startSynthPad();
      const masterGain = synthGainRef.current;
      const ctx = audioCtxRef.current;
      if (masterGain && ctx) {
        masterGain.gain.setValueAtTime(0, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 2.0); // 2 second fade in
      }
    }
  }, [audioUrl, preloadAudio, startSynthPad]);

  // Stop background music with a 2-second Fade-Out effect
  const stopMusic = useCallback(() => {
    if (!isPlayingRef.current) return;
    isPlayingRef.current = false;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    if (audioUrl && audioRef.current) {
      const audio = audioRef.current;
      const duration = 2000; // 2 seconds
      const stepTime = 50;
      const decrement = audio.volume / (duration / stepTime);

      fadeIntervalRef.current = window.setInterval(() => {
        if (audio.volume - decrement > 0.01) {
          audio.volume -= decrement;
        } else {
          audio.volume = 0;
          audio.pause();
          audio.currentTime = 0;
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        }
      }, stepTime);
    } else {
      const masterGain = synthGainRef.current;
      const ctx = audioCtxRef.current;
      if (masterGain && ctx) {
        masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 2.0); // 2 second fade out
        setTimeout(() => {
          stopSynthPad();
        }, 2050);
      }
    }
  }, [audioUrl, stopSynthPad]);

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      stopSynthPad();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [stopSynthPad]);

  return { playMusic, stopMusic, preloadAudio };
}
