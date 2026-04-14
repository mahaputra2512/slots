'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [accuracy, setAccuracy] = useState(70);
  const [saved, setSaved] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await fetch('/api/settings', { cache: 'no-store' });
      const data = await response.json();
      setAccuracy(data.accuracy);
    };

    load();
  }, []);

  const save = async () => {
    const response = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accuracy })
    });

    const data = await response.json();
    setAccuracy(data.accuracy);
    setSaved(`Disimpan: ${data.accuracy}%`);
  };

  return (
    <main className="container">
      <h1>Admin /admin</h1>
      <div className="row" style={{ marginBottom: 16 }}>
        <Link href="/">/</Link>
        <Link href="/gambar">/gambar</Link>
      </div>

      <section className="card">
        <h2>Pengaturan Akurasi Mesin Slot</h2>
        <p>
          Nilai: <strong>{accuracy}%</strong>
        </p>
        <input
          type="range"
          min="0"
          max="100"
          value={accuracy}
          onChange={(e) => setAccuracy(Number(e.target.value))}
        />
        <div style={{ marginTop: 12 }}>
          <button onClick={save}>Simpan</button>
        </div>
        {saved ? <p>{saved}</p> : null}
      </section>
    </main>
  );
}
