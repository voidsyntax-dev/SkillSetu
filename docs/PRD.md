Version: v1.0  
  Scope: Full system including **skill graph, mastery tracking, decay engine, task engine, resource engine, proof vault, and career mapping**  
# **1. Product Overview**  
SkillSetu is a **skill-centric learning and career navigation platform** designed to build and maintain mastery over time.  
Traditional platforms organize knowledge around **courses**.  
  SkillSetu organizes knowledge around **skills and subskills**.  
Core structure:  
Career → Skills → Subskills → Resources → Tasks → Attempts → Mastery → Decay → Revision → Career Fit  
The system continuously tracks user mastery and prevents skill decay through intelligent task scheduling.  
# **2. Core Product Philosophy**  
### **Principle 1 — Skill Graph Learning**  
All knowledge is mapped as a **directed skill graph**.  
Nodes:  
- skills  
- subskills  
Edges:  
- prerequisite dependencies  
Example:  
Linear Algebra → Optimization → Machine Learning  
### **Principle 2 — Atomic Learning Units**  
The smallest learning unit is a **subskill**.  
Subskills allow:  
- precise mastery measurement  
- targeted practice  
- fine-grained decay tracking.  
Example:  
Thermodynamics → Subskills:  
- First Law  
- Second Law  
- Entropy  
- Phase Equilibrium  
- Fugacity  
- Chemical Potential.  
### **Principle 3 — Continuous Mastery**  
Skill knowledge decays if unused.  
The platform constantly:  
- measures mastery  
- detects decay  
- schedules revision tasks.  
# **3. Target Users**  
### **Primary Users**  
University students.  
Examples:  
- engineering students  
- CS learners  
- technical self learners.  
### **Secondary Users**  
Early career professionals.  
Use cases:  
- career switching  
- skill upgrades.  
### **Tertiary Users**  
Employers seeking verified skill evidence.  
# **4. Core System Architecture**  
Platform flow:  
User  
  → Job Profile  
  → Skills  
  → Subskills  
  → Resources  
  → Tasks  
  → Attempts  
  → Mastery Score Update  
  → Decay Engine  
  → Daily Task Recommendation  
  → Resource Recommendation  
  → Career Fit Score.  
# **5. Job Profile Layer**  
Users start by selecting a **target job role**.  
Examples:  
- Process Engineer  
- Process Simulation Engineer  
- Chemical Data Scientist  
- Machine Learning Engineer  
- Investment Analyst.  
Each job profile contains:  
- required skills  
- expected proficiency  
- recommended learning roadmap  
- career fit calculation.  
# **6. Skill Layer**  
Each job profile contains **core skills**.  
Example: Process Simulation Engineer  
Skills:  
- Thermodynamics  
- Fluid Mechanics  
- Heat Transfer  
- Process Simulation  
- Numerical Methods  
- Python for Engineers.  
Each skill contains:  
- importance weight  
- mastery score  
- decay risk  
- progress tracking.  
# **7. Subskill Layer**  
Subskills are the **primary learning units**.  
Example:  
Thermodynamics  
Subskills:  
- First Law  
- Second Law  
- Entropy  
- Phase Equilibrium  
- Fugacity  
- Chemical Potential  
- Equations of State.  
Why subskills exist:  
- resources attach here  
- tasks test here  
- decay tracked here.  
# **8. Resource Layer**  
Each subskill contains learning resources.  
Types:  
- video lectures  
- textbook chapters  
- research papers  
- notes  
- simulations  
- interactive demonstrations.  
Metadata stored:  
- duration  
- difficulty  
- source  
- estimated learning time  
- subskill tag.  
# **9. Task / Question Layer**  
Each subskill has a **task bank**.  
Task types:  
Concept questions  
  Numerical problems  
  Case studies  
  Simulation tasks.  
Difficulty levels:  
1 Basic  
  2 Intermediate  
  3 Advanced  
  4 Exam level  
  5 Industry level.  
Each task stores:  
- correct answer  
- expected completion time  
- difficulty  
- concept tags.  
# **10. Task Attempt Tracking**  
Every user attempt is recorded.  
Data stored:  
User ID  
  Task ID  
  Score  
  Time taken  
  Attempt timestamp  
  Success / failure.  
This data drives:  
- mastery score updates  
- resource recommendations  
- decay detection.  
# **11. Mastery Score System**  
Mastery represents the user's knowledge of a skill or subskill.  
Factors influencing mastery:  
Accuracy  
  Question difficulty  
  Consistency  
  Recency of practice.  
Harder questions increase mastery more.  
Example formula:  
mastery_new = mastery_old + difficulty_weight × accuracy × consistency_factor  
Mastery is stored at:  
- subskill level  
- skill level (aggregated).  
# **12. Skill Decay Engine**  
Knowledge decays over time if unused.  
Decay model:  
mastery = mastery × e^(−λt)  
Where:  
λ = forgetting rate  
  t = time since last practice.  
Risk levels:  
Mastery < 40 → High risk  
  40–70 → Medium risk  
70 → Stable.  
The decay engine runs periodically.  
# **13. Daily Task Recommendation Engine**  
The system generates daily practice tasks.  
Priority formula:  
priority = skill_weight × decay_risk  
Daily task plan example:  
- 1 high-priority revision task  
- 1 medium-priority reinforcement task  
- optional new learning task.  
Total tasks must respect user time limits.  
# **14. Resource Recommendation Engine**  
Resources appear when the system detects difficulty.  
Triggers:  
- task failure  
- excessive completion time  
- repeated mistakes.  
Ranking rules:  
1 shortest resource covering concept  
  2 highest quality source  
  3 difficulty matching user level.  
# **15. Proof Vault**  
Proof Vault stores evidence of user learning.  
Data stored:  
task score  
  completion timestamp  
  optional uploaded files  
  project submissions.  
Examples:  
- Aspen simulation files  
- code notebooks  
- project reports.  
Users can export proof history.  
# **16. Internship & Career Mapping**  
Skills map to real career opportunities.  
Examples:  
- AICTE internship programs  
- government internship schemes.  
Career Fit Score formula:  
fit_score = completed_required_skills / total_required_skills  
The platform shows:  
- eligibility percentage  
- missing skills  
- recommended next learning steps.  
# **17. Dashboard & Visualization**  
User dashboard includes:  
Skill mastery heatmap  
  Decay alerts  
  Weak skill detection  
  Weekly progress graph  
  Learning streak  
  Mastery radar chart.  
The dashboard visualizes the user’s **personal skill graph**.  
# **18. Gamification**  
Retention systems include:  
daily streaks  
  weekly mastery gain  
  consistency score  
  milestone badges.  
Gamification encourages continuous learning.  
# **19. Skill Graph Dependency System**  
Skills may depend on prerequisites.  
Example:  
Thermodynamics → Phase Equilibrium → Distillation.  
The system ensures:  
- correct learning order  
- dependency-aware recommendations.  
# **20. Database Architecture**  
Core tables:  
user  
  domain  
  job_profile  
  skill_node  
  subskill_node  
  skill_dependency  
  resource  
  task  
  task_attempt  
  user_skill_state  
  proof_vault.  
Additional tables:  
daily_task  
  career_mapping  
  skill_progress  
  resource_interaction.  
# **21. Tech Stack**  
Frontend:  
Next.js  
  React  
  TailwindCSS.  
Backend:  
FastAPI or Node.js.  
Database:  
PostgreSQL.  
Graph relationships:  
Neo4j.  
Authentication:  
Firebase Auth or Auth0.  
Hosting:  
Railway / Render / Vercel.  
# **22. AI Layer**  
AI components:  
AI Career Navigator  
  AI Learning Assistant  
  AI Skill Gap Analyzer.  
Capabilities:  
generate learning paths  
  explain concepts  
  generate practice questions  
  detect missing skills.  
# **23. User Journey**  
Step 1 — user selects career.  
  Step 2 — system loads skill graph.  
  Step 3 — user studies subskills.  
  Step 4 — resources displayed.  
  Step 5 — user solves tasks.  
  Step 6 — mastery score updates.  
  Step 7 — decay engine monitors knowledge.  
  Step 8 — system schedules revision tasks.  
# **24. MVP Scope**  
Initial MVP includes:  
5 domains  
  20 job profiles  
  150 skills  
  600 subskills  
  1500 tasks.  
Features included:  
skill graph  
  task system  
  mastery scoring  
  decay engine  
  daily tasks  
  dashboard.  
# **25. 8-Week MVP Build Plan**  
Week 1  
  Authentication + user profiles.  
Week 2  
  Skill graph + database models.  
Week 3  
  Task system.  
Week 4  
  Mastery score engine.  
Week 5  
  Decay engine.  
Week 6  
  Daily task recommendation.  
Week 7  
  Proof vault + internship mapping.  
Week 8  
  UI polish + analytics.  
# **26. Monetization**  
Free tier:  
career maps  
  resources  
  basic tasks.  
Premium tier:  
AI mentor  
  advanced projects  
  skill certification  
  career insights.  
Subscription target:  
$8–12/month.  
# **27. Long-Term Vision**  
SkillSetu becomes a **global skill graph for careers**.  
Instead of learning platforms selling courses, SkillSetu becomes the **navigation system for human knowledge and professional skills**.  
Users will track, maintain, and prove their expertise through continuously measured mastery.  
   
