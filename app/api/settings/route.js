import { getAccuracy, setAccuracy } from '../../../lib/store';

export async function GET() {
  return Response.json({ accuracy: getAccuracy() });
}

export async function POST(request) {
  const body = await request.json();
  const accuracy = setAccuracy(body?.accuracy);
  return Response.json({ accuracy });
}
