import { skill, sub } from "./dsl";

export const mechanicalSkills = [
  skill("strength_of_materials", "Strength of Materials", "Stress, strain, bending, torsion and deflection of structural members.", { level: 2, deps: ["engineering_mechanics"], book: "R.C. Hibbeler — Mechanics of Materials" }, [
    sub("stress_strain", "Stress & Strain", "Normal and shear stress, Hooke's law and elastic constants.", [
      ["Normal stress", "Internal force per unit area acting perpendicular to a section"],
      ["Young's modulus", "Ratio of normal stress to normal strain in the linear elastic region"],
      ["Poisson's ratio", "Negative ratio of lateral strain to axial strain under uniaxial load"],
      ["Yield strength", "Stress at which a material begins to deform plastically"],
    ], [
      ["A 100 mm² bar carries an axial load of 10 kN. What is the normal stress?", "100 MPa", ["10 MPa", "1000 MPa", "1 MPa"], "σ = F/A = 10,000 N / 100 mm² = 100 N/mm² = 100 MPa.", 1],
    ]),
    sub("bending", "Bending of Beams", "Shear force, bending moment and flexural stress.", [
      ["Bending moment", "Internal moment at a section of a beam that resists the applied loads"],
      ["Flexure formula", "σ = M·y/I, giving bending stress at distance y from the neutral axis"],
      ["Neutral axis", "Line in a bent beam's cross-section where bending stress is zero"],
      ["Section modulus", "Z = I/y_max, a geometric measure of a beam's bending strength"],
    ]),
    sub("torsion", "Torsion", "Twisting of circular shafts.", [
      ["Torsion formula", "τ = T·r/J, giving shear stress in a circular shaft under torque"],
      ["Polar moment of inertia", "J, a cross-section's resistance to torsion"],
      ["Angle of twist", "Rotation of one end of a shaft relative to the other, θ = TL/(GJ)"],
    ]),
    sub("deflection_columns", "Deflection & Columns", "Beam deflection and buckling of columns.", [
      ["Euler buckling load", "Critical axial load P_cr = π²EI/(KL)² at which a slender column buckles"],
      ["Slenderness ratio", "Effective length divided by radius of gyration, indicating buckling tendency"],
      ["Mohr's circle", "Graphical method for finding principal stresses and maximum shear stress"],
    ]),
  ]),

  skill("theory_of_machines", "Theory of Machines", "Kinematics and dynamics of mechanisms, gears, flywheels and vibrations.", { level: 2, deps: ["engineering_mechanics"], book: "S.S. Rattan — Theory of Machines" }, [
    sub("mechanisms", "Mechanisms & Linkages", "Links, pairs and degrees of freedom.", [
      ["Kinematic pair", "Two links in contact that permit a constrained relative motion"],
      ["Grashof's law", "For a four-bar linkage, at least one link can fully rotate if s + l ≤ p + q"],
      ["Gruebler's equation", "Formula for the degrees of freedom of a planar mechanism, F = 3(n−1) − 2j − h"],
    ]),
    sub("gears", "Gears & Gear Trains", "Transmitting motion between shafts.", [
      ["Involute profile", "Gear tooth shape that maintains a constant velocity ratio despite centre-distance changes"],
      ["Module", "Pitch circle diameter divided by the number of teeth"],
      ["Epicyclic gear train", "Gear train in which some gear axes rotate about another axis"],
    ]),
    sub("flywheels_governors", "Flywheels & Governors", "Smoothing speed fluctuations.", [
      ["Flywheel", "Rotating mass that stores energy to reduce speed fluctuation within a cycle"],
      ["Coefficient of fluctuation of speed", "Ratio of the speed range in a cycle to the mean speed"],
      ["Governor", "Device that regulates mean engine speed as load changes by adjusting fuel supply"],
    ]),
    sub("vibrations", "Mechanical Vibrations", "Free, damped and forced vibration.", [
      ["Natural frequency", "Frequency at which a system oscillates when disturbed and left alone, √(k/m)"],
      ["Resonance", "Large-amplitude response when forcing frequency matches a natural frequency"],
      ["Damping ratio", "Ratio of actual damping to critical damping in a vibrating system"],
    ]),
  ]),

  skill("machine_design", "Machine Design", "Designing shafts, joints, bearings and springs against static and fatigue failure.", { level: 3, deps: ["strength_of_materials", "theory_of_machines"], book: "Shigley — Mechanical Engineering Design" }, [
    sub("failure_theories", "Failure Theories", "Predicting yield under combined stress.", [
      ["Von Mises criterion", "Ductile materials yield when distortion energy reaches its value at uniaxial yield"],
      ["Tresca criterion", "Yield occurs when maximum shear stress reaches half the yield strength"],
      ["Factor of safety", "Ratio of material strength to the actual working stress"],
    ]),
    sub("fatigue", "Fatigue Design", "Designing parts that see repeated loading.", [
      ["Endurance limit", "Stress amplitude below which a steel specimen can survive infinite cycles"],
      ["S-N curve", "Plot of stress amplitude versus number of cycles to failure"],
      ["Stress concentration factor", "Ratio of peak local stress at a notch to nominal stress"],
      ["Goodman line", "Criterion combining mean and alternating stress for fatigue design"],
    ]),
    sub("machine_elements", "Machine Elements", "Shafts, keys, bolts, welds and springs.", [
      ["Key", "Machine element that transmits torque between a shaft and a hub"],
      ["Preload", "Initial tension applied to a bolt to keep a joint clamped under service load"],
      ["Spring index", "Ratio of mean coil diameter to wire diameter in a helical spring"],
    ]),
    sub("bearings", "Bearings & Lubrication", "Selecting rolling and sliding bearings.", [
      ["Rolling element bearing", "Bearing in which balls or rollers carry load between races"],
      ["L10 life", "Number of revolutions that 90% of a group of identical bearings will survive"],
      ["Hydrodynamic lubrication", "Regime where a fluid film generated by motion fully separates the surfaces"],
    ]),
  ]),

  skill("manufacturing_processes", "Manufacturing Processes", "Casting, forming, machining, welding and modern manufacturing.", { level: 2, deps: ["materials_science"], book: "Kalpakjian — Manufacturing Engineering and Technology" }, [
    sub("casting", "Casting", "Shaping metal by pouring it into moulds.", [
      ["Sand casting", "Process using expendable sand moulds for parts of almost any size"],
      ["Riser", "Reservoir of molten metal that feeds a casting as it shrinks during solidification"],
      ["Chvorinov's rule", "Solidification time is proportional to (volume/surface area)²"],
    ]),
    sub("metal_forming", "Metal Forming", "Plastic deformation processes.", [
      ["Forging", "Shaping metal by compressive forces with dies or hammers"],
      ["Rolling", "Reducing thickness by passing material between rotating rolls"],
      ["Hot working", "Deformation above the recrystallisation temperature so the metal does not strain-harden"],
    ]),
    sub("machining", "Machining", "Material removal with cutting tools.", [
      ["Taylor's tool life equation", "V·Tⁿ = C, relating cutting speed to tool life"],
      ["Built-up edge", "Layer of work material welded onto the tool tip during cutting"],
      ["Material removal rate", "Volume of material removed per unit time"],
    ]),
    sub("joining_additive", "Welding & Additive Manufacturing", "Joining processes and 3D printing.", [
      ["Heat-affected zone", "Region of base metal whose microstructure is altered by welding heat but not melted"],
      ["TIG welding", "Arc welding with a non-consumable tungsten electrode and inert gas shielding"],
      ["Fused deposition modelling", "Additive process that builds parts by extruding thermoplastic layer by layer"],
      ["Selective laser melting", "Additive process that fully melts metal powder layers with a laser"],
    ]),
  ]),

  skill("applied_thermal", "Applied Thermal Engineering", "Power cycles, IC engines, refrigeration and air conditioning.", { level: 3, deps: ["thermodynamics", "heat_transfer"], book: "Cengel & Boles — Thermodynamics: An Engineering Approach" }, [
    sub("power_cycles", "Power Cycles", "Rankine and Brayton cycles.", [
      ["Rankine cycle", "Vapour power cycle of pump, boiler, turbine and condenser used in steam plants"],
      ["Brayton cycle", "Gas power cycle of compressor, combustor and turbine used in gas turbines"],
      ["Reheat", "Re-heating steam between turbine stages to raise efficiency and reduce moisture"],
      ["Regeneration", "Using turbine bleed steam or exhaust heat to preheat working fluid"],
    ]),
    sub("ic_engines", "IC Engines", "Spark and compression ignition engines.", [
      ["Otto cycle", "Ideal cycle for spark-ignition engines with constant-volume heat addition"],
      ["Diesel cycle", "Ideal cycle for compression-ignition engines with constant-pressure heat addition"],
      ["Compression ratio", "Ratio of cylinder volume at bottom dead centre to that at top dead centre"],
      ["Knocking", "Abnormal auto-ignition of end gas in a spark-ignition engine"],
    ]),
    sub("refrigeration", "Refrigeration & Air Conditioning", "Vapour compression systems and psychrometrics.", [
      ["Coefficient of performance", "Ratio of refrigeration effect to work input"],
      ["Vapour compression cycle", "Refrigeration cycle of compressor, condenser, expansion valve and evaporator"],
      ["Relative humidity", "Ratio of actual water vapour pressure to saturation pressure at the same temperature"],
      ["Dew point", "Temperature at which air becomes saturated and water vapour starts to condense"],
    ]),
  ]),

  skill("cad_fea", "CAD, CAM & FEA", "Computer-aided design, finite element analysis and CNC programming.", { level: 3, category: "tools", deps: ["strength_of_materials", "numerical_methods"], book: "Logan — A First Course in the Finite Element Method" }, [
    sub("cad_modeling", "Solid Modelling", "Parametric 3D modelling and drawings.", [
      ["Parametric modelling", "CAD approach where geometry is driven by editable dimensions and constraints"],
      ["GD&T", "Geometric dimensioning and tolerancing, a symbolic language for allowable variation of form and position"],
      ["Assembly constraint", "Relationship such as mate or align that positions parts relative to each other"],
    ]),
    sub("fea_basics", "Finite Element Analysis", "Solving field problems by discretisation.", [
      ["Mesh", "Subdivision of a domain into small elements connected at nodes"],
      ["Stiffness matrix", "Matrix relating nodal forces to nodal displacements, K·u = F"],
      ["Mesh convergence study", "Refining the mesh until results stop changing significantly"],
      ["Boundary conditions", "Specified displacements, loads or constraints applied to a finite element model"],
    ]),
    sub("cnc", "CNC & CAM", "Computer-controlled machining.", [
      ["G-code", "Programming language of motion and machine commands for CNC machines"],
      ["Toolpath", "Path a cutting tool follows, generated by CAM software from the CAD model"],
      ["Work offset", "Reference that locates the part coordinate system on the machine"],
    ]),
  ]),
];
