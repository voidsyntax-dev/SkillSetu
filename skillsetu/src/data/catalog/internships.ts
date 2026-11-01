import type { Internship } from "@/types";

// Sample listings (fictional companies) used to demonstrate skill-based matching.
type Req = [string, number];
function i(
  id: string, company: string, title: string, branchId: string, location: string,
  mode: Internship["mode"], stipend: string, duration: string, description: string, reqs: Req[],
): Internship {
  return {
    id, company, title, branchId, location, mode, stipend, duration, description,
    requirements: reqs.map(([skillId, minMastery]) => ({ skillId, minMastery })),
  };
}

export const internships: Internship[] = [
  i("int_refinery_process", "Konkan Refining Co.", "Process Engineering Intern", "chemical", "Mumbai", "On-site", "₹30,000/mo", "6 months",
    "Support the process team with heat and material balances, exchanger performance checks and debottlenecking studies.",
    [["material_energy_balances", 60], ["heat_transfer", 55], ["thermodynamics", 50]]),
  i("int_sim_aspen", "Vapourline Engineering", "Process Simulation Intern", "chemical", "Pune", "Hybrid", "₹25,000/mo", "3 months",
    "Build and validate flowsheet models for distillation trains and recommend energy-saving retrofits.",
    [["process_simulation", 55], ["thermodynamics", 60], ["mass_transfer", 50]]),
  i("int_hazop", "SafeOps Consulting", "Process Safety Analyst Intern", "chemical", "Vadodara", "On-site", "₹20,000/mo", "3 months",
    "Assist in HAZOP and LOPA workshops and prepare relief valve sizing calculations.",
    [["process_safety", 60], ["reaction_engineering", 45]]),
  i("int_chem_ml", "PlantMind AI", "Industrial Data Science Intern", "chemical", "Bengaluru", "Remote", "₹35,000/mo", "6 months",
    "Develop soft-sensor models that predict product quality from plant historian data.",
    [["python_programming", 60], ["machine_learning", 50], ["probability_statistics", 55]]),

  i("int_upstream_bio", "Helix Biologics", "Upstream Bioprocess Intern", "biotech", "Hyderabad", "On-site", "₹22,000/mo", "6 months",
    "Run fed-batch fermentations, monitor kLa and growth kinetics, and help scale up from 5 L to 200 L.",
    [["bioreactor_design", 60], ["microbiology", 55]]),
  i("int_dsp", "PureProtein Labs", "Downstream Processing Intern", "biotech", "Bengaluru", "On-site", "₹20,000/mo", "3 months",
    "Optimise chromatography and ultrafiltration steps for a monoclonal antibody purification train.",
    [["downstream_processing", 60], ["biochemistry", 50]]),
  i("int_bioinfo", "GenomeGrid", "Bioinformatics Intern", "biotech", "Remote", "Remote", "₹25,000/mo", "4 months",
    "Build RNA-seq pipelines and differential expression reports in Python.",
    [["bioinformatics", 55], ["python_programming", 55], ["molecular_biology", 45]]),

  i("int_mech_design", "Torque Motors", "Design Engineering Intern", "mechanical", "Chennai", "On-site", "₹18,000/mo", "6 months",
    "Model chassis brackets in CAD, run FEA checks and prepare manufacturing drawings.",
    [["machine_design", 55], ["cad_fea", 55], ["strength_of_materials", 55]]),
  i("int_hvac", "CoolCore Systems", "Thermal Engineering Intern", "mechanical", "Noida", "Hybrid", "₹20,000/mo", "3 months",
    "Size cooling equipment and analyse heat loads for a data-centre project.",
    [["heat_transfer", 55], ["applied_thermal", 50]]),
  i("int_robotics", "Kinetiq Robotics", "Robotics Intern", "mechanical", "Bengaluru", "On-site", "₹30,000/mo", "6 months",
    "Integrate motors, encoders and PID loops on a pick-and-place robot.",
    [["control_systems", 55], ["theory_of_machines", 50], ["embedded_systems", 45]]),

  i("int_structural", "Pillar Structural Consultants", "Structural Design Intern", "civil", "Delhi", "On-site", "₹15,000/mo", "3 months",
    "Analyse RC frames and design beams, slabs and footings for residential towers.",
    [["structural_analysis", 55], ["concrete_design", 55]]),
  i("int_geotech", "TerraFirm Geotech", "Geotechnical Intern", "civil", "Kolkata", "On-site", "₹15,000/mo", "2 months",
    "Assist with soil investigation reports and pile capacity calculations for a metro corridor.",
    [["geotechnical_engineering", 55], ["strength_of_materials", 45]]),

  i("int_grid", "BharatGrid Analytics", "Power Systems Intern", "electrical", "Gurugram", "Hybrid", "₹25,000/mo", "6 months",
    "Run load-flow and short-circuit studies for renewable plant grid connections.",
    [["power_systems", 60], ["electrical_machines", 50]]),
  i("int_ev", "VoltDrive EV", "Power Electronics Intern", "electrical", "Pune", "On-site", "₹30,000/mo", "6 months",
    "Test inverter prototypes and tune motor control firmware for two-wheeler drives.",
    [["power_electronics", 60], ["control_systems", 50], ["embedded_systems", 45]]),

  i("int_embedded", "Sensorly IoT", "Embedded Firmware Intern", "electronics", "Bengaluru", "Hybrid", "₹25,000/mo", "6 months",
    "Write low-power firmware and I2C/SPI drivers for environmental sensor nodes.",
    [["embedded_systems", 60], ["digital_electronics", 55], ["programming_fundamentals", 55]]),
  i("int_vlsi", "SiliconRiver Semiconductors", "RTL Design Intern", "electronics", "Hyderabad", "On-site", "₹40,000/mo", "6 months",
    "Write and verify Verilog modules and run synthesis and timing checks.",
    [["vlsi_design", 55], ["digital_electronics", 65]]),

  i("int_swe", "Cartwheel Commerce", "Software Engineering Intern", "computer", "Bengaluru", "Hybrid", "₹50,000/mo", "6 months",
    "Build backend services and APIs for a high-traffic e-commerce platform.",
    [["data_structures", 65], ["algorithms", 60], ["databases", 50]]),
  i("int_data", "InsightWorks", "Data Analyst Intern", "computer", "Remote", "Remote", "₹25,000/mo", "3 months",
    "Clean data, write SQL and build dashboards for marketing performance.",
    [["databases", 55], ["data_analytics", 55], ["probability_statistics", 50]]),
  i("int_ml", "Neuronest AI", "Machine Learning Intern", "computer", "Pune", "Remote", "₹45,000/mo", "6 months",
    "Train and evaluate models for document classification and ship them behind an API.",
    [["machine_learning", 60], ["python_programming", 60], ["probability_statistics", 55]]),
  i("int_web", "PixelForge Studio", "Full-Stack Intern", "computer", "Remote", "Remote", "₹20,000/mo", "3 months",
    "Build React front-ends and REST APIs for client projects.",
    [["web_development", 55], ["databases", 45]]),

  i("int_steel", "Eastern Alloys Ltd.", "Metallurgy Intern", "materials", "Jamshedpur", "On-site", "₹20,000/mo", "2 months",
    "Study heat-treatment cycles and microstructures in the plate mill quality lab.",
    [["physical_metallurgy", 55], ["materials_characterization", 45]]),
  i("int_corrosion", "Pipeline Integrity Services", "Corrosion Engineering Intern", "materials", "Ahmedabad", "On-site", "₹18,000/mo", "3 months",
    "Assess cathodic protection survey data for cross-country pipelines.",
    [["corrosion_engineering", 55], ["materials_science", 50]]),

  i("int_wwtp", "BlueStream Water", "Wastewater Treatment Intern", "environmental", "Chennai", "On-site", "₹15,000/mo", "3 months",
    "Monitor activated sludge performance and help design a nutrient removal upgrade.",
    [["water_wastewater_treatment", 55], ["environmental_chemistry", 50]]),
  i("int_esg", "GreenLedger Advisory", "Sustainability Analyst Intern", "environmental", "Mumbai", "Hybrid", "₹20,000/mo", "3 months",
    "Compute carbon footprints and draft life-cycle assessments for manufacturing clients.",
    [["environmental_impact_assessment", 55], ["data_analytics", 45]]),

  i("int_cfd", "SkyFoil Aero", "CFD Intern", "aerospace", "Bengaluru", "On-site", "₹25,000/mo", "6 months",
    "Run CFD simulations of UAV wings and validate them against wind-tunnel data.",
    [["aerodynamics", 60], ["fluid_mechanics", 55], ["numerical_methods", 50]]),
  i("int_rocket", "OrbitForge Space", "Propulsion Test Intern", "aerospace", "Hyderabad", "On-site", "₹30,000/mo", "6 months",
    "Support static-fire tests and analyse thrust and specific impulse data.",
    [["propulsion", 60], ["thermodynamics", 55]]),
];
