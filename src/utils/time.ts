import { NotifWindow } from '../types';

// Time utilities for scheduling and formatting
export const getHourForWindow = (window: NotifWindow): number => {
  switch (window) {
    case '6am': return 6;
    case '7am': return 7;
    case '8am': return 8;
    case '9am': return 9;
    case '12pm': return 12;
    case '1pm': return 13;
    case '5pm': return 17;
    case '6pm': return 18;
    case '7pm': return 19;
    case '8pm': return 20;
  }
};

export const getTodayAtHour = (hour: number): Date => {
  const now = new Date();
  now.setHours(hour, 0, 0, 0);
  return now;
};

export const getTomorrowAtHour = (hour: number): Date => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(hour, 0, 0, 0);
  return tomorrow;
};

export const getMidnight = (): Date => {
  const midnight = new Date();
  midnight.setHours(23, 59, 59, 999);
  return midnight;
};

export const getTodayString = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD
};

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getDateDifference = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Deterministic seed based on date and user areas
export const getDailySeed = (date: string, areas: string[]): number => {
  const str = date + areas.sort().join('');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};
