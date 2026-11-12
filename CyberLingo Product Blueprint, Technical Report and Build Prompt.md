# CyberLingo: Product Blueprint, Technical Report and Build Prompt

A Duolingo-format learning app that teaches only cybersecurity. Stack: React JS, JavaScript only (no TypeScript), Firebase. All learning content is supplied by the product owner.

*"CyberLingo" is a working title. Use your own name, mascot, colors and artwork. Duolingo's mechanics (streaks, hearts, XP, short lessons) are fine to replicate, but its brand, owl and assets are protected.*

## 1. Product Vision

Make learning cybersecurity as habit-forming as learning a language: short, gamified, bite-sized lessons, done daily, with instant feedback and visible progress.

**Target users:** beginners, students, career switchers, IT staff and non-technical employees who need security awareness.

**Core promise:** 5 minutes a day, no lectures, learn by answering.

## 2. Duolingo Format: What We Replicate

| Duolingo concept | CyberLingo equivalent |
| --- | --- |
| Course (language) | Track (e.g. Security Fundamentals, Network Security, Web Security, Cryptography) |
| Unit (with guidebook) | Unit with a short "Guidebook" (concept notes) |
| Skill/lesson node on the path | Lesson node on a vertical winding path |
| Lesson (about 10-15 questions) | Lesson of 10-15 exercises |
| Hearts (5) | Hearts (5), lose one per wrong answer |
| XP | XP per lesson, bonus for perfect lesson |
| Streak | Daily streak with freeze |
| Daily goal | Daily XP goal (10/20/30/50) |
| Gems | Gems, spent to refill hearts or buy streak freeze |
| Leagues | Weekly XP leagues (Bronze to Diamond) |
| Practice / review | Practice mode built from past mistakes |
| Checkpoint / unit test | Unit test at the end of each unit |
| Chests and quests | Daily quests and reward chests |
| Feedback sheet (green/red) | Bottom sheet showing correct/incorrect and explanation |

## 3. User Journey

1. **Splash and welcome:** "Get started" or "I already have an account".
2. **Onboarding:** pick goal (career, certification, awareness, curiosity), experience level, daily goal. Optional placement quiz to skip ahead.
3. **Sign up:** Google, email/password (anonymous play first, then upgrade, like Duolingo).
4. **Home path:** vertical winding path of lesson nodes. Locked, active, completed (gold) states. Top bar shows streak, gems, hearts.
5. **Lesson player:** full-screen, progress bar, X to exit, one exercise at a time, Check button, feedback sheet, Continue.
6. **Lesson complete:** XP earned, accuracy, time, streak update, chest animation.
7. **Other tabs:** Learn, Practice, Leaderboard, Quests, Profile.

## 4. Lesson Player: The Heart of the Product

### 4.1 Flow

- Lesson is a queue of exercises. Progress bar fills per correct answer.
- Press **Check**. Show green sheet (correct) or red sheet (incorrect, with the right answer and a one-line explanation).
- Wrong answer: lose 1 heart, exercise is re-queued at the end of the lesson.
- Lesson ends only when the queue is empty (all answered correctly).
- 0 hearts: block with "Out of hearts" modal (practice to earn a heart, spend gems, or wait for regeneration).
- Quitting mid-lesson shows a confirmation modal. Progress is not saved.

### 4.2 Exercise Types (cybersecurity-adapted)

| Type key | Description | Example |
| --- | --- | --- |
| `multiple_choice` | One correct option from 3-4 | "Which is a phishing sign?" |
| `multi_select` | Select all correct options | "Select all strong password habits" |
| `true_false` | Statement judgement | "HTTPS means a site is safe." |
| `fill_blank` | Sentence with a tappable word bank | "A \_\_\_ encrypts traffic between you and the site." |
| `match_pairs` | Match terms to definitions (two columns) | "DDoS to Traffic flooding" |
| `order_steps` | Arrange steps in the correct order (tap tiles) | Incident response phases |
| `scenario` | Short story, pick the best action | "You receive this email..." |
| `spot_the_threat` | Tap the suspicious parts of an email, URL or log | Highlight fake link |
| `command_complete` | Build a command from tiles | `nmap -sV target` |
| `info_card` | Teaching card (no answer) shown before a new concept | Intro to firewalls |

Each type has its own React component plus a pure validation function.

## 5. Gamification Rules (configurable in Firestore `config/gameRules`)

- **XP:** 10 per lesson, +5 for perfect, +2 for speed bonus. Practice: 5 XP.
- **Hearts:** max 5, regenerate 1 per 4 hours (computed from timestamps, no timers).
- **Streak:** increments when daily XP goal is met. Resets if a day is missed (unless a freeze is active). Day boundary uses the user's stored timezone.
- **Gems:** 10 per lesson, 20 per perfect lesson, quest rewards. Refill hearts costs 350, streak freeze costs 200.
- **Leagues:** 30 users per league per week. Top 10 promote, bottom 5 demote. Reset every Monday 00:00 UTC.
- **Quests:** daily ("Earn 30 XP", "Complete 2 lessons", "Get 1 perfect lesson") and monthly badges.
- **Achievements:** badges for streak milestones (3, 7, 30, 100), track completion, perfect units.

## 6. Content Model (you supply the content)

Content is authored as JSON files in the repo, validated, then seeded into Firestore by a script. This keeps authoring simple for a non-developer.

### 6.1 Hierarchy

`Track > Unit > Lesson > Exercise`

### 6.2 Content JSON Format

```json
{
  "trackId": "security-fundamentals",
  "title": "Security Fundamentals",
  "order": 1,
  "units": [
    {
      "unitId": "u1-cia-triad",
      "title": "The CIA Triad",
      "order": 1,
      "color": "#58CC02",
      "guidebook": "Confidentiality, Integrity, Availability...",
      "lessons": [
        {
          "lessonId": "u1-l1",
          "title": "What is Confidentiality?",
          "order": 1,
          "exercises": [
            {
              "id": "e1",
              "type": "multiple_choice",
              "prompt": "Which principle keeps data secret from unauthorized users?",
              "options": ["Integrity", "Confidentiality", "Availability", "Authenticity"],
              "answer": 1,
              "explanation": "Confidentiality restricts access to authorized users."
            },
            {
              "id": "e2",
              "type": "match_pairs",
              "prompt": "Match each term to its meaning",
              "pairs": [["Phishing", "Fake messages that steal info"], ["Malware", "Malicious software"]],
              "explanation": "..."
            },
            {
              "id": "e3",
              "type": "order_steps",
              "prompt": "Order the incident response phases",
              "steps": ["Preparation", "Identification", "Containment", "Eradication", "Recovery"],
              "explanation": "..."
            }
          ]
        }
      ]
    }
  ]
}
```

For `order_steps`, `steps` is stored in the correct order and shuffled at runtime. For `fill_blank`: `{ "sentence": "A ___ encrypts traffic", "wordBank": ["VPN","Router","Switch"], "answer": ["VPN"] }`. For `multi_select`, `answer` is an array of indices.

### 6.3 Content Pipeline

1. Author JSON in `/content/<track>.json`.
2. `npm run content:validate` checks schema, unique IDs, valid answers, min/max exercises per lesson.
3. `npm run content:seed` writes to Firestore using the Admin SDK.
4. Content has a `version` field so clients can refresh caches.

## 7. System Architecture

```
React SPA (Vite, PWA)
   |-- Firebase Auth (Google, Email, Anonymous)
   |-- Firestore (content, user progress, leaderboards)
   |-- Cloud Functions (trusted logic: XP, hearts, streaks, leagues)
   |-- Firebase Hosting (CDN)
   |-- Firebase Analytics + Crashlytics-style error logging
```

**Why Cloud Functions:** XP, streak and league writes must be server-validated so users cannot cheat from the browser. Requires the Blaze plan (generous free tier). Fallback for MVP: client writes with strict security rules.

### 7.1 Tech Stack

| Layer | Choice |
| --- | --- |
| UI | React 18, JavaScript (JSX) only |
| Build | Vite |
| Routing | React Router v6 |
| State | Zustand (global), React Query (server cache) |
| Styling | Tailwind CSS plus a small design-token file |
| Animation | Framer Motion, Lottie (mascot, confetti) |
| Audio | Howler.js (correct/wrong/complete sounds) |
| Backend | Firebase Auth, Firestore, Functions (Node.js JS), Hosting |
| Offline/PWA | vite-plugin-pwa, Firestore persistence |
| Testing | Vitest, React Testing Library, Firebase Emulator Suite |
| Lint | ESLint + Prettier; PropTypes for runtime prop checks (replaces TS) |

## 8. Firestore Data Model

```
tracks/{trackId}                      { title, order, description, icon, version }
tracks/{trackId}/units/{unitId}       { title, order, color, guidebook }
tracks/{trackId}/units/{unitId}/lessons/{lessonId}
                                      { title, order, exerciseCount }
tracks/{trackId}/units/{unitId}/lessons/{lessonId}/exercises/{exerciseId}
                                      { type, prompt, ...typeFields, explanation, order }

users/{uid}                           { displayName, photoURL, createdAt, timezone,
                                        goal, level, dailyGoalXp, currentTrackId,
                                        xpTotal, xpToday, xpWeek, gems,
                                        hearts, heartsUpdatedAt,
                                        streak, longestStreak, lastActiveDate, streakFreezes,
                                        leagueId, leagueTier }
users/{uid}/progress/{trackId}        { completedLessons: [lessonId], currentLessonId,
                                        unitStats: { unitId: { stars, accuracy } } }
users/{uid}/mistakes/{exerciseId}     { trackId, lessonId, count, lastMissedAt }
users/{uid}/quests/{date}             { quests: [{id, target, progress, claimed}] }
users/{uid}/achievements/{badgeId}    { unlockedAt }

leagues/{leagueId}                    { tier, weekId, memberIds }
leagues/{leagueId}/members/{uid}      { displayName, photoURL, weeklyXp }
config/gameRules                      { xp, hearts, gems, league rules }
```

**Reading cost note:** fetch a lesson's exercises in one query only when the lesson starts. Cache the path (tracks, units, lessons) with React Query.

## 9. Cloud Functions (JavaScript, Node 20)

| Function | Trigger | Purpose |
| --- | --- | --- |
| `onUserCreate` | Auth onCreate | Create `users/{uid}`, default hearts, daily goal |
| `completeLesson` | HTTPS callable | Validate payload, award XP/gems, update progress, streak, quests, league XP |
| `loseHeart` | HTTPS callable | Deduct heart, set regen timestamp |
| `refillHearts` | HTTPS callable | Spend gems, restore hearts |
| `buyStreakFreeze` | HTTPS callable | Spend gems |
| `claimQuestReward` | HTTPS callable | Grant gems/XP once |
| `weeklyLeagueReset` | Scheduled (Mon 00:00 UTC) | Promote/demote, form new leagues |
| `dailyStreakCheck` | Scheduled (hourly) | Reset streaks for missed days per timezone |

Heart regeneration is computed lazily: `hearts = min(max, stored + floor((now - heartsUpdatedAt) / regenInterval))`.

## 10. Security Rules (summary)

- `tracks/**`: read for authenticated users, write denied (admin SDK only).
- `users/{uid}`: read/write only by owner, but fields `xpTotal`, `gems`, `streak`, `hearts`, `leagueId` are write-denied from the client (Functions only).
- `leagues/**`: read for members, write denied.
- Enable App Check (reCAPTCHA v3) to block bots.
- Rate limit callable functions (per-uid counters).
- Validate lesson completion: minimum duration and exercise count to prevent XP farming.

## 11. Frontend Structure

```
src/
  main.jsx
  App.jsx
  routes/            (Welcome, Onboarding, Learn, Practice, Leaderboard, Quests, Profile, Lesson)
  components/
    layout/          (TopBar, BottomNav, Sidebar)
    path/            (UnitHeader, LessonNode, PathConnector)
    lesson/
      LessonPlayer.jsx
      ProgressBar.jsx
      FeedbackSheet.jsx
      exercises/     (MultipleChoice, MultiSelect, TrueFalse, FillBlank,
                      MatchPairs, OrderSteps, Scenario, SpotTheThreat,
                      CommandComplete, InfoCard)
    modals/          (OutOfHearts, QuitLesson, StreakCelebration)
    ui/              (Button, Card, Mascot, Confetti)
  hooks/             (useAuth, useUser, useLesson, useHearts, useStreak)
  store/             (lessonStore.js, userStore.js)
  services/          (firebase.js, contentService.js, userService.js, functions.js)
  lib/               (validators.js, shuffle.js, xp.js, time.js)
  styles/            (tokens.css, tailwind.css)
  assets/            (sounds, lottie, icons)
functions/           (index.js, lessons.js, streaks.js, leagues.js, hearts.js)
content/             (security-fundamentals.json ...)
scripts/             (validateContent.js, seedContent.js)
```

### 11.1 Lesson Player State Machine

`LOADING > INTRO > QUESTION > CHECKING > FEEDBACK (correct | incorrect) > NEXT > ... > COMPLETE`

Store: `queue`, `currentIndex`, `selectedAnswer`, `status`, `heartsLeft`, `correctCount`, `mistakes[]`, `startTime`. Each exercise component exposes the same contract: `onAnswerChange(value)` and a `validate(exercise, value)` pure function returning `{correct, correctAnswer}`.

### 11.2 UI/UX Rules (strictly Duolingo-style)

- Mobile-first, max content width about 600px centered on desktop with a left sidebar.
- Chunky rounded buttons with a bottom 4px darker border (3D press effect). Press moves the button down.
- Green primary (#58CC02 family, use your own variant), blue secondary, red for errors, gold for completion.
- Bottom-fixed Check/Continue button. Disabled gray until an answer is chosen.
- Feedback sheet slides up from bottom, tinted green or red.
- Friendly mascot (your own design) with expressions per state.
- Sound effects and haptics (vibration API) for correct, wrong and complete.
- Large touch targets, keyboard support (1-4 to pick, Enter to check).

## 12. Non-Functional Requirements

- **Performance:** first load under 2s on 4G, lesson start under 500ms (prefetch next lesson).
- **Offline:** PWA, Firestore persistence, queue progress writes.
- **Accessibility:** WCAG AA, screen reader labels, reduced-motion setting, color-blind safe states (icons plus color).
- **Responsive:** 360px to desktop.
- **i18n-ready:** strings in a dictionary file (English first).
- **Analytics events:** lesson\_start, lesson\_complete, exercise\_wrong, heart\_lost, streak\_extended, dropoff\_exercise\_index.
- **Privacy:** GDPR-friendly, account deletion function.

## 13. Roadmap

| Phase | Scope | Duration |
| --- | --- | --- |
| 0 | Setup: Vite, Firebase, emulator, design tokens, content schema | 3 days |
| 1 | Auth, onboarding, home path UI | 1 week |
| 2 | Lesson player with all exercise types | 2 weeks |
| 3 | Hearts, XP, gems, streaks via Functions | 1 week |
| 4 | Practice mode, mistakes, quests, achievements | 1 week |
| 5 | Leagues and leaderboard | 1 week |
| 6 | PWA, audio, animation polish, accessibility | 1 week |
| 7 | Testing, security rules audit, launch | 1 week |

**MVP (Phases 0-3):** about 4-5 weeks for one developer.

## 14. Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Cheating XP | Server-side validation, App Check |
| Firestore read costs | Cache path, fetch exercises per lesson, use bundles |
| Content errors | Validation script, preview mode, version field |
| Legal/brand similarity | Original branding, art and name |
| Timezone streak bugs | Store IANA timezone, test with emulator clock |
| No TypeScript safety | PropTypes, JSDoc, ESLint, content validators |

## 15. End-to-End Build Prompt

Copy everything inside the block below into your AI coding tool (Claude Code, Cursor, etc.). For best results, run it phase by phase and confirm each phase works before moving on.

```text
You are a senior full-stack engineer. Build a production-quality web app called "CyberLingo": a Duolingo-style gamified learning platform that teaches ONLY cybersecurity. The learning format, UX, and game mechanics must closely mirror Duolingo (path of lessons, short exercise-based lessons, hearts, XP, streaks, gems, leagues, quests, feedback sheet). Use original branding and artwork, not Duolingo's.

TECH STACK (strict)
- React 18 + Vite, JavaScript ONLY (.js/.jsx). NO TypeScript anywhere.
- Firebase: Auth (Google, Email/Password, Anonymous with account upgrade), Firestore, Cloud Functions (Node 20, JavaScript, 2nd gen), Hosting, App Check.
- React Router v6, Zustand, @tanstack/react-query, Tailwind CSS, Framer Motion, Howler.js, lottie-react, PropTypes, vite-plugin-pwa.
- Testing: Vitest + React Testing Library. Develop against the Firebase Emulator Suite.
- ESLint + Prettier.

CONTENT
- All lesson content is provided by me as JSON files in /content. Do NOT invent course content beyond a small sample track for testing (2 units, 3 lessons each, covering every exercise type).
- Hierarchy: Track > Unit > Lesson > Exercise. Each unit has a "guidebook" text.
- Write scripts/validateContent.js (schema checks, unique IDs, valid answer indexes, 8-15 exercises per lesson) and scripts/seedContent.js (firebase-admin, idempotent upsert into Firestore). Add npm scripts content:validate and content:seed.
- Exercise types to support: multiple_choice, multi_select, true_false, fill_blank (word bank), match_pairs, order_steps, scenario, spot_the_threat, command_complete, info_card. Document the JSON shape of each in /docs/content-format.md with an example.

FEATURES (replicate Duolingo behavior)
1. Welcome + onboarding: goal, experience level, daily XP goal (10/20/30/50), optional placement quiz. Anonymous play then upgrade to a real account.
2. Learn tab: vertical winding path of lesson nodes grouped by unit with colored unit headers and guidebook button. Node states: locked, active (pulsing, "START" bubble), completed (gold). Sequential unlocking. Top bar shows streak, gems, hearts.
3. Lesson player (full screen): X to quit with confirm modal, animated progress bar, one exercise at a time, disabled Check button until an answer exists, green/red bottom feedback sheet showing the correct answer + explanation, Continue button. Wrong answers cost 1 heart and the exercise is re-queued to the end. Lesson ends when the queue is empty. Keyboard shortcuts (1-4 select, Enter check/continue). Sounds and haptics for correct/wrong/complete.
4. Out-of-hearts modal: options to practice for a heart, spend gems to refill, or wait. Hearts max 5, regenerate 1 per 4 hours, computed lazily from heartsUpdatedAt.
5. Lesson complete screen: XP earned, accuracy, time, streak update, gem reward, confetti, continue.
6. XP, gems, streak (with timezone-aware day boundary, daily goal, streak freeze purchasable with gems).
7. Practice tab: builds a practice session from users/{uid}/mistakes and previously completed lessons.
8. Quests tab: daily quests (earn XP, complete lessons, perfect lesson) with claimable rewards; achievements/badges.
9. Leaderboard tab: weekly leagues (Bronze, Silver, Gold, Sapphire, Diamond), 30 users each, promote top 10, demote bottom 5, reset Monday 00:00 UTC via scheduled function.
10. Profile: avatar, stats, streak calendar, achievements, settings (daily goal, sound, reduced motion, logout, delete account).
11. PWA with offline support for the current lesson (prefetch next lesson).

SERVER LOGIC (Cloud Functions, JavaScript)
- onUserCreate, completeLesson (callable; validates payload, enforces minimum lesson duration and exercise count, awards XP/gems, updates progress/streak/quests/league XP in a transaction), loseHeart, refillHearts, buyStreakFreeze, claimQuestReward, weeklyLeagueReset (scheduled), dailyStreakCheck (scheduled hourly, per-user timezone).
- Game constants live in Firestore config/gameRules and are read by functions.
- Clients must NEVER directly write xpTotal, gems, streak, hearts, leagueId.

FIRESTORE & SECURITY
- Use this data model: tracks/{trackId}/units/{unitId}/lessons/{lessonId}/exercises/{exerciseId}; users/{uid} with subcollections progress, mistakes, quests, achievements; leagues/{leagueId}/members/{uid}; config/gameRules.
- Write firestore.rules: tracks read-only to authenticated users; users writable only by owner excluding protected fields; leagues read-only to members. Write rules unit tests using the emulator. Enable App Check.
- Create firestore.indexes.json for required queries.

UI/UX REQUIREMENTS
- Mobile-first (360px+), centered 600px column on desktop with left sidebar nav (bottom nav on mobile).
- Duolingo-like feel: chunky rounded buttons with 4px darker bottom border and press-down animation, bright green primary, friendly original mascot (SVG/Lottie with happy/sad/celebrate states), slide-up feedback sheet, smooth Framer Motion transitions.
- Design tokens in src/styles/tokens.css. Accessible (WCAG AA, aria labels, color + icon for correctness, prefers-reduced-motion).

ARCHITECTURE
- Folder structure: src/{routes,components/{layout,path,lesson/exercises,modals,ui},hooks,store,services,lib,styles,assets}, functions/, content/, scripts/, docs/.
- Every exercise component follows one contract: props { exercise, onAnswerChange, disabled, status } plus a pure validate(exercise, answer) => { correct, correctAnswer } exported from lib/validators.js. Unit test every validator.
- Lesson player is a state machine (LOADING, INTRO, QUESTION, CHECKING, FEEDBACK, COMPLETE) in a Zustand store.
- Use React Query for caching the path and prefetching the next lesson; use Firestore offline persistence.
- Use PropTypes on every component and JSDoc on every function (compensating for no TypeScript).
- Environment config via .env (VITE_FIREBASE_*), with .env.example provided.

DELIVERABLES
- Complete working code, firebase.json (hosting + functions + emulators), firestore.rules, firestore.indexes.json, README.md with setup, emulator, seed, and deploy steps.
- Analytics events: lesson_start, lesson_complete, exercise_wrong, heart_lost, streak_extended.
- Tests: validators, lesson store state machine, security rules, and at least one end-to-end lesson flow test.

WORKING METHOD
Work in phases and stop after each one so I can verify:
Phase 0: scaffold, Firebase config, emulators, design tokens, content schema + validate/seed scripts.
Phase 1: auth, onboarding, Learn path UI with sample content.
Phase 2: lesson player and all exercise types.
Phase 3: Cloud Functions for hearts, XP, gems, streaks, and the lesson complete flow.
Phase 4: practice, mistakes, quests, achievements.
Phase 5: leagues and leaderboard.
Phase 6: PWA, audio, animation, accessibility polish.
Phase 7: tests, security audit, deploy.
At the start of each phase, list the files you will create or change. At the end, tell me exactly how to run and verify it. Ask me before making any decision that is not covered above.
```

## 16. Next Steps for You

1. Create the Firebase project and upgrade to Blaze (needed for Functions).
2. Prepare your first track's content in the JSON format from section 6.
3. Design your mascot, logo and color palette.
4. Paste the prompt from section 15 into your AI coding tool and run Phase 0.
