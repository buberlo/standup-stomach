import { STORAGE_KEYS } from './constants';

const KEYS = {
  notes: STORAGE_KEYS?.notes ?? STORAGE_KEYS?.NOTES ?? 'hunger.notes',
  blockers: STORAGE_KEYS?.blockers ?? STORAGE_KEYS?.BLOCKERS ?? 'hunger.blockers',
  coupons: STORAGE_KEYS?.coupons ?? STORAGE_KEYS?.COUPONS ?? 'hunger.coupons',
};

const isBrowser = () => typeof window !== 'undefined' && Boolean(window.localStorage);

function parseCollection(raw, fallback = []) {
  if (!raw) return fallback;

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function serialize(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
}

function readCollection(key, fallback = []) {
  if (!isBrowser()) return fallback;
  return parseCollection(window.localStorage.getItem(key), fallback);
}

function writeCollection(key, value) {
  if (!isBrowser()) return false;

  const serialized = serialize(value);
  if (serialized === null) return false;

  try {
    window.localStorage.setItem(key, serialized);
    return true;
  } catch {
    return false;
  }
}

export function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const loadNotes = () => readCollection(KEYS.notes);
export const saveNotes = (notes) => writeCollection(KEYS.notes, notes ?? []);

export const loadBlockers = () => readCollection(KEYS.blockers);
export const saveBlockers = (blockers) => writeCollection(KEYS.blockers, blockers ?? []);

export const loadCoupons = () => readCollection(KEYS.coupons);
export const saveCoupons = (coupons) => writeCollection(KEYS.coupons, coupons ?? []);

export function upsertItem(key, item, idField = 'id') {
  const id = item?.[idField] || createId();
  const nextItem = { ...item, [idField]: id };
  const items = readCollection(key);
  const index = items.findIndex((entry) => entry?.[idField] === id);

  if (index >= 0) {
    items[index] = { ...items[index], ...nextItem };
  } else {
    items.push(nextItem);
  }

  writeCollection(key, items);
  return nextItem;
}

export function removeItem(key, id, idField = 'id') {
  const items = readCollection(key);
  const nextItems = items.filter((entry) => entry?.[idField] !== id);

  writeCollection(key, nextItems);
  return nextItems;
}

export function clearAllData() {
  if (!isBrowser()) return;

  Object.values(KEYS).forEach((key) => {
    window.localStorage.removeItem(key);
  });
}

export function loadDashboardState() {
  return {
    notes: loadNotes(),
    blockers: loadBlockers(),
    coupons: loadCoupons(),
  };
}

export function saveDashboardState(state = {}) {
  return {
    notes: saveNotes(state.notes ?? loadNotes()),
    blockers: saveBlockers