import React, { useState, useEffect, useRef } from 'react';
import { Mic, Share2, RefreshCw, Trophy, AlertCircle } from 'lucide-react';
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

    // Initialize Speech Recognition once to check compatibility
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
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

  const toggleRecording = (e) => {
    if (e) e.preventDefault();
    if (hasPlayed) return;

    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error("Error stopping recognition", err);
        }
      }
      setIsRecording(false);
    } else {
      setTranscription('');

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech recognition is not supported in this browser.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setTranscription(result);
        const finalScore = calculateScore(word.term, result);
        handleGameEnd(finalScore);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          alert("Please allow microphone access to play!");
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      try {
        recognition.start();
      } catch (err) {
        console.error("Error starting speech recognition", err);
      }
    }
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
            onClick={toggleRecording}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              padding: 0,
              touchAction: 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
              backgroundColor: isRecording ? '#fca5a5' : '#ff85a2'
            }}
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
          {isRecording ? "Listening... finish speaking and wait" : !hasPlayed ? "Tap button to start recording" : "Next word in 12 hours"}
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
