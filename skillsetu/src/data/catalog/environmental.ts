import { skill, sub } from "./dsl";

export const environmentalSkills = [
  skill("environmental_chemistry", "Environmental Chemistry", "Chemistry of water, air and soil and the fate of pollutants.", { level: 1, category: "foundation", book: "Sawyer, McCarty & Parkin — Chemistry for Environmental Engineering and Science" }, [
    sub("water_chemistry", "Water Chemistry", "Key water quality parameters.", [
      ["pH", "Negative logarithm of hydrogen ion activity, indicating acidity or alkalinity"],
      ["Alkalinity", "Capacity of water to neutralise acid, mainly from bicarbonate and carbonate"],
      ["Hardness (water)", "Concentration of multivalent cations, chiefly calcium and magnesium"],
    ]),
    sub("oxygen_demand", "Oxygen Demand", "Measuring organic pollution.", [
      ["BOD", "Biochemical oxygen demand, oxygen used by microbes to degrade organics, usually over 5 days at 20 °C"],
      ["COD", "Chemical oxygen demand, oxygen equivalent of organics oxidised by a strong chemical oxidant"],
      ["Dissolved oxygen", "Concentration of oxygen gas dissolved in water, vital for aquatic life"],
    ]),
    sub("pollutant_fate", "Fate of Pollutants", "How contaminants move and transform.", [
      ["Bioaccumulation", "Build-up of a substance in an organism faster than it is removed"],
      ["Half-life (environmental)", "Time for half of a pollutant to degrade or be removed"],
      ["Partition coefficient", "Ratio of a chemical's concentration between two phases, such as octanol and water"],
    ]),
  ]),

  skill("water_wastewater_treatment", "Water & Wastewater Treatment", "Design of drinking water and sewage treatment processes.", { level: 3, deps: ["environmental_chemistry", "fluid_mechanics"], book: "Metcalf & Eddy — Wastewater Engineering: Treatment and Resource Recovery" }, [
    sub("water_treatment", "Drinking Water Treatment", "Making raw water safe to drink.", [
      ["Coagulation", "Adding chemicals such as alum to destabilise colloidal particles"],
      ["Flocculation", "Gentle mixing that grows small destabilised particles into settleable flocs"],
      ["Rapid sand filter", "Filter removing fine particles that are not settled, cleaned by backwashing"],
      ["Chlorine residual", "Chlorine remaining after disinfection that protects water in distribution"],
    ]),
    sub("primary_secondary", "Wastewater Treatment", "Primary and biological secondary treatment.", [
      ["Primary clarifier", "Settling tank that removes settleable solids from raw sewage"],
      ["Activated sludge process", "Aerated biological treatment using a recycled suspension of microorganisms"],
      ["Sludge volume index", "Volume occupied by one gram of settled sludge, indicating settleability"],
      ["F/M ratio", "Food-to-microorganism ratio, organic load per unit biomass in a reactor"],
    ]),
    sub("advanced_treatment", "Advanced Treatment & Reuse", "Nutrient removal and water reuse.", [
      ["Nitrification", "Biological oxidation of ammonia to nitrate"],
      ["Denitrification", "Anoxic biological reduction of nitrate to nitrogen gas"],
      ["Reverse osmosis", "Pressure-driven membrane process that removes dissolved salts"],
    ]),
  ]),

  skill("air_pollution_control", "Air Pollution & Control", "Sources, dispersion and control of air pollutants.", { level: 3, deps: ["environmental_chemistry", "particle_technology"], book: "de Nevers — Air Pollution Control Engineering" }, [
    sub("pollutants", "Air Pollutants", "Criteria pollutants and their effects.", [
      ["PM2.5", "Fine particulate matter with diameter of 2.5 µm or less that penetrates deep into the lungs"],
      ["Photochemical smog", "Secondary pollution formed when NOx and VOCs react in sunlight to form ozone"],
      ["Air quality index", "Single number summarising pollutant concentrations against health standards"],
    ]),
    sub("dispersion", "Atmospheric Dispersion", "How pollutants spread from sources.", [
      ["Gaussian plume model", "Model predicting downwind concentration from a continuous point source"],
      ["Atmospheric stability", "Tendency of the atmosphere to suppress or enhance vertical mixing"],
      ["Effective stack height", "Physical stack height plus plume rise"],
    ]),
    sub("control_devices", "Control Equipment", "Removing pollutants from gas streams.", [
      ["Electrostatic precipitator", "Device that charges particles and collects them on plates with an electric field"],
      ["Bag filter", "Fabric filter collecting dust as gas passes through cloth bags"],
      ["Wet scrubber", "Device removing gases or particles by contact with a liquid spray"],
      ["Selective catalytic reduction", "Process reducing NOx to nitrogen with ammonia over a catalyst"],
    ]),
  ]),

  skill("solid_waste_management", "Solid & Hazardous Waste Management", "Collection, processing and disposal of municipal and hazardous waste.", { level: 3, deps: ["environmental_chemistry"], book: "Tchobanoglous — Integrated Solid Waste Management" }, [
    sub("waste_hierarchy", "Waste Management Hierarchy", "Priorities for handling waste.", [
      ["Waste hierarchy", "Order of preference: reduce, reuse, recycle, recover, then dispose"],
      ["Extended producer responsibility", "Policy making producers responsible for their products after use"],
      ["Source segregation", "Separating waste into fractions where it is generated"],
    ]),
    sub("waste_processing", "Treatment & Disposal", "Composting, incineration and landfills.", [
      ["Sanitary landfill", "Engineered disposal site with liners and leachate and gas collection"],
      ["Leachate", "Contaminated liquid that drains through waste in a landfill"],
      ["Composting", "Aerobic biological decomposition of organic waste into humus-like material"],
      ["Waste-to-energy", "Recovering energy from waste by incineration or anaerobic digestion"],
    ]),
  ]),

  skill("environmental_impact_assessment", "Environmental Impact Assessment & Sustainability", "Assessing project impacts, life cycle analysis and environmental regulation.", { level: 4, deps: ["environmental_chemistry"], book: "Canter — Environmental Impact Assessment" }, [
    sub("eia_process", "EIA Process", "Steps in assessing project impacts.", [
      ["Screening", "Deciding whether a project needs a full environmental impact assessment"],
      ["Scoping", "Identifying the key issues and impacts an EIA should address"],
      ["Public hearing", "Consultation step where affected communities comment on a proposed project"],
    ]),
    sub("lca", "Life Cycle Assessment", "Cradle-to-grave environmental accounting.", [
      ["Life cycle assessment", "Evaluating environmental impacts across raw materials, production, use and disposal"],
      ["Functional unit", "Quantified reference performance against which LCA results are expressed"],
      ["Carbon footprint", "Total greenhouse gas emissions caused, expressed as CO₂-equivalent"],
    ]),
    sub("sustainability", "Sustainability & Regulation", "Frameworks for sustainable development.", [
      ["Circular economy", "Economic model that keeps materials in use and designs out waste"],
      ["Zero liquid discharge", "Treatment approach where no wastewater leaves the facility"],
      ["ISO 14001", "International standard for environmental management systems"],
    ]),
  ]),
];
