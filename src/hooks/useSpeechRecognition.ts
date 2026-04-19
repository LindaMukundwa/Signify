import { useState, useCallback, useRef } from "react";

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
  isSupported: boolean;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState("");
  const recognitionRef = useRef<any>(null);

  const isSupported =
    typeof window !== "undefined" &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError("Speech recognition is not supported in your browser");
      return;
    }

    recognitionRef.current?.stop();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.language = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
    };

    recognition.onresult = (event: any) => {
      let finalSegment = "";
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalSegment += text + " ";
        } else {
          interim += text;
        }
      }

      if (finalSegment) {
        setTranscript((prev) => prev + finalSegment);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: any) => {
      if (event.error !== "no-speech") {
        setError(`Error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
    };

    recognition.start();
  }, [isSupported]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setInterimTranscript("");
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    setError("");
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    clearTranscript,
    isSupported,
  };
};
