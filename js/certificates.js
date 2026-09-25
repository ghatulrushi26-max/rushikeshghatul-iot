/**
 * ==============================================================================
 * CERTIFICATES DATA SYSTEM
 * ==============================================================================
 * How to add a new certificate:
 * 1. Place your certificate file (PDF or image like JPG, PNG, WEBP) inside:
 *    assets/certificates/
 * 2. Optionally, place a thumbnail image in assets/certificates/ (or use the PDF directly)
 * 3. Add a new object to the list below following this format:
 *
 *    {
 *      id: "unique-id-here",
 *      title: "Certificate Title",
 *      organization: "Issuing Organization / College / Company",
 *      date: "Month Year (e.g. September 2026)",
 *      category: "Internship", // Valid categories: "Internship", "Achievement", "Workshop", "Course", "Training", "Participation", "Industrial Visit", "Other"
 *      file: "assets/certificates/your-certificate.pdf", // Path to PDF or image file
 *      image: "assets/certificates/your-preview-thumbnail.jpg", // Preview image (or leave same as file if image)
 *      description: "Brief description of what was achieved or learned."
 *    },
 *
 * The website will AUTOMATICALLY render the certificate card, category filtering,
 * preview modal, and download button without changing any HTML code!
 * ==============================================================================
 */

const certificatesData = [
  {
    id: "msedcl-internship-2026",
    title: "MSEDCL Industrial Internship Certificate",
    organization: "Maharashtra State Electricity Distribution Co. Ltd. (MSEDCL)",
    date: "September 2026",
    category: "Internship",
    file: "assets/certificates/msedcl-internship-sample.pdf",
    image: "assets/certificates/msedcl-cert-thumb.svg",
    description: "Hands-on industrial exposure in power distribution, substation operations, switchgear maintenance, and electrical utility safety practices."
  },
  {
    id: "industrial-automation-plc-scada",
    title: "PLC & SCADA Industrial Automation Training",
    organization: "Industrial Automation Systems Lab",
    date: "August 2026",
    category: "Training",
    file: "assets/certificates/plc-scada-sample.pdf",
    image: "assets/certificates/plc-cert-thumb.svg",
    description: "Intensive training on Programmable Logic Controllers (PLC), SCADA HMI design, ladder programming, and industrial sensors & actuators."
  },
  {
    id: "solar-pv-installation-course",
    title: "Solar PV System Design & Installation",
    organization: "Renewable Energy Technology Institute",
    date: "June 2026",
    category: "Course",
    file: "assets/certificates/solar-pv-sample.pdf",
    image: "assets/certificates/solar-cert-thumb.svg",
    description: "Comprehensive training in rooftop solar PV layout design, inverter selection, on-grid/off-grid systems, and net metering schemes."
  },
  {
    id: "cstps-industrial-visit",
    title: "CSTPS Chandrapur Industrial Visit Certificate",
    organization: "Chandrapur Super Thermal Power Station (CSTPS)",
    date: "March 2026",
    category: "Industrial Visit",
    file: "assets/certificates/industrial-visit-cstps.pdf",
    image: "assets/certificates/cstps-cert-thumb.svg",
    description: "Certified field visit studying 2920 MW thermal power generation cycles, boiler-turbine operations, high-voltage 400kV switchyards, and protection relays."
  },
  {
    id: "power-systems-workshop",
    title: "Modern Power Systems & Protection Workshop",
    organization: "Government College of Engineering, Yavatmal",
    date: "February 2026",
    category: "Workshop",
    file: "assets/certificates/sample-certificate.pdf",
    image: "assets/certificates/workshop-cert-thumb.svg",
    description: "Technical workshop focusing on digital distance relays, fault calculation, busbar protection, and smart grid automation."
  },
  {
    id: "tech-fest-competition-award",
    title: "State Level Technical Paper Presentation Award",
    organization: "Annual Engineering Technical Symposium",
    date: "January 2026",
    category: "Achievement",
    file: "assets/certificates/sample-certificate.pdf",
    image: "assets/certificates/achievement-cert-thumb.svg",
    description: "Awarded recognition for presenting technical research and design ideas in Renewable Energy and Virtual Power Plants."
  },
  {
    id: "electrical-safety-participation",
    title: "National Seminar on Electrical Safety & Standards",
    organization: "Central Electricity Authority / Industry Forum",
    date: "November 2025",
    category: "Participation",
    file: "assets/certificates/sample-certificate.pdf",
    image: "assets/certificates/workshop-cert-thumb.svg",
    description: "Active participation in national safety compliance, IEEE & IS standards, substation earthing, and arc flash safety protocols."
  },
  {
    id: "substation-visit-auric",
    title: "AURIC Smart Industrial City Field Tour",
    organization: "AURIC Smart City, Shendra MIDC",
    date: "October 2025",
    category: "Industrial Visit",
    file: "assets/certificates/sample-certificate.pdf",
    image: "assets/certificates/cstps-cert-thumb.svg",
    description: "Certified participation exploring smart industrial city infrastructure, underground distribution networks, and SCADA-enabled substations."
  }
];

// Attach to window object for global availability
if (typeof window !== "undefined") {
  window.certificatesData = certificatesData;
}
