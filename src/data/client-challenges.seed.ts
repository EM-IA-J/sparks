import { ChallengeTemplate } from '../types';

/**
 * CLIENT-BASED CHALLENGES
 * Based on the client document "Challenge me (Tasks ONLY)"
 * Organized by category with ~7 challenges each
 */

// ============================================================================
// HEALTH & FITNESS (hf prefix)
// Purpose: Try different activities and after 2 weeks decide which one fits you most
// ============================================================================
const HEALTH_CHALLENGES: ChallengeTemplate[] = [
  {
    id: 'hf001',
    title: 'Go for a 2K Run',
    short: 'Put on sports clothes, pick a route, and run at least 2 kilometers.',
    areaTags: ['health'],
    tone: 'serious',
    durationMin: 20,
    steps: [
      'Put on sports clothes and running shoes',
      'Check the route distance using a maps app (Strava works great)',
      'Stretch your legs before starting',
      'Run at least 2 kilometers',
      'Take a photo of yourself at the end',
    ],
    altId: 'hf002',
    followUp: [
      'How did it go?',
      'Would you recommend running to others?',
      'Did you enjoy this activity?',
    ],
  },
  {
    id: 'hf002',
    title: 'Go for a 4K Run',
    short: 'Level up - run at least 4 kilometers today.',
    areaTags: ['health'],
    tone: 'serious',
    durationMin: 30,
    steps: [
      'Get ready with your running gear',
      'Stretch your legs properly before starting',
      'Run at least 4 kilometers',
      'Track your progress with a running app',
      'Cool down and stretch after',
    ],
    altId: 'hf001',
    followUp: [
      'How did it go compared to shorter runs?',
      'Would you run this distance again?',
    ],
  },
  {
    id: 'hf003',
    title: 'Book a Gym Class',
    short: 'Book a guided class at the gym for this week.',
    areaTags: ['health'],
    tone: 'serious',
    durationMin: 60,
    steps: [
      'Search for gym classes near you',
      'Choose one: Spinning, HIIT, Zumba, Yoga, or Swimming',
      'Book a session for the closest possible day (within a week)',
      'Add it to your calendar',
      'Prepare your gym bag the night before',
    ],
    altId: 'hf004',
    followUp: [
      'Which class did you book?',
      'How did it feel trying something new?',
    ],
  },
  {
    id: 'hf004',
    title: 'Book a Personal Trainer',
    short: 'Book a session with a personal trainer at a gym.',
    areaTags: ['health'],
    tone: 'serious',
    durationMin: 60,
    steps: [
      'Research personal trainers at gyms near you',
      'Check reviews or ask for recommendations',
      'Book an initial session',
      'Prepare questions about your fitness goals',
    ],
    altId: 'hf003',
    followUp: [
      'What did you learn from the trainer?',
      'Would you continue with personal training?',
    ],
  },
  {
    id: 'hf005',
    title: 'Team Sport with a Friend',
    short: 'Book a team sport activity and invite a friend to join.',
    areaTags: ['health', 'social'],
    tone: 'playful',
    durationMin: 120,
    steps: [
      'Choose a sport: CrossFit, martial arts, volleyball, basketball, or tennis',
      'Find a place that offers sessions',
      'Book a spot for you and a friend',
      'Message your friend with the invite',
      'Confirm the date and time',
    ],
    altId: 'hf006',
    followUp: [
      'Which sport and friend did you choose?',
      'Would you do this again together?',
    ],
  },
  {
    id: 'hf006',
    title: 'No Sugar for 24 Hours',
    short: 'Starting now. No sugar. Nada. Zero. Be aware of everything you eat.',
    areaTags: ['health'],
    tone: 'serious',
    durationMin: 1440,
    steps: [
      'Commit to avoiding all sugar for the next 24 hours',
      'Check food labels before eating anything',
      'Replace sugary snacks with fruits or nuts',
      'Drink water when cravings hit',
      'Notice how you feel throughout the day',
    ],
    followUp: [
      'Did you make it through without sugar?',
      'How did your energy levels feel?',
      'Would you try this regularly?',
    ],
  },
  {
    id: 'hf007',
    title: 'Try 16-Hour Fasting',
    short: 'Do not eat anything from midnight until 4pm. Water, tea, black coffee only.',
    areaTags: ['health'],
    tone: 'serious',
    durationMin: 960,
    steps: [
      'Stop eating after dinner the night before',
      'Fast from midnight until at least 4pm',
      'You can drink: water, tea, or black coffee',
      'Break your fast with something nutritious',
      'Notice how your body and mind feel',
    ],
    followUp: [
      'How did you feel during the fast?',
      'Did you experience mental clarity?',
      'Would you incorporate fasting regularly?',
    ],
  },
];

// ============================================================================
// FAMILY & FRIENDS (fam prefix)
// Purpose: Get closer to family, strengthen friendships, possibly make new friends
// ============================================================================
const FAMILY_FRIENDS_CHALLENGES: ChallengeTemplate[] = [
  {
    id: 'fam001',
    title: 'Reconnect with Family',
    short: 'Reach out to a family member you have not talked to in a while.',
    areaTags: ['social'],
    tone: 'serious',
    durationMin: 60,
    steps: [
      'Think of the family member you have not been in touch with the longest',
      'Consider if you miss them or want to make up for past conflicts',
      'Send them a message or make a call',
      'Be genuine and open in your conversation',
    ],
    altId: 'fam002',
    followUp: [
      'How did it feel to reconnect?',
      'What did you talk about?',
      'Will you stay in touch more regularly?',
    ],
  },
  {
    id: 'fam002',
    title: 'Surprise a Friend in Need',
    short: 'Surprise a friend going through a rough time with a visit and small gift.',
    areaTags: ['social'],
    tone: 'serious',
    durationMin: 60,
    steps: [
      'Think of a friend who could use some support right now',
      'Choose a small gift: a book, cinema ticket, or their favorite treat',
      'Plan when you will surprise them with a visit',
      'Show up and spend quality time together',
    ],
    altId: 'fam001',
    followUp: [
      'Who did you surprise?',
      'How did they react?',
      'How did it make you feel?',
    ],
  },
  {
    id: 'fam003',
    title: 'Game Night with Friends',
    short: 'Organize a night with friends to cook, play games, or watch a movie.',
    areaTags: ['social', 'creativity'],
    tone: 'playful',
    durationMin: 60,
    steps: [
      'Choose friends to invite',
      'Pick an activity: cooking together, board games, or movie night',
      'Set a date and time that works for everyone',
      'Plan the food and drinks',
      'Send out the invites!',
    ],
    followUp: [
      'What activity did you choose?',
      'How many friends joined?',
      'Will you make this a regular thing?',
    ],
  },
  {
    id: 'fam004',
    title: 'Lunch with a Colleague',
    short: 'Invite a team member you do not know well for lunch or coffee.',
    areaTags: ['social', 'focus'],
    tone: 'serious',
    durationMin: 60,
    steps: [
      'Think of a colleague you want to know better',
      'Send them a casual invite for lunch or coffee',
      'Choose a nice place to go',
      'Ask them about themselves beyond work',
      'Listen and find common interests',
    ],
    altId: 'fam005',
    followUp: [
      'Who did you invite?',
      'What did you learn about them?',
      'Will you stay connected?',
    ],
  },
  {
    id: 'fam005',
    title: 'Try Something New Together',
    short: 'Invite a friend to do something you have never done together.',
    areaTags: ['social', 'creativity'],
    tone: 'playful',
    durationMin: 60,
    steps: [
      'Think of a friend who would be up for an adventure',
      'Choose something new: park workout, new cafe, board game, escape room',
      'Send them a message with your suggestion',
      'Pick a date and location',
      'Make it happen!',
    ],
    altId: 'fam004',
    followUp: [
      'What new activity did you try?',
      'Did you both enjoy it?',
      'What will you try next?',
    ],
  },
  {
    id: 'fam006',
    title: 'Plan a Family Gathering',
    short: 'Organize a family gathering or trip together.',
    areaTags: ['social'],
    tone: 'serious',
    durationMin: 1440,
    steps: [
      'Decide who you want to bring together',
      'Choose a format: dinner, day trip, or longer vacation',
      'Pick a date that works for everyone',
      'Plan the logistics: location, food, activities',
      'Send out invites and confirmations',
    ],
    followUp: [
      'What are you planning?',
      'Who is coming?',
      'When is it happening?',
    ],
  },
  {
    id: 'fam007',
    title: 'Hike with Friends',
    short: 'Invite friends for a hike to a new place.',
    areaTags: ['social', 'nature', 'health'],
    tone: 'playful',
    durationMin: 60,
    steps: [
      'Research hiking trails near you',
      'Pick one that suits your group fitness level',
      'Message at least one friend with your suggestion',
      'Set a date and meeting point',
      'Pack water, snacks, and good shoes',
    ],
    followUp: [
      'Where did you hike?',
      'Who came along?',
      'Would you recommend the trail?',
    ],
  },
];

// ============================================================================
// SELF-LOVE & MENTAL WELLBEING (sl prefix)
// Purpose: Start loving and accepting yourself for who you are
// ============================================================================
const SELFLOVE_CHALLENGES: ChallengeTemplate[] = [
  {
    id: 'sl101',
    title: 'Self-Care Evening',
    short: 'Plan a relaxing evening with music, candles, and a hot bath.',
    areaTags: ['selflove'],
    tone: 'serious',
    durationMin: 15,
    steps: [
      'Pick a day this week for your self-care evening',
      'Gather supplies: candles, bath products, relaxing music',
      'Order your favorite food for delivery',
      'Turn off your phone and enjoy the moment',
    ],
    altId: 'sl102',
    followUp: [
      'When will you have your relaxing time?',
      'How did it feel to prioritize yourself?',
    ],
  },
  {
    id: 'sl102',
    title: 'Reading Hour',
    short: 'Schedule time to read a book for at least 1 hour.',
    areaTags: ['selflove', 'focus'],
    tone: 'serious',
    durationMin: 10,
    steps: [
      'Choose a book you have been meaning to read',
      'Pick a time today or tomorrow',
      'Find a comfortable quiet spot',
      'Put your phone in another room',
      'Read for at least one full hour',
    ],
    altId: 'sl101',
    followUp: [
      'What book did you read?',
      'How did it feel to disconnect and read?',
    ],
  },
  {
    id: 'sl103',
    title: 'Affirmation Practice',
    short: 'You are enough. Say it, write it, believe it.',
    areaTags: ['selflove'],
    tone: 'serious',
    durationMin: 20,
    steps: [
      'Say out loud: "I am enough and I am a beautiful person"',
      'Write this affirmation on a piece of paper',
      'Put it somewhere you will see it every morning',
      'Commit to saying it each time you feel bad about yourself',
    ],
    followUp: [
      'Where did you put your affirmation?',
      'How did it feel to say those words?',
    ],
  },
  {
    id: 'sl104',
    title: 'Breathwork or Meditation',
    short: 'Do breathwork or meditation for 20 minutes.',
    areaTags: ['selflove', 'health'],
    tone: 'serious',
    durationMin: 30,
    steps: [
      'Choose a guided app: Headspace, Calm, Insight Timer, or YouTube',
      'Find a quiet, comfortable space',
      'Set aside 20 minutes minimum',
      'Follow the guided session',
      'Notice how you feel before and after',
    ],
    followUp: [
      'Which app or guide did you use?',
      'How do you feel now?',
      'Will you make this a habit?',
    ],
  },
  {
    id: 'sl105',
    title: 'Three Qualities I Love',
    short: 'Write down 3 qualities you like about yourself.',
    areaTags: ['selflove'],
    tone: 'serious',
    durationMin: 30,
    steps: [
      'Find a quiet moment to reflect',
      'Write down 3 qualities you genuinely like about yourself',
      'For each one, write a sentence about what you appreciate',
      'Read them back to yourself with kindness',
    ],
    followUp: [
      'What three qualities did you write?',
      'Was it easy or hard to find things you like?',
    ],
  },
  {
    id: 'sl106',
    title: 'Declutter 5 Items',
    short: 'Remove 5 items from your room that do not serve you anymore.',
    areaTags: ['selflove', 'focus'],
    tone: 'serious',
    durationMin: 60,
    steps: [
      'Look around your room with fresh eyes',
      'Find 5 items you no longer need or use',
      'Decide: donate, recycle, or throw away',
      'Remove them from your space',
      'Notice how your room feels lighter',
    ],
    followUp: [
      'What items did you remove?',
      'How does your space feel now?',
    ],
  },
  {
    id: 'sl107',
    title: 'Set Your Boundaries',
    short: 'Practice saying no to something you do not want to do.',
    areaTags: ['selflove'],
    tone: 'serious',
    durationMin: 15,
    steps: [
      'Think of times when you said yes but meant no',
      'Practice saying: "Sorry, I don\'t want to do that"',
      'Today, pause before agreeing to anything',
      'Ask yourself: Do I really WANT to do this?',
      'If not, politely decline',
    ],
    followUp: [
      'Did you practice setting a boundary?',
      'How did it feel?',
      'What would you do differently?',
    ],
  },
];

// ============================================================================
// CAREER & PURPOSE (cp prefix)
// Purpose: Help you realize what job would suit you and what your purpose might be
// ============================================================================
const CAREER_CHALLENGES: ChallengeTemplate[] = [
  {
    id: 'cp001',
    title: 'Problems & Solutions',
    short: 'Write 5 things that bother you in society, with potential solutions.',
    areaTags: ['focus'],
    tone: 'serious',
    durationMin: 60,
    steps: [
      'Sit down with paper and pen (no distractions)',
      'Write 5 things that bother you in society, work, or in general',
      'Next to each, write a potential solution',
      'Then write a job that could address each problem',
      'Reflect on which ones excite you most',
    ],
    altId: 'cp002',
    followUp: [
      'Did you finish the exercise?',
      'Can you imagine having a job in one of these areas?',
    ],
  },
  {
    id: 'cp002',
    title: 'What Makes You Feel Alive',
    short: 'List 10 moments when you felt most alive and time flew by.',
    areaTags: ['focus', 'selflove'],
    tone: 'serious',
    durationMin: 60,
    steps: [
      'Without overthinking, write down 10 moments you felt ALIVE',
      'Think: when did time fly? When did you feel joy, curiosity, or pride?',
      'Ask yourself: "What moments made me forget to check my phone?"',
      'Circle the top 3 that could potentially earn you money',
      'Reflect on patterns you notice',
    ],
    altId: 'cp001',
    followUp: [
      'What activities came up most?',
      'Which top 3 could you make money from?',
    ],
  },
  {
    id: 'cp003',
    title: 'Job Satisfaction Survey',
    short: 'Ask 5 people about their jobs and what they like or dislike.',
    areaTags: ['focus', 'social'],
    tone: 'serious',
    durationMin: 15,
    steps: [
      'Make a list of 5 people you can talk to',
      'Ask each: Do you like your job? What do you like/dislike? Why?',
      'Take notes on their answers',
      'Look for patterns and insights',
      'Decide who you will talk to first - today',
    ],
    followUp: [
      'What did you learn from the conversations?',
      'Any surprising insights?',
    ],
  },
  {
    id: 'cp004',
    title: 'Job Qualities Reflection',
    short: 'Identify 3 qualities of your job you like and 3 you do not.',
    areaTags: ['focus'],
    tone: 'serious',
    durationMin: 30,
    steps: [
      'Think about your current job or studies',
      'Write 3 qualities you like most',
      'Write 3 qualities you do not like',
      'Write one thing you LOVE about it',
      'Consider what this tells you about your ideal work',
    ],
    followUp: [
      'What patterns do you see?',
      'What does your ideal job look like?',
    ],
  },
  {
    id: 'cp005',
    title: 'LinkedIn Outreach',
    short: 'Message 3 people whose jobs interest you and ask to meet.',
    areaTags: ['focus', 'social'],
    tone: 'serious',
    durationMin: 60,
    steps: [
      'Find 3 people on LinkedIn or Instagram with interesting jobs',
      'Write a personalized message to each',
      'Ask if they would be open to a brief chat',
      'Prepare questions you want to ask them',
      'Send the first message today',
    ],
    followUp: [
      'Who did you reach out to?',
      'Did anyone respond?',
      'What do you hope to learn?',
    ],
  },
  {
    id: 'cp006',
    title: 'Ikigai Exercise',
    short: 'Discover your purpose by mapping what you love, are good at, and can earn from.',
    areaTags: ['focus', 'selflove'],
    tone: 'serious',
    durationMin: 60,
    steps: [
      'List things you LOVE doing or are interested in',
      'List things you are GOOD AT',
      'List what you think the WORLD NEEDS',
      'List what you can get PAID FOR',
      'Look for overlaps - that is your Ikigai',
    ],
    followUp: [
      'What did you discover about your Ikigai?',
      'What roles might fit your purpose?',
    ],
  },
  {
    id: 'cp007',
    title: 'Send 5 Job Applications',
    short: 'Apply to 5 jobs that align with your career goals.',
    areaTags: ['focus', 'money'],
    tone: 'serious',
    durationMin: 120,
    steps: [
      'Based on previous exercises, identify roles that fit you',
      'Search job boards for relevant positions',
      'Update your CV if needed',
      'Write tailored cover letters',
      'Submit at least 5 applications',
    ],
    followUp: [
      'Which jobs did you apply for?',
      'How do you feel about taking this step?',
    ],
  },
];

// ============================================================================
// ROMANCE (rom prefix)
// Purpose: Be more active, take initiative, increase your chance of finding a partner
// ============================================================================
const ROMANCE_CHALLENGES: ChallengeTemplate[] = [
  {
    id: 'rom001',
    title: 'Dating Mindset Check',
    short: 'Answer reflection questions about your approach to dating.',
    areaTags: ['romance', 'selflove'],
    tone: 'serious',
    durationMin: 120,
    steps: [
      'Find a quiet space to reflect honestly',
      'Answer: How do you take care of yourself when stressed?',
      'Answer: What do you like about yourself that a partner should appreciate?',
      'Answer: Do you feel you can be your authentic self when dating?',
      'Answer: What is one boundary you would protect no matter what?',
    ],
    followUp: [
      'What did you learn about yourself?',
      'Are you ready to date authentically?',
    ],
  },
  {
    id: 'rom002',
    title: 'Night Out Challenge',
    short: 'Go out with a friend and talk to at least 3 strangers you find interesting.',
    areaTags: ['romance', 'social'],
    tone: 'playful',
    durationMin: 60,
    steps: [
      'Ask a friend to go out this weekend',
      'Choose a social place: bar, club, or event',
      'Your goal: talk to at least 3 new people',
      'Start conversations with compliments or simple questions',
      'Remember: you have nothing to lose by talking to them',
    ],
    altId: 'rom003',
    followUp: [
      'How many new people did you talk to?',
      'How did it feel stepping out of your comfort zone?',
    ],
  },
  {
    id: 'rom003',
    title: 'Book Speed Dating',
    short: 'Find and book a speed dating event for the earliest possible day.',
    areaTags: ['romance'],
    tone: 'serious',
    durationMin: 60,
    steps: [
      'Search for speed dating events in your city',
      'Find one for the earliest possible date',
      'Book your spot',
      'Prepare some conversation starters',
      'Go with an open mind',
    ],
    altId: 'rom002',
    followUp: [
      'When is your speed dating event?',
      'How many people did you connect with?',
    ],
  },
  {
    id: 'rom004',
    title: 'Install a Dating App',
    short: 'Download a dating app right now and set a goal of one date every 2 weeks.',
    areaTags: ['romance'],
    tone: 'playful',
    durationMin: 15,
    steps: [
      'Choose an app: Hinge, Bumble, or OkCupid',
      'Download it now',
      'Create an authentic profile',
      'Add photos where you are genuinely smiling',
      'Set a goal: at least one date every 14 days',
    ],
    followUp: [
      'Which app did you download?',
      'Did you set up your profile?',
    ],
  },
  {
    id: 'rom005',
    title: 'Host a Singles Mixer',
    short: 'Organize a house party where friends bring someone single you do not know.',
    areaTags: ['romance', 'social'],
    tone: 'playful',
    durationMin: 1440,
    steps: [
      'Pick a date for your party',
      'Invite your friends with one rule: bring someone single you do not know',
      'Create a theme or dress code to make it fun',
      'Plan activities: games, music, good food',
      'Aim for 10-12 people total',
    ],
    followUp: [
      'When is the party?',
      'Did you meet anyone interesting?',
    ],
  },
  {
    id: 'rom006',
    title: 'Partner Dance Class',
    short: 'Book a partner dance class: Salsa, Swing, or Tango.',
    areaTags: ['romance', 'health', 'creativity'],
    tone: 'playful',
    durationMin: 60,
    steps: [
      'Search for partner dance classes near you',
      'Choose: Salsa, Swing, Tango, or Bachata',
      'Book a session for the earliest date',
      'Go alone - you will be paired with others',
      'Enjoy the shared activity and natural conversation',
    ],
    followUp: [
      'Which dance did you choose?',
      'Did you meet anyone interesting?',
    ],
  },
  {
    id: 'rom007',
    title: 'Creative Social Class',
    short: 'Book a drawing, pottery, or creative class to meet new people.',
    areaTags: ['romance', 'creativity', 'social'],
    tone: 'playful',
    durationMin: 60,
    steps: [
      'Find a creative class: drawing, pottery, or painting',
      'Book a spot for the earliest possible date',
      'Go with the intention to socialize',
      'Start conversations with fellow students',
      'Enjoy the creative process together',
    ],
    followUp: [
      'What class did you take?',
      'Did you make any connections?',
    ],
  },
];

// ============================================================================
// FUN & CREATIVITY (fun prefix)
// Purpose: Try new activities that can lead to a new hobby, get to know your city,
// meet new people, or just do something interesting and fun
// ============================================================================
const FUN_CHALLENGES: ChallengeTemplate[] = [
  {
    id: 'fun001',
    title: 'Outdoor Painting',
    short: 'Buy painting supplies, go outside, and paint the scenery you see.',
    areaTags: ['creativity', 'nature'],
    tone: 'playful',
    durationMin: 120,
    steps: [
      'Get supplies: canvas, paints, brushes',
      'Find a scenic spot outdoors',
      'Set up and observe the scenery',
      'Let your imagination flow as you paint',
      'Add special patterns or shapes that speak to you',
    ],
    altId: 'fun002',
    followUp: [
      'What did you paint?',
      'Would you try painting again?',
    ],
  },
  {
    id: 'fun002',
    title: 'Book a Painting Class',
    short: 'Sign up for a painting class in your city.',
    areaTags: ['creativity', 'social'],
    tone: 'playful',
    durationMin: 120,
    steps: [
      'Search for painting classes near you',
      'Pick one: acrylic, watercolor, or Paint & Sip',
      'Book a session for this week if possible',
      'Go with an open mind - no skill required',
      'Enjoy the creative process',
    ],
    altId: 'fun001',
    followUp: [
      'What type of class did you take?',
      'Would you recommend it?',
    ],
  },
  {
    id: 'fun003',
    title: 'Try DJing',
    short: 'Download a DJ app or book a lesson to learn the basics.',
    areaTags: ['creativity'],
    tone: 'playful',
    durationMin: 120,
    steps: [
      'Download a DJ app (djay is popular) or find a tutor',
      'Learn the basics of mixing and transitions',
      'Play with beatmatching two songs',
      'Try creating a simple mix',
      'Share your creation with a friend',
    ],
    followUp: [
      'Did you like mixing music?',
      'Will you practice more?',
    ],
  },
  {
    id: 'fun004',
    title: 'Classical or Jazz Concert',
    short: 'Book a concert with classical, jazz, or instrumental music and bring a friend.',
    areaTags: ['creativity', 'social'],
    tone: 'serious',
    durationMin: 60,
    steps: [
      'Search for upcoming concerts in your area',
      'Pick one: classical, jazz, or instrumental',
      'Invite a friend to join you',
      'Book your tickets',
      'Enjoy the live music experience',
    ],
    followUp: [
      'What concert did you attend?',
      'Would you go again?',
    ],
  },
  {
    id: 'fun005',
    title: 'Learn an Instrument',
    short: 'Book a lesson to learn piano, guitar, or drums.',
    areaTags: ['creativity'],
    tone: 'serious',
    durationMin: 60,
    steps: [
      'Choose an instrument that interests you',
      'Search for tutors or music schools',
      'Book an introductory lesson',
      'Go with no expectations - just curiosity',
      'Practice what you learned for 15 min after',
    ],
    followUp: [
      'Which instrument did you try?',
      'Will you continue learning?',
    ],
  },
  {
    id: 'fun006',
    title: 'Sewing or Upcycling',
    short: 'Take a sewing class or upcycle clothes you no longer wear.',
    areaTags: ['creativity'],
    tone: 'playful',
    durationMin: 60,
    steps: [
      'Option A: Book a sewing class near you',
      'Option B: Go through your wardrobe',
      'Select clothes you do not wear anymore',
      'Get creative: use scissors, markers, patches',
      'Transform them into something new',
    ],
    followUp: [
      'What did you create?',
      'Would you try this again?',
    ],
  },
  {
    id: 'fun007',
    title: 'Acting or Improv',
    short: 'Try an acting class, improv theatre, or storytelling workshop.',
    areaTags: ['creativity', 'social'],
    tone: 'playful',
    durationMin: 120,
    steps: [
      'Search for beginner-friendly classes',
      'Choose: acting, improv, or storytelling',
      'Book a session for the next two weeks',
      'Go ready to be silly and have fun',
      'Step outside your comfort zone',
    ],
    followUp: [
      'What did you try?',
      'How did it feel to perform?',
    ],
  },
  {
    id: 'fun008',
    title: 'Learn Poker',
    short: 'Order a poker set, watch tutorials, and organize a poker night.',
    areaTags: ['creativity', 'social'],
    tone: 'playful',
    durationMin: 180,
    steps: [
      'Order a poker set online',
      'Watch YouTube tutorials on the rules and strategy',
      'Practice the basics',
      'Find friends who play or want to learn',
      'Organize a poker night within 3 weeks',
    ],
    followUp: [
      'When is your poker night?',
      'Who is coming?',
    ],
  },
];

// ============================================================================
// MONEY & FINANCES (mon prefix)
// Purpose: Gain control of your finances with awareness, discipline, and vision
// ============================================================================
const MONEY_CHALLENGES: ChallengeTemplate[] = [
  {
    id: 'mon001',
    title: 'Money Mindset Check',
    short: 'Reflect on your relationship with money.',
    areaTags: ['money', 'selflove'],
    tone: 'serious',
    durationMin: 30,
    steps: [
      'Answer honestly: Do you love, like, or fear money?',
      'Consider: Do you see money as scarce or abundant?',
      'Reflect: Do you track your spending?',
      'Think: What beliefs about money did you grow up with?',
      'Write one empowering money belief to adopt',
    ],
    followUp: [
      'What did you discover about your money mindset?',
      'What new belief will you adopt?',
    ],
  },
  {
    id: 'mon002',
    title: 'Financial Snapshot',
    short: 'Create a spreadsheet showing your current financial situation.',
    areaTags: ['money', 'focus'],
    tone: 'serious',
    durationMin: 60,
    steps: [
      'Open a spreadsheet (Google Sheets or Excel)',
      'List all your savings accounts and balances',
      'List any debts you have',
      'Write down recurring income sources',
      'List your regular monthly expenses',
    ],
    followUp: [
      'Did you complete your financial snapshot?',
      'Any surprises in your numbers?',
    ],
  },
  {
    id: 'mon003',
    title: 'Start Saving or Pay Off Debt',
    short: 'Set up automatic savings or make a debt payment today.',
    areaTags: ['money'],
    tone: 'serious',
    durationMin: 60,
    steps: [
      'If you have debt: contact the lender about a payment plan',
      'If saving: open a separate savings account',
      'Set up an automatic transfer after each paycheck',
      'Start small - even a small amount builds the habit',
      'Do not connect this account to your debit card',
    ],
    followUp: [
      'What action did you take?',
      'How much will you save or pay each month?',
    ],
  },
  {
    id: 'mon004',
    title: 'Define Your Savings Goal',
    short: 'Decide what you are saving for and how much you need.',
    areaTags: ['money', 'focus'],
    tone: 'serious',
    durationMin: 30,
    steps: [
      'Write down what you want to save for',
      'Research how much it will cost',
      'Calculate how much you need to save per week/month',
      'Set a target date',
      'Write this goal somewhere visible',
    ],
    followUp: [
      'What is your savings goal?',
      'When do you want to reach it?',
    ],
  },
  {
    id: 'mon005',
    title: 'Subscription Audit',
    short: 'Review all subscriptions and cancel the ones you do not use.',
    areaTags: ['money', 'focus'],
    tone: 'serious',
    durationMin: 60,
    steps: [
      'Check your bank statement for recurring charges',
      'List all subscriptions: streaming, apps, memberships',
      'For each one, ask: Did I use this in the last month?',
      'Cancel at least one that you forgot existed',
      'Calculate your annual savings',
    ],
    followUp: [
      'What subscriptions did you cancel?',
      'How much will you save?',
    ],
  },
  {
    id: 'mon006',
    title: 'Money Belief Swap',
    short: 'Replace a limiting belief about money with an empowering one.',
    areaTags: ['money', 'selflove'],
    tone: 'serious',
    durationMin: 30,
    steps: [
      'Write down one limiting belief (e.g., "I will never save enough")',
      'Rewrite it as empowering: "I have all the money I need"',
      'Write this new belief on paper',
      'Put it on your mirror or somewhere visible',
      'Read it every morning',
    ],
    followUp: [
      'What belief did you swap?',
      'Where did you put your new affirmation?',
    ],
  },
  {
    id: 'mon007',
    title: 'Future Self Budget',
    short: 'Design a budget for the life you want, then compare to your current one.',
    areaTags: ['money', 'focus'],
    tone: 'serious',
    durationMin: 60,
    steps: [
      'Imagine your ideal life in 5 years',
      'List the expenses that life would have',
      'Create a budget for that future self',
      'Compare it to your current budget',
      'Identify the gaps and what needs to change',
    ],
    followUp: [
      'What did you learn from this exercise?',
      'What is the biggest gap to close?',
    ],
  },
];

// ============================================================================
// EXPORT ALL CLIENT CHALLENGES
// ============================================================================
export const CLIENT_CHALLENGE_SEEDS: ChallengeTemplate[] = [
  // Health & Fitness (7 challenges)
  ...HEALTH_CHALLENGES,
  // Family & Friends (7 challenges)
  ...FAMILY_FRIENDS_CHALLENGES,
  // Self-Love (7 challenges)
  ...SELFLOVE_CHALLENGES,
  // Career & Purpose (7 challenges)
  ...CAREER_CHALLENGES,
  // Romance (7 challenges)
  ...ROMANCE_CHALLENGES,
  // Fun & Creativity (8 challenges)
  ...FUN_CHALLENGES,
  // Money & Finances (7 challenges)
  ...MONEY_CHALLENGES,
];

// Challenge count summary
export const CHALLENGE_COUNTS = {
  health: HEALTH_CHALLENGES.length,
  social: FAMILY_FRIENDS_CHALLENGES.length,
  selflove: SELFLOVE_CHALLENGES.length,
  focus: CAREER_CHALLENGES.length,
  romance: ROMANCE_CHALLENGES.length,
  creativity: FUN_CHALLENGES.length,
  money: MONEY_CHALLENGES.length,
  total: CLIENT_CHALLENGE_SEEDS.length,
};
