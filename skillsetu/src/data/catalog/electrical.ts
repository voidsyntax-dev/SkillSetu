import { skill, sub } from "./dsl";

export const electricalSkills = [
  skill("circuit_theory", "Electric Circuits & Networks", "DC and AC circuit analysis, network theorems and transients.", { level: 1, deps: ["engineering_mathematics"], book: "Hayt, Kemmerly & Durbin — Engineering Circuit Analysis" }, [
    sub("dc_circuits", "DC Circuit Analysis", "Ohm's law, Kirchhoff's laws and nodal/mesh analysis.", [
      ["Ohm's law", "Voltage across a resistor equals current times resistance, V = I·R"],
      ["Kirchhoff's current law", "Algebraic sum of currents entering a node is zero"],
      ["Kirchhoff's voltage law", "Algebraic sum of voltages around any closed loop is zero"],
      ["Nodal analysis", "Method writing KCL equations at nodes with node voltages as unknowns"],
    ], [
      ["Two 10 Ω resistors are connected in parallel. What is the equivalent resistance?", "5 Ω", ["20 Ω", "10 Ω", "0.2 Ω"], "For two equal resistors in parallel, R_eq = R/2 = 5 Ω.", 1],
    ]),
    sub("network_theorems", "Network Theorems", "Simplifying networks for analysis.", [
      ["Thevenin's theorem", "Any linear two-terminal network can be replaced by a voltage source in series with a resistance"],
      ["Norton's theorem", "Any linear two-terminal network can be replaced by a current source in parallel with a resistance"],
      ["Superposition theorem", "Response of a linear circuit to several sources equals the sum of responses to each acting alone"],
      ["Maximum power transfer theorem", "Maximum power reaches a load when its resistance equals the source's Thevenin resistance"],
    ]),
    sub("ac_circuits", "AC Circuits & Phasors", "Sinusoidal steady state, impedance and power.", [
      ["Phasor", "Complex number representing the amplitude and phase of a sinusoid"],
      ["Impedance", "Complex opposition to AC current, Z = R + jX"],
      ["Power factor", "Ratio of real power to apparent power, cos φ"],
      ["Resonance in RLC circuit", "Condition where inductive and capacitive reactances cancel, at f = 1/(2π√LC)"],
    ]),
    sub("transients", "Transient Analysis", "Response of RC, RL and RLC circuits to switching.", [
      ["RC time constant", "τ = R·C, time for a capacitor voltage to reach 63.2% of its final change"],
      ["Natural response", "Circuit behaviour due only to stored energy, with no independent sources"],
      ["Step response", "Circuit response to a sudden constant input applied at t = 0"],
    ]),
  ]),

  skill("electrical_machines", "Electrical Machines", "Transformers, DC machines, induction and synchronous machines.", { level: 2, deps: ["circuit_theory"], book: "P.S. Bimbhra — Electrical Machinery" }, [
    sub("transformers", "Transformers", "Single and three-phase transformers.", [
      ["Turns ratio", "Ratio of primary to secondary turns, equal to the voltage ratio of an ideal transformer"],
      ["Core loss", "Hysteresis and eddy-current loss in the transformer core, roughly constant with load"],
      ["Open-circuit test", "Test performed at rated voltage with secondary open to measure core losses"],
      ["Voltage regulation", "Change in secondary voltage from no load to full load as a fraction of full-load voltage"],
    ]),
    sub("dc_machines", "DC Machines", "DC generators and motors.", [
      ["Back EMF", "Voltage induced in a motor's armature that opposes the supply voltage"],
      ["Commutator", "Segmented rotary switch that keeps torque unidirectional in a DC machine"],
      ["Armature reaction", "Effect of armature current's magnetic field on the main field flux"],
    ]),
    sub("induction_machines", "Induction Motors", "Three-phase induction motor operation.", [
      ["Slip", "Fractional difference between synchronous speed and rotor speed"],
      ["Synchronous speed", "Speed of the rotating magnetic field, N_s = 120f/P"],
      ["Squirrel cage rotor", "Rotor made of bars short-circuited by end rings"],
    ], [
      ["A 4-pole, 50 Hz induction motor has synchronous speed of:", "1500 rpm", ["3000 rpm", "1000 rpm", "750 rpm"], "N_s = 120·f/P = 120 × 50 / 4 = 1500 rpm.", 1],
    ]),
    sub("synchronous_machines", "Synchronous Machines", "Alternators and synchronous motors.", [
      ["Alternator", "Synchronous generator producing AC at a frequency fixed by rotor speed"],
      ["Synchronous reactance", "Combined effect of armature leakage reactance and armature reaction"],
      ["V-curve", "Plot of armature current against field current for a synchronous motor at constant load"],
    ]),
  ]),

  skill("power_systems", "Power Systems", "Generation, transmission, distribution, load flow and protection.", { level: 3, deps: ["electrical_machines"], book: "Kothari & Nagrath — Modern Power System Analysis" }, [
    sub("transmission", "Transmission Lines", "Line parameters and performance.", [
      ["Corona", "Ionisation of air around a high-voltage conductor causing power loss and noise"],
      ["Ferranti effect", "Rise in receiving-end voltage above sending-end voltage on a lightly loaded long line"],
      ["Surge impedance loading", "Power delivered when a line is terminated in its characteristic impedance"],
    ]),
    sub("load_flow", "Load Flow Analysis", "Steady-state bus voltages and power flows.", [
      ["Slack bus", "Reference bus whose voltage magnitude and angle are specified, supplying the system losses"],
      ["PV bus", "Generator bus with specified real power and voltage magnitude"],
      ["Newton-Raphson load flow", "Iterative load flow method using the Jacobian matrix with fast convergence"],
    ]),
    sub("faults_protection", "Faults & Protection", "Short-circuit analysis and protective relaying.", [
      ["Symmetrical components", "Decomposition of unbalanced three-phase quantities into positive, negative and zero sequence"],
      ["Circuit breaker", "Switching device that interrupts fault current automatically"],
      ["Distance relay", "Protective relay that operates on the impedance measured to the fault"],
    ]),
    sub("renewables_grid", "Renewable Integration", "Solar, wind and grid stability.", [
      ["Maximum power point tracking", "Control method keeping a solar array at the operating point of maximum power"],
      ["Grid frequency regulation", "Balancing generation and load to keep system frequency near nominal"],
      ["Inverter", "Power electronic device converting DC to AC for grid connection"],
    ]),
  ]),

  skill("power_electronics", "Power Electronics", "Semiconductor switches and converters for efficient power conversion.", { level: 3, deps: ["circuit_theory", "analog_electronics"], book: "Mohan, Undeland & Robbins — Power Electronics" }, [
    sub("power_devices", "Power Semiconductor Devices", "Thyristors, MOSFETs and IGBTs.", [
      ["Thyristor (SCR)", "Four-layer device that latches on when gated and turns off only when current falls below holding current"],
      ["IGBT", "Voltage-controlled switch combining MOSFET gate drive with bipolar conduction for high power"],
      ["Snubber circuit", "Network that limits voltage or current rate of change across a switching device"],
    ]),
    sub("converters", "Rectifiers & Converters", "AC-DC and DC-DC conversion.", [
      ["Controlled rectifier", "Converter using thyristors to produce adjustable DC from AC"],
      ["Buck converter", "DC-DC converter producing an output voltage lower than its input"],
      ["Boost converter", "DC-DC converter producing an output voltage higher than its input"],
      ["Duty cycle", "Fraction of the switching period during which the switch is on"],
    ], [
      ["An ideal buck converter has 24 V input and 50% duty cycle. Output voltage?", "12 V", ["48 V", "24 V", "6 V"], "For an ideal buck converter, V_out = D × V_in = 0.5 × 24 = 12 V.", 1],
    ]),
    sub("inverters_drives", "Inverters & Motor Drives", "DC-AC conversion and speed control.", [
      ["PWM", "Pulse width modulation, varying pulse widths to synthesise a desired average waveform"],
      ["V/f control", "Induction motor speed control keeping the voltage-to-frequency ratio constant"],
      ["Total harmonic distortion", "Ratio of harmonic content to the fundamental component of a waveform"],
    ]),
  ]),

  skill("control_systems", "Control Systems", "Modelling, time and frequency response, stability and controller design for dynamic systems.", { level: 3, deps: ["engineering_mathematics", "circuit_theory"], book: "Katsuhiko Ogata — Modern Control Engineering" }, [
    sub("system_modeling", "System Modelling", "Transfer functions and block diagrams.", [
      ["Block diagram reduction", "Simplifying interconnected blocks into a single equivalent transfer function"],
      ["Signal flow graph", "Graph of nodes and branches representing system equations, solved by Mason's gain formula"],
      ["State-space model", "Representation of a system by first-order differential equations in matrix form"],
    ]),
    sub("time_response", "Time Response", "Transient and steady-state performance.", [
      ["Rise time", "Time for a response to go from 10% to 90% of its final value"],
      ["Peak overshoot", "Maximum amount by which the response exceeds its final value"],
      ["Steady-state error", "Difference between desired and actual output as time tends to infinity"],
      ["Settling time", "Time for the response to stay within a small band (often 2%) of its final value"],
    ]),
    sub("frequency_response", "Frequency Response & Stability", "Bode, Nyquist and root locus methods.", [
      ["Root locus", "Plot of closed-loop pole locations as a gain varies from zero to infinity"],
      ["Nyquist criterion", "Stability test based on encirclements of −1 by the open-loop frequency response"],
      ["Phase margin", "Additional phase lag at gain crossover that would bring the system to instability"],
    ]),
    sub("controller_design", "Controller Design", "Compensators and state feedback.", [
      ["Lead compensator", "Compensator that adds phase lead to improve transient response and stability"],
      ["Lag compensator", "Compensator that raises low-frequency gain to reduce steady-state error"],
      ["Controllability", "Property that the inputs can drive the state from any initial value to any final value"],
    ]),
  ]),
];
