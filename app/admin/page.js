'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [accuracy, setAccuracy] = useState(70);
  const [maxWin, setMaxWin] = useState(50000);
  const [maxStreak, setMaxStreak] = useState(3);
  const [saved, setSaved] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await fetch('/api/settings', { cache: 'no-store' });
      const data = await response.json();
      setAccuracy(data.accuracy);
      setMaxWin(data.maxWin);
      setMaxStreak(data.maxStreak);
    };

    load();
  }, []);

  const save = async () => {
    const response = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accuracy, maxWin, maxStreak })
    });

    const data = await response.json();
    setAccuracy(data.accuracy);
    setMaxWin(data.maxWin);
    setMaxStreak(data.maxStreak);
    setSaved(
      `Disimpan: Akurasi ${data.accuracy}% | Max menang Rp ${new Intl.NumberFormat('id-ID').format(data.maxWin)} | Max streak ${data.maxStreak}`
    );
  };

  return (
    <main className="container">
      <h1>Admin /admin</h1>
      <div className="row" style={{ marginBottom: 16 }}>
        <Link href="/">/</Link>
        <Link href="/gambar">/gambar</Link>
      </div>

      <section className="card">
        <h2>Pengaturan Mesin Slot</h2>
        <p>
          Akurasi menang: <strong>{accuracy}%</strong>
        </p>
        <input
          type="range"
          min="0"
          max="100"
          value={accuracy}
          onChange={(e) => setAccuracy(Number(e.target.value))}
        />

        <p style={{ marginTop: 16 }}>
          Maksimal uang kemenangan (Rp): <strong>{new Intl.NumberFormat('id-ID').format(maxWin)}</strong>
        </p>
        <input
          type="number"
          min="1000"
          step="1000"
          value={maxWin}
          onChange={(e) => setMaxWin(Number(e.target.value))}
          style={{ width: '100%', maxWidth: 260, padding: 10, borderRadius: 8, border: '1px solid #475569' }}
        />

        <p style={{ marginTop: 16 }}>
          Maksimal streak menang: <strong>{maxStreak}</strong>
        </p>
        <input
          type="number"
          min="1"
          max="20"
          value={maxStreak}
          onChange={(e) => setMaxStreak(Number(e.target.value))}
          style={{ width: '100%', maxWidth: 260, padding: 10, borderRadius: 8, border: '1px solid #475569' }}
        />

        <div style={{ marginTop: 12 }}>
          <button onClick={save}>Simpan</button>
        </div>
        {saved ? <p>{saved}</p> : null}
      </section>
    </main>
  );
}
