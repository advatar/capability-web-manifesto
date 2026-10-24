import { useCallback, useEffect, useRef, useState } from "react";

// Minimal typings for the Web Speech API (not in lib.dom for all targets).
interface SpeechRecognitionResultLike {
  readonly isFinal: boolean;
  readonly [index: number]: { transcript: string };
}

interface SpeechRecognitionEventLike {
  results: {
    readonly length: number;
    readonly [index: number]: SpeechRecognitionResultLike;
  };
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: unknown) => void) | null;
  start(): void;
  stop(): void;
}

type SpeechWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

function getRecognition(): SpeechRecognitionLike | null {
  const w = window as SpeechWindow;
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

export interface VoiceInput {
  /** Whether the browser supports speech recognition. */
  supported: boolean;
  /** Whether we are currently listening. */
  listening: boolean;
  /** The latest (possibly interim) transcript. */
  transcript: string;
  /** Start listening; resolves the final transcript via onFinal. */
  start: () => void;
  stop: () => void;
}

/**
 * Speech-to-text for answering voice-enabled A2UI surfaces. Calls `onFinal`
 * with the recognized phrase when the user stops speaking.
 */
export function useVoiceInput(onFinal: (text: string) => void): VoiceInput {
  // The server and first browser render must agree. Detect browser-only
  // capabilities after hydration instead of constructing a recognizer in render.
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const onFinalRef = useRef(onFinal);
  onFinalRef.current = onFinal;

  useEffect(() => {
    const w = window as SpeechWindow;
    setSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  const start = useCallback(() => {
    const recognition = getRecognition();
    if (!recognition) return;
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
      const last = event.results[event.results.length - 1];
      if (last?.isFinal) {
        onFinalRef.current(text.trim());
      }
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setTranscript("");
    setListening(true);
    recognition.start();
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  return { supported, listening, transcript, start, stop };
}

/** Speak a prompt aloud (text-to-speech), if available. */
export function speak(text: string): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

/** Interpret a spoken phrase as a yes/no answer, or null if ambiguous. */
export function interpretYesNo(text: string): "yes" | "no" | null {
  const t = text.trim().toLowerCase();
  if (/\b(yes|yeah|yep|sure|confirm|approve|ok|okay|do it)\b/.test(t)) return "yes";
  if (/\b(no|nope|cancel|decline|don't|do not|stop)\b/.test(t)) return "no";
  return null;
}
