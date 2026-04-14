const globalForStore = globalThis;

if (!globalForStore.__slotStore) {
  globalForStore.__slotStore = {
    accuracy: 70,
    maxWin: 50000,
    maxStreak: 3,
    photos: []
  };
}

export const slotStore = globalForStore.__slotStore;

export function setAccuracy(value) {
  const normalized = Math.max(0, Math.min(100, Number(value) || 0));
  slotStore.accuracy = normalized;
  return slotStore.accuracy;
}

export function getAccuracy() {
  return slotStore.accuracy;
}

export function setMaxWin(value) {
  const normalized = Math.max(1000, Number(value) || 1000);
  slotStore.maxWin = normalized;
  return slotStore.maxWin;
}

export function getMaxWin() {
  return slotStore.maxWin;
}

export function setMaxStreak(value) {
  const normalized = Math.max(1, Number(value) || 1);
  slotStore.maxStreak = normalized;
  return slotStore.maxStreak;
}

export function getMaxStreak() {
  return slotStore.maxStreak;
}

export function addPhoto(photoBase64) {
  const item = {
    id: crypto.randomUUID(),
    image: photoBase64,
    createdAt: new Date().toISOString()
  };

  slotStore.photos.unshift(item);

  if (slotStore.photos.length > 200) {
    slotStore.photos.length = 200;
  }

  return item;
}

export function getPhotos() {
  return slotStore.photos;
}
