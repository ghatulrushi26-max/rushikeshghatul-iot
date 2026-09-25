/**
 * ==============================================================================
 * PROJECTS DATA SYSTEM
 * ==============================================================================
 * Easily add or edit projects below.
 * Each card will dynamically display:
 * - Project Image
 * - Title & Category
 * - Description
 * - Technologies Used (tags)
 * - My Contribution
 * - GitHub Link (shows "Coming Soon" if null or empty)
 * - Live Demo Link (shows "Coming Soon" if null or empty)
 * ==============================================================================
 */

const projectsData = [
  {
    id: "solar-pv-system",
    title: "Grid-Tied Solar PV System Design & Performance Analysis",
    category: "Renewable Energy",
    image: "assets/projects/solar-pv-system.svg",
    description: "Engineering design, sizing, and loss analysis for a rooftop grid-tied solar photovoltaic installation with net metering capabilities and shadow mitigation.",
    technologies: ["Solar PV Design", "PVsyst", "AutoCAD Electrical", "Inverter Sizing", "Net Metering"],
    contribution: "Calculated load requirements, determined optimal panel tilt and azimuth angles, sized solar inverter string capacity, and prepared single-line diagrams (SLDs).",
    githubUrl: null, // Set to repo URL e.g. "https://github.com/your-username/solar-pv-system"
    liveDemoUrl: null // Set to live URL or simulation link
  },
  {
    id: "virtual-power-plant",
    title: "Virtual Power Plant (VPP) Aggregation Model",
    category: "Power Systems",
    image: "assets/projects/virtual-power-plant.svg",
    description: "Conceptual modeling and dispatch strategy for aggregating distributed energy resources (DERs)—including solar PV, battery energy storage systems (BESS), and flexible loads—into a coordinated Virtual Power Plant.",
    technologies: ["Power Systems", "DER Aggregation", "Python", "BESS", "Smart Grid"],
    contribution: "Formulated scheduling constraints for battery storage during peak demand, integrated renewable forecasting metrics, and analyzed economic dispatch benefits.",
    githubUrl: null,
    liveDemoUrl: null
  },
  {
    id: "scada-industrial-automation",
    title: "PLC & SCADA Based Industrial Process Automation",
    category: "Industrial Automation",
    image: "assets/projects/scada-automation.svg",
    description: "Automated conveyor sorting and liquid tank level control system using Programmable Logic Controllers (PLC) paired with an interactive SCADA Human-Machine Interface (HMI).",
    technologies: ["PLC Ladder Logic", "SCADA HMI", "Sensors & Actuators", "Relay Logic", "Modbus"],
    contribution: "Developed ladder logic programs for automatic sequence control, configured alarm threshold tags in SCADA, and implemented emergency fail-safe interlocks.",
    githubUrl: null,
    liveDemoUrl: null
  },
  {
    id: "renewable-energy-microgrid",
    title: "Hybrid Renewable Energy Microgrid Simulation",
    category: "Renewable Energy",
    image: "assets/projects/renewable-energy.svg",
    description: "Simulation study of a hybrid microgrid combining solar PV generation, backup diesel generator, and battery bank to ensure uninterrupted power supply for critical industrial loads.",
    technologies: ["Microgrid", "Renewable Energy", "MATLAB / Simulation", "Power Flow", "Battery Storage"],
    contribution: "Modeled renewable generation curves against industrial 24-hour load profiles, evaluated power quality indices, and optimized fuel cost savings.",
    githubUrl: null,
    liveDemoUrl: null
  },
  {
    id: "academic-power-machines",
    title: "Induction Motor Protection & Speed Control Bench",
    category: "Academic Projects",
    image: "assets/projects/academic-electrical.svg",
    description: "Laboratory testing and protection scheme setup for a 3-phase squirrel cage induction motor featuring overcurrent, single-phasing, and under-voltage protection.",
    technologies: ["Electrical Machines", "Protection Relays", "VFD Drive", "Current Transformers", "Testing"],
    contribution: "Wired measurement instrumentation, calibrated bimetallic thermal overload relays, conducted no-load and blocked-rotor tests, and documented efficiency curves.",
    githubUrl: null,
    liveDemoUrl: null
  }
];

if (typeof window !== "undefined") {
  window.projectsData = projectsData;
}
