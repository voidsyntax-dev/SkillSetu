## **1. Frontend (UI + UX)**
**Recommended:**

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Animation:** Framer Motion

**Why this combo**

- Next.js → SSR + SEO + fast loading
- Tailwind → fastest styling iteration
- shadcn/ui → clean glassmorphic components
- Framer Motion → smooth modern UI interactions

**Outcome**

- Claymorphism + glassmorphism easy to implement
- Extremely fast development
## **2. Backend (API + Logic)**
**Recommended**

- **Runtime:** Node.js
- **Framework:** tRPC

Alternative if you want simpler:

- **Backend:** Supabase

**Why**

- tRPC → no REST boilerplate
- end-to-end type safety
- perfect with Next.js
## **3. Database**
**Recommended**

- **Primary DB:** PostgreSQL
- **ORM:** Prisma

**Reason**

Your system has structured relationships:

Job → Skills → Subskills → Resources → Questions

Relational DB handles this cleanly.
## **4. Authentication**
Use

- Clerk

or

- NextAuth.js

**Clerk advantage**

- Google login
- OTP login
- built-in user dashboard
## **5. AI Layer**
For skill recommendations and resource generation.

Use:

- OpenAI API
- or Anthropic

Applications:

- AI skill graph generation
- AI curated resources
- question generation
- learning path optimization
## **6. Search (Very Important)**
For skills / jobs discovery.

Use:

- Meilisearch

or

- Algolia

This enables:

- instant search
- fuzzy matching
- skill suggestions
## **7. Hosting / Infrastructure**
**Best modern stack**

- Frontend: Vercel
- Database: Supabase
- Storage: Cloudflare R2

**Why**

- zero DevOps
- instant deployments
- global CDN
## **8. Analytics**
Use:

- PostHog

Tracks:

- user learning paths
- skill engagement
- resource usage
## **9. CMS for Content (Optional)**
If you want editable skill/resource database:

- Sanity
# **Final Recommended Stack (Elite Startup Stack)**
**Frontend**

Next.js\
TypeScript\
Tailwind\
shadcn/ui\
Framer Motion

**Backend**

tRPC\
Node.js

**Database**

PostgreSQL\
Prisma ORM

**AI**

OpenAI APIs

**Infra**

Vercel\
Supabase\
Cloudflare

