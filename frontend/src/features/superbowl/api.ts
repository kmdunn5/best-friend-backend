import type { Game, Guess } from './types';

const BASE = '/api/superbowl/commercial-guessing';

function unwrapJsonApi<T>(json: any): T {
  const attrs = json?.data?.attributes ?? {};
  const id = json?.data?.id;
  return { id: Number(id), ...attrs } as T;
}

export async function fetchCurrentGame(): Promise<Game | null> {
  const res = await fetch(`${BASE}/games/current`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch current game');
  const json = await res.json();
  return unwrapJsonApi<Game>(json);
}

export async function submitGuess(
  gameId: number,
  guesserName: string,
  category: string
): Promise<Guess> {
  const res = await fetch(`${BASE}/games/${gameId}/guesses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ guesserName, category }),
  });
  if (!res.ok) throw new Error('Failed to submit guess');
  const json = await res.json();
  return unwrapJsonApi<Guess>(json);
}

export async function adminCreateGame(
  secret: string,
  year: number,
  guessingOpensAt?: string
): Promise<Game> {
  const res = await fetch(`${BASE}/admin/games`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Secret': secret,
    },
    body: JSON.stringify({ year, guessingOpensAt }),
  });
  if (res.status === 403) throw new Error('Invalid admin secret');
  if (!res.ok) throw new Error('Failed to create game');
  const json = await res.json();
  return unwrapJsonApi<Game>(json);
}

export async function adminUpdateStatus(
  secret: string,
  gameId: number,
  status: string
): Promise<Game> {
  const res = await fetch(`${BASE}/admin/games/${gameId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Secret': secret,
    },
    body: JSON.stringify({ status }),
  });
  if (res.status === 403) throw new Error('Invalid admin secret');
  if (!res.ok) throw new Error('Failed to update status');
  const json = await res.json();
  return unwrapJsonApi<Game>(json);
}

export async function adminSetWinner(
  secret: string,
  gameId: number,
  winningCategory: string
): Promise<Game> {
  const res = await fetch(`${BASE}/admin/games/${gameId}/winner`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Secret': secret,
    },
    body: JSON.stringify({ winningCategory }),
  });
  if (res.status === 403) throw new Error('Invalid admin secret');
  if (!res.ok) throw new Error('Failed to set winner');
  const json = await res.json();
  return unwrapJsonApi<Game>(json);
}
