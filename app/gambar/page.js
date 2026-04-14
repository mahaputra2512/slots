'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function GambarPage() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    let timer;

    const loadPhotos = async () => {
      const response = await fetch('/api/photos', { cache: 'no-store' });
      const data = await response.json();
      setPhotos(data.photos || []);
    };

    loadPhotos();
    timer = setInterval(loadPhotos, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="container">
      <h1>Galeri /gambar</h1>
      <div className="row" style={{ marginBottom: 16 }}>
        <Link href="/">/</Link>
        <Link href="/admin">/admin</Link>
      </div>

      {photos.length === 0 ? (
        <p>Belum ada gambar tersimpan.</p>
      ) : (
        <div className="grid">
          {photos.map((item) => (
            <div className="card" key={item.id}>
              <img className="thumb" src={item.image} alt={item.createdAt} />
              <small>{new Date(item.createdAt).toLocaleString('id-ID')}</small>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
