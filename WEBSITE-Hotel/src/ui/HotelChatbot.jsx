/**
 * HotelChatbot.jsx
 * ================
 * Floating AI concierge ("Eva") for the public website.
 *
 * Usage (already wired in src/App.jsx):
 *   import HotelChatbot from './ui/HotelChatbot';
 *   <HotelChatbot />
 *
 * Floats as a button in the bottom-left corner. Clicking opens the chat window.
 * Sends POST to {API_URL}/chatbot/ask and displays the answer.
 */

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Render markdown-style links [label](url) as clickable links.
// Internal links (starting with "/") navigate within the app; the rest open normally.
function renderText(text, onLink) {
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const label = match[1];
    const href = match[2];
    parts.push(
      <a
        key={key++}
        href={href}
        onClick={(e) => {
          if (href.startsWith("/")) {
            e.preventDefault();
            onLink(href);
          }
        }}
        target={href.startsWith("/") ? undefined : "_blank"}
        rel="noopener noreferrer"
        style={{ color: "#028090", fontWeight: 600, textDecoration: "underline" }}
      >
        {label}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length ? parts : text;
}

const styles = {
  fab: {
    position: "fixed", bottom: "28px", left: "28px",
    width: "58px", height: "58px", borderRadius: "50%",
    background: "#1a3a5c", color: "#fff", border: "none",
    cursor: "pointer", fontSize: "26px",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 16px rgba(0,0,0,0.25)", zIndex: 9999,
  },
  window: {
    position: "fixed", bottom: "98px", right: "28px",
    width: "360px", height: "520px", background: "#fff",
    borderRadius: "16px", boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
    display: "flex", flexDirection: "column", overflow: "hidden",
    zIndex: 9998, fontFamily: "Inter, sans-serif",
  },
  header: {
    background: "#1a3a5c", color: "#fff", padding: "14px 18px",
    display: "flex", alignItems: "center", gap: "10px",
  },
  headerAvatar: {
    width: "34px", height: "34px", borderRadius: "50%",
    background: "#028090", display: "flex",
    alignItems: "center", justifyContent: "center", fontSize: "18px",
  },
  headerText: { flex: 1 },
  headerTitle: { margin: 0, fontSize: "15px", fontWeight: 700 },
  headerSub: { margin: 0, fontSize: "11px", opacity: 0.75 },
  closeBtn: {
    background: "transparent", border: "none", color: "#fff",
    fontSize: "20px", cursor: "pointer", padding: "0 4px",
  },
  messages: {
    flex: 1, overflowY: "auto", padding: "14px",
    display: "flex", flexDirection: "column", gap: "10px",
    background: "#f8f9fb",
  },
  bubble: (isBot) => ({
    maxWidth: "82%", alignSelf: isBot ? "flex-start" : "flex-end",
    background: isBot ? "#fff" : "#1a3a5c",
    color: isBot ? "#222" : "#fff",
    borderRadius: isBot ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
    padding: "10px 14px", fontSize: "13.5px", lineHeight: "1.55",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)", whiteSpace: "pre-wrap",
  }),
  sourceTag: { fontSize: "10.5px", color: "#888", marginTop: "5px" },
  typingDot: {
    display: "inline-block", width: "7px", height: "7px",
    borderRadius: "50%", background: "#1a3a5c", margin: "0 2px",
    animation: "bounce 1.2s infinite",
  },
  inputArea: {
    display: "flex", padding: "10px 12px", gap: "8px",
    borderTop: "1px solid #eee", background: "#fff",
  },
  input: {
    flex: 1, border: "1px solid #ddd", borderRadius: "20px",
    padding: "9px 16px", fontSize: "13.5px", outline: "none",
    resize: "none", fontFamily: "inherit",
  },
  sendBtn: {
    width: "38px", height: "38px", borderRadius: "50%",
    background: "#1a3a5c", color: "#fff", border: "none",
    cursor: "pointer", fontSize: "17px",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  micBtn: {
    width: "38px", height: "38px", borderRadius: "50%",
    color: "#fff", border: "none", cursor: "pointer", fontSize: "16px",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
};

const SUGGESTIONS = [
  "What room types do you have?",
  "What time is check-in?",
  "Is breakfast included?",
  "Do you have a swimming pool?",
];

export default function HotelChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 0, role: "bot", text: "Hello! I'm Eva, your AI concierge. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSugg, setShowSugg] = useState(true);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  function handleLink(href) {
    setOpen(false);
    navigate(href);
  }

  // ── Voice-to-text (records audio + Groq Whisper transcription) ──
  // Works in ALL modern browsers (Chrome, Edge, Brave, Firefox, Safari) because
  // it uses MediaRecorder instead of the Chrome-only Web Speech API.
  // Flow: record -> auto-stop after a short silence -> upload to the backend ->
  // Whisper transcribes + AI cleans -> fill the input box. Whisper auto-detects
  // Indonesian vs English, so no language setting is needed.
  const SILENCE_MS = 1000;          // auto-stop after this much trailing silence
  const SILENCE_THRESHOLD = 12;     // mic loudness below this counts as silence
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false); // uploading/transcribing
  const [micError, setMicError] = useState("");
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const rafRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const speechStartedRef = useRef(false);

  const voiceSupported =
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function" &&
    typeof window !== "undefined" &&
    typeof window.MediaRecorder !== "undefined";

  function clearSilenceTimer() {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }

  function cleanupAudio() {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    clearSilenceTimer();
    try { mediaStreamRef.current?.getTracks().forEach((t) => t.stop()); } catch { /* ignore */ }
    mediaStreamRef.current = null;
    try { audioContextRef.current?.close(); } catch { /* ignore */ }
    audioContextRef.current = null;
  }

  // Watch microphone loudness. Once the user starts speaking, auto-stop after
  // SILENCE_MS of silence. Before any speech, keep recording indefinitely.
  function monitorSilence(stream) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = buf[i] - 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / buf.length);

        if (rms > SILENCE_THRESHOLD) {
          speechStartedRef.current = true;   // the guest is speaking
          clearSilenceTimer();               // reset the countdown
        } else if (speechStartedRef.current && !silenceTimerRef.current) {
          silenceTimerRef.current = setTimeout(() => stopRecording(), SILENCE_MS);
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch { /* analysis unavailable -> user can still stop manually */ }
  }

  async function startRecording() {
    setMicError("");
    if (!voiceSupported) {
      setMicError("Your browser does not support audio recording.");
      return;
    }
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setMicError("Microphone is blocked. Please allow mic access for this site, then try again.");
      return;
    }
    mediaStreamRef.current = stream;
    audioChunksRef.current = [];
    speechStartedRef.current = false;

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    recorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data); };
    recorder.onstop = handleRecordingStop;
    recorder.start();

    setShowSugg(false);
    setListening(true);
    monitorSilence(stream);
  }

  function stopRecording() {
    clearSilenceTimer();
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    setListening(false);
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop(); // fires onstop -> handleRecordingStop
      }
    } catch { /* ignore */ }
  }

  // Build the audio blob, send it to the backend for transcription + cleanup,
  // then drop the resulting text into the input box.
  async function handleRecordingStop() {
    const mime = mediaRecorderRef.current?.mimeType || "audio/webm";
    cleanupAudio();

    const chunks = audioChunksRef.current;
    audioChunksRef.current = [];
    if (!chunks.length || !speechStartedRef.current) return; // nothing was said

    const blob = new Blob(chunks, { type: mime });
    const ext = mime.includes("ogg") ? "ogg" : mime.includes("mp4") ? "mp4" : "webm";

    setProcessing(true);
    try {
      const form = new FormData();
      form.append("audio", blob, `recording.${ext}`);
      const res = await fetch(`${API_URL}/chatbot/transcribe`, { method: "POST", body: form });
      const data = res.ok ? await res.json() : null;
      if (data && data.text) setInput(data.text);
      else setMicError("Could not transcribe the audio. Please try again.");
    } catch {
      setMicError("Could not reach the speech service. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  function toggleListening() {
    if (loading || processing) return;
    if (listening) { stopRecording(); return; } // manual stop
    startRecording();
  }

  // Clean up on unmount.
  useEffect(() => {
    return () => {
      try { mediaRecorderRef.current?.stop(); } catch { /* ignore */ }
      cleanupAudio();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text) {
    const query = text.trim();
    if (!query || loading) return;
    setInput("");
    setShowSugg(false);
    setMessages(prev => [...prev, { id: Date.now(), role: "user", text: query }]);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/chatbot/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, session_id: null, hotel_id: null }),
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1, role: "bot",
          text: data.response || "I'm having trouble right now. Please contact our front desk.",
          sources: [],
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: "bot", text: "Connection error. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  }

  return (
    <>
      <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0);opacity:0.5} 40%{transform:scale(1);opacity:1} }`}</style>

      <button style={styles.fab} onClick={() => setOpen(o => !o)} title="Chat with Eva">
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div style={styles.window}>
          <div style={styles.header}>
            <div style={styles.headerAvatar}>🤖</div>
            <div style={styles.headerText}>
              <p style={styles.headerTitle}>Eva — AI Concierge</p>
              <p style={styles.headerSub}>Eva Group Hotel · Always here to help</p>
            </div>
            <button style={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
          </div>

          <div style={styles.messages}>
            {messages.map(msg => (
              <div key={msg.id}>
                <div style={styles.bubble(msg.role === "bot")}>
                  {msg.role === "bot" ? renderText(msg.text, handleLink) : msg.text}
                </div>
                {msg.role === "bot" && msg.sources?.length > 0 && (
                  <div style={styles.sourceTag}>Sources: {msg.sources.join(", ")}</div>
                )}
              </div>
            ))}

            {loading && (
              <div style={styles.bubble(true)}>
                {[0, 0.2, 0.4].map((delay, i) => (
                  <span key={i} style={{ ...styles.typingDot, animationDelay: `${delay}s` }} />
                ))}
              </div>
            )}

            {showSugg && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => sendMessage(s)} style={{
                    background: "#fff", border: "1px solid #1a3a5c", color: "#1a3a5c",
                    borderRadius: "14px", padding: "5px 12px", fontSize: "12px", cursor: "pointer",
                  }}>{s}</button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {micError && (
            <div style={{ padding: "0 12px 6px", fontSize: "11px", color: "#e63946" }}>
              {micError}
            </div>
          )}

          <div style={styles.inputArea}>
            <textarea
              rows={1} style={styles.input}
              placeholder={
                listening ? "Recording... (auto-stops when you pause)"
                : processing ? "Transcribing your words..."
                : "Ask about rooms, check-in, amenities..."
              }
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey} disabled={loading || listening || processing}
            />
            {voiceSupported && (
              <button
                style={{ ...styles.micBtn, background: listening ? "#e63946" : processing ? "#888" : "#028090" }}
                onClick={toggleListening}
                disabled={loading || processing}
                title={listening ? "Stop & insert text" : processing ? "Transcribing..." : "Speak"}
              >
                {processing ? (
                  "…"
                ) : listening ? (
                  // Stop square
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                ) : (
                  // Microphone
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="9" y="2" width="6" height="12" rx="3" />
                    <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                )}
              </button>
            )}
            <button style={styles.sendBtn} onClick={() => sendMessage(input)} disabled={loading || !input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}