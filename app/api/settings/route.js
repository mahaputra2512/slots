import {
  getAccuracy,
  getMaxStreak,
  getMaxWin,
  setAccuracy,
  setMaxStreak,
  setMaxWin
} from '../../../lib/store';

export async function GET() {
  return Response.json({
    accuracy: getAccuracy(),
    maxWin: getMaxWin(),
    maxStreak: getMaxStreak()
  });
}

export async function POST(request) {
  const body = await request.json();
  const accuracy = setAccuracy(body?.accuracy);
  const maxWin = setMaxWin(body?.maxWin);
  const maxStreak = setMaxStreak(body?.maxStreak);

  return Response.json({ accuracy, maxWin, maxStreak });
}
