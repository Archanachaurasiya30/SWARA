import { useEffect, useRef, useState } from "react";

// Wraps the browser's Speech Recognition API (works in Chrome, Edge and Safari, not everywhere).
// It only turns speech into TEXT. It never sends anything or triggers SOS by itself.
const SpeechRecognition =
  typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : undefined;

const errorText = {
  "not-allowed": "Microphone access was blocked. Allow the microphone for this site to use voice.",
  "service-not-allowed": "Microphone access was blocked. Allow the microphone for this site to use voice.",
  "no-speech": "We did not hear anything. Tap the microphone and try again.",
  "audio-capture": "No microphone was found on this device.",
  network: "Voice typing needs an internet connection in this browser.",
};

export default function useSpeechRecognition({ onResult }) {
  const supported = Boolean(SpeechRecognition);
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState("");

  // Stop listening if the component goes away
  useEffect(() => () => recognitionRef.current?.abort(), []);

  const start = (lang = "en-IN") => {
    setError("");
    if (!supported) {
      setError("Voice typing is not supported in this browser. You can still type your message, or try Chrome or Edge.");
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;

    rec.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const piece = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += piece;
        else interimText += piece;
      }
      setInterim(interimText);
      if (finalText) onResult(finalText.trim()); // goes into the text box for the user to review
    };
    rec.onerror = (event) => setError(errorText[event.error] || "Voice typing stopped. Please try again.");
    rec.onend = () => {
      setListening(false);
      setInterim("");
    };

    recognitionRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      setError("Could not start the microphone. Please try again.");
    }
  };

  const stop = () => recognitionRef.current?.stop();

  return { supported, listening, interim, error, start, stop };
}
