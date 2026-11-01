// Guided mini-projects per career. Submitting one adds a PROJECT proof to the vault.

export interface Project {
  id: string;
  careerId: string;
  skillId: string; // the skill the proof is filed under
  title: string;
  brief: string;
  weeks: number;
}

export const PROJECTS: Project[] = [
  { id: "pe_distillation", careerId: "process_engineer", skillId: "mass_transfer", title: "Size a distillation column", brief: "Use McCabe-Thiele to find the stages and reflux ratio for a benzene–toluene split, then write a one-page design note.", weeks: 2 },
  { id: "pe_heat_exchanger", careerId: "process_engineer", skillId: "heat_transfer", title: "Rate a shell-and-tube exchanger", brief: "Compute LMTD and U for a given duty, check the pressure drop, and recommend a design change.", weeks: 1 },
  { id: "psim_flowsheet", careerId: "process_simulation_engineer", skillId: "process_simulation", title: "Simulate a reactor–separator flowsheet", brief: "Build a recycle flowsheet in DWSIM or Aspen Plus, converge the recycle and report the energy balance.", weeks: 2 },
  { id: "sw_api", careerId: "software_engineer", skillId: "web_development", title: "Build a REST API with tests", brief: "Create a small CRUD API with input validation, authentication and an automated test suite.", weeks: 2 },
  { id: "sw_algorithms", careerId: "software_engineer", skillId: "algorithms", title: "Solve 30 graph and DP problems", brief: "Implement BFS/DFS, shortest paths and dynamic programming solutions, with complexity analysis for each.", weeks: 3 },
  { id: "ds_dashboard", careerId: "data_analyst", skillId: "data_analytics", title: "Build a sales dashboard", brief: "Clean a messy sales dataset, answer five business questions with SQL, and present them in a dashboard.", weeks: 2 },
  { id: "ml_classifier", careerId: "ml_engineer", skillId: "machine_learning", title: "Train and evaluate a classifier", brief: "Train two models on a public dataset, compare them with cross-validation and explain the trade-offs.", weeks: 2 },
  { id: "ev_motor_drive", careerId: "ev_powertrain_engineer", skillId: "power_electronics", title: "Design a motor-drive inverter", brief: "Size a three-phase inverter for an EV motor, pick switching devices and simulate the PWM output.", weeks: 3 },
  { id: "struct_frame", careerId: "structural_engineer", skillId: "concrete_design", title: "Design an RC frame", brief: "Analyse a two-storey frame, design beams and columns to IS limit state codes, and draw the reinforcement.", weeks: 3 },
  { id: "bio_fermentation", careerId: "bioprocess_engineer", skillId: "bioreactor_design", title: "Plan a fed-batch fermentation", brief: "Model growth with the Monod equation, design the feed profile and estimate oxygen transfer requirements.", weeks: 2 },
];

export const getProject = (id: string) => PROJECTS.find((p) => p.id === id);
