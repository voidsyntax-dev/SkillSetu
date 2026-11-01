// Parametrised engineering problems. Each problem is built from a seed, so the
// server can rebuild it later and grade the answer without sending it to the browser.
// Problem ids look like "num:<templateId>:<seed>".

import { makeRand, type Rand } from "./rand";

const round = (v: number, d: number) => Math.round(v * 10 ** d) / 10 ** d;

interface Built {
  prompt: string;
  value: number;
  steps: string[];
}

export interface NumericTemplate {
  id: string;
  title: string;
  skillId: string;
  subskillId: string | null; // null = aptitude: no mastery is recorded
  unit: string;
  decimals: number;
  difficulty: 1 | 2 | 3;
  formula: string;
  tag?: "aptitude";
  build: (r: Rand) => Built;
}

export interface NumericPublic {
  id: string;
  title: string;
  prompt: string;
  unit: string;
  formula: string;
  difficulty: 1 | 2 | 3;
  skillId: string;
  subskillId: string | null;
  tag?: "aptitude";
}

export interface NumericCheck {
  correct: boolean;
  value: number;
  unit: string;
  formula: string;
  steps: string[];
  tolerance: number;
}

export const NUMERIC_TEMPLATES: NumericTemplate[] = [
  {
    id: "carnot", title: "Carnot efficiency", skillId: "thermodynamics", subskillId: "second_law",
    unit: "%", decimals: 1, difficulty: 1, formula: "η = (1 − T_C / T_H) × 100 %",
    build: (r) => {
      const th = r(500, 800, 10), tc = r(250, 350, 5);
      const v = round((1 - tc / th) * 100, 1);
      return {
        prompt: `A Carnot engine takes heat from a reservoir at ${th} K and rejects heat to a sink at ${tc} K. Find its thermal efficiency in %.`,
        value: v,
        steps: ["η = (1 − T_C / T_H) × 100", `η = (1 − ${tc} / ${th}) × 100`, `η = ${v} %`],
      };
    },
  },
  {
    id: "ideal_gas", title: "Ideal gas pressure", skillId: "thermodynamics", subskillId: "property_relations",
    unit: "kPa", decimals: 1, difficulty: 1, formula: "P = nRT / V",
    build: (r) => {
      const n = r(1, 5), t = r(273, 400), vL = r(2, 20);
      const p = round((n * 8.314 * t) / vL, 1); // kPa
      return {
        prompt: `${n} mol of an ideal gas is at ${t} K in a ${vL} L container. Find the pressure in kPa (R = 8.314 J/mol·K).`,
        value: p,
        steps: ["P = nRT / V", `P = ${n} × 8.314 × ${t} / ${round(vL / 1000, 3)} m³ = ${round((n * 8.314 * t) / (vL / 1000), 0)} Pa`, `P = ${p} kPa`],
      };
    },
  },
  {
    id: "reynolds", title: "Reynolds number", skillId: "fluid_mechanics", subskillId: "flow_regimes",
    unit: "", decimals: 0, difficulty: 1, formula: "Re = ρVD / μ",
    build: (r) => {
      const v = r(5, 30, 5) / 10, d = r(20, 100, 10);
      const re = Math.round(1000 * v * d);
      return {
        prompt: `Water (ρ = 1000 kg/m³, μ = 1.0 mPa·s) flows at ${v} m/s through a ${d} mm pipe. Find the Reynolds number.`,
        value: re,
        steps: ["Re = ρVD / μ", `Re = 1000 × ${v} × ${d / 1000} / 0.001`, `Re ≈ ${re}`],
      };
    },
  },
  {
    id: "pipe_head_loss", title: "Pipe friction head loss", skillId: "fluid_mechanics", subskillId: "pipe_flow",
    unit: "m", decimals: 2, difficulty: 2, formula: "h_f = f (L/D) V² / (2g)",
    build: (r) => {
      const l = r(50, 200, 10), v = r(2, 6) / 2, dMm = r(50, 200, 10);
      const hf = round((0.02 * (l / (dMm / 1000)) * v * v) / (2 * 9.81), 2);
      return {
        prompt: `Water flows at ${v} m/s through ${l} m of ${dMm} mm pipe. With a friction factor f = 0.02, find the head loss in metres.`,
        value: hf,
        steps: ["h_f = f (L/D) V² / (2g)", `h_f = 0.02 × (${l} / ${dMm / 1000}) × ${v}² / (2 × 9.81)`, `h_f = ${hf} m`],
      };
    },
  },
  {
    id: "conduction", title: "Conduction through a wall", skillId: "heat_transfer", subskillId: "conduction",
    unit: "W", decimals: 0, difficulty: 1, formula: "Q = k A ΔT / L",
    build: (r) => {
      const k = r(5, 500, 5) / 10, a = r(1, 5), dT = r(10, 100, 5), l = r(1, 5) / 10;
      const q = Math.round((k * a * dT) / l);
      return {
        prompt: `A flat wall of area ${a} m² and thickness ${l} m has thermal conductivity ${k} W/m·K. The temperature difference across it is ${dT} K. Find the heat flow in W.`,
        value: q,
        steps: ["Q = k A ΔT / L", `Q = ${k} × ${a} × ${dT} / ${l}`, `Q = ${q} W`],
      };
    },
  },
  {
    id: "cstr_first_order", title: "CSTR conversion (1st order)", skillId: "reaction_engineering", subskillId: "ideal_reactors",
    unit: "%", decimals: 1, difficulty: 2, formula: "X = kτ / (1 + kτ)",
    build: (r) => {
      const k = r(1, 10) / 10, tau = r(1, 10);
      const x = round(((k * tau) / (1 + k * tau)) * 100, 1);
      return {
        prompt: `A first-order reaction (k = ${k} min⁻¹) runs in a CSTR with space time τ = ${tau} min. Find the conversion in %.`,
        value: x,
        steps: ["X = kτ / (1 + kτ)", `X = (${k} × ${tau}) / (1 + ${k} × ${tau})`, `X = ${x} %`],
      };
    },
  },
  {
    id: "parallel_resistors", title: "Parallel resistors", skillId: "circuit_theory", subskillId: "dc_circuits",
    unit: "Ω", decimals: 2, difficulty: 1, formula: "R = R₁R₂ / (R₁ + R₂)",
    build: (r) => {
      const a = r(2, 20) * 5, b = r(2, 20) * 5;
      const req = round((a * b) / (a + b), 2);
      return {
        prompt: `Two resistors of ${a} Ω and ${b} Ω are connected in parallel. Find the equivalent resistance in Ω.`,
        value: req,
        steps: ["1/R = 1/R₁ + 1/R₂", `R = ${a} × ${b} / (${a} + ${b})`, `R = ${req} Ω`],
      };
    },
  },
  {
    id: "mixing", title: "Mixing streams", skillId: "material_energy_balances", subskillId: "material_balances",
    unit: "%", decimals: 1, difficulty: 1, formula: "x_mix = (m₁x₁ + m₂x₂) / (m₁ + m₂)",
    build: (r) => {
      const m1 = r(1, 10) * 10, x1 = r(10, 60, 5), m2 = r(1, 10) * 10, x2 = r(10, 60, 5);
      const w = round((m1 * x1 + m2 * x2) / (m1 + m2), 1);
      return {
        prompt: `${m1} kg of a stream containing ${x1}% solute is mixed with ${m2} kg of a stream containing ${x2}% solute. Find the solute mass percent of the mixture.`,
        value: w,
        steps: ["Solute balance: m₁x₁ + m₂x₂ = (m₁ + m₂) x_mix", `x_mix = (${m1}×${x1} + ${m2}×${x2}) / (${m1} + ${m2})`, `x_mix = ${w} %`],
      };
    },
  },
  {
    id: "axial_stress", title: "Axial normal stress", skillId: "strength_of_materials", subskillId: "stress_strain",
    unit: "MPa", decimals: 1, difficulty: 1, formula: "σ = F / A",
    build: (r) => {
      const f = r(5, 100, 5), a = r(100, 500, 50);
      const s = round((f * 1000) / a, 1);
      return {
        prompt: `A bar with a cross-section of ${a} mm² carries an axial load of ${f} kN. Find the normal stress in MPa.`,
        value: s,
        steps: ["σ = F / A", `σ = ${f} × 1000 N / ${a} mm²`, `σ = ${s} MPa`],
      };
    },
  },
  {
    id: "beam_bending", title: "Beam bending stress", skillId: "strength_of_materials", subskillId: "bending",
    unit: "MPa", decimals: 1, difficulty: 3, formula: "σ = M·y / I,  I = bh³/12,  y = h/2",
    build: (r) => {
      const m = r(5, 50, 5), b = r(50, 150, 10), h = r(100, 300, 50);
      const inertia = (b * h ** 3) / 12;
      const s = round((m * 1e6 * (h / 2)) / inertia, 1);
      return {
        prompt: `A rectangular beam (${b} mm wide, ${h} mm deep) bends under a moment of ${m} kN·m. Find the maximum bending stress in MPa.`,
        value: s,
        steps: ["σ = M·y / I, with I = bh³/12 and y = h/2", `I = ${b} × ${h}³ / 12 mm⁴`, `σ = ${m}×10⁶ × ${h / 2} / I = ${s} MPa`],
      };
    },
  },
  {
    id: "stokes_settling", title: "Stokes settling velocity", skillId: "particle_technology", subskillId: "settling",
    unit: "mm/s", decimals: 2, difficulty: 3, formula: "v = (ρp − ρf) g d² / (18 μ)",
    build: (r) => {
      const d = r(10, 100, 10);
      const dm = d * 1e-6;
      const v = round(((2500 - 1000) * 9.81 * dm * dm) / (18 * 0.001) * 1000, 2);
      return {
        prompt: `A ${d} µm solid sphere (density 2500 kg/m³) settles in water (density 1000 kg/m³, μ = 1 mPa·s) in the Stokes regime. Find its terminal velocity in mm/s.`,
        value: v,
        steps: ["v = (ρp − ρf) g d² / (18 μ)", `v = 1500 × 9.81 × (${d}×10⁻⁶)² / (18 × 0.001)`, `v = ${v} mm/s`],
      };
    },
  },
  {
    id: "sync_speed", title: "Motor synchronous speed", skillId: "electrical_machines", subskillId: "induction_machines",
    unit: "rpm", decimals: 0, difficulty: 1, formula: "N_s = 120 f / P",
    build: (r) => {
      const f = r(0, 1) ? 60 : 50, p = r(2, 8, 2);
      const n = Math.round((120 * f) / p);
      return {
        prompt: `A ${p}-pole induction motor runs on a ${f} Hz supply. Find its synchronous speed in rpm.`,
        value: n,
        steps: ["N_s = 120 f / P", `N_s = 120 × ${f} / ${p}`, `N_s = ${n} rpm`],
      };
    },
  },
  // ─── Aptitude (placement) ────────────────────────────────────────────────
  {
    id: "apt_percent", title: "Successive percentage change", skillId: "placement", subskillId: null,
    unit: "%", decimals: 2, difficulty: 1, formula: "Net % = a − b − ab/100  (+a% then −b%)", tag: "aptitude",
    build: (r) => {
      const p = r(10, 40, 5), q = r(5, 30, 5);
      const net = round(p - q - (p * q) / 100, 2);
      return {
        prompt: `The price of an item rises by ${p}% and then falls by ${q}%. What is the net percentage change?`,
        value: net,
        steps: ["Net % = a − b − ab/100", `Net % = ${p} − ${q} − ${p}×${q}/100`, `Net % = ${net} %`],
      };
    },
  },
  {
    id: "apt_work", title: "Work and time", skillId: "placement", subskillId: null,
    unit: "days", decimals: 2, difficulty: 2, formula: "T = ab / (a + b)", tag: "aptitude",
    build: (r) => {
      const a = r(4, 12), b = r(6, 15);
      const t = round((a * b) / (a + b), 2);
      return {
        prompt: `A can finish a job in ${a} days and B can finish it in ${b} days. Working together, how many days will they take?`,
        value: t,
        steps: ["1/T = 1/a + 1/b  →  T = ab / (a + b)", `T = ${a} × ${b} / (${a} + ${b})`, `T = ${t} days`],
      };
    },
  },
  {
    id: "apt_average", title: "Average and removed value", skillId: "placement", subskillId: null,
    unit: "", decimals: 0, difficulty: 2, formula: "Removed = 5·A − 4·B", tag: "aptitude",
    build: (r) => {
      const a = r(40, 60), b = r(25, 40);
      const x = 5 * a - 4 * b;
      return {
        prompt: `Five numbers have an average of ${a}. After one number is removed, the average of the remaining four is ${b}. What was the removed number?`,
        value: x,
        steps: ["Removed = 5 × (old average) − 4 × (new average)", `Removed = 5 × ${a} − 4 × ${b}`, `Removed = ${x}`],
      };
    },
  },
];

export const ENGINEERING_TEMPLATES = NUMERIC_TEMPLATES.filter((t) => !t.tag);
export const APTITUDE_TEMPLATES = NUMERIC_TEMPLATES.filter((t) => t.tag === "aptitude");
const byId = new Map(NUMERIC_TEMPLATES.map((t) => [t.id, t]));

export const numericId = (templateId: string, seed: number) => `num:${templateId}:${seed >>> 0}`;
export const isNumericId = (id: string) => id.startsWith("num:");

function resolve(id: string) {
  const [, tid, rawSeed] = id.split(":");
  const template = byId.get(tid);
  const seed = Number(rawSeed);
  if (!template || !Number.isInteger(seed)) return null;
  return { template, built: template.build(makeRand(seed)) };
}

export function numericPublic(id: string): NumericPublic | null {
  const r = resolve(id);
  if (!r) return null;
  const { template: t, built } = r;
  return {
    id, title: t.title, prompt: built.prompt, unit: t.unit, formula: t.formula, difficulty: t.difficulty,
    skillId: t.skillId, subskillId: t.subskillId, tag: t.tag,
  };
}

/** Grades an answer. The expected value is only returned after the learner submits. */
export function checkNumeric(id: string, input: number): NumericCheck | null {
  const r = resolve(id);
  if (!r) return null;
  const { template: t, built } = r;
  const tolerance = Math.max(Math.abs(built.value) * 0.01, 0.5 * 10 ** -t.decimals);
  return {
    correct: Number.isFinite(input) && Math.abs(input - built.value) <= tolerance,
    value: built.value,
    unit: t.unit,
    formula: t.formula,
    steps: built.steps,
    tolerance: round(tolerance, 4),
  };
}

/** A fully worked example for a template, used on formula sheets. */
export function sampleSolution(t: NumericTemplate) {
  const built = t.build(makeRand(7));
  return { prompt: built.prompt, value: built.value, unit: t.unit, steps: built.steps };
}

/** A set of problems drawn from the given templates, reproducible from the seed. */
export function numericSet(seed: number, count: number, pool: NumericTemplate[] = NUMERIC_TEMPLATES): NumericPublic[] {
  const r = makeRand(seed);
  const out: NumericPublic[] = [];
  for (let i = 0; i < count && pool.length; i++) {
    const t = pool[r(0, pool.length - 1)];
    const p = numericPublic(numericId(t.id, seed * 31 + i + 1));
    if (p) out.push(p);
  }
  return out;
}
