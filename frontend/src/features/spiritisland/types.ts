export type Complexity = 'LOW' | 'MODERATE' | 'HIGH';
export type CardType = 'UNIQUE' | 'MINOR' | 'MAJOR';
export type PowerSpeed = 'FAST' | 'SLOW';
export type GameResult = 'WIN' | 'LOSS';
export type LossReason = 'BLIGHT' | 'SPIRIT_DESTROYED' | 'TIME_RAN_OUT';

export interface Spirit {
  id: number;
  name: string;
  complexity: Complexity;
  description: string;
  primaryElements: string;
  uniquePowers?: PowerCard[];
}

export interface Adversary {
  id: number;
  name: string;
  description: string;
  levels: AdversaryLevel[];
}

export interface AdversaryLevel {
  id: number;
  adversaryId: number;
  level: number;
  difficulty: number;
  name: string;
  effect: string;
}

export interface PowerCard {
  id: number;
  name: string;
  cardType: CardType;
  cost: number;
  speed: PowerSpeed;
  elements: string;
  description: string;
  spiritId: number | null;
}

export interface Game {
  id: number;
  playedAt: string;
  numPlayers: number;
  adversaryLevelId: number | null;
  result: GameResult;
  lossReason: LossReason | null;
  victoryTerrorLevel: number | null;
  numRounds: number | null;
  boardSetup: string | null;
  notes: string | null;
  fake: boolean;
  createdAt: string;
  spirits: GameSpirit[];
}

export interface GameSpirit {
  id: number;
  gameId: number;
  spiritId: number;
  spiritName: string;
  playerName: string;
  damageDealt: number | null;
  damagePrevented: number | null;
  fearGenerated: number | null;
  citiesDestroyed: number | null;
  townsDestroyed: number | null;
  explorersDestroyed: number | null;
  dahanSaved: number | null;
  blightRemoved: number | null;
  notes: string | null;
}

export interface OverviewStats {
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  avgTerrorLevel: number | null;
  avgRounds: number | null;
  mostCommonLossReason: string | null;
}

export interface SpiritStats {
  id: number;
  spiritName: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  avgDamageDealt: number;
  avgDamagePrevented: number;
  avgFearGenerated: number;
  avgCitiesDestroyed: number;
  avgTownsDestroyed: number;
  avgExplorersDestroyed: number;
}

export interface AdversaryStats {
  id: number;
  adversaryName: string;
  level: number;
  difficulty: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
}

export interface MatchupStats {
  id: number;
  spiritName: string;
  adversaryName: string;
  adversaryLevel: number;
  gamesPlayed: number;
  wins: number;
  winRate: number;
}

export const ELEMENT_COLORS: Record<string, string> = {
  SUN: '#f9a825',
  MOON: '#7e57c2',
  FIRE: '#e53935',
  AIR: '#42a5f5',
  WATER: '#1565c0',
  EARTH: '#6d4c41',
  PLANT: '#2e7d32',
  ANIMAL: '#d84315',
};

export const ELEMENT_ICONS: Record<string, string> = {
  SUN: '☀️',
  MOON: '🌙',
  FIRE: '🔥',
  AIR: '💨',
  WATER: '💧',
  EARTH: '⛰️',
  PLANT: '🌿',
  ANIMAL: '🐾',
};

export const COMPLEXITY_COLORS: Record<Complexity, string> = {
  LOW: '#2e7d32',
  MODERATE: '#f57f17',
  HIGH: '#c62828',
};

export const LOSS_REASON_LABELS: Record<LossReason, string> = {
  BLIGHT: 'Blight Overrun',
  SPIRIT_DESTROYED: 'Spirit Destroyed',
  TIME_RAN_OUT: 'Time Ran Out',
};
