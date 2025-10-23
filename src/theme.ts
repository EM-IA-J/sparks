// Google-style design system with clean, modern colors
export const theme = {
  colors: {
    // Primary Google Blue
    primary: '#4285F4', // Google Blue
    primaryLight: '#669DF6',
    primaryDark: '#1A73E8',

    // Secondary accent colors
    secondary: '#34A853', // Google Green
    secondaryLight: '#5BB974',
    secondaryDark: '#0F9D58',

    // Neutral grays with warmth
    bg: '#FFFFFF',
    bgCard: '#FFFFFF',
    bgOverlay: 'rgba(0, 0, 0, 0.5)',

    text: '#202124', // Google dark gray
    textLight: '#5F6368',
    textMuted: '#80868B',

    border: '#DADCE0',
    borderLight: '#F1F3F4',

    // Status colors (Google style)
    success: '#34A853', // Google Green
    warning: '#FBBC04', // Google Yellow
    error: '#EA4335', // Google Red

    // Area colors (Google palette)
    areas: {
      health: '#EA4335', // Red
      creativity: '#FBBC04', // Yellow
      social: '#4285F4', // Blue
      nature: '#34A853', // Green
      focus: '#9334E6', // Purple
      money: '#0F9D58', // Dark Green
      romance: '#F538A0', // Pink
      selflove: '#FF6D00', // Orange
    },

    // Feedback emojis mapped to colors
    feedback: {
      fire: '#EA4335',
      good: '#34A853',
      meh: '#FBBC04',
      bad: '#5F6368',
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },

  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 48,
  },

  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 5,
    },
  },

  gradients: {
    primary: ['#4285F4', '#1A73E8'],
    warm: ['#FBBC04', '#EA4335'],
    cool: ['#4285F4', '#34A853'],
    purple: ['#9334E6', '#C084FC'],
  },
};

export type Theme = typeof theme;
export type Color = keyof typeof theme.colors;
export type Area = keyof typeof theme.colors.areas;
