// Validates catalog integrity: references resolve, ids are unique, and every
// generated question is well-formed. Run with `npm run catalog:check`.

import { branches, careers, internships, skills } from "../src/data/catalog";
import { catalogStats, getQuestions } from "../src/lib/catalog";

const errors: string[] = [];
const skillIds = new Set<string>();

for (const s of skills) {
  if (skillIds.has(s.id)) errors.push(`duplicate skill id ${s.id}`);
  skillIds.add(s.id);
}
for (const s of skills) {
  for (const d of s.dependsOn) if (!skillIds.has(d)) errors.push(`${s.id} depends on unknown ${d}`);
  const subIds = new Set<string>();
  for (const ss of s.subskills) {
    if (subIds.has(ss.id)) errors.push(`duplicate subskill ${s.id}:${ss.id}`);
    subIds.add(ss.id);
    if (ss.concepts.length < 3) errors.push(`${s.id}:${ss.id} has fewer than 3 concepts`);
    const qs = getQuestions(s.id, ss.id);
    if (qs.length < 5) errors.push(`${s.id}:${ss.id} has only ${qs.length} questions`);
    for (const q of qs) {
      if (q.options.length !== 4) errors.push(`${q.id} has ${q.options.length} options`);
      if (!q.options.includes(q.answer)) errors.push(`${q.id} answer missing from options`);
      if (new Set(q.options.map((o) => o.toLowerCase())).size !== q.options.length) errors.push(`${q.id} has duplicate options`);
    }
  }
}
for (const b of branches) for (const id of b.skills) if (!skillIds.has(id)) errors.push(`branch ${b.id} lists unknown skill ${id}`);
for (const c of careers) {
  if (!branches.some((b) => b.id === c.branchId)) errors.push(`career ${c.id} has unknown branch ${c.branchId}`);
  for (const s of c.skills) if (!skillIds.has(s.id)) errors.push(`career ${c.id} needs unknown skill ${s.id}`);
}
for (const i of internships) for (const r of i.requirements) if (!skillIds.has(r.skillId)) errors.push(`internship ${i.id} needs unknown skill ${r.skillId}`);

// Skills not reachable from any branch would be orphaned in navigation.
const inBranch = new Set(branches.flatMap((b) => b.skills));
for (const s of skills) if (!inBranch.has(s.id)) errors.push(`skill ${s.id} is not in any branch`);

console.log(catalogStats());
if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log("Catalog OK");
