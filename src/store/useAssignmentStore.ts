import { create } from 'zustand';
import { ChallengeAssignment, FeedbackType, TelemetryEvent } from '../types';

interface AssignmentState {
  currentAssignment: ChallengeAssignment | null;
  history: ChallengeAssignment[];
  telemetry: TelemetryEvent[];
  setCurrentAssignment: (assignment: ChallengeAssignment) => void;
  updateAssignment: (partial: Partial<ChallengeAssignment>) => void;
  startChallenge: () => void;
  completeChallenge: (feedback?: FeedbackType, wouldRepeat?: boolean, photoUri?: string) => void;
  skipChallenge: () => void;
  expireChallenge: () => void;
  swapChallenge: () => void;
  snoozeChallenge: () => void;
  addToHistory: (assignment: ChallengeAssignment) => void;
  logEvent: (type: TelemetryEvent['type'], metadata?: Record<string, any>) => void;
  reset: () => void;
}

export const useAssignmentStore = create<AssignmentState>((set) => ({
  currentAssignment: null,
  history: [],
  telemetry: [],

  setCurrentAssignment: (assignment) => {
    set({ currentAssignment: assignment });
    set((state) => ({
      telemetry: [
        ...state.telemetry,
        { type: 'assignment_assigned', timestamp: Date.now(), metadata: { templateId: assignment.templateId } },
      ],
    }));
  },

  updateAssignment: (partial) => set((state) => ({
    currentAssignment: state.currentAssignment
      ? { ...state.currentAssignment, ...partial }
      : null,
  })),

  startChallenge: () => set((state) => {
    if (!state.currentAssignment) return state;
    const updated = {
      ...state.currentAssignment,
      status: 'started' as const,
      startedAt: Date.now(),
    };
    return {
      currentAssignment: updated,
      telemetry: [
        ...state.telemetry,
        { type: 'challenge_started', timestamp: Date.now(), metadata: { templateId: updated.templateId } },
      ],
    };
  }),

  completeChallenge: (feedback, wouldRepeat, photoUri) => set((state) => {
    if (!state.currentAssignment) return state;
    const completed = {
      ...state.currentAssignment,
      status: 'completed' as const,
      completedAt: Date.now(),
      feedback,
      wouldRepeat,
      photoUri,
    };
    return {
      currentAssignment: completed,
      history: [completed, ...state.history],
      telemetry: [
        ...state.telemetry,
        { type: 'challenge_completed', timestamp: Date.now(), metadata: { templateId: completed.templateId, feedback } },
      ],
    };
  }),

  skipChallenge: () => set((state) => {
    if (!state.currentAssignment) return state;
    return {
      currentAssignment: {
        ...state.currentAssignment,
        status: 'skipped' as const,
      },
    };
  }),

  expireChallenge: () => set((state) => {
    if (!state.currentAssignment) return state;
    const expired = {
      ...state.currentAssignment,
      status: 'expired' as const,
    };
    return {
      currentAssignment: expired,
      history: [expired, ...state.history],
    };
  }),

  swapChallenge: () => set((state) => {
    if (!state.currentAssignment || state.currentAssignment.hasSwapped) return state;
    return {
      currentAssignment: {
        ...state.currentAssignment,
        hasSwapped: true,
      },
      telemetry: [
        ...state.telemetry,
        { type: 'challenge_swapped', timestamp: Date.now() },
      ],
    };
  }),

  snoozeChallenge: () => set((state) => {
    if (!state.currentAssignment) return state;
    return {
      currentAssignment: {
        ...state.currentAssignment,
        hasSnoozed: true,
        dueAt: state.currentAssignment.dueAt + 60 * 60 * 1000, // +60 minutes
      },
      telemetry: [
        ...state.telemetry,
        { type: 'challenge_snoozed', timestamp: Date.now() },
      ],
    };
  }),

  addToHistory: (assignment) => set((state) => ({
    history: [assignment, ...state.history],
  })),

  logEvent: (type, metadata) => set((state) => ({
    telemetry: [
      ...state.telemetry,
      { type, timestamp: Date.now(), metadata },
    ],
  })),

  reset: () => set({
    currentAssignment: null,
    history: [],
    telemetry: [],
  }),
}));
