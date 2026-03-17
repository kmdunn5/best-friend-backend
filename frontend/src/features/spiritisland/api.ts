import type {
  Spirit, Adversary, PowerCard, Game,
  OverviewStats, SpiritStats, AdversaryStats, MatchupStats,
} from './types';

const BASE = '/api/spirit-island';

function unwrapOne<T>(json: Record<string, unknown>): T {
  const data = json?.data as Record<string, unknown> | undefined;
  const attrs = (data?.attributes ?? {}) as Record<string, unknown>;
  const id = data?.id;
  return { id: Number(id), ...attrs } as T;
}

function unwrapMany<T>(json: Record<string, unknown>): T[] {
  const data = json?.data;
  if (!Array.isArray(data)) return [];
  return data.map((item: Record<string, unknown>) => {
    const attrs = (item?.attributes ?? {}) as Record<string, unknown>;
    const id = item?.id;
    return { id: Number(id), ...attrs } as T;
  });
}

// ---- Spirits ----

export async function fetchSpirits(): Promise<Spirit[]> {
  const res = await fetch(`${BASE}/spirits`);
  return unwrapMany<Spirit>(await res.json());
}

export async function fetchSpirit(id: number): Promise<Spirit> {
  const res = await fetch(`${BASE}/spirits/${id}`);
  if (!res.ok) throw new Error('Spirit not found');
  return unwrapOne<Spirit>(await res.json());
}

// ---- Adversaries ----

export async function fetchAdversaries(): Promise<Adversary[]> {
  const res = await fetch(`${BASE}/adversaries`);
  return unwrapMany<Adversary>(await res.json());
}

export async function fetchAdversary(id: number): Promise<Adversary> {
  const res = await fetch(`${BASE}/adversaries/${id}`);
  if (!res.ok) throw new Error('Adversary not found');
  return unwrapOne<Adversary>(await res.json());
}

// ---- Power Cards ----

export async function fetchPowerCards(params?: { cardType?: string; spiritId?: number }): Promise<PowerCard[]> {
  const query = new URLSearchParams();
  if (params?.cardType) query.set('cardType', params.cardType);
  if (params?.spiritId) query.set('spiritId', String(params.spiritId));
  const qs = query.toString();
  const res = await fetch(`${BASE}/power-cards${qs ? `?${qs}` : ''}`);
  return unwrapMany<PowerCard>(await res.json());
}

// ---- Games ----

export async function fetchGames(includeFake = true): Promise<Game[]> {
  const res = await fetch(`${BASE}/games?includeFake=${includeFake}`);
  return unwrapMany<Game>(await res.json());
}

export async function fetchGame(id: number): Promise<Game> {
  const res = await fetch(`${BASE}/games/${id}`);
  if (!res.ok) throw new Error('Game not found');
  return unwrapOne<Game>(await res.json());
}

export async function createGame(data: Record<string, unknown>): Promise<Game> {
  const res = await fetch(`${BASE}/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create game');
  return unwrapOne<Game>(await res.json());
}

export async function deleteGame(id: number): Promise<void> {
  const res = await fetch(`${BASE}/games/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete game');
}

// ---- Stats ----

export async function fetchOverviewStats(includeFake = true): Promise<OverviewStats> {
  const res = await fetch(`${BASE}/stats/overview?includeFake=${includeFake}`);
  return unwrapOne<OverviewStats>(await res.json());
}

export async function fetchSpiritStats(includeFake = true): Promise<SpiritStats[]> {
  const res = await fetch(`${BASE}/stats/spirits?includeFake=${includeFake}`);
  return unwrapMany<SpiritStats>(await res.json());
}

export async function fetchAdversaryStats(includeFake = true): Promise<AdversaryStats[]> {
  const res = await fetch(`${BASE}/stats/adversaries?includeFake=${includeFake}`);
  return unwrapMany<AdversaryStats>(await res.json());
}

export async function fetchMatchupStats(includeFake = true): Promise<MatchupStats[]> {
  const res = await fetch(`${BASE}/stats/matchups?includeFake=${includeFake}`);
  return unwrapMany<MatchupStats>(await res.json());
}
