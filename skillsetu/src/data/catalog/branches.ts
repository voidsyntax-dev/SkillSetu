import type { Branch } from "@/types";

// Each branch lists its curriculum in recommended study order.
export const branches: Branch[] = [
  {
    id: "chemical",
    name: "Chemical Engineering",
    short: "Chemical",
    icon: "⚗️",
    description: "Design and operate processes that turn raw materials into fuels, chemicals, pharmaceuticals and materials — safely and economically.",
    skills: [
      "engineering_mathematics", "probability_statistics", "python_programming", "material_energy_balances",
      "thermodynamics", "fluid_mechanics", "particle_technology", "heat_transfer", "numerical_methods",
      "mass_transfer", "reaction_engineering", "process_control", "process_simulation", "process_safety",
      "plant_design_economics",
    ],
  },
  {
    id: "biotech",
    name: "Biotechnology",
    short: "Biotech",
    icon: "🧬",
    description: "Engineer living systems — from enzymes and microbes to bioreactors — to make medicines, food, fuels and diagnostics.",
    skills: [
      "engineering_mathematics", "probability_statistics", "python_programming", "biochemistry", "microbiology",
      "molecular_biology", "enzyme_kinetics", "material_energy_balances", "mass_transfer", "bioreactor_design",
      "downstream_processing", "bioinformatics", "metabolic_engineering",
    ],
  },
  {
    id: "mechanical",
    name: "Mechanical Engineering",
    short: "Mechanical",
    icon: "⚙️",
    description: "Design, analyse and manufacture machines, engines and thermal systems that move the world.",
    skills: [
      "engineering_mathematics", "engineering_mechanics", "materials_science", "thermodynamics",
      "strength_of_materials", "fluid_mechanics", "theory_of_machines", "manufacturing_processes",
      "heat_transfer", "numerical_methods", "applied_thermal", "machine_design", "cad_fea", "control_systems",
    ],
  },
  {
    id: "civil",
    name: "Civil Engineering",
    short: "Civil",
    icon: "🏗️",
    description: "Plan, design and build infrastructure — buildings, bridges, roads, water systems — that societies run on.",
    skills: [
      "engineering_mathematics", "engineering_mechanics", "surveying", "strength_of_materials", "fluid_mechanics",
      "structural_analysis", "geotechnical_engineering", "concrete_design", "hydrology_water_resources",
      "transportation_engineering", "water_wastewater_treatment", "construction_management",
    ],
  },
  {
    id: "electrical",
    name: "Electrical Engineering",
    short: "Electrical",
    icon: "⚡",
    description: "Generate, transmit and convert electrical power and build the machines and controls that use it.",
    skills: [
      "engineering_mathematics", "circuit_theory", "electromagnetics", "analog_electronics", "digital_electronics",
      "signals_systems", "electrical_machines", "control_systems", "power_electronics", "power_systems",
      "embedded_systems",
    ],
  },
  {
    id: "electronics",
    name: "Electronics & Communication",
    short: "ECE",
    icon: "📡",
    description: "Design circuits, chips, embedded devices and the communication systems that connect them.",
    skills: [
      "engineering_mathematics", "circuit_theory", "programming_fundamentals", "analog_electronics",
      "digital_electronics", "signals_systems", "electromagnetics", "control_systems", "communication_systems",
      "embedded_systems", "vlsi_design",
    ],
  },
  {
    id: "computer",
    name: "Computer Science & Engineering",
    short: "CSE",
    icon: "💻",
    description: "Build software, data systems and intelligent applications — from algorithms to the cloud.",
    skills: [
      "engineering_mathematics", "probability_statistics", "programming_fundamentals", "python_programming",
      "data_structures", "algorithms", "digital_electronics", "databases", "operating_systems",
      "computer_networks", "web_development", "software_engineering", "data_analytics", "machine_learning",
      "cloud_computing",
    ],
  },
  {
    id: "materials",
    name: "Metallurgical & Materials Engineering",
    short: "Materials",
    icon: "🔩",
    description: "Discover, process and select metals, polymers and composites with the properties products need.",
    skills: [
      "engineering_mathematics", "materials_science", "thermodynamics", "material_energy_balances",
      "physical_metallurgy", "strength_of_materials", "extractive_metallurgy", "manufacturing_processes",
      "materials_characterization", "corrosion_engineering", "polymers_composites",
    ],
  },
  {
    id: "environmental",
    name: "Environmental Engineering",
    short: "Environmental",
    icon: "🌱",
    description: "Protect air, water and land through treatment systems, pollution control and sustainable design.",
    skills: [
      "engineering_mathematics", "probability_statistics", "environmental_chemistry", "microbiology",
      "fluid_mechanics", "particle_technology", "hydrology_water_resources", "water_wastewater_treatment",
      "air_pollution_control", "solid_waste_management", "environmental_impact_assessment",
    ],
  },
  {
    id: "aerospace",
    name: "Aerospace Engineering",
    short: "Aerospace",
    icon: "✈️",
    description: "Design aircraft, spacecraft and propulsion systems that fly efficiently and safely.",
    skills: [
      "engineering_mathematics", "engineering_mechanics", "thermodynamics", "fluid_mechanics",
      "strength_of_materials", "numerical_methods", "aerodynamics", "flight_mechanics", "propulsion",
      "aircraft_structures", "control_systems", "cad_fea",
    ],
  },
];
