import { addPhoto, getPhotos } from '../../../lib/store';

function getClientIp(request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp.trim();
  }

  return 'unknown';
}

export async function GET() {
  return Response.json({ photos: getPhotos() });
}

export async function POST(request) {
  const body = await request.json();
  const image = body?.image;

  if (!image || typeof image !== 'string' || !image.startsWith('data:image/')) {
    return Response.json({ error: 'Format gambar tidak valid.' }, { status: 400 });
  }

  const ip = getClientIp(request);
  const photo = addPhoto(image, ip);
  return Response.json({ photo }, { status: 201 });
}
