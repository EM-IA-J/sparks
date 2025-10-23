# Sparks ✨

**Small challenges. Big shifts.**

Sparks is a motivational micro-challenge app that activates users' lives through daily or weekly challenges across 1-3 life areas. Built with React Native + Expo, it creates adherence and motivation through emotional design, positive reinforcement, and light gamification.

---

## 🎯 Overview

Sparks delivers bite-sized challenges designed to create small doses of emotion, vulnerability, or personal discovery. Each challenge is deterministic (based on date + user areas), avoiding repetition and balancing serious and playful tones.

### Core Features

- **Onboarding**: Select 3 life areas, cadence (daily/weekly), notification window, and social opt-in with animated confetti celebration
- **Daily Challenges**: Deterministic assignment with A/B tone pairing and one-time swap option
- **Breathing Exercise**: Pre-challenge mindfulness session with animated breathing guide
- **Timer System**: Persistent in-app countdown with animated breathing ring, pause/resume, and push notifications
- **3-Notification Flow**: Spark start → Timer complete → Feedback submitted
- **Feedback Loop**: Emoji feedback (🔥/🙂/😐/💩) + "would you repeat?" question
- **Progress Tracking**: Streak counter, calendar heatmap, area breakdown, top moments
- **Achievement System**: 22 unlockable badges across 5 categories (streak, total, timing, area, special)
- **Social Leaderboard**: Mock friends system with nudging, streak comparison, and achievements display
- **User Profile**: Avatar with initials displayed in header, showing streak and quick access to settings
- **Progress Sharing**: Share your streak and accomplishments on social media with custom message
- **Settings**: Full customization with progress sharing and danger zone for data reset

---

## 📦 Tech Stack

- **Framework**: Expo SDK 54 + React Native 0.81
- **Language**: TypeScript (strict mode)
- **Navigation**: expo-router (file-based routing)
- **State**: Zustand for global state management
- **Storage**: AsyncStorage for persistence
- **Notifications**: expo-notifications with local scheduling
- **Haptics**: expo-haptics for tactile feedback
- **Styling**: StyleSheet with Google Material Design tokens

---

## 🚀 Setup

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

## 📂 Project Structure

```
sparks/
├── app/                      # Expo Router screens
│   ├── _layout.tsx          # Root layout with navigation logic
│   ├── onboarding.tsx       # Onboarding flow
│   ├── settings.tsx         # Settings screen
│   └── (tabs)/              # Tab navigation
│       ├── _layout.tsx      # Tab layout
│       ├── index.tsx        # Home/Challenge screen
│       ├── progress.tsx     # Progress & stats
│       └── social.tsx       # Social leaderboard
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx       # Haptic-enabled buttons
│   │   ├── Card.tsx         # Content card wrapper
│   │   ├── Chip.tsx         # Selectable area chips
│   │   ├── TimerRing.tsx    # Animated countdown ring with breathing effect
│   │   ├── UserProfile.tsx  # User avatar and streak
│   │   ├── BreathingExercise.tsx  # Pre-challenge breathing animation
│   │   ├── StatCard.tsx     # Stats display card
│   │   ├── HeatMap.tsx      # Calendar progress heatmap
│   │   ├── AchievementBadge.tsx   # Achievement display with progress
│   │   ├── SplashScreen.tsx # App splash screen
│   │   └── index.ts         # Component exports
│   ├── store/               # Zustand stores
│   │   ├── useUserStore.ts  # User state, achievements & preferences
│   │   ├── useAssignmentStore.ts  # Challenge assignments & history
│   │   └── useSettingsStore.ts    # Friends & settings
│   ├── services/            # Business logic
│   │   ├── assigner.ts      # Challenge assignment algorithm
│   │   ├── notifications.ts # Push notification scheduling (3-step flow)
│   │   ├── storage.ts       # AsyncStorage helpers with timer persistence
│   │   └── achievements.ts  # Achievement checking & progress tracking
│   ├── data/
│   │   ├── challenges.seed.ts  # 30+ challenge templates
│   │   └── achievements.seed.ts # 22 achievement definitions
│   ├── utils/
│   │   └── time.ts          # Time/date utilities
│   ├── types.ts             # TypeScript types
│   ├── copy.ts              # Centralized UI copy
│   └── theme.ts             # Design tokens
├── assets/                   # Images and icons
├── app.json                  # Expo config
├── package.json
└── README.md
```

---

## 🎨 Design System

### Colors (Google Material Design)

- **Primary**: `#4285F4` (Google Blue)
- **Secondary**: `#34A853` (Google Green)
- **Error**: `#EA4335` (Google Red)
- **Warning**: `#FBBC04` (Google Yellow)
- **Background**: `#FFFFFF` (clean white)
- **Text**: `#202124` (Google dark gray)
- **Area Colors**: Each of 8 areas has a unique vibrant color from Google palette

### Spacing

- `xs`: 4px, `sm`: 8px, `md`: 16px, `lg`: 24px, `xl`: 32px, `xxl`: 48px

### Typography

- **Display**: 48px bold (onboarding titles)
- **xxxl**: 32px bold (screen titles)
- **xxl**: 24px bold (card headers)
- **base**: 16px regular (body text)

### Components

- **Button**: 4 variants (primary, secondary, outline, danger) with haptic feedback
- **Card**: Elevated container with rounded corners and shadow
- **Chip**: Toggle-able area/option selector with color coding
- **TimerRing**: Circular progress indicator with animated breathing effect
- **BreathingExercise**: Full-screen pre-challenge mindfulness animation
- **UserProfile**: Avatar with initials, streak counter, and navigation to settings
- **HeatMap**: Calendar-based progress visualization
- **AchievementBadge**: Unlockable badge display with progress bars
- **StatCard**: Stat display with icons and values

---

## 🧩 Challenge System

### Challenge Templates

30+ challenges across 8 areas:

1. **Health**: Cold shower, meditation, phone detox
2. **Creativity**: Drawing, haiku, cooking experiments
3. **Social**: Friend calls, barista conversations, compliments
4. **Nature**: Silent walks, tree naming, barefoot grounding
5. **Focus**: App blocking, deep reading, subscription audit
6. **Money**: Subscription audit, micro-savings
7. **Romance**: Profile refresh, smile missions
8. **Self-love**: Decluttering, gratitude lists, digital detox

### Assignment Algorithm

```typescript
// Deterministic seed based on date + user areas
seed = hash(todayDate + sortedAreas)

// Filter by user's selected areas
eligible = challenges.filter(c => c.areaTags overlaps user.areas)

// Avoid last 5 completed
fresh = eligible.filter(c => !recentHistory.includes(c.id))

// 70% serious / 30% playful tone
tone = (seed % 100) < 70 ? 'serious' : 'playful'

// Pick challenge deterministically
index = seed % tonedChallenges.length
selected = tonedChallenges[index]
```

### A/B Pairing

Each challenge has an `altId` linking to its opposite tone:
- **Serious**: "Cold shock therapy" (60s cold shower)
- **Playful**: "Ice ice baby" (dance in freezing shower)

Users can swap once per challenge.

---

## 🏆 Achievement System

### Achievement Categories

**Streak Achievements** (4 badges)
- 🔥 **Getting Started**: Complete 3 days in a row
- 🔥 **Week Warrior**: Complete 7 days in a row
- 🔥 **Monthly Master**: Complete 30 days in a row
- 🔥 **Century Club**: Complete 100 days in a row

**Total Completion** (5 badges)
- ⚡ **First Spark**: Complete your first challenge
- ⚡ **Ten Strong**: Complete 10 challenges
- 🏃 **Marathonian**: Complete 42 challenges (like a marathon!)
- 💯 **Centurion**: Complete 100 challenges
- 📅 **Year Round**: Complete 365 challenges

**Timing** (2 badges)
- 🌅 **Morning Person**: Complete 7 morning sparks (6am-12pm)
- 🌙 **Night Owl**: Complete 7 evening sparks (6pm-12am)

**Area-Specific** (5 badges)
- 💪 **Health Master**: Complete 20 health challenges
- 🎨 **Creative Genius**: Complete 20 creativity challenges
- 👥 **Social Butterfly**: Complete 20 social challenges
- 🌳 **Nature Lover**: Complete 20 nature challenges
- 🎯 **Focus Master**: Complete 20 focus challenges

**Special** (6 badges)
- 🎯 **No Swap Sam**: Complete 10 challenges without swapping
- ⚡ **Speed Demon**: Complete 5 challenges early
- 🌈 **Jack of All Areas**: Complete challenges in all 8 areas
- 🔥 **Feedback Fire**: Give 10 fire (🔥) ratings
- 📸 **Memory Keeper**: Upload 5 photos (future)
- 🤝 **Social Spark**: Invite 3 friends (future)

### How Achievements Work

1. **Auto-unlock**: Achievements unlock automatically when you complete a challenge
2. **Progress Tracking**: See your progress towards locked achievements with progress bars
3. **Visual Feedback**: Get an alert when you unlock a new achievement
4. **Display**: View all achievements in the Social tab, sorted by unlock status

---

## 🧪 Wireframes

### 1. Onboarding

```
┌─────────────────────┐
│  Welcome to Sparks  │
│ Small challenges.   │
│    Big shifts.      │
│                     │
│ Pick 3 areas:       │
│ [Health] [Creativity]│
│ [Social] [Nature]   │
│ [Focus] [Money]     │
│ [Romance] [Self-love]│
│                     │
│ Cadence: [Daily]    │
│ Window: [Morning]   │
│ Social: [Toggle]    │
│                     │
│   [Spark me] 🔥     │
└─────────────────────┘
```

### 2. Home/Challenge

```
┌─────────────────────┐
│ Today's Spark       │
│ 🔥 3 day streak     │
│                     │
│ ┌─────────────────┐ │
│ │ Cold Shock      │ │
│ │ Therapy         │ │
│ │                 │ │
│ │ Take a 60s cold │ │
│ │ shower          │ │
│ │                 │ │
│ │ 1. Warm start   │ │
│ │ 2. Go cold 60s  │ │
│ │ 3. Breathe deep │ │
│ │                 │ │
│ │ [health]        │ │
│ └─────────────────┘ │
│                     │
│ Alternative:        │
│ Ice ice baby        │
│ [Swap]              │
│                     │
│    ⭕ 20:00         │
│                     │
│ [Start Challenge]   │
└─────────────────────┘
```

### 3. Progress

```
┌─────────────────────┐
│ Progress            │
│                     │
│ ┌─────────────────┐ │
│ │      12         │ │
│ │   day streak    │ │
│ └─────────────────┘ │
│                     │
│ Total: 45 sparks    │
│                     │
│ By Area:            │
│ ● Health: 15        │
│ ● Creativity: 12    │
│ ● Social: 10        │
│ ● Nature: 8         │
│                     │
│ Top Moments:        │
│ 🔥 Challenge 1      │
│ 🔥 Challenge 3      │
│ 🔥 Challenge 7      │
└─────────────────────┘
```

### 4. Social

```
┌─────────────────────┐
│ Social              │
│                     │
│ ┌─────────────────┐ │
│ │ 👑 You          │ │
│ │ 12 day streak   │ │
│ │ 45 sparks       │ │
│ └─────────────────┘ │
│                     │
│ Leaderboard         │
│                     │
│ #2 🔥 Alex          │
│    12 · 45    [Nudge]│
│                     │
│ #3 ⚡ Jordan        │
│    8 · 32     [Nudge]│
│                     │
│ #4 🌟 Sam (invited) │
│    0 · 0            │
│                     │
│ [Invite Friend]     │
│                     │
│ Achievements        │
│                     │
│ ┌─────────────────┐ │
│ │ 🔥 Week Warrior │ │
│ │ Complete 7 days │ │
│ │ Unlocked 2 days │ │
│ │ ago             │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │ 🔒 Marathonian  │ │
│ │ Complete 42...  │ │
│ │ ████░░░░ 12/42  │ │
│ └─────────────────┘ │
└─────────────────────┘
```

---

## 📊 Test Plan (2 Weeks)

### Week 1: Internal Testing

**Days 1-3**: Core flow validation
- Complete onboarding 5 times with different area combinations
- Verify challenge assignment is deterministic (same date/areas = same challenge)
- Test swap functionality (only works once)
- Validate timer countdown + pause/resume
- Confirm notification scheduling

**Days 4-7**: Edge cases
- Skip challenges, verify they move to history
- Test midnight expiration (set device time)
- Break streak by missing a day, verify reset
- Export data JSON, verify format
- Reset all data, confirm clean state

### Week 2: User Testing (10 Participants)

**Recruitment**:
- 5 users interested in self-improvement
- 5 users skeptical of habit apps
- Mix of iOS and Android

**Test Protocol**:

1. **Onboarding** (5 min)
   - Can you complete setup without help?
   - Did you understand what areas mean?
   - Did confetti/haptic feel rewarding?

2. **First Challenge** (10 min)
   - Read challenge aloud. What's your first reaction?
   - Is the tone appropriate (serious vs playful)?
   - Would you actually do this challenge?
   - Try the swap. Does the alternative feel different?

3. **Timer Experience** (5 min)
   - Start timer. Pause. Resume. Complete.
   - Did the ring animation feel satisfying?
   - Was 20min default too long/short/just right?

4. **Feedback** (2 min)
   - Rate with emojis. Does this capture your feeling?
   - "Would you do this again?" - is this question valuable?

5. **Daily Use** (7 days)
   - Complete at least 3 challenges over 7 days
   - Note which challenges felt meaningful vs annoying
   - Track streak - does it motivate you?

6. **Final Interview** (15 min)
   - **Emotion**: "Which spark gave you energy today?"
   - **Motivation**: "Was there a challenge that changed your mood?"
   - **Habit**: "Can you see doing this for 30 days?"
   - **Social**: "Would you invite friends?"
   - **Improvement**: "What would make you use this daily?"

### Metrics to Track

| Metric | Target | Why |
|--------|--------|-----|
| Notification open rate | >40% | Indicates content relevance |
| Challenge start rate | >60% | Shows initial engagement |
| Challenge completion rate | >50% | Core behavior we're building |
| Swap usage rate | ~20% | A/B testing effectiveness |
| D7 retention | >30% | Habit formation signal |
| Streak ≥3 days | >40% users | Momentum indicator |
| Fire feedback (🔥) | >25% | Delightful moments |
| Would repeat "yes" | >60% | Content-market fit |

### Success Criteria

**Must Have**:
- Zero crashes during core flows
- Timer accuracy within 1 second
- Notifications fire within 1 minute of scheduled time
- Onboarding completion >90%

**Should Have**:
- Challenge completion rate >50%
- D7 retention >30%
- At least 3 users say a challenge "changed their day"

**Nice to Have**:
- Users invite friends organically
- Users request specific challenge types
- Users customize challenge difficulty

---

## 🔮 Future Enhancements

### Near-term
- Photo uploads for completed challenges (achievement ready)
- Friends system (real, not mock) with achievement sharing
- Custom challenge creation by users
- Snooze +60min functionality
- 14-day habit locking
- Achievement notifications with custom animations
- Achievement sharing on social media

### Mid-term
- AI-generated challenges based on mood and past performance
- Voice-guided breathing exercises with customizable durations
- Integration with HealthKit/Google Fit for health challenges
- Weekly reflection summaries with achievement highlights
- Challenge difficulty levels (easy/medium/hard)
- Achievement leaderboard with friends

### Long-term
- Community challenges (citywide events) with group achievements
- Therapist/coach partnerships with custom achievement tracks
- Challenge marketplace where users can create and share
- AR/VR immersive experiences for challenges
- Achievement NFTs for milestone celebrations

---

## 🐛 Known Issues

1. **Web**: Push notifications don't work on web (Expo limitation)
2. **Storage**: No cloud sync - data lives on device only (achievements included)
3. **Timezones**: Assignment time is based on device local time
4. **Authentication**: No user accounts yet - all data is local only
5. **Achievements**: Speed Demon achievement uses placeholder logic (needs timer completion tracking)
6. **Timer**: Breathing animation may stutter on low-end devices

---

## 📝 License

MIT License - feel free to fork and build upon this!

---

## 🙏 Credits

Built with love by a senior product engineer + designer who believes small actions create big change.

**Stack**: React Native, Expo, TypeScript, Zustand, expo-router

**Inspiration**: James Clear (Atomic Habits), BJ Fogg (Tiny Habits), streaks from Duolingo, design from Google Material

---

## 📞 Contact

Questions? Feedback? Want to contribute?

Open an issue or PR on GitHub.

---

**Remember: You're just one spark away from a breakthrough.** ✨🔥
