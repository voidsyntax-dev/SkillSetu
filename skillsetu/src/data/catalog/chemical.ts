import { skill, sub } from "./dsl";

export const chemicalSkills = [
  skill("material_energy_balances", "Material & Energy Balances", "Process calculations: conservation of mass and energy across units, recycle, purge and reactive systems.", { level: 1, deps: ["engineering_mathematics"], book: "Felder & Rousseau — Elementary Principles of Chemical Processes" }, [
    sub("material_balances", "Material Balances", "Applying conservation of mass to single and multiple units.", [
      ["General balance equation", "Input + generation − output − consumption = accumulation"],
      ["Degrees of freedom analysis", "Count of unknowns minus independent equations, used to check that a balance problem is solvable"],
      ["Tie component", "Species that passes through a process unchanged and links two streams in a balance"],
    ]),
    sub("recycle_purge", "Recycle, Bypass & Purge", "Handling streams that return to or skip process units.", [
      ["Recycle stream", "Stream that returns unconverted material from downstream back to an earlier unit"],
      ["Purge stream", "Small bleed stream that prevents inert species from accumulating in a recycle loop"],
      ["Bypass stream", "Stream that skips one or more process units and rejoins downstream"],
    ]),
    sub("reactive_balances", "Reactive Systems", "Balances with chemical reaction, conversion, yield and selectivity.", [
      ["Limiting reactant", "Reactant that would be consumed first if the reaction ran to completion"],
      ["Fractional conversion", "Fraction of a reactant fed that is consumed by reaction"],
      ["Selectivity", "Ratio of desired product formed to undesired product formed"],
      ["Extent of reaction", "Single variable ξ that tracks the progress of a reaction for all species via stoichiometry"],
    ], [
      ["100 mol of A is fed and 60 mol leaves unreacted. What is the fractional conversion of A?", "0.40", ["0.60", "0.25", "1.67"], "Conversion = (fed − out)/fed = (100 − 60)/100 = 0.40.", 1],
    ]),
    sub("energy_balances", "Energy Balances", "Enthalpy changes, heats of reaction and adiabatic temperatures.", [
      ["Standard heat of reaction", "Enthalpy change when stoichiometric reactants at 25 °C and 1 atm react to form products at the same state"],
      ["Hess's law", "Enthalpy of an overall reaction equals the sum of enthalpies of any set of steps that add up to it"],
      ["Adiabatic flame temperature", "Maximum temperature products reach when combustion occurs with no heat loss"],
    ]),
  ]),

  skill("thermodynamics", "Chemical Engineering Thermodynamics", "Energy, entropy, equilibrium and properties of real fluids and mixtures.", { level: 2, deps: ["engineering_mathematics", "material_energy_balances"], book: "Smith, Van Ness & Abbott — Introduction to Chemical Engineering Thermodynamics" }, [
    sub("first_law", "First Law", "Conservation of energy for closed and open systems.", [
      ["Internal energy", "State function equal to the total microscopic kinetic and potential energy of a system's molecules"],
      ["Enthalpy", "State function H = U + PV, convenient for flow processes at constant pressure"],
      ["Steady-flow energy equation", "Open-system energy balance relating heat, shaft work and changes in enthalpy, kinetic and potential energy"],
      ["Isothermal process", "Process that occurs at constant temperature"],
    ], [
      ["For a closed system, which expression states the first law (sign convention: W is work done BY the system)?", "ΔU = Q − W", ["ΔU = Q + W", "ΔH = Q − W", "ΔS = Q/T"], "Energy added as heat raises internal energy, energy leaving as work lowers it: ΔU = Q − W.", 1],
    ]),
    sub("second_law", "Second Law & Entropy", "Direction of processes, entropy and limits on efficiency.", [
      ["Entropy", "State function measuring molecular disorder; for a reversible process dS = δQ_rev/T"],
      ["Carnot efficiency", "Maximum possible efficiency of a heat engine, 1 − T_cold/T_hot"],
      ["Reversible process", "Idealised process that can be reversed without leaving any change in system or surroundings"],
      ["Entropy generation", "Entropy produced by irreversibilities such as friction, mixing and heat transfer across finite ΔT"],
    ], [
      ["A heat engine operates between 600 K and 300 K. What is its maximum possible efficiency?", "50%", ["100%", "25%", "67%"], "Carnot efficiency = 1 − 300/600 = 0.5.", 2],
    ]),
    sub("property_relations", "Property Relations & Equations of State", "PVT behaviour of real fluids and thermodynamic property relations.", [
      ["Compressibility factor", "Z = PV/RT, a measure of how much a real gas deviates from ideal-gas behaviour"],
      ["Cubic equation of state", "PVT model such as van der Waals or Peng-Robinson that is cubic in molar volume"],
      ["Maxwell relations", "Equalities between partial derivatives of state functions derived from exact differentials"],
      ["Residual property", "Difference between a real-fluid property and its ideal-gas value at the same T and P"],
    ]),
    sub("phase_equilibrium", "Phase Equilibrium", "Vapour-liquid equilibrium, fugacity and activity models.", [
      ["Raoult's law", "Ideal VLE relation y_i·P = x_i·P_i^sat for components in an ideal liquid solution"],
      ["Fugacity", "Corrected pressure that plays the role of pressure in equilibrium criteria for real systems"],
      ["Activity coefficient", "Factor γ correcting for non-ideal liquid behaviour in modified Raoult's law"],
      ["Azeotrope", "Mixture that boils at constant composition, so vapour and liquid compositions are equal"],
      ["Gibbs phase rule", "F = C − P + 2, the number of intensive variables that can be set independently"],
    ]),
    sub("reaction_equilibrium", "Chemical Reaction Equilibrium", "Equilibrium constants and their dependence on temperature.", [
      ["Equilibrium constant", "K = exp(−ΔG°/RT), relating standard Gibbs energy change to equilibrium composition"],
      ["Van 't Hoff equation", "Relation d(ln K)/dT = ΔH°/RT² describing how K changes with temperature"],
      ["Le Chatelier's principle", "A system at equilibrium shifts to partially counteract an imposed change"],
    ]),
  ]),

  skill("fluid_mechanics", "Fluid Mechanics", "Fluid statics, pipe flow, pumps and the behaviour of moving fluids.", { level: 2, deps: ["engineering_mathematics", "engineering_mechanics"], book: "Frank M. White — Fluid Mechanics" }, [
    sub("fluid_properties", "Fluid Properties & Statics", "Viscosity, pressure and hydrostatics.", [
      ["Viscosity", "Fluid property resisting shear deformation, the ratio of shear stress to shear rate"],
      ["Newtonian fluid", "Fluid whose shear stress is linearly proportional to its shear rate"],
      ["Hydrostatic pressure", "Pressure in a fluid at rest that increases with depth as ρ·g·h"],
      ["Buoyancy", "Upward force on an immersed body equal to the weight of fluid it displaces"],
    ]),
    sub("flow_regimes", "Flow Regimes", "Laminar, turbulent and transition flow characterised by Reynolds number.", [
      ["Reynolds number", "Dimensionless ratio of inertial to viscous forces, Re = ρVD/μ"],
      ["Laminar flow", "Smooth layered flow, typically for pipe Reynolds numbers below about 2100"],
      ["Turbulent flow", "Chaotic flow with eddies and strong mixing at high Reynolds number"],
      ["Boundary layer", "Thin region near a wall where velocity changes from zero to the free-stream value"],
    ], [
      ["Water flows in a pipe with Re = 50,000. The flow is most likely:", "Turbulent", ["Laminar", "Creeping", "Inviscid"], "Pipe flow above Re ≈ 4000 is turbulent.", 1],
    ]),
    sub("bernoulli_energy", "Bernoulli & Mechanical Energy", "Energy conservation along streamlines and through piping systems.", [
      ["Bernoulli equation", "Along a streamline in steady, inviscid, incompressible flow, P/ρ + V²/2 + gz is constant"],
      ["Head loss", "Mechanical energy dissipated by friction, expressed as an equivalent height of fluid"],
      ["Venturi meter", "Flow meter that infers flow rate from the pressure drop across a converging throat"],
    ]),
    sub("pipe_flow", "Pipe Flow & Pumps", "Friction losses, pump selection and system curves.", [
      ["Darcy-Weisbach equation", "h_f = f·(L/D)·V²/2g, giving frictional head loss in a pipe"],
      ["Moody chart", "Plot of Darcy friction factor versus Reynolds number and relative roughness"],
      ["NPSH", "Net positive suction head; margin above vapour pressure at a pump inlet needed to avoid cavitation"],
      ["Cavitation", "Formation and violent collapse of vapour bubbles where local pressure falls below vapour pressure"],
    ]),
  ]),

  skill("heat_transfer", "Heat Transfer", "Conduction, convection, radiation and the design of heat exchangers.", { level: 2, deps: ["thermodynamics", "fluid_mechanics"], book: "Incropera & DeWitt — Fundamentals of Heat and Mass Transfer" }, [
    sub("conduction", "Conduction", "Heat flow through solids by molecular interaction.", [
      ["Fourier's law", "Conductive heat flux is proportional to the negative temperature gradient, q = −k·dT/dx"],
      ["Thermal conductivity", "Material property k measuring how readily heat is conducted"],
      ["Thermal resistance", "Ratio of temperature difference to heat flow, allowing layered walls to be treated like series resistors"],
      ["Critical insulation radius", "Radius below which adding insulation to a pipe increases heat loss"],
    ]),
    sub("convection", "Convection", "Heat transfer between a surface and a moving fluid.", [
      ["Newton's law of cooling", "Convective heat transfer q = h·A·(T_s − T_∞)"],
      ["Nusselt number", "Dimensionless ratio of convective to conductive heat transfer at a surface"],
      ["Prandtl number", "Ratio of momentum diffusivity to thermal diffusivity of a fluid"],
      ["Natural convection", "Fluid motion driven by buoyancy from density differences caused by temperature"],
    ]),
    sub("radiation", "Radiation", "Heat transfer by electromagnetic waves.", [
      ["Stefan-Boltzmann law", "Emissive power of a black body is σ·T⁴"],
      ["Emissivity", "Ratio of a surface's emitted radiation to that of a black body at the same temperature"],
      ["View factor", "Fraction of radiation leaving one surface that strikes another surface directly"],
    ]),
    sub("heat_exchangers", "Heat Exchangers", "Sizing and rating exchangers using LMTD and NTU methods.", [
      ["LMTD", "Log-mean temperature difference, the effective driving force for heat exchanger design"],
      ["Overall heat transfer coefficient", "U, combining all convective, conductive and fouling resistances between two fluids"],
      ["Effectiveness-NTU method", "Rating method using the ratio of actual to maximum possible heat transfer"],
      ["Fouling factor", "Additional thermal resistance from deposits that build up on exchanger surfaces"],
      ["Counter-current flow", "Arrangement where the two fluids flow in opposite directions, giving the highest LMTD"],
    ]),
  ]),

  skill("mass_transfer", "Mass Transfer", "Diffusion and equilibrium-stage separations: distillation, absorption, extraction and drying.", { level: 3, deps: ["thermodynamics", "heat_transfer"], book: "Robert E. Treybal — Mass Transfer Operations" }, [
    sub("diffusion", "Molecular Diffusion", "Fick's law and mass transfer coefficients.", [
      ["Fick's first law", "Diffusive flux is proportional to the negative concentration gradient"],
      ["Diffusivity", "Proportionality constant in Fick's law, characterising how fast a species spreads"],
      ["Mass transfer coefficient", "Ratio of mass flux to concentration driving force across an interface"],
      ["Schmidt number", "Ratio of momentum diffusivity to mass diffusivity"],
    ]),
    sub("distillation", "Distillation", "Separating liquids by relative volatility.", [
      ["Relative volatility", "Ratio of the K-values of two components, indicating ease of separation by distillation"],
      ["McCabe-Thiele method", "Graphical stage-by-stage design method using equilibrium and operating lines"],
      ["Minimum reflux ratio", "Lowest reflux at which a separation is possible, requiring infinite stages"],
      ["Total reflux", "Operation with no product withdrawal, giving the minimum number of stages"],
    ], [
      ["At minimum reflux, the number of theoretical stages required is:", "Infinite", ["Minimum", "Exactly one", "Zero"], "At minimum reflux a pinch point forms, so infinitely many stages are needed.", 2],
    ]),
    sub("absorption", "Gas Absorption & Stripping", "Transferring a solute between gas and liquid.", [
      ["Henry's law", "Partial pressure of a dilute dissolved gas is proportional to its liquid mole fraction"],
      ["Packed column", "Column filled with random or structured packing that provides gas-liquid contact area"],
      ["HTU", "Height of a transfer unit, a measure of the separation efficiency of packing"],
      ["Flooding", "Condition where gas flow prevents liquid from flowing down a column, limiting capacity"],
    ]),
    sub("extraction_drying", "Extraction, Leaching & Drying", "Liquid-liquid extraction, solid leaching and moisture removal.", [
      ["Distribution coefficient", "Ratio of solute concentration in extract phase to raffinate phase at equilibrium"],
      ["Raffinate", "Phase left after the solute has been extracted from the feed"],
      ["Constant rate drying period", "Stage in which surface moisture evaporates as if from a free liquid surface"],
      ["Critical moisture content", "Moisture level at which the drying rate starts to fall"],
    ]),
  ]),

  skill("reaction_engineering", "Chemical Reaction Engineering", "Kinetics and the design of batch, CSTR and plug flow reactors.", { level: 3, deps: ["thermodynamics", "material_energy_balances"], book: "H. Scott Fogler — Elements of Chemical Reaction Engineering" }, [
    sub("kinetics", "Reaction Kinetics", "Rate laws, reaction order and temperature dependence.", [
      ["Rate law", "Expression relating reaction rate to concentrations, e.g. −r_A = k·C_Aⁿ"],
      ["Reaction order", "Exponent on a concentration in the rate law, found experimentally"],
      ["Arrhenius equation", "k = A·exp(−E_a/RT), describing how rate constant increases with temperature"],
      ["Activation energy", "Minimum energy barrier reactant molecules must overcome to react"],
    ]),
    sub("ideal_reactors", "Ideal Reactors", "Design equations for batch, CSTR and PFR.", [
      ["CSTR", "Continuous stirred tank reactor that is perfectly mixed so exit composition equals tank composition"],
      ["PFR", "Plug flow reactor with no axial mixing, where composition varies along its length"],
      ["Space time", "Reactor volume divided by volumetric feed rate, τ = V/v₀"],
      ["Levenspiel plot", "Plot of F_A0/(−r_A) versus conversion used to size and compare reactors"],
    ], [
      ["For a positive-order reaction and the same conversion, which reactor needs the smaller volume?", "PFR", ["CSTR", "Both equal", "Depends only on temperature"], "A CSTR operates at the low exit concentration, so its rate is lower and it needs more volume.", 2],
    ]),
    sub("rtd", "Residence Time Distribution", "Characterising real, non-ideal reactors.", [
      ["RTD function E(t)", "Distribution describing how long fluid elements spend inside a reactor"],
      ["Tracer test", "Experiment injecting a pulse or step of tracer to measure a reactor's RTD"],
      ["Dispersion model", "Non-ideal reactor model that adds axial mixing to plug flow"],
    ]),
    sub("catalysis", "Heterogeneous Catalysis", "Surface reactions, adsorption and transport limitations.", [
      ["Langmuir adsorption isotherm", "Model of monolayer adsorption on identical, independent surface sites"],
      ["Thiele modulus", "Ratio of reaction rate to diffusion rate inside a catalyst pellet"],
      ["Effectiveness factor", "Actual pellet reaction rate divided by the rate if the whole interior were at surface conditions"],
      ["Catalyst deactivation", "Loss of activity over time by poisoning, fouling (coking) or sintering"],
    ]),
  ]),

  skill("process_control", "Process Dynamics & Control", "Dynamic behaviour of processes and the feedback controllers that keep them on target.", { level: 3, deps: ["engineering_mathematics", "reaction_engineering"], book: "Seborg, Edgar & Mellichamp — Process Dynamics and Control" }, [
    sub("dynamics_modeling", "Process Dynamics", "Transfer functions and first/second-order responses.", [
      ["Transfer function", "Ratio of Laplace-transformed output to input for a linear system with zero initial conditions"],
      ["Time constant", "Time for a first-order system to reach 63.2% of its final response to a step"],
      ["Dead time", "Delay between a change in input and the first visible change in output"],
      ["Damping ratio", "Parameter that determines whether a second-order response is overdamped, critically damped or oscillatory"],
    ]),
    sub("pid_control", "PID Control", "Proportional, integral and derivative feedback control.", [
      ["Proportional action", "Control output proportional to the current error, which leaves a steady-state offset"],
      ["Integral action", "Control output proportional to the accumulated error, which eliminates offset"],
      ["Derivative action", "Control output proportional to the rate of change of error, which anticipates trends"],
      ["Ziegler-Nichols tuning", "Empirical PID tuning rules based on the ultimate gain and period"],
    ], [
      ["Which controller mode eliminates steady-state offset?", "Integral", ["Proportional", "Derivative", "On-off"], "Integral action keeps changing the output while any error persists, driving offset to zero.", 1],
    ]),
    sub("stability", "Stability Analysis", "Ensuring closed-loop systems do not oscillate out of control.", [
      ["Characteristic equation", "Denominator of the closed-loop transfer function set to zero; its roots determine stability"],
      ["Routh-Hurwitz criterion", "Algebraic test for whether all roots of a polynomial lie in the left half-plane"],
      ["Gain margin", "Factor by which loop gain can increase before the closed loop becomes unstable"],
      ["Bode plot", "Plots of amplitude ratio and phase angle against frequency on log scales"],
    ]),
    sub("advanced_control", "Advanced Control Strategies", "Cascade, feedforward, ratio and model predictive control.", [
      ["Cascade control", "Scheme where a primary controller sets the setpoint of a faster secondary loop"],
      ["Feedforward control", "Control that measures a disturbance and acts before it affects the output"],
      ["Model predictive control", "Optimisation-based control that predicts future outputs with a model and handles constraints"],
      ["Ratio control", "Keeps two flows in a fixed proportion by manipulating one of them"],
    ]),
  ]),

  skill("process_simulation", "Process Simulation & Design", "Steady-state flowsheet simulation (Aspen Plus / DWSIM), property methods and optimisation.", { level: 4, category: "tools", deps: ["thermodynamics", "mass_transfer", "reaction_engineering", "numerical_methods"], book: "Seider et al. — Product and Process Design Principles" }, [
    sub("flowsheeting", "Flowsheeting", "Building and converging process flowsheets.", [
      ["Sequential modular approach", "Simulation strategy that solves unit operations one at a time in sequence"],
      ["Tear stream", "Stream cut to break a recycle loop so it can be converged iteratively"],
      ["Design specification", "Simulator constraint that adjusts a variable until a target value is met"],
    ]),
    sub("property_methods", "Property Method Selection", "Choosing thermodynamic models in simulators.", [
      ["NRTL model", "Activity coefficient model suitable for strongly non-ideal liquid mixtures"],
      ["Peng-Robinson method", "Cubic equation-of-state method widely used for hydrocarbons and gas processing"],
      ["Binary interaction parameter", "Fitted coefficient that corrects mixing rules for a specific pair of components"],
    ]),
    sub("unit_models", "Unit Operation Models", "Simulating reactors, columns and exchangers.", [
      ["RadFrac", "Rigorous Aspen Plus model for multistage vapour-liquid separations"],
      ["Shortcut column (DSTWU)", "Fenske-Underwood-Gilliland based estimate of stages and reflux"],
      ["RGibbs reactor", "Reactor model that finds the equilibrium composition by minimising Gibbs free energy"],
    ]),
    sub("pinch_analysis", "Heat Integration", "Pinch analysis for energy targeting.", [
      ["Pinch point", "Location of minimum temperature approach between hot and cold composite curves"],
      ["Composite curves", "Combined temperature-enthalpy profiles of all hot or all cold streams"],
      ["Minimum approach temperature", "ΔT_min, the smallest allowed temperature difference in heat exchange"],
      ["Golden rule of pinch", "Never transfer heat across the pinch, use hot utility below it or cold utility above it"],
    ]),
  ]),

  skill("process_safety", "Process Safety", "Hazard identification, risk assessment and protective layers in chemical plants.", { level: 4, deps: ["reaction_engineering", "fluid_mechanics"], book: "Crowl & Louvar — Chemical Process Safety" }, [
    sub("hazard_identification", "Hazard Identification", "Systematic methods to find what can go wrong.", [
      ["HAZOP", "Structured team study applying guide words such as 'no', 'more' and 'reverse' to process parameters"],
      ["FMEA", "Failure modes and effects analysis, examining each component's failure modes and consequences"],
      ["What-if analysis", "Brainstorming technique asking 'what if' questions about deviations"],
    ]),
    sub("risk_assessment", "Risk Assessment", "Quantifying frequency and consequence of incidents.", [
      ["Risk", "Combination of the likelihood of an event and the severity of its consequences"],
      ["LOPA", "Layer of protection analysis, a semi-quantitative check that enough independent safeguards exist"],
      ["Fault tree analysis", "Top-down logic diagram tracing an undesired event to combinations of basic failures"],
      ["ALARP", "Principle that risk should be reduced to 'as low as reasonably practicable'"],
    ]),
    sub("fire_explosion", "Fires & Explosions", "Flammability, ignition and relief system design.", [
      ["Lower flammability limit", "Minimum fuel concentration in air that can propagate a flame"],
      ["Flash point", "Lowest temperature at which a liquid gives off enough vapour to ignite briefly"],
      ["BLEVE", "Boiling liquid expanding vapour explosion from sudden failure of a vessel holding a pressurised liquid"],
      ["Pressure relief valve", "Device that opens at a set pressure to protect equipment from overpressure"],
    ]),
    sub("safety_systems", "Safety Instrumented Systems", "Instrumented layers and management of process safety.", [
      ["SIL", "Safety integrity level, a measure of the risk reduction a safety function provides"],
      ["Interlock", "Automatic action that brings a process to a safe state when a limit is exceeded"],
      ["Management of change", "Procedure to review the hazards of any modification before it is made"],
      ["Inherent safety", "Designing hazards out through minimise, substitute, moderate and simplify"],
    ]),
  ]),

  skill("plant_design_economics", "Plant Design & Economics", "Equipment sizing, cost estimation and project profitability.", { level: 4, deps: ["process_simulation"], book: "Peters, Timmerhaus & West — Plant Design and Economics for Chemical Engineers" }, [
    sub("cost_estimation", "Capital Cost Estimation", "Estimating the cost to build a plant.", [
      ["Six-tenths rule", "Equipment cost scales roughly with capacity raised to the power 0.6"],
      ["Lang factor", "Multiplier converting purchased equipment cost into total installed plant cost"],
      ["Cost index", "Index such as CEPCI used to update historical costs to the present"],
    ]),
    sub("profitability", "Profitability Analysis", "Judging whether a project is worth building.", [
      ["Net present value", "Sum of all discounted future cash flows minus initial investment"],
      ["Internal rate of return", "Discount rate that makes a project's net present value zero"],
      ["Payback period", "Time for cumulative cash flow to recover the initial investment"],
      ["Depreciation", "Allocation of an asset's cost over its useful life for accounting and tax"],
    ]),
    sub("equipment_design", "Equipment Design", "Sizing vessels, columns and storage.", [
      ["Design pressure", "Pressure used for mechanical design, set with a margin above maximum operating pressure"],
      ["Corrosion allowance", "Extra wall thickness added to account for metal loss over the equipment life"],
      ["P&ID", "Piping and instrumentation diagram showing equipment, lines, valves and control loops"],
    ]),
  ]),

  skill("particle_technology", "Mechanical Operations", "Particle size reduction, separation of solids and fluid-particle systems.", { level: 2, deps: ["fluid_mechanics"], book: "McCabe, Smith & Harriott — Unit Operations of Chemical Engineering" }, [
    sub("size_reduction", "Size Reduction & Screening", "Crushing, grinding and particle size analysis.", [
      ["Rittinger's law", "Energy for size reduction is proportional to the new surface area created"],
      ["Bond's work index", "Energy needed to reduce a material from very large size to 80% passing 100 µm"],
      ["Sieve analysis", "Measurement of particle size distribution by passing material through a stack of screens"],
    ]),
    sub("settling", "Settling & Sedimentation", "Motion of particles through fluids.", [
      ["Stokes' law", "Terminal settling velocity in the laminar regime is proportional to particle diameter squared"],
      ["Terminal velocity", "Constant velocity reached when drag and buoyancy balance gravity"],
      ["Thickener", "Large settling tank that concentrates a slurry into a dense underflow"],
    ]),
    sub("filtration", "Filtration & Centrifugation", "Separating solids from liquids.", [
      ["Filter cake", "Layer of deposited solids that itself acts as the filtering medium"],
      ["Specific cake resistance", "Property describing how strongly a cake resists liquid flow per unit mass deposited"],
      ["Cyclone separator", "Device that uses a vortex to throw particles to the wall and separate them from gas"],
    ]),
    sub("fluidization", "Fluidization", "Beds of particles suspended by an upward fluid flow.", [
      ["Minimum fluidization velocity", "Superficial velocity at which bed weight is just supported by the fluid drag"],
      ["Ergun equation", "Correlation for pressure drop through a packed bed combining viscous and inertial terms"],
      ["Bubbling bed", "Fluidized bed in which excess gas passes through as bubbles"],
    ]),
  ]),
];
