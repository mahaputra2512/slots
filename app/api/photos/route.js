import { addPhoto, getPhotos } from '../../../lib/store';

export async function GET() {
  return Response.json({ photos: getPhotos() });
}

export async function POST(request) {
  const body = await request.json();
  const image = body?.image;

  if (!image || typeof image !== 'string' || !image.startsWith('data:image/')) {
    return Response.json({ error: 'Format gambar tidak valid.' }, { status: 400 });
  }

  const photo = addPhoto(image);
  return Response.json({ photo }, { status: 201 });
}
