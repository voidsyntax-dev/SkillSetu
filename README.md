# SkillSetu (https://skillsetu-aevh.onrender.com)

**Career-first skill mastery for engineering students.**
SkillSetu maps engineering careers to the subjects and subskills they require, then helps a learner
master them through adaptive practice, numerical problems, exam-style tests, spaced revision and
verifiable proofs of skill.

> *Branch → Career → Subject → Subskill → Concepts → Practice → Mastery → Decay → Revision → Career fit → Proof*

---

## At a glance

| Item | Detail |
|---|---|
| Type | Full-stack web application (single codebase, server-rendered) |
| Audience | Engineering students (India-focused: GATE, placements, ₹ salary bands) |
| Engineering branches | 10 (Chemical, Biotech, Mechanical, Civil, Electrical, Electronics & Communication, Computer Science, Metallurgy & Materials, Environmental, Aerospace) |
| Careers | 36, each with weighted skill requirements, salary band, outlook and employers |
| Subjects | 75 (Year 1 to Year 4, with a prerequisite graph) |
| Subskills | 262 |
| Concepts | 887 key terms with definitions |
| Practice questions | 2,000+ generated from concepts, plus hand-written applied questions and parametrised numerical problems |
| Language | TypeScript (strict mode) |
| Framework | Next.js 16 (App Router, React Server Components, Server Actions) |
| UI | React 19, Tailwind CSS 4, Lucide icons, Inter font |
| Data | Prisma ORM with SQLite (switch to PostgreSQL by changing the datasource) |
| Auth | bcrypt password hashing, HMAC-signed httpOnly session cookies, guest-first access |
| AI (optional) | Anthropic Claude via the official SDK, with a built-in offline fallback |
| Quality checks | `tsc --noEmit`, ESLint (Next.js config), catalog integrity checker, production build |

---

## Problem it solves

Engineering students often study subjects in isolation, do not know which topics their target job
needs, forget material before exams, and have no evidence of skill beyond grades. SkillSetu addresses each of these:

| Problem | SkillSetu response |
|---|---|
| "Which subjects matter for my career?" | Career pages list weighted skills; career fit is computed from the learner's mastery |
| "What should I study next?" | Roadmaps respect prerequisites; the daily plan recommends what to revise, strengthen or learn |
| "I forget things quickly" | Mastery decays on a forgetting curve; a due-date queue and decay alerts schedule revision |
| "I need exam practice" | Adaptive practice, numerical problems, timed mock tests and GATE-style mocks |
| "How do I prove what I know?" | Automatic proofs of mastery, skill certificates, project submissions and a public portfolio |
| "Where do I stand for placements?" | Aptitude drills, an interview question bank, and a resume generated from verified proofs |

---

## Feature overview

### 1. Learning content

| Feature | Description |
|---|---|
| Branch explorer | Ten branches, each with an ordered subject list, description and career paths |
| Career pages | Required skills with importance weights, salary band, learning time, outlook, typical employers and a skill-graph roadmap |
| Subject pages | Subskills, prerequisites, unlocks, careers that need the subject, recommended textbook |
| Subskill pages | Summary, key concepts, curated resources (NPTEL, MIT OCW, YouTube, Wikipedia, textbooks), mastery stats, notes, bookmark and an AI explanation panel |
| Skill graph | Interactive SVG prerequisite graph coloured by mastery |
| Search and command palette | `Ctrl/⌘ K` opens instant search across branches, careers, subjects, subskills and concepts |
| Internship matching | Sample listings mapped to required mastery levels, showing readiness and eligibility |

### 2. Adaptive practice and mastery

| Feature | Description |
|---|---|
| Practice sessions | 10-question sessions; difficulty adapts to current mastery; instant feedback with explanation |
| Keyboard practice | Keys `1–4` choose an answer; `Enter` submits and continues |
| Mastery engine | Score updated per answer using difficulty, correct-answer streak, speed bonus and diminishing returns near 100% |
| Forgetting curve | `mastery = m × e^(−0.035·t)` with a one-day grace period; scores fade when a topic is not revisited |
| Decay risk | Each topic is classed Stable, Fading or Decaying; alerts appear on the dashboard |
| Why was I wrong? | After a wrong answer, an explanation of the misconception (AI mentor or offline) |
| Flashcards | Every subskill's concepts as 3-D flip cards with "Got it / Still learning" self-rating; missed cards return |
| Question bank | Concept-to-definition, definition-to-concept, odd-one-out and applied questions, generated deterministically |

### 3. Numerical problems and exam preparation

| Feature | Description |
|---|---|
| Numerical problems | 16 parametrised problem types across thermodynamics, fluids, heat transfer, reaction engineering, circuits, mass and energy balances, strength of materials, particle technology, electrical machines and aptitude |
| Fresh numbers each time | Each problem is generated from a seed; the server rebuilds it to grade, so answers are never sent to the browser |
| Worked solutions | Formula, step-by-step working and the final value, shown after answering |
| Formula sheets | Printable per-subject sheets with formulas and worked examples |
| GATE mode | 60-minute GATE-style mock per branch: 25 MCQs (1 mark, −⅓ for wrong) and 5 numericals (2 marks, no negative); timer, question navigator and full answer review |
| Mock tests | 15 questions in 15 minutes for a whole subject, with a per-topic breakdown and review |
| Head-to-head challenges | Five-question challenge on any subject, shared by link; the first attempt goes on the leaderboard |
| Placement prep | Aptitude drill (percentages, work and time, averages) and branch-specific interview questions with model answers |
| Mistake book | Every question answered wrongly is kept until it is answered correctly in a retry session |
| Daily review | Mixed revision of the weakest and most-decayed topics |

### 4. Planning, insight and motivation

| Feature | Description |
|---|---|
| Daily plan | Revise → strengthen → learn, ordered and prerequisite-aware |
| Due-today queue | Spaced-repetition schedule (review interval of 1–21 days, set by mastery) |
| Question of the day | One question per branch per day, with the share of learners who answered correctly |
| Exam planner | Exam date and subjects → questions per day needed to reach 80% mastery, plus a 7-day rotating schedule |
| Analytics | Total accuracy, average time, accuracy by subject and by difficulty, fastest-decaying topics |
| Weekly report | Last 7 days compared with the previous 7: questions answered, accuracy, mastery gained |
| Streaks | Daily streaks with a longest-streak record; one-day streak freezes earned every 7 days (max 2) |
| Badges | 13 achievements (e.g. Sharpshooter, Week Warrior, Polymath, Skill Master) |
| Study groups | Create a group, share a 6-character code, 7-day XP leaderboard (correct answers), per-member mastery and weakest subject |
| Teacher view | The group owner assigns subjects with due dates and sees overdue assignments and member progress |

### 5. Career outcomes

| Feature | Description |
|---|---|
| Career fit score | Weighted mastery across the career's required skills, with the biggest gap highlighted |
| Gap analysis | Two-week study plan for the highest-impact gaps (AI or offline) |
| Career comparison | Compare up to three careers: branch, salary, time to job-ready, difficulty, shared and unique skills, and your fit |
| Projects | Ten guided mini-projects linked to careers; marking one submitted adds it to the proof vault |
| Proof vault | Automatic proofs: subtopic mastery (≥80% with ≥70% accuracy over 5+ attempts), skill certificates (all subtopics mastered) and project submissions, each with a verification hash |
| Public portfolio | Shareable read-only page of a registered learner's proofs |
| Resume generator | Printable resume from name, branch, target career, verified skills, proofs, badges and streak |

### 6. Personalisation and accessibility

| Feature | Description |
|---|---|
| Onboarding wizard | Three steps: branch → goal career → daily study target |
| Light, dark and system themes | Chosen in the header; applied before first paint (no flash) |
| Responsive design | Desktop navigation with dropdown menus; full mobile drawer |
| Reduced motion | All animations respect the operating system's "reduce motion" setting |
| Keyboard support | Command palette, practice shortcuts, skip-to-content link, visible focus rings |
| Language toggle | English / Hindi for navigation and sign-in (content remains in English) |
| Installable app (PWA) | Web app manifest and service worker that caches the app shell for offline viewing of recent pages |

### 7. AI mentor (optional)

| Feature | Description |
|---|---|
| Subskill explanations | Explanation with an analogy and a real-world example; the learner can ask a specific doubt |
| Career navigator | Describe your interests and receive matching careers with reasons |
| Gap analysis | Personalised study plan for a target career |
| Why was I wrong? | Explains the misconception behind a wrong answer |
| Bring your own key | A learner can paste their own Anthropic key in Settings. It stays in their browser and is sent only with each mentor request |
| Offline fallback | With no key, a deterministic engine answers from the catalog, so the feature never breaks |
| Safe failure | If Claude is unavailable, the learner gets the offline answer with a short notice explaining why |

### 8. Accounts, data and administration

| Feature | Description |
|---|---|
| Guest-first access | Anyone can practise immediately; guest progress carries over when the learner signs up |
| Sign up and log in | Email and password (bcrypt); signed session cookie (HMAC-SHA256, httpOnly, sameSite=lax) |
| Preferences | Name, branch, target career (also sets the branch) and daily goal |
| Bookmarks and notes | Save a subskill to the library; personal notes autosave |
| Reset progress | Clears mastery, attempts, activity, badges, proofs and results (after confirmation) |
| Admin content editor | Add questions to any subtopic from the browser; available to emails listed in `ADMIN_EMAILS` |
| Resource tracking | Mark curated resources as done or helpful |

---

## Screens and routes

| Area | Routes |
|---|---|
| Home and onboarding | `/`, `/onboarding` |
| Dashboard | `/dashboard` |
| Explore | `/branches`, `/branches/[id]`, `/careers`, `/career/[id]`, `/skills`, `/skills/[id]`, `/subskills/[skillId]/[subskillId]`, `/compare`, `/formulas`, `/formulas/[skillId]`, `/internships`, `/search` |
| Practice | `/practice/[skillId]/[subskillId]`, `/review`, `/numericals`, `/flashcards`, `/flashcards/[skillId]`, `/test`, `/test/[skillId]`, `/gate`, `/gate/[branchId]`, `/challenges`, `/challenge/[code]`, `/mistakes`, `/mistakes/retry`, `/placement` |
| Plan and insight | `/planner`, `/analytics`, `/groups`, `/groups/[id]` |
| Outcomes | `/proofs`, `/portfolio/[id]`, `/projects`, `/resume` |
| Account | `/login`, `/signup`, `/settings`, `/library` |
| AI | `/mentor` |
| Admin | `/admin` (restricted) |
| System | `/manifest.webmanifest`, `/sw.js`, `/icon.svg`, custom 404 page |

---

## Architecture

```
skillsetu/
├── prisma/schema.prisma        Per-user state: mastery, attempts, activity, badges, proofs,
│                               groups, challenges, test results, plans, daily answers, custom questions
├── scripts/check-catalog.ts    Integrity checks: unique ids, resolvable references, four options per
│                               question, answer present in options, every skill belongs to a branch
├── public/sw.js                Service worker (app-shell cache)
└── src/
    ├── data/catalog/           The curriculum as typed code (branches, careers, internships and one
    │                           file per engineering domain). Adding content means editing these files
    ├── data/projects.ts        Guided projects per career
    ├── data/placement.ts       Interview question bank per branch
    ├── lib/
    │   ├── catalog.ts          Lookups, search, question and resource generation
    │   ├── rand.ts             Seeded randomness (reproducible problems and quizzes)
    │   ├── numerics.ts         Parametrised numerical problems, grading and worked solutions
    │   ├── mastery.ts          Mastery maths: decay, risk, answer update, labels
    │   ├── attempts.ts         Records an answer: mastery, streaks and freezes, activity, proofs, badges
    │   ├── planning.ts         Custom questions, GATE sets, daily question, due queue, analytics,
    │   │                       exam plan, group XP
    │   ├── insights.ts         Career fit, daily plan, decay alerts, internship matching
    │   ├── actions.ts          All mutations (Server Actions): grading, groups, challenges, admin
    │   ├── ai.ts               Claude integration with offline fallback
    │   ├── session.ts          Signed cookie sessions and guest creation
    │   ├── i18n.ts, theme.ts   Language and theme preferences (client)
    │   └── admin.ts            Admin email allow-list
    ├── components/             Practice engine, quiz runner, numerical drill, flashcards, command
    │                           palette, header, charts, skill graph, UI primitives
    └── app/                    Routes (App Router), loading states, print-friendly pages
```

### Key design decisions

| Decision | Reason |
|---|---|
| Curriculum lives in typed code, not in the database | Versioned, reviewable, type-checked content; the database stores only per-user state |
| All grading happens on the server | Correct answers never reach the browser before submission, which prevents trivial cheating |
| Seeded problem generation | The server can rebuild a numerical problem or a whole GATE set from a seed, so no answer keys are stored or sent |
| Server Components by default, small client islands | Fast first paint, small JavaScript bundles, data fetched close to the database |
| Server Actions for mutations | No hand-written API layer; type-safe calls from components |
| Pure mastery maths shared by client and server | Consistent scores whether computed in a page or a component |
| Explicit AI fallback | The product works without any external service or paid key |
| User-supplied AI keys stay in the browser | The platform never stores or logs a learner's key |
| Dependency-free charts and skill graph (SVG) | Lightweight pages and no chart-library lock-in |
| CSS-only animations with reduced-motion support | Smooth UI without an animation runtime cost |

---

## Mastery model (summary)

| Input | Effect |
|---|---|
| Correct answer | Score rises. Gain scales with difficulty (1.0× / 1.25× / 1.5×), streak (up to +40%) and speed (+10% if under 20 s), and shrinks near 100% |
| Wrong answer | Score falls; the loss is larger at higher mastery |
| Time without practice | Score decays by `e^(−0.035·days)` after a one-day grace period |
| Review schedule | Revisit interval: 21 days (≥90%), 10 days (≥80%), 4 days (≥60%), 2 days (≥40%), otherwise 1 day |
| Proof threshold | ≥80% mastery, ≥70% accuracy, ≥5 attempts |

---

## Security and privacy

| Area | Measure |
|---|---|
| Passwords | bcrypt hashing (cost 10); never stored or logged in plain text |
| Sessions | HMAC-SHA256-signed cookie, httpOnly, sameSite=lax, secure in production; secret from `AUTH_SECRET` |
| Authorisation | Group actions check ownership; admin tools check the allow-listed email; learner data is scoped to the session user |
| Grading integrity | Answers and explanations are returned only after submission |
| Input handling | Length limits on free text; date and identifier validation; references restricted to the catalog |
| API keys | Server key (optional, from the environment) and learner key (browser-only, per request); masked in the UI; never logged |
| Errors | Mentor errors are logged by category only, never with request contents |
| Personal data | Minimal: name, email (optional for guests) and study data. No tracking or third-party analytics |

---

## Quality and engineering practice

| Check | Status |
|---|---|
| TypeScript strict mode | Passing (`npm run typecheck`) |
| ESLint with Next.js and React hooks rules | Passing (`npm run lint`) |
| Production build (all routes compiled) | Passing (`npm run build`) |
| Catalog integrity checker | `npm run catalog:check` |
| Numerical engine self-check | Generated problems verified: correct answers accepted, wrong answers rejected |
| Browser verification | Core flows (practice, numericals, dashboard, library, flashcards, mock tests, mistake book) checked end to end |
| Automated test suite | Not yet included (see roadmap) |

---

## Getting started

Requirements: Node.js 20 or later, and npm.

```bash
cd skillsetu
npm install                    # also runs `prisma generate`
cp .env.example .env           # set AUTH_SECRET; optional: ANTHROPIC_API_KEY, ADMIN_EMAILS
npx prisma db push             # creates the SQLite database
npm run catalog:check          # optional: validate the curriculum
npm run dev                    # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | Database location (default `file:./dev.db`) |
| `AUTH_SECRET` | Yes in production | Secret for signing session cookies |
| `ANTHROPIC_API_KEY` | No | Enables the Claude-powered mentor for all users by default |
| `ADMIN_EMAILS` | No | Comma-separated emails allowed to use `/admin` |

---

## Adding content

| Content | Where | How |
|---|---|---|
| Concepts and subskills | `src/data/catalog/<domain>.ts` | Use the `skill()` and `sub()` helpers; add `[term, definition]` tuples. Practice questions are generated automatically |
| Hand-written applied questions | Same files | Add `[question, answer, [wrong1, wrong2, wrong3], explanation, difficulty]` |
| Numerical problem types | `src/lib/numerics.ts` | Add a template with a `build(rand)` function returning prompt, value and steps |
| Careers, branches, internships | `src/data/catalog/` | Edit the relevant file, then run `npm run catalog:check` |
| Questions without code | `/admin` | Sign in with an allow-listed email |

---

## Current limitations

- No automated test suite yet.
- Numerical problems cover 16 types; most subjects rely on concept questions.
- GATE mode is GATE-style: no multiple-select questions, no official paper patterns, no score prediction.
- Study-group assignments do not yet track completion per member.
- Projects are self-reported; there is no review workflow.
- Hindi covers navigation and sign-in only.
- Admin-authored questions appear in regular practice, not in mock tests, reviews or the mistake book.
- Offline mode serves recently viewed pages only; practice answers need a connection.
- Internship listings are illustrative samples, not live job postings.

---

## Roadmap

1. Automated tests (mastery maths, numerical grading, GATE scoring, end-to-end practice flow)
2. Multiple-select questions and official GATE paper formats
3. Completion tracking and reminders for group assignments
4. More numerical problem types and worked examples per subject
5. Hindi translations of concept content
6. Email verification and password reset
7. PostgreSQL deployment and rate limiting on the mentor endpoint

---

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Prisma · SQLite · Lucide icons · Anthropic SDK (optional) · bcryptjs

---

---

## License and copyright

**Copyright © 2026 Anant Mukherjee. All rights reserved.**

This is proprietary software. No one may use, copy, modify, deploy, distribute or
otherwise exploit this code, its content or its documentation without prior written
permission from the copyright holder. Viewing the repository for evaluation (for
example, in a hiring process) does not grant any usage right.

See the [LICENSE](LICENSE) file for the full terms.

---

*SkillSetu — Maps the path. Masters the skill.*
