// In-memory cache only. Supabase is the source of truth.
// Cache is hydrated from Supabase on auth state change and after every mutation.
// No localStorage persistence: a hard refresh re-fetches from Supabase.

const store = new Map<string, any[]>();
const listeners = new Map<string, Set<() => void>>();

function emit(table: string) {
  listeners.get(table)?.forEach((cb) => cb());
  listeners.get("*")?.forEach((cb) => cb());
}

export function read<T = any>(table: string): T[] {
  return (store.get(table) as T[] | undefined) ?? [];
}

export function write<T = any>(table: string, rows: T[]) {
  store.set(table, rows);
  emit(table);
}

export function upsert<T extends { id: string }>(table: string, row: T): T {
  const rows = read<T>(table);
  const idx = rows.findIndex((r) => r.id === row.id);
  if (idx >= 0) rows[idx] = { ...rows[idx], ...row };
  else rows.push(row);
  write(table, rows);
  return row;
}

export function patch<T extends { id: string }>(
  table: string,
  id: string,
  partial: Partial<T>,
): T | null {
  const rows = read<T>(table);
  const idx = rows.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  rows[idx] = { ...rows[idx], ...partial } as T;
  write(table, rows);
  return rows[idx];
}

export function remove<T extends { id: string }>(table: string, predicate: (r: T) => boolean) {
  const rows = read<T>(table).filter((r) => !predicate(r));
  write(table, rows);
}

export function findOne<T>(table: string, predicate: (r: T) => boolean): T | null {
  return read<T>(table).find(predicate) ?? null;
}

export function findMany<T>(table: string, predicate?: (r: T) => boolean): T[] {
  const rows = read<T>(table);
  return predicate ? rows.filter(predicate) : rows;
}

export function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export function nowIso() {
  return new Date().toISOString();
}

export function subscribe(table: string, cb: () => void) {
  if (!listeners.has(table)) listeners.set(table, new Set());
  listeners.get(table)!.add(cb);
  return () => listeners.get(table)?.delete(cb);
}

export function reset() {
  store.clear();
  listeners.forEach((set) => set.forEach((cb) => cb()));
}

export function bumpAll() {
  listeners.forEach((set) => set.forEach((cb) => cb()));
}
