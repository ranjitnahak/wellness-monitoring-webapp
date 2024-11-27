export interface WellnessEntry {
  id: string;
  athlete_id: string;
  date: string;
  sleep_hours: number;
  stress_level: number;
  fatigue_level: number;
  muscle_soreness: number;
  mood: 'Poor' | 'Average' | 'Good';
  created_at: string;
}

export interface Athlete {
  id: string;
  name: string;
  team_id: string;
  email: string;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  created_at: string;
}

export interface WellnessCheckIn {
  id?: string;
  userId: string;
  date: string;
  sleep: number;
  fatigue: number;
  mood: number;
  stress: number;
  soreness: number;
  notes?: string;
  created_at?: string;
}

export type WellnessRating = 1 | 2 | 3 | 4 | 5;

export interface WellnessStats {
  averageSleep: number;
  averageMood: number;
  averageFatigue: number;
  averageStress: number;
  averageSoreness: number;
}
