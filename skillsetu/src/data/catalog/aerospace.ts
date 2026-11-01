import { skill, sub } from "./dsl";

export const aerospaceSkills = [
  skill("aerodynamics", "Aerodynamics", "Lift, drag, airfoils, wings and compressible flow.", { level: 2, deps: ["fluid_mechanics"], book: "John D. Anderson — Fundamentals of Aerodynamics" }, [
    sub("airfoils", "Airfoils & Lift", "How wings generate lift.", [
      ["Angle of attack", "Angle between the chord line of an airfoil and the oncoming flow"],
      ["Lift coefficient", "Dimensionless lift, L / (½ρV²S)"],
      ["Stall", "Sudden loss of lift when flow separates at high angle of attack"],
      ["Kutta condition", "Requirement that flow leaves a sharp trailing edge smoothly, fixing circulation"],
    ]),
    sub("drag", "Drag", "Sources of aerodynamic drag.", [
      ["Induced drag", "Drag caused by wingtip vortices as a by-product of generating lift"],
      ["Skin friction drag", "Drag from shear stress in the boundary layer on a surface"],
      ["Aspect ratio", "Wingspan squared divided by wing area; higher values reduce induced drag"],
    ]),
    sub("compressible_flow", "Compressible Flow", "High-speed aerodynamics.", [
      ["Mach number", "Ratio of flow speed to the local speed of sound"],
      ["Shock wave", "Thin region of abrupt pressure, density and temperature rise in supersonic flow"],
      ["Critical Mach number", "Free-stream Mach at which local flow first reaches sonic speed somewhere on the body"],
    ]),
  ]),

  skill("flight_mechanics", "Flight Mechanics", "Aircraft performance, stability and control.", { level: 3, deps: ["aerodynamics", "engineering_mechanics"], book: "Nelson — Flight Stability and Automatic Control" }, [
    sub("performance", "Aircraft Performance", "Range, endurance, climb and take-off.", [
      ["Breguet range equation", "Relates aircraft range to L/D, propulsion efficiency and fuel fraction"],
      ["Rate of climb", "Excess power divided by aircraft weight"],
      ["Wing loading", "Aircraft weight divided by wing area"],
    ]),
    sub("stability", "Stability & Control", "Static and dynamic stability.", [
      ["Static longitudinal stability", "Tendency of an aircraft to return to trim pitch after a disturbance"],
      ["Neutral point", "Centre of gravity location at which the aircraft is neutrally stable in pitch"],
      ["Static margin", "Distance between centre of gravity and neutral point as a fraction of chord"],
      ["Phugoid mode", "Long-period longitudinal oscillation exchanging altitude and airspeed"],
    ]),
  ]),

  skill("propulsion", "Aerospace Propulsion", "Jet engines, rockets and their thermodynamic performance.", { level: 3, deps: ["thermodynamics", "aerodynamics"], book: "Hill & Peterson — Mechanics and Thermodynamics of Propulsion" }, [
    sub("jet_engines", "Gas Turbine Engines", "Turbojets, turbofans and turboprops.", [
      ["Turbofan", "Jet engine whose fan drives a large bypass airflow around the core"],
      ["Bypass ratio", "Ratio of air mass flow through the bypass duct to that through the core"],
      ["Thrust specific fuel consumption", "Fuel mass flow per unit thrust, a measure of engine efficiency"],
    ]),
    sub("rockets", "Rocket Propulsion", "Chemical rockets and the rocket equation.", [
      ["Specific impulse", "Thrust per unit weight flow of propellant, measured in seconds"],
      ["Tsiolkovsky rocket equation", "Δv = I_sp·g₀·ln(m₀/m_f), relating velocity change to mass ratio"],
      ["Converging-diverging nozzle", "Nozzle that accelerates exhaust to supersonic speed after a sonic throat"],
    ]),
  ]),

  skill("aircraft_structures", "Aircraft Structures", "Thin-walled structures, loads and lightweight design.", { level: 3, deps: ["strength_of_materials"], book: "T.H.G. Megson — Aircraft Structures for Engineering Students" }, [
    sub("thin_walled", "Thin-walled Structures", "Analysing skins, spars and stringers.", [
      ["Shear flow", "Shear force per unit length along the wall of a thin-walled section"],
      ["Shear centre", "Point through which a load must act to cause bending without twisting"],
      ["Monocoque", "Structure in which the outer skin carries most of the load"],
    ]),
    sub("loads_fatigue", "Flight Loads & Damage Tolerance", "Designing for safe service life.", [
      ["V-n diagram", "Flight envelope showing allowable load factor versus airspeed"],
      ["Load factor", "Ratio of lift to aircraft weight, measured in g"],
      ["Damage tolerance", "Design philosophy ensuring cracks are found before they become critical"],
    ]),
  ]),
];
