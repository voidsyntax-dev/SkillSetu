import { skill, sub } from "./dsl";

export const materialsSkills = [
  skill("materials_science", "Materials Science", "Atomic structure, crystals, defects, phase diagrams and properties of engineering materials.", { level: 1, category: "foundation", book: "William D. Callister — Materials Science and Engineering: An Introduction" }, [
    sub("crystal_structure", "Crystal Structure", "Arrangement of atoms in solids.", [
      ["Unit cell", "Smallest repeating arrangement of atoms that builds a crystal lattice"],
      ["FCC structure", "Face-centred cubic lattice with atomic packing factor 0.74, as in copper and aluminium"],
      ["Miller indices", "Notation (hkl) describing crystal planes by reciprocals of their axis intercepts"],
      ["Atomic packing factor", "Fraction of unit cell volume occupied by atoms"],
    ]),
    sub("defects", "Imperfections in Solids", "Point, line and planar defects.", [
      ["Vacancy", "Point defect where an atom is missing from its lattice site"],
      ["Dislocation", "Line defect whose motion allows plastic deformation of crystals"],
      ["Grain boundary", "Interface between crystals of different orientation in a polycrystal"],
    ]),
    sub("phase_diagrams", "Phase Diagrams", "Equilibrium phases in alloys.", [
      ["Eutectic reaction", "Liquid transforms on cooling into two solid phases at a fixed temperature"],
      ["Lever rule", "Method for finding relative amounts of phases in a two-phase region"],
      ["Solidus", "Line below which an alloy is completely solid"],
    ]),
    sub("material_properties", "Mechanical Properties", "Testing and properties of materials.", [
      ["Ductility", "Ability of a material to undergo significant plastic deformation before fracture"],
      ["Hardness", "Resistance of a material to localised plastic indentation"],
      ["Toughness", "Energy a material can absorb before fracturing"],
      ["Creep", "Time-dependent deformation under constant load at elevated temperature"],
    ]),
  ]),

  skill("physical_metallurgy", "Physical Metallurgy", "Iron-carbon system, heat treatment and strengthening of alloys.", { level: 2, deps: ["materials_science", "thermodynamics"], book: "Sidney Avner — Introduction to Physical Metallurgy" }, [
    sub("iron_carbon", "Iron-Carbon System", "Phases and microstructures of steels.", [
      ["Austenite", "FCC γ-iron phase that can dissolve up to about 2.1% carbon"],
      ["Pearlite", "Lamellar mixture of ferrite and cementite formed by the eutectoid reaction"],
      ["Eutectoid point (steel)", "About 0.76% C at 727 °C, where austenite transforms to pearlite"],
      ["Cementite", "Hard, brittle iron carbide Fe₃C"],
    ]),
    sub("heat_treatment", "Heat Treatment", "Controlling microstructure by heating and cooling.", [
      ["Quenching", "Rapid cooling of steel to form hard martensite"],
      ["Tempering", "Reheating quenched steel to reduce brittleness while keeping much of its strength"],
      ["Annealing", "Heating and slow cooling to soften a metal and relieve stresses"],
      ["TTT diagram", "Time-temperature-transformation plot showing isothermal transformation kinetics"],
    ]),
    sub("strengthening", "Strengthening Mechanisms", "Ways to make metals stronger.", [
      ["Work hardening", "Strength increase from dislocation multiplication during plastic deformation"],
      ["Hall-Petch relation", "Yield strength increases as the inverse square root of grain size"],
      ["Precipitation hardening", "Strengthening by fine particles that obstruct dislocation motion"],
    ]),
  ]),

  skill("corrosion_engineering", "Corrosion Engineering", "Electrochemistry of corrosion and methods of protection.", { level: 3, deps: ["materials_science"], book: "Fontana — Corrosion Engineering" }, [
    sub("corrosion_basics", "Electrochemistry of Corrosion", "Anodes, cathodes and corrosion cells.", [
      ["Galvanic series", "Ranking of metals by their corrosion potential in a given environment"],
      ["Anodic reaction", "Oxidation reaction in which metal dissolves and releases electrons"],
      ["Passivation", "Formation of a thin protective oxide film that drastically slows corrosion"],
    ]),
    sub("corrosion_forms", "Forms of Corrosion", "Uniform and localised attack.", [
      ["Pitting corrosion", "Localised attack producing small, deep cavities"],
      ["Stress corrosion cracking", "Cracking from the combined action of tensile stress and a corrosive environment"],
      ["Galvanic corrosion", "Accelerated attack of the more active metal when dissimilar metals are coupled"],
    ]),
    sub("corrosion_protection", "Corrosion Protection", "Preventing and controlling corrosion.", [
      ["Cathodic protection", "Making a structure the cathode of a cell using sacrificial anodes or impressed current"],
      ["Sacrificial anode", "More active metal such as zinc that corrodes preferentially to protect a structure"],
      ["Corrosion inhibitor", "Chemical added in small amounts to reduce corrosion rate"],
    ]),
  ]),

  skill("materials_characterization", "Materials Characterisation", "Microscopy, diffraction and spectroscopy for analysing materials.", { level: 3, category: "tools", deps: ["materials_science"], book: "Yang Leng — Materials Characterization" }, [
    sub("microscopy", "Microscopy", "Imaging microstructure.", [
      ["SEM", "Scanning electron microscope imaging surfaces with a focused electron beam"],
      ["TEM", "Transmission electron microscope imaging electrons transmitted through a thin specimen"],
      ["Etching", "Chemical attack of a polished sample to reveal grain boundaries"],
    ]),
    sub("diffraction", "X-ray Diffraction", "Identifying crystal structures.", [
      ["Bragg's law", "nλ = 2d·sin θ, condition for constructive X-ray diffraction"],
      ["Diffraction pattern", "Set of peaks whose positions reveal lattice spacings"],
      ["Scherrer equation", "Relation estimating crystallite size from diffraction peak broadening"],
    ]),
    sub("spectroscopy_thermal", "Spectroscopy & Thermal Analysis", "Chemical and thermal characterisation.", [
      ["EDS", "Energy-dispersive X-ray spectroscopy, identifying elements from characteristic X-rays"],
      ["FTIR", "Infrared spectroscopy identifying chemical bonds from absorption bands"],
      ["DSC", "Differential scanning calorimetry, measuring heat flow during transitions"],
      ["TGA", "Thermogravimetric analysis, tracking mass change with temperature"],
    ]),
  ]),

  skill("polymers_composites", "Polymers & Composites", "Polymer chemistry, processing and fibre-reinforced composites.", { level: 3, category: "elective", deps: ["materials_science"], book: "Fried — Polymer Science and Technology" }, [
    sub("polymer_basics", "Polymer Science", "Structure of polymers.", [
      ["Degree of polymerisation", "Number of repeat units in a polymer chain"],
      ["Glass transition temperature", "Temperature at which an amorphous polymer changes from glassy to rubbery"],
      ["Thermoset", "Cross-linked polymer that does not melt on reheating"],
      ["Thermoplastic", "Polymer that softens on heating and can be remoulded"],
    ]),
    sub("polymer_processing", "Polymer Processing", "Shaping polymer products.", [
      ["Injection moulding", "Injecting molten polymer into a closed mould under pressure"],
      ["Extrusion", "Forcing molten polymer continuously through a shaped die"],
      ["Blow moulding", "Inflating a heated parison inside a mould to form hollow parts"],
    ]),
    sub("composites", "Composite Materials", "Combining materials for superior properties.", [
      ["Matrix", "Continuous phase of a composite that binds and protects the reinforcement"],
      ["Rule of mixtures", "Estimate of composite properties as a volume-weighted average of constituents"],
      ["Carbon fibre reinforced polymer", "Lightweight, high-stiffness composite of carbon fibres in a polymer matrix"],
    ]),
  ]),

  skill("extractive_metallurgy", "Extractive Metallurgy", "Producing metals from ores by mineral processing, pyro- and hydrometallurgy.", { level: 3, deps: ["thermodynamics", "material_energy_balances"], book: "Gilchrist — Extraction Metallurgy" }, [
    sub("mineral_processing", "Mineral Processing", "Concentrating ores.", [
      ["Froth flotation", "Separation of minerals by selectively attaching them to air bubbles"],
      ["Beneficiation", "Processes that raise the grade of an ore before extraction"],
      ["Comminution", "Crushing and grinding ore to liberate valuable minerals"],
    ]),
    sub("pyrometallurgy", "Pyrometallurgy", "High-temperature extraction.", [
      ["Ellingham diagram", "Plot of standard Gibbs energy of oxide formation versus temperature"],
      ["Blast furnace", "Shaft furnace reducing iron ore with coke to produce hot metal"],
      ["Slag", "Molten oxide by-product that collects impurities during smelting"],
    ]),
    sub("hydrometallurgy", "Hydro- & Electrometallurgy", "Aqueous extraction and refining.", [
      ["Leaching", "Dissolving metal values from ore into an aqueous solution"],
      ["Electrowinning", "Recovering metal from solution by electrolytic deposition"],
      ["Faraday's law of electrolysis", "Mass deposited is proportional to the charge passed"],
    ]),
  ]),
];
