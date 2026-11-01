import { skill, sub } from "./dsl";

export const civilSkills = [
  skill("surveying", "Surveying", "Measuring and mapping land using levelling, traversing, total stations and GNSS.", { level: 1, deps: ["engineering_mathematics"], book: "B.C. Punmia — Surveying Vol. 1" }, [
    sub("levelling", "Levelling", "Determining relative heights of points.", [
      ["Benchmark", "Fixed reference point of known elevation used in levelling"],
      ["Back sight", "First staff reading taken after setting up the level, on a point of known elevation"],
      ["Reduced level", "Elevation of a point with respect to the chosen datum"],
    ]),
    sub("traversing", "Traversing & Theodolite", "Angle and distance measurement for control networks.", [
      ["Traverse", "Series of connected survey lines whose lengths and angles are measured"],
      ["Closing error", "Discrepancy between the computed and known end position of a closed traverse"],
      ["Bowditch rule", "Method distributing traverse closing error in proportion to line lengths"],
    ]),
    sub("modern_surveying", "Modern Surveying", "Total stations, GNSS and remote sensing.", [
      ["Total station", "Electronic instrument combining a theodolite with an electronic distance meter"],
      ["GNSS", "Satellite navigation systems such as GPS used to determine precise positions"],
      ["Contour", "Line joining points of equal elevation on a map"],
    ]),
  ]),

  skill("structural_analysis", "Structural Analysis", "Analysing determinate and indeterminate trusses, beams and frames.", { level: 2, deps: ["strength_of_materials"], book: "R.C. Hibbeler — Structural Analysis" }, [
    sub("determinate", "Determinate Structures", "Trusses, beams and influence lines.", [
      ["Statically determinate", "Structure whose reactions and internal forces can be found from equilibrium alone"],
      ["Method of joints", "Truss analysis applying equilibrium at each joint"],
      ["Influence line", "Graph of a response at one point as a unit load moves across the structure"],
    ]),
    sub("indeterminate", "Indeterminate Structures", "Force and displacement methods.", [
      ["Degree of indeterminacy", "Number of unknown forces beyond those solvable by equilibrium equations"],
      ["Moment distribution method", "Iterative method that balances joint moments using distribution and carry-over factors"],
      ["Slope-deflection method", "Displacement method expressing member end moments in terms of joint rotations"],
    ]),
    sub("matrix_methods", "Matrix Methods", "Computer-oriented structural analysis.", [
      ["Direct stiffness method", "Assembling member stiffness matrices into a global matrix to solve for displacements"],
      ["Flexibility method", "Force method that solves for redundant forces using compatibility of displacements"],
      ["Degree of kinematic indeterminacy", "Number of unknown joint displacements in a structure"],
    ]),
  ]),

  skill("concrete_design", "Reinforced Concrete Design", "Limit state design of RC beams, slabs, columns and footings.", { level: 3, deps: ["structural_analysis"], book: "S. Unnikrishna Pillai & Devdas Menon — Reinforced Concrete Design" }, [
    sub("concrete_materials", "Concrete Technology", "Concrete ingredients, mix design and properties.", [
      ["Water-cement ratio", "Ratio of water to cement by mass, the main factor controlling concrete strength"],
      ["Characteristic strength", "Strength below which not more than 5% of test results are expected to fall"],
      ["Curing", "Maintaining moisture and temperature so cement hydrates and concrete gains strength"],
      ["Slump test", "Field test measuring the workability of fresh concrete"],
    ]),
    sub("limit_state", "Limit State Design", "Design philosophy and safety factors.", [
      ["Limit state of collapse", "Condition where a structure or member fails by loss of strength or stability"],
      ["Limit state of serviceability", "Condition limiting deflection and cracking under service loads"],
      ["Partial safety factor", "Factor applied to loads or material strengths to account for uncertainty"],
    ]),
    sub("rc_members", "RC Beams, Slabs & Columns", "Designing members for flexure, shear and compression.", [
      ["Under-reinforced section", "Section where steel yields before concrete crushes, giving ductile failure"],
      ["Shear reinforcement", "Stirrups that resist diagonal tension cracking in beams"],
      ["One-way slab", "Slab supported on two opposite sides, or with long/short span ratio greater than 2"],
      ["Development length", "Embedment length a bar needs to transfer its force to the surrounding concrete"],
    ]),
  ]),

  skill("geotechnical_engineering", "Geotechnical Engineering", "Soil mechanics, foundations and slope stability.", { level: 3, deps: ["strength_of_materials", "fluid_mechanics"], book: "Braja M. Das — Principles of Geotechnical Engineering" }, [
    sub("soil_properties", "Soil Properties & Classification", "Index properties and classification systems.", [
      ["Void ratio", "Ratio of volume of voids to volume of solids in a soil"],
      ["Atterberg limits", "Water contents marking transitions between solid, plastic and liquid states of fine soils"],
      ["Plasticity index", "Difference between liquid limit and plastic limit"],
    ]),
    sub("permeability_consolidation", "Permeability & Consolidation", "Water flow through soil and settlement.", [
      ["Darcy's law", "Flow velocity through soil is proportional to hydraulic gradient"],
      ["Effective stress", "Total stress minus pore water pressure; it controls soil strength and deformation"],
      ["Consolidation", "Gradual volume decrease of saturated clay as pore water drains under load"],
    ]),
    sub("shear_strength", "Shear Strength", "Failure of soils under shear.", [
      ["Mohr-Coulomb criterion", "τ = c + σ′·tan φ, the shear strength of soil"],
      ["Angle of internal friction", "Parameter φ describing frictional resistance between soil particles"],
      ["Triaxial test", "Laboratory test that shears a cylindrical soil sample under controlled confining pressure"],
    ]),
    sub("foundations", "Foundations", "Shallow and deep foundation design.", [
      ["Bearing capacity", "Maximum pressure a soil can carry without shear failure"],
      ["Pile foundation", "Deep foundation transferring load through weak soil to stronger strata"],
      ["Differential settlement", "Unequal settlement of different parts of a structure"],
    ]),
  ]),

  skill("transportation_engineering", "Transportation Engineering", "Highway geometry, pavement design and traffic engineering.", { level: 3, deps: ["surveying", "geotechnical_engineering"], book: "Khanna & Justo — Highway Engineering" }, [
    sub("geometric_design", "Geometric Design", "Sight distance, curves and superelevation.", [
      ["Stopping sight distance", "Distance needed for a driver to perceive, react and stop before an obstacle"],
      ["Superelevation", "Banking of a road at a horizontal curve to counteract centrifugal force"],
      ["Transition curve", "Curve of gradually changing radius between a straight and a circular curve"],
    ]),
    sub("pavement_design", "Pavement Design", "Flexible and rigid pavements.", [
      ["Flexible pavement", "Layered bituminous pavement that distributes load by grain-to-grain contact"],
      ["Rigid pavement", "Concrete slab pavement that distributes load by flexural (slab) action"],
      ["CBR test", "California bearing ratio test used to evaluate subgrade strength"],
    ]),
    sub("traffic_engineering", "Traffic Engineering", "Traffic flow and signal design.", [
      ["Traffic flow equation", "q = k·v, flow equals density times speed"],
      ["Level of service", "Qualitative rating (A–F) of operating conditions on a road"],
      ["Webster's method", "Method for calculating optimum signal cycle length at an intersection"],
    ]),
  ]),

  skill("hydrology_water_resources", "Hydrology & Water Resources", "Rainfall-runoff, open channel flow and irrigation engineering.", { level: 3, deps: ["fluid_mechanics"], book: "K. Subramanya — Engineering Hydrology" }, [
    sub("hydrology", "Hydrology", "The hydrologic cycle and runoff estimation.", [
      ["Hydrograph", "Graph of river discharge against time at a location"],
      ["Unit hydrograph", "Direct runoff hydrograph from one unit of effective rainfall over a catchment"],
      ["Rational method", "Peak runoff Q = C·i·A for small catchments"],
    ]),
    sub("open_channel_flow", "Open Channel Flow", "Flow with a free surface.", [
      ["Manning's equation", "V = (1/n)·R^(2/3)·S^(1/2), uniform flow velocity in open channels"],
      ["Froude number", "Ratio of inertial to gravity forces; it separates subcritical from supercritical flow"],
      ["Hydraulic jump", "Abrupt rise in water surface when supercritical flow changes to subcritical"],
    ]),
    sub("irrigation", "Irrigation Engineering", "Water requirements of crops and canal design.", [
      ["Duty", "Area of land irrigated per unit discharge of water"],
      ["Evapotranspiration", "Combined water loss by evaporation from soil and transpiration from plants"],
      ["Lacey's regime theory", "Empirical theory for designing stable alluvial canals"],
    ]),
  ]),

  skill("construction_management", "Construction Management", "Planning, scheduling, estimating and managing construction projects.", { level: 4, deps: ["concrete_design"], book: "Chitkara — Construction Project Management" }, [
    sub("scheduling", "Project Scheduling", "CPM and PERT network planning.", [
      ["Critical path", "Longest path through a project network, which determines the minimum project duration"],
      ["Total float", "Time an activity can be delayed without delaying project completion"],
      ["PERT", "Scheduling technique using optimistic, most likely and pessimistic durations"],
    ]),
    sub("estimation", "Estimation & Costing", "Quantities and cost of works.", [
      ["Bill of quantities", "Itemised list of work quantities with rates used for tendering"],
      ["Rate analysis", "Breakdown of the cost of one unit of work into materials, labour and equipment"],
      ["Contingency", "Allowance added to an estimate for unforeseen costs"],
    ]),
    sub("contracts_quality", "Contracts, Quality & Safety", "Managing contracts and site practices.", [
      ["Lump-sum contract", "Contract where the contractor agrees to complete defined work for a fixed price"],
      ["Earned value", "Measure of work actually completed expressed in budgeted cost terms"],
      ["Quality assurance", "Planned activities that ensure a project will meet its requirements"],
    ]),
  ]),
];
