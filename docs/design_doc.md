# **SkillSetu Website Design Document**
*(Inspired by Notion’s website architecture)*
# **1. Core Design Philosophy**
### **Objectives**
- Instantly communicate: **“Choose a career → learn the exact skills → prove mastery.”**
- Minimize friction between **career discovery → skill learning → practice.**
- Maintain **SaaS startup feel similar to Notion.**
### **UX Principles**
1. **Clarity over complexity**
1. **Scroll-based storytelling**
1. **Visual hierarchy**
1. **Instant onboarding**
1. **Interactive exploration**

The hero section must communicate the product in **<5 seconds** because it’s the first visible section users see when landing on a page. 
# **2. Design Language**
## **Visual Style**
Hybrid of:

**Glassmorphism**

- blurred translucent panels
- layered UI
- subtle gradients

**Claymorphism**

- soft 3D cards
- rounded shapes
- inner + outer shadows for depth 
### **Color Palette**
Primary

- Electric Blue (#2563EB)

Secondary

- Indigo (#6366F1)

Background

- Dark Gradient
- #0F172A → #020617

Accent

- Neon Cyan
- Soft Purple
### **Typography**
Headings

- **Inter / Satoshi**

Body

- **Inter / DM Sans**

Code blocks / skill tags

- **JetBrains Mono**
# **3. Website Architecture**
The site uses **progressive storytelling (Notion-style)**

Hero\
↓\
Product Overview\
↓\
Career Explorer\
↓\
Skill Graph Visualization\
↓\
Learning Workflow\
↓\
Resources + Practice\
↓\
Community / AI features\
↓\
Pricing\
↓\
CTA\
↓\
Footer
# **4. Homepage Layout**
# **Section 1 — Hero**
### **Layout**
Two-column hero.

Left

- Headline
- Subheadline
- CTA buttons

Right

- Interactive UI preview animation
### **Example Copy**
Headline\
**Master Skills That Actually Get You Hired**

Subtext\
` `Choose a career → learn the exact skills → practice with real problems.

Buttons

Primary

Start Learning

Secondary

Explore Careers
### **Hero Visual**
Animated:

Career → Skill → Subskill → Resource → Practice

Example animation:

Machine Learning\
`  `↓\
Linear Algebra\
`  `↓\
Matrix Decomposition\
`  `↓\
Video + Article\
`  `↓\
Practice Problems

Glassmorphic floating cards.
# **Section 2 — Social Proof**
Small horizontal strip.

Trusted by learners from\
\
IIT\
NIT\
BITS\
IISc\
Global universities

Optional stats

100+ Careers\
5000+ Skills\
50k+ Resources\
1M+ Questions
# **Section 3 — Product Explanation**
Similar to Notion’s **“one workspace” explanation** section. 

Three large cards.
### **Card 1 — Career Roadmaps**
Interactive visualization:

Data Scientist\
\
Statistics\
Machine Learning\
Deep Learning\
MLOps

CTA

Explore Roadmaps
### **Card 2 — Skill Graph**
Graph structure:

Skill\
` `├ Subskills\
` `├ Resources\
` `├ Practice

Visualized like a **knowledge tree**.
### **Card 3 — Structured Learning**
Instead of random YouTube tutorials:

Career\
` `↓\
Skill\
` `↓\
Subskill\
` `↓\
Resource\
` `↓\
Practice
# **Section 4 — Career Explorer**
One of the **most important pages.**
### **UI**
Searchable career database.

Example cards:

AI Engineer\
Data Scientist\
Product Manager\
Quant Trader\
Software Engineer\
Chemical Process Engineer

Each card shows:

Difficulty\
Average Salary\
Skills Required\
Learning Time

Hover → expands.
# **Section 5 — Skill Map Visualization**
Interactive graph similar to:

Obsidian graph\
GitHub dependency map

Example:

Machine Learning\
` `├ Linear Algebra\
` `├ Probability\
` `├ Optimization\
` `└ Python

Click → open skill page.
# **Section 6 — Skill Page**
This page is the **core learning unit.**

Structure:

Skill\
│\
├ Description\
├ Subskills\
├ Resources\
└ Questions

Example:

Linear Regression

Subskills

Loss functions\
Gradient descent\
Normal equation\
Bias variance

Resources

Video\
Article\
Course\
Book

Questions

MCQ\
Coding\
Conceptual
# **Section 7 — Learning Workflow**
Explain the **SkillSetu learning model.**

Visual diagram.

Choose Career\
`      `↓\
Learn Skills\
`      `↓\
Practice\
`      `↓\
Build Projects\
`      `↓\
Get Job Ready
# **Section 8 — AI Learning Assistant**
Future feature.

Example:

AI Skill Mentor

Capabilities:

- explains concepts
- suggests resources
- generates practice questions
- tracks progress
# **Section 9 — Community**
Gamified elements.

Features

Leaderboards\
Skill streaks\
Weekly challenges\
Peer discussions
# **Section 10 — Pricing**
Simple SaaS pricing.

Free

career maps\
basic resources\
limited questions

Pro

AI mentor\
advanced questions\
projects\
certifications
# **Section 11 — Final CTA**
Large center CTA.

Start mastering skills today.

Buttons

Get Started\
Explore Careers
# **5. Navigation Design**
Minimalist top navbar like Notion.

Logo\
\
Careers\
Skills\
Resources\
Community\
Pricing\
\
Sign In\
Get Started

Sticky on scroll.
# **6. Microinteractions**
Examples:

Hover effects

cards slightly lift\
shadow increases

Skill nodes

pulse animation

Buttons

gradient glow
# **7. Motion Design**
Use **scroll-based animations**.

Examples:

Hero

floating cards animation

Skill graph

nodes expand on hover

Roadmap

branches animate when scrolling
# **8. Component Library**
Design system.

Components

Career card\
Skill node\
Skill card\
Resource card\
Question card\
Glass panels\
Buttons
# **9. Performance Requirements**
Targets

LCP < 2.5s\
TTI < 3s

Optimizations

Next.js\
Edge caching\
Image optimization\
Lazy loading
# **10. Tech Stack**
Frontend

Next.js\
Tailwind\
Framer Motion\
Three.js

Backend

Supabase\
PostgreSQL

Search

Algolia

Graph

D3.js
# **11. Core Differentiation**
Your platform differs from competitors by:

Structured skill graphs\
Career-first learning\
Resource aggregation\
Practice integrated

Competitors:

Coursera → courses\
YouTube → random content\
SkillSetu → skill mastery graph
# **12. Landing Page Conversion Strategy**
Hero → curiosity

Feature section → clarity

Skill map → uniqueness

Career explorer → engagement

CTA → action
# **13. Future Features**
Possible expansions:

AI learning paths\
skill certifications\
job matching\
portfolio generation

If you want, I can also produce:

1. **A YC-level startup design spec (like Stripe / Linear quality)**
1. **A full UI wireframe for every page**
1. **A Figma-style component system**
1. **The exact homepage layout used by $10B SaaS startups**
1. **A brutally optimized UX flow for maximum retention**.

