import type { Career, CareerSkill } from "@/types";

// Compact skill list: "id" = weight 2, "id!" = weight 3 (critical), "id?" = weight 1 (useful).
function s(...ids: string[]): CareerSkill[] {
  return ids.map((raw) => {
    if (raw.endsWith("!")) return { id: raw.slice(0, -1), weight: 3 };
    if (raw.endsWith("?")) return { id: raw.slice(0, -1), weight: 1 };
    return { id: raw, weight: 2 };
  });
}

export const careers: Career[] = [
  // ─── Chemical ───
  {
    id: "process_engineer", name: "Process Engineer", branchId: "chemical",
    description: "Designs, runs and optimises continuous chemical processes in refineries, petrochemical and specialty chemical plants.",
    difficulty: "Advanced", salary: "₹6–14 LPA", learningTime: "9–12 months", outlook: "Steady demand across refining, petrochemicals and green hydrogen projects.",
    employers: ["Refineries", "Petrochemical majors", "EPC contractors", "Specialty chemicals"],
    skills: s("material_energy_balances!", "thermodynamics!", "fluid_mechanics", "heat_transfer!", "mass_transfer!", "reaction_engineering!", "process_control", "process_simulation", "process_safety?"),
  },
  {
    id: "process_simulation_engineer", name: "Process Simulation Engineer", branchId: "chemical",
    description: "Builds steady-state and dynamic models in Aspen Plus, HYSYS or DWSIM to design new units and debottleneck existing ones.",
    difficulty: "Advanced", salary: "₹7–16 LPA", learningTime: "9–12 months", outlook: "Growing with digital twins and decarbonisation studies.",
    employers: ["EPC contractors", "Process licensors", "Engineering consultancies"],
    skills: s("thermodynamics!", "process_simulation!", "numerical_methods", "mass_transfer", "reaction_engineering", "heat_transfer", "python_programming?", "plant_design_economics?"),
  },
  {
    id: "chemical_safety_engineer", name: "Process Safety Engineer", branchId: "chemical",
    description: "Leads HAZOP, LOPA and SIL studies and designs relief systems so plants operate without major accidents.",
    difficulty: "Intermediate", salary: "₹6–13 LPA", learningTime: "6–9 months", outlook: "Mandatory role in every hazardous-chemical facility.",
    employers: ["Oil & gas operators", "Pharma manufacturers", "Safety consultancies"],
    skills: s("process_safety!", "reaction_engineering", "fluid_mechanics", "thermodynamics", "process_control", "probability_statistics?"),
  },
  {
    id: "chemical_data_scientist", name: "Chemical Data Scientist", branchId: "chemical",
    description: "Applies statistics and machine learning to plant data for soft sensors, predictive maintenance and yield optimisation.",
    difficulty: "Advanced", salary: "₹8–20 LPA", learningTime: "9–12 months", outlook: "Fast-growing as plants adopt Industry 4.0 analytics.",
    employers: ["Process industries", "Industrial AI start-ups", "Automation vendors"],
    skills: s("python_programming!", "probability_statistics!", "machine_learning!", "data_analytics", "process_control", "reaction_engineering?", "thermodynamics?"),
  },

  // ─── Biotech ───
  {
    id: "bioprocess_engineer", name: "Bioprocess Engineer", branchId: "biotech",
    description: "Develops and scales up fermentation and cell-culture processes for biologics, enzymes and vaccines.",
    difficulty: "Advanced", salary: "₹5–12 LPA", learningTime: "9–12 months", outlook: "Strong growth in biosimilars, vaccines and precision fermentation.",
    employers: ["Biopharma", "Vaccine manufacturers", "Industrial enzyme companies"],
    skills: s("bioreactor_design!", "microbiology", "enzyme_kinetics", "mass_transfer", "downstream_processing!", "material_energy_balances", "process_control?"),
  },
  {
    id: "biotech_research_scientist", name: "Biotech Research Scientist", branchId: "biotech",
    description: "Designs experiments to engineer genes, proteins and pathways for new therapies and bio-based products.",
    difficulty: "Advanced", salary: "₹5–12 LPA", learningTime: "12+ months", outlook: "Driven by gene therapy, synthetic biology and R&D investment.",
    employers: ["Research institutes", "Biopharma R&D", "Synthetic biology start-ups"],
    skills: s("molecular_biology!", "biochemistry!", "metabolic_engineering", "enzyme_kinetics", "bioinformatics", "probability_statistics?"),
  },
  {
    id: "bioinformatics_scientist", name: "Bioinformatics Scientist", branchId: "biotech",
    description: "Analyses genomic and proteomic data with code to discover biomarkers and drug targets.",
    difficulty: "Advanced", salary: "₹6–15 LPA", learningTime: "9–12 months", outlook: "Rising demand with cheap sequencing and AI drug discovery.",
    employers: ["Genomics companies", "Pharma", "Hospitals & research labs"],
    skills: s("bioinformatics!", "python_programming!", "probability_statistics", "molecular_biology", "machine_learning", "databases?"),
  },
  {
    id: "quality_validation_specialist", name: "QA / Validation Specialist", branchId: "biotech",
    description: "Ensures GMP compliance and validates equipment, processes and cleaning in regulated manufacturing.",
    difficulty: "Beginner", salary: "₹4–9 LPA", learningTime: "4–6 months", outlook: "Every regulated plant needs validation teams.",
    employers: ["Pharma", "Biologics", "Medical devices"],
    skills: s("microbiology!", "downstream_processing", "bioreactor_design", "probability_statistics", "biochemistry?"),
  },

  // ─── Mechanical ───
  {
    id: "design_engineer", name: "Mechanical Design Engineer", branchId: "mechanical",
    description: "Creates and validates mechanical components and assemblies using CAD, FEA and design standards.",
    difficulty: "Intermediate", salary: "₹4–10 LPA", learningTime: "6–9 months", outlook: "Core demand in automotive, machinery and consumer products.",
    employers: ["Automotive OEMs", "Industrial machinery", "Engineering services"],
    skills: s("machine_design!", "strength_of_materials!", "cad_fea!", "theory_of_machines", "manufacturing_processes", "materials_science?"),
  },
  {
    id: "thermal_engineer", name: "Thermal & HVAC Engineer", branchId: "mechanical",
    description: "Designs heat exchangers, cooling systems and HVAC for buildings, electronics and power plants.",
    difficulty: "Intermediate", salary: "₹4–11 LPA", learningTime: "6–9 months", outlook: "Boosted by data-centre cooling and EV battery thermal management.",
    employers: ["HVAC companies", "Power plants", "EV makers"],
    skills: s("thermodynamics!", "heat_transfer!", "applied_thermal!", "fluid_mechanics", "cad_fea?"),
  },
  {
    id: "manufacturing_engineer", name: "Manufacturing Engineer", branchId: "mechanical",
    description: "Plans production processes, tooling and quality for efficient, defect-free manufacturing.",
    difficulty: "Beginner", salary: "₹3.5–9 LPA", learningTime: "4–6 months", outlook: "Expanding with domestic manufacturing incentives.",
    employers: ["Automotive", "Electronics manufacturing", "Aerospace suppliers"],
    skills: s("manufacturing_processes!", "materials_science", "cad_fea", "probability_statistics", "machine_design?"),
  },
  {
    id: "robotics_engineer", name: "Robotics & Mechatronics Engineer", branchId: "mechanical",
    description: "Integrates mechanisms, sensors, embedded controllers and software into automated machines and robots.",
    difficulty: "Advanced", salary: "₹6–15 LPA", learningTime: "9–12 months", outlook: "Rapid growth in warehouse automation and industrial robotics.",
    employers: ["Automation integrators", "Robotics start-ups", "Automotive plants"],
    skills: s("theory_of_machines!", "control_systems!", "embedded_systems", "python_programming", "cad_fea", "machine_design?"),
  },

  // ─── Civil ───
  {
    id: "structural_engineer", name: "Structural Engineer", branchId: "civil",
    description: "Analyses and designs safe, economical structures — buildings, bridges and industrial frames.",
    difficulty: "Advanced", salary: "₹4–12 LPA", learningTime: "9–12 months", outlook: "Steady with infrastructure and urban housing growth.",
    employers: ["Structural consultancies", "Infrastructure developers", "Public works departments"],
    skills: s("structural_analysis!", "concrete_design!", "strength_of_materials!", "engineering_mechanics", "geotechnical_engineering", "numerical_methods?"),
  },
  {
    id: "geotechnical_engineer", name: "Geotechnical Engineer", branchId: "civil",
    description: "Investigates soils and designs foundations, retaining structures and slopes.",
    difficulty: "Intermediate", salary: "₹4–10 LPA", learningTime: "6–9 months", outlook: "Needed for metros, tunnels and high-rise projects.",
    employers: ["Geotech consultancies", "Metro corporations", "Construction majors"],
    skills: s("geotechnical_engineering!", "strength_of_materials", "fluid_mechanics", "concrete_design", "surveying?"),
  },
  {
    id: "transportation_planner", name: "Transportation Engineer", branchId: "civil",
    description: "Designs highways, intersections and transit systems and models traffic flow.",
    difficulty: "Intermediate", salary: "₹4–10 LPA", learningTime: "6–9 months", outlook: "Expanding with national highway and smart-city programmes.",
    employers: ["Highway authorities", "Transport consultancies", "Smart-city SPVs"],
    skills: s("transportation_engineering!", "surveying!", "geotechnical_engineering", "probability_statistics", "data_analytics?"),
  },
  {
    id: "construction_manager", name: "Construction Project Manager", branchId: "civil",
    description: "Plans schedules, budgets and teams to deliver construction projects on time and to quality.",
    difficulty: "Intermediate", salary: "₹5–14 LPA", learningTime: "6–9 months", outlook: "High demand across real estate and infrastructure.",
    employers: ["Construction majors", "Real estate developers", "Project management consultancies"],
    skills: s("construction_management!", "concrete_design", "surveying", "structural_analysis?", "probability_statistics?"),
  },

  // ─── Electrical ───
  {
    id: "power_systems_engineer", name: "Power Systems Engineer", branchId: "electrical",
    description: "Plans and operates transmission and distribution networks, protection schemes and grid studies.",
    difficulty: "Advanced", salary: "₹5–13 LPA", learningTime: "9–12 months", outlook: "Strong demand from grid expansion and renewable integration.",
    employers: ["Transmission utilities", "Power equipment makers", "Grid operators"],
    skills: s("power_systems!", "electrical_machines!", "circuit_theory", "power_electronics", "control_systems", "numerical_methods?"),
  },
  {
    id: "ev_powertrain_engineer", name: "EV Powertrain Engineer", branchId: "electrical",
    description: "Develops motors, inverters, chargers and battery management for electric vehicles.",
    difficulty: "Advanced", salary: "₹7–18 LPA", learningTime: "9–12 months", outlook: "One of the fastest-growing engineering roles.",
    employers: ["EV OEMs", "Battery makers", "Charging infrastructure firms"],
    skills: s("power_electronics!", "electrical_machines!", "control_systems", "embedded_systems", "circuit_theory", "applied_thermal?"),
  },
  {
    id: "renewable_energy_engineer", name: "Renewable Energy Engineer", branchId: "electrical",
    description: "Designs solar and wind plants, their power converters and grid connections.",
    difficulty: "Intermediate", salary: "₹4–11 LPA", learningTime: "6–9 months", outlook: "Driven by national renewable capacity targets.",
    employers: ["Solar & wind developers", "EPC firms", "Energy consultancies"],
    skills: s("power_systems!", "power_electronics", "electrical_machines", "circuit_theory", "data_analytics?"),
  },

  // ─── Electronics ───
  {
    id: "embedded_engineer", name: "Embedded Systems Engineer", branchId: "electronics",
    description: "Writes firmware and designs hardware for microcontroller-based products and IoT devices.",
    difficulty: "Intermediate", salary: "₹5–14 LPA", learningTime: "6–9 months", outlook: "High demand in automotive electronics, IoT and consumer devices.",
    employers: ["Automotive electronics", "IoT companies", "Consumer electronics"],
    skills: s("embedded_systems!", "digital_electronics!", "programming_fundamentals!", "analog_electronics", "computer_networks?"),
  },
  {
    id: "vlsi_engineer", name: "VLSI Design Engineer", branchId: "electronics",
    description: "Designs and verifies digital or analog integrated circuits from RTL to layout.",
    difficulty: "Advanced", salary: "₹8–22 LPA", learningTime: "12+ months", outlook: "Booming with semiconductor design and fab investments.",
    employers: ["Semiconductor companies", "EDA vendors", "Design services firms"],
    skills: s("vlsi_design!", "digital_electronics!", "analog_electronics", "programming_fundamentals", "signals_systems?"),
  },
  {
    id: "telecom_engineer", name: "RF & Telecom Engineer", branchId: "electronics",
    description: "Plans, optimises and tests wireless networks, RF front-ends and communication links.",
    difficulty: "Intermediate", salary: "₹4–12 LPA", learningTime: "6–9 months", outlook: "Driven by 5G rollouts and satellite communications.",
    employers: ["Telecom operators", "Network equipment vendors", "Satellite companies"],
    skills: s("communication_systems!", "electromagnetics!", "signals_systems", "computer_networks", "analog_electronics?"),
  },

  // ─── Computer ───
  {
    id: "software_engineer", name: "Software Engineer", branchId: "computer",
    description: "Designs, builds and maintains reliable software systems and services.",
    difficulty: "Intermediate", salary: "₹6–25 LPA", learningTime: "6–12 months", outlook: "Largest engineering job market; strong demand for good fundamentals.",
    employers: ["Product companies", "IT services", "Start-ups"],
    skills: s("data_structures!", "algorithms!", "programming_fundamentals", "databases", "operating_systems", "software_engineering!", "computer_networks?", "web_development?"),
  },
  {
    id: "data_analyst", name: "Data Analyst", branchId: "computer",
    description: "Turns raw data into insights with SQL, Python and dashboards to guide business decisions.",
    difficulty: "Beginner", salary: "₹4–10 LPA", learningTime: "4–6 months", outlook: "Open to graduates of every branch; demand keeps rising.",
    employers: ["Consulting", "E-commerce", "Banks & fintech"],
    skills: s("data_analytics!", "databases!", "probability_statistics!", "python_programming", "machine_learning?"),
  },
  {
    id: "ml_engineer", name: "Machine Learning Engineer", branchId: "computer",
    description: "Builds, trains and deploys machine learning models in production systems.",
    difficulty: "Advanced", salary: "₹10–30 LPA", learningTime: "9–12 months", outlook: "Very high demand with the adoption of AI across industries.",
    employers: ["AI product companies", "Big tech", "Research labs"],
    skills: s("machine_learning!", "python_programming!", "probability_statistics!", "engineering_mathematics", "data_structures", "cloud_computing?", "software_engineering?"),
  },
  {
    id: "full_stack_developer", name: "Full-Stack Web Developer", branchId: "computer",
    description: "Builds complete web applications — user interfaces, APIs and databases.",
    difficulty: "Beginner", salary: "₹4–15 LPA", learningTime: "4–8 months", outlook: "Consistent demand from start-ups and agencies.",
    employers: ["Start-ups", "Agencies", "Product companies"],
    skills: s("web_development!", "databases!", "programming_fundamentals", "software_engineering", "computer_networks?", "cloud_computing?"),
  },
  {
    id: "devops_engineer", name: "Cloud & DevOps Engineer", branchId: "computer",
    description: "Automates infrastructure, CI/CD pipelines and keeps cloud systems reliable and secure.",
    difficulty: "Intermediate", salary: "₹7–22 LPA", learningTime: "6–9 months", outlook: "Strong demand as companies migrate to the cloud.",
    employers: ["SaaS companies", "Cloud consultancies", "Enterprises"],
    skills: s("cloud_computing!", "operating_systems!", "computer_networks!", "software_engineering", "python_programming?"),
  },

  // ─── Materials ───
  {
    id: "metallurgist", name: "Metallurgical Engineer", branchId: "materials",
    description: "Controls steelmaking and heat-treatment processes to achieve the right microstructure and properties.",
    difficulty: "Intermediate", salary: "₹5–12 LPA", learningTime: "6–9 months", outlook: "Core hiring by steel, aluminium and alloy producers.",
    employers: ["Steel plants", "Non-ferrous producers", "Foundries"],
    skills: s("physical_metallurgy!", "extractive_metallurgy!", "materials_science", "thermodynamics", "materials_characterization?"),
  },
  {
    id: "materials_rnd_engineer", name: "Materials R&D Engineer", branchId: "materials",
    description: "Develops and characterises new alloys, polymers and composites for advanced products.",
    difficulty: "Advanced", salary: "₹6–14 LPA", learningTime: "9–12 months", outlook: "Demand from batteries, aerospace and semiconductors.",
    employers: ["R&D centres", "Aerospace & defence", "Battery companies"],
    skills: s("materials_science!", "materials_characterization!", "polymers_composites", "physical_metallurgy", "probability_statistics?"),
  },
  {
    id: "corrosion_engineer", name: "Corrosion & Integrity Engineer", branchId: "materials",
    description: "Assesses and prevents corrosion damage to pipelines, plants and offshore structures.",
    difficulty: "Intermediate", salary: "₹5–13 LPA", learningTime: "6–9 months", outlook: "Steady need in oil & gas, water and infrastructure.",
    employers: ["Oil & gas operators", "Pipeline companies", "Inspection firms"],
    skills: s("corrosion_engineering!", "materials_science", "physical_metallurgy", "process_safety?", "materials_characterization?"),
  },

  // ─── Environmental ───
  {
    id: "water_treatment_engineer", name: "Water & Wastewater Engineer", branchId: "environmental",
    description: "Designs and operates treatment plants for drinking water, sewage and industrial effluent.",
    difficulty: "Intermediate", salary: "₹4–10 LPA", learningTime: "6–9 months", outlook: "Expanding with clean-water missions and zero-liquid-discharge rules.",
    employers: ["Water utilities", "Treatment plant EPCs", "Industrial ETP operators"],
    skills: s("water_wastewater_treatment!", "environmental_chemistry!", "fluid_mechanics", "microbiology", "hydrology_water_resources?"),
  },
  {
    id: "environmental_consultant", name: "Environmental Consultant", branchId: "environmental",
    description: "Prepares EIAs, monitors compliance and advises industry on sustainability and emissions.",
    difficulty: "Beginner", salary: "₹3.5–9 LPA", learningTime: "4–6 months", outlook: "Growing with ESG reporting and stricter regulation.",
    employers: ["Environmental consultancies", "ESG advisory firms", "Pollution control boards"],
    skills: s("environmental_impact_assessment!", "air_pollution_control", "environmental_chemistry", "solid_waste_management", "data_analytics?"),
  },
  {
    id: "sustainability_engineer", name: "Sustainability & Decarbonisation Engineer", branchId: "environmental",
    description: "Measures carbon footprints and designs projects that cut emissions, energy and waste.",
    difficulty: "Intermediate", salary: "₹5–14 LPA", learningTime: "6–9 months", outlook: "Rapidly growing with net-zero commitments.",
    employers: ["Corporates' ESG teams", "Energy consultancies", "Climate-tech start-ups"],
    skills: s("environmental_impact_assessment!", "material_energy_balances", "air_pollution_control", "data_analytics", "thermodynamics?"),
  },

  // ─── Aerospace ───
  {
    id: "aerodynamics_engineer", name: "Aerodynamics / CFD Engineer", branchId: "aerospace",
    description: "Uses wind-tunnel testing and CFD to shape aircraft, drones and vehicles for lower drag and better lift.",
    difficulty: "Advanced", salary: "₹6–15 LPA", learningTime: "9–12 months", outlook: "Strong in aerospace, defence, drones and motorsport.",
    employers: ["Aircraft makers", "Defence labs", "Drone companies"],
    skills: s("aerodynamics!", "fluid_mechanics!", "numerical_methods!", "flight_mechanics", "python_programming?"),
  },
  {
    id: "propulsion_engineer", name: "Propulsion Engineer", branchId: "aerospace",
    description: "Designs and tests jet engines and rocket motors for aircraft and launch vehicles.",
    difficulty: "Advanced", salary: "₹6–16 LPA", learningTime: "12+ months", outlook: "Growing with private space launch companies.",
    employers: ["Space start-ups", "Engine manufacturers", "Defence research"],
    skills: s("propulsion!", "thermodynamics!", "fluid_mechanics", "heat_transfer", "aerodynamics"),
  },
  {
    id: "aircraft_structures_engineer", name: "Aircraft Structures Engineer", branchId: "aerospace",
    description: "Analyses airframe components for strength, fatigue and damage tolerance.",
    difficulty: "Advanced", salary: "₹5–14 LPA", learningTime: "9–12 months", outlook: "Steady demand from aerostructure suppliers and MRO.",
    employers: ["Aerostructure suppliers", "Engineering services", "MRO organisations"],
    skills: s("aircraft_structures!", "strength_of_materials!", "cad_fea", "polymers_composites", "machine_design?"),
  },
];
