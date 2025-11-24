# Challenge Me

**The place where you need to act, not to think.**

Challenge Me is a micro-challenge app that pushes users to take action through real-world activities across 8 life areas. Built with React Native + Expo, it creates motivation through direct challenges, breathing exercises, and progress tracking.

---

## Overview

Challenge Me delivers actionable challenges designed to get you moving, connecting, growing, and living. Each challenge is based on real activities - running, calling family, attending classes, managing finances, and more. The app guides users through a breathing exercise before each challenge (from step 3 onwards) to help them get grounded and present.

### Core Features

- **Welcome Screen**: Clean introduction with the app philosophy
- **Onboarding**: Select 1-2 life areas, cadence (daily/weekly), notification time, and social opt-in
- **Daily Challenges**: 50+ real-world activities based on client-written content
- **Breathing Exercise**: Pre-challenge mindfulness session (appears from step 3 after 2 completed challenges)
- **Timer System**: Countdown timer that continues in background, with persistence across app restarts
- **Follow-up Questions**: Reflection prompts after completing challenges
- **Feedback Loop**: Emoji feedback + "would you repeat?" question
- **Progress Tracking**: Streak counter, calendar heatmap, area breakdown, top moments
- **Achievement System**: 22 unlockable badges across 5 categories
- **Social Leaderboard**: Friends system with nudging and achievements display
- **Settings**: Full customization with time picker and danger zone for data reset

---

## Tech Stack

- **Framework**: Expo SDK 54 + React Native
- **Language**: TypeScript
- **Navigation**: expo-router (file-based routing)
- **State**: Zustand for global state management
- **Storage**: AsyncStorage for persistence
- **Notifications**: expo-notifications with local scheduling
- **Haptics**: expo-haptics for tactile feedback
- **Styling**: StyleSheet with Google Material Design tokens

---

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (installed globally or via npx)

### Installation

```bash
# Clone or navigate to project
cd sparks

# Install dependencies
npm install

# Start development server
npm start

# Run on specific platform
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

### Environment

No API keys or environment variables required for basic functionality. Push notifications work on device but not web.

---

## Project Structure

```
sparks/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout with navigation logic
│   ├── onboarding.tsx            # Welcome + area selection flow
│   ├── settings.tsx              # Settings screen
│   └── (tabs)/                   # Tab navigation
│       ├── _layout.tsx           # Tab layout configuration
│       ├── index.tsx             # Home/Challenge screen
│       ├── progress.tsx          # Progress & stats
│       └── social.tsx            # Social leaderboard & achievements
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── Button.tsx            # Haptic-enabled buttons
│   │   ├── Card.tsx              # Content card wrapper
│   │   ├── Chip.tsx              # Selectable area chips
│   │   ├── TimerRing.tsx         # Animated countdown ring
│   │   ├── UserProfile.tsx       # User avatar and settings access
│   │   ├── BreathingExercise.tsx # Pre-challenge breathing animation
│   │   ├── StatCard.tsx          # Stats display card
│   │   ├── HeatMap.tsx           # Calendar progress heatmap
│   │   ├── AchievementBadge.tsx  # Achievement display with progress
│   │   └── index.ts              # Component exports
│   ├── store/                    # Zustand stores
│   │   ├── useUserStore.ts       # User state, achievements & preferences
│   │   ├── useAssignmentStore.ts # Challenge assignments & history
│   │   └── useSettingsStore.ts   # Friends & settings
│   ├── services/                 # Business logic
│   │   ├── assigner.ts           # Challenge assignment algorithm
│   │   ├── notifications.ts      # Push notification scheduling
│   │   ├── storage.ts            # AsyncStorage helpers with timer persistence
│   │   └── achievements.ts       # Achievement checking & progress tracking
│   ├── data/
│   │   ├── client-challenges.seed.ts  # 50 client-written challenges
│   │   ├── challenges.seed.ts         # Combined challenge pool (85 total)
│   │   └── achievements.seed.ts       # 22 achievement definitions
│   ├── utils/
│   │   ├── time.ts               # Time/date utilities
│   │   └── progression.ts        # Step counting & breathing gate logic
│   ├── types.ts                  # TypeScript types
│   ├── copy.ts                   # Centralized UI copy
│   └── theme.ts                  # Design tokens
├── assets/                       # Images and icons
├── app.json                      # Expo config
├── package.json
└── README.md
```

---

## Challenge System

### Challenge Categories & Counts

| Category | Area Tag | Challenges | Focus |
|----------|----------|------------|-------|
| Health & Fitness | `health` | 7 | Running, gym classes, fasting, no sugar |
| Family & Friends | `social` | 7 | Reconnecting, game nights, hiking |
| Self-Love | `selflove` | 7 | Self-care, affirmations, boundaries |
| Career & Purpose | `focus` | 7 | Ikigai, job exploration, networking |
| Romance | `romance` | 7 | Dating apps, dance classes, speed dating |
| Fun & Creativity | `creativity` | 8 | Painting, DJing, music, poker |
| Money & Finances | `money` | 7 | Budgeting, saving, subscription audit |
| **Total Client Challenges** | | **50** | |
| Original Challenges | mixed | 35 | Various activities |
| **Total Pool** | | **85** | |

### Example Challenges

**Health - Go for a 2K Run**
```
Put on sports clothes, pick a route, and run at least 2 kilometers.

Steps:
1. Put on sports clothes and running shoes
2. Check the route distance using a maps app
3. Stretch your legs before starting
4. Run at least 2 kilometers
5. Take a photo of yourself at the end

Follow-up: How did it go? Would you recommend running?
```

**Social - Reconnect with Family**
```
Reach out to a family member you have not talked to in a while.

Steps:
1. Think of the family member you haven't been in touch with
2. Consider if you miss them or want to make up for past conflicts
3. Send them a message or make a call
4. Be genuine and open in your conversation

Follow-up: How did it feel to reconnect? Will you stay in touch?
```

**Romance - Partner Dance Class**
```
Book a partner dance class: Salsa, Swing, or Tango.

Steps:
1. Search for partner dance classes near you
2. Choose: Salsa, Swing, Tango, or Bachata
3. Book a session for the earliest date
4. Go alone - you'll be paired with others
5. Enjoy the shared activity and natural conversation
```

### Assignment Algorithm

```typescript
// Filter challenges by user's selected areas (1-2 areas)
eligible = challenges.filter(c => c.areaTags overlaps user.areas)

// Exclude already completed challenges
fresh = eligible.filter(c => !history.includes(c.id))

// If all used, reset pool
if (fresh.length === 0) fresh = eligible

// 70% serious / 30% playful tone selection
tone = (seed % 100) < 70 ? 'serious' : 'playful'

// Pick first matching challenge (sequential, not random)
selected = tonedChallenges[0]
```

---

## User Flow

### 1. Welcome Screen
- App title and philosophy
- "Continue" button to proceed

### 2. Onboarding
- Select 1-2 life areas to focus on
- Choose notification cadence (daily/every 2 days/every 3 days/weekly)
- Set preferred notification time with time picker
- Toggle social sharing

### 3. Challenge Flow
```
[Challenge Assigned]
        ↓
[START button pressed]
        ↓
[Breathing Exercise] ← Only shown after 2 completed challenges
   - Back / Skip options
   - "Ready?" question after breathing
   - "Give me a few minutes" option with 2-min wait
        ↓
[Timer starts - runs in background]
        ↓
[COMPLETED or GIVE UP]
        ↓
[Follow-up reflection] ← If challenge has followUp questions
        ↓
[Feedback: emoji + would repeat?]
        ↓
[Next challenge assigned]
```

### 4. Breathing Exercise Logic
- **Step 1-2**: No breathing exercise (first-time users)
- **Step 3+**: Breathing exercise shown before each challenge
- Users can opt out permanently with "Don't show again"

---

## Achievement System

### Categories

**Streak Achievements** (4 badges)
- Getting Started: 3 days in a row
- Week Warrior: 7 days in a row
- Monthly Master: 30 days in a row
- Century Club: 100 days in a row

**Total Completion** (5 badges)
- First Spark: Complete 1 challenge
- Ten Strong: Complete 10 challenges
- Marathonian: Complete 42 challenges
- Centurion: Complete 100 challenges
- Year Round: Complete 365 challenges

**Timing** (2 badges)
- Morning Person: 7 morning completions
- Night Owl: 7 evening completions

**Area-Specific** (5 badges)
- Health Master, Creative Genius, Social Butterfly, Nature Lover, Focus Master

**Special** (6 badges)
- No Swap Sam, Speed Demon, Jack of All Areas, Feedback Fire, Memory Keeper, Social Spark

---

## Design System

### Colors (Google Material Design)

- **Primary**: `#4285F4` (Google Blue)
- **Secondary**: `#34A853` (Google Green)
- **Error**: `#EA4335` (Google Red)
- **Warning**: `#FBBC04` (Google Yellow)
- **Background**: `#FFFFFF`
- **Text**: `#202124`

### Area Colors

Each area has a unique color for chips and visualizations:
- Health, Creativity, Social, Nature, Focus, Money, Romance, Self-love

### Components

- **Button**: 4 variants (primary, secondary, outline, danger) with haptic feedback
- **Card**: Elevated container with rounded corners
- **Chip**: Toggle-able area selector with color coding
- **TimerRing**: Circular countdown indicator
- **BreathingExercise**: Full-screen modal with back/skip controls
- **HeatMap**: Calendar-based progress visualization
- **AchievementBadge**: Badge display with progress bars

---

## Screens

### Home (Challenge)
- Header with greeting and UserProfile (access to settings)
- Current streak display
- Challenge card with title, description, steps, and area tags
- Timer ring when active
- Start/Complete/Give Up buttons

### Progress
- Large streak card
- Stats grid: completed, fire moments, success rate, total hours, best day
- Calendar heatmap of activity
- Area breakdown
- Top moments (fire-rated challenges)

### Social
- User rank card
- Friends leaderboard with nudge buttons
- Achievements section sorted by unlock status

### Settings
- Area selection (1-2 areas)
- Cadence selection
- Time picker for notifications
- Social opt-in toggle
- Share progress button
- Danger zone: reset all data

---

## Known Issues

1. **Web**: Push notifications don't work on web (Expo limitation)
2. **Storage**: No cloud sync - data lives on device only
3. **Timezones**: Assignment time based on device local time
4. **Authentication**: No user accounts - all data is local

---

## Development

### Adding New Challenges

Add challenges to `src/data/client-challenges.seed.ts`:

```typescript
{
  id: 'unique_id',
  title: 'Challenge Title',
  short: 'One sentence description.',
  areaTags: ['health'], // or multiple: ['health', 'social']
  tone: 'serious', // or 'playful'
  durationMin: 20,
  steps: [
    'Step 1',
    'Step 2',
    'Step 3',
  ],
  followUp: [
    'How did it go?',
    'Would you do this again?',
  ],
}
```

### Running TypeScript Check

```bash
npx tsc --noEmit
```

---

## License

MIT License

---

## Credits

Built with React Native, Expo, TypeScript, and Zustand.

**Philosophy**: Small actions create big change. Act, don't think.

---

**Remember: You're one challenge away from a breakthrough.**
