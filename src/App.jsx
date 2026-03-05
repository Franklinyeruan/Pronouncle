import React, { useState, useEffect, useRef } from 'react';
import { Mic, Download, Share2, RefreshCw, Trophy, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getDailyWord } from './data/lexicon';
import { calculateScore, getPhoneticCode } from './utils/scoring';

const Pronouncle = () => {
  const [word, setWord] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [score, setScore] = useState(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const initGame = () => {
    const dailyWord = getDailyWord();
    setWord(dailyWord);

    // Check if played today
    const lastPlayed = localStorage.getItem('pronouncle_last_played');
    const today = new Date().toDateString();
    if (lastPlayed === today) {
      const savedScore = localStorage.getItem('pronouncle_today_score');
      setScore(parseInt(savedScore));
      setHasPlayed(true);
    }

    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setTranscription(result);
        const finalScore = calculateScore(dailyWord.term, result);
        handleGameEnd(finalScore);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleGameEnd = (finalScore) => {
    setScore(finalScore);
    setHasPlayed(true);
    localStorage.setItem('pronouncle_last_played', new Date().toDateString());
    localStorage.setItem('pronouncle_today_score', finalScore.toString());

    if (finalScore >= 80) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fda4af', '#93c5fd', '#fcd34d']
      });
    }
  };

  const startRecording = async () => {
    if (hasPlayed) return;

    setTranscription('');
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioUrl(URL.createObjectURL(audioBlob));
      };

      mediaRecorderRef.current.start();
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone", err);
      alert("Please allow microphone access to play!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const shareScore = () => {
    const text = `I scored ${score}/100 on Pronouncle today! Can you beat me? \nWord: ${word.term}\nPlay here: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    alert("Score copied to clipboard!");
  };

  const handleTryAgain = () => {
    if (window.confirm("Technical trouble? Use this to retry your recording. (Honors system! 😉)")) {
      setHasPlayed(false);
      setScore(null);
      setTranscription('');
      setAudioUrl(null);
      localStorage.removeItem('pronouncle_last_played');
      localStorage.removeItem('pronouncle_today_score');
    }
  };

  if (!word) return null;

  return (
    <div className="glass-card animate-cute-bounce">
      <h1>Pronouncle</h1>
      <p className="subtitle">Medical Pronunciation Challenge</p>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '800', marginBottom: '8px' }}>TODAY'S TERM</p>
        <h2 style={{ marginBottom: '4px', color: '#ff85a2', fontWeight: '900' }}>{word.term}</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        {!hasPlayed ? (
          <button
            className={`btn btn-primary ${isRecording ? 'animate-pulse' : ''}`}
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            style={{ width: '100px', height: '100px', borderRadius: '50%', padding: 0 }}
          >
            <Mic size={40} />
          </button>
        ) : (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div style={{
              fontSize: '5rem',
              fontWeight: '900',
              color: score >= 80 ? '#4ade80' : score >= 50 ? '#fcd34d' : '#fca5a5',
              lineHeight: 1,
              textShadow: '3px 3px 0px white'
            }}>
              {score}
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontWeight: '700' }}>ACCURACY SCORE</p>

            {transcription && (
              <div style={{ marginTop: '16px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', backgroundColor: '#f9fafb', padding: '8px 16px', borderRadius: '12px 12px 0 0', borderBottom: '1px solid #eee' }}>
                  " {transcription} "
                </p>
                <p style={{ color: '#7ea9ff', fontSize: '0.7rem', fontWeight: '800', backgroundColor: '#f0f9ff', padding: '4px 16px', borderRadius: '0 0 12px 12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Phonemes: {getPhoneticCode(transcription)}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px', justifyContent: 'center' }}>
              {audioUrl && (
                <a href={audioUrl} download={`${word.term}_pronunciation.wav`} className="btn" style={{ background: '#f3f4f6', color: '#6b7280' }}>
                  <Download size={20} />
                </a>
              )}
              <button onClick={shareScore} className="btn btn-primary" style={{ flex: 1 }}>
                <Share2 size={20} /> Share Score
              </button>
            </div>

            <button
              onClick={handleTryAgain}
              className="btn btn-ghost"
              style={{ marginTop: '20px', width: '100%' }}
            >
              <RefreshCw size={14} /> Try Again (Technical Fix)
            </button>
          </div>
        )}

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', height: '1.2rem', fontWeight: '600' }}>
          {isRecording ? "Listening..." : !hasPlayed ? "Hold space or button to record" : "Next word in 12 hours"}
        </p>
      </div>

      {/* Definition Section */}
      <div style={{
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '2px dashed #f3f4f6',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '0.7rem',
          fontWeight: '800',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '8px'
        }}>
          What is it?
        </p>
        <p style={{
          fontSize: '0.9rem',
          color: '#64748b',
          lineHeight: '1.5',
          fontStyle: 'italic'
        }}>
          {word.definition}
        </p>
      </div>
    </div>
  );
};

export default Pronouncle;
