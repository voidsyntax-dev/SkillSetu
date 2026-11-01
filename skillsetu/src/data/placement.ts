// Common interview questions per branch, with short model answers.

export interface InterviewQ { q: string; a: string }

export const GENERIC_INTERVIEW: InterviewQ[] = [
  { q: "Tell me about yourself.", a: "Two minutes: your branch, one project or subject you enjoyed most with a concrete result, and why this role fits your next step." },
  { q: "Describe a time you worked in a team that struggled.", a: "Use STAR: situation, your task, what you did to align people, and the measurable outcome." },
  { q: "Where do you see yourself in five years?", a: "Name a realistic growth path in the company's domain, e.g. senior engineer owning a unit or a technical specialist track." },
  { q: "Why should we hire you?", a: "Match 2–3 requirements in the job description to specific evidence: a project, a certification, or a proof from your vault." },
];

export const INTERVIEW_BY_BRANCH: Record<string, InterviewQ[]> = {
  chemical: [
    { q: "Explain the difference between a CSTR and a PFR and when you'd use each.", a: "CSTR is perfectly mixed with the outlet at reactor concentration, so it needs more volume for the same conversion of a positive-order reaction. PFR has no axial mixing and is preferred for high conversion and fast reactions." },
    { q: "What is a HAZOP and what do the guide words mean?", a: "A structured team study. Guide words like 'no', 'more', 'less', 'reverse' are applied to process parameters such as flow and pressure to find deviations, causes, consequences and safeguards." },
    { q: "How would you reduce energy consumption in a distillation column?", a: "Pinch analysis for heat integration, optimising reflux ratio, feed preheating, or a heat-integrated column design." },
  ],
  biotech: [
    { q: "What is the Monod equation and what does K_s represent?", a: "μ = μmax·S/(Ks + S). Ks is the substrate concentration at which the specific growth rate is half of μmax." },
    { q: "Why is downstream processing often the bottleneck?", a: "Products are dilute and mixed with cells and impurities; purification steps are many, costly, and must meet strict purity standards." },
    { q: "What is kLa and why does it matter for aerobic fermentation?", a: "The volumetric oxygen transfer coefficient. Cells need oxygen, and limited kLa causes oxygen-limited growth and lower yields." },
  ],
  mechanical: [
    { q: "Explain the difference between yield and ultimate strength.", a: "Yield is where plastic deformation begins; ultimate is the maximum stress the material withstands before necking and failure." },
    { q: "When would you use fatigue analysis?", a: "For parts under repeated or fluctuating loads, like shafts and springs, where failure can occur below the static yield stress." },
    { q: "What is a free body diagram used for?", a: "To isolate a body and show every external force and moment, the first step in solving equilibrium and dynamics problems." },
  ],
  civil: [
    { q: "What is the difference between limit state and working stress design?", a: "Limit state design checks ultimate and serviceability limits with partial safety factors on loads and materials; working stress uses a single factor on allowable stresses." },
    { q: "How do you decide the type of foundation?", a: "From soil investigation (bearing capacity, settlement, groundwater) and the structure's loads; shallow for good soil, piles or rafts for weak soil." },
    { q: "What is the critical path method?", a: "Finding the longest path of dependent activities through a project network, which sets the minimum duration; delays on it delay the whole project." },
  ],
  electrical: [
    { q: "What is the Ferranti effect?", a: "On a long, lightly loaded line, the receiving-end voltage rises above the sending-end voltage because line capacitance dominates." },
    { q: "How does a PID controller work?", a: "Output = Kp·e + Ki∫e + Kd·de/dt: proportional reacts to present error, integral removes offset, derivative anticipates change." },
    { q: "Why do EV motors often use permanent magnets or induction machines?", a: "Permanent-magnet machines give high efficiency and torque density; induction machines are robust and cheap. The choice trades efficiency, cost and control complexity." },
  ],
  electronics: [
    { q: "What is the difference between a latch and a flip-flop?", a: "A latch is level-sensitive and transparent while enabled; a flip-flop is edge-triggered and samples only at the clock edge." },
    { q: "What does setup time and hold time mean?", a: "Setup: data must be stable before the clock edge; hold: data must remain stable just after it. Violations cause metastability or wrong capture." },
    { q: "Explain the Nyquist rate.", a: "Twice the highest signal frequency; sampling below it causes aliasing." },
  ],
  computer: [
    { q: "What is the time complexity of quicksort and why?", a: "O(n log n) average because partitions split roughly evenly; O(n²) worst case with consistently bad pivots, mitigated by randomised or median-of-three pivots." },
    { q: "What is the difference between a process and a thread?", a: "A process has its own address space; threads share their process's memory and are cheaper to create and switch." },
    { q: "Explain ACID properties.", a: "Atomicity, Consistency, Isolation, Durability: guarantees that transactions are all-or-nothing, valid, isolated from each other and persisted." },
  ],
  materials: [
    { q: "Why does grain size affect strength?", a: "Grain boundaries block dislocation motion, so finer grains give higher yield strength (Hall–Petch)." },
    { q: "What is the difference between galvanic and pitting corrosion?", a: "Galvanic corrosion occurs between dissimilar metals in contact; pitting is localised attack that forms small, deep cavities on passive surfaces." },
    { q: "How do you identify a crystal plane?", a: "By Miller indices (hkl), the reciprocals of its intercepts with the axes, cleared of fractions." },
  ],
  environmental: [
    { q: "What is BOD and how is it measured?", a: "Biochemical oxygen demand: oxygen consumed by microbes degrading organics over 5 days at 20 °C in a sealed sample." },
    { q: "What does an activated sludge process do?", a: "Aerated biological treatment where microbes in a recycled suspension degrade organics; settling separates the sludge from the treated water." },
    { q: "What is life cycle assessment?", a: "Evaluating environmental impacts across a product's whole life, from raw material extraction to disposal." },
  ],
  aerospace: [
    { q: "What is the difference between induced and parasite drag?", a: "Induced drag is a by-product of lift from wingtip vortices; parasite drag is friction and form drag, growing with speed squared." },
    { q: "What does specific impulse measure?", a: "Thrust per unit weight flow of propellant, in seconds; higher means more efficient use of propellant." },
    { q: "What is the Mach number and why does it matter?", a: "Ratio of flow speed to the speed of sound; compressibility effects and shock waves appear as it approaches and exceeds 1." },
  ],
};
