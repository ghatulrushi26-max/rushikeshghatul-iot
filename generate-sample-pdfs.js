const fs = require('fs');

function createSimplePdf(title, subtitle, lines, outputPath) {
  const content = [
    'BT',
    '/F1 20 Tf',
    '50 750 Td',
    '(' + title.replace(/[\(\)]/g, '') + ') Tj',
    '0 -30 Td',
    '/F1 12 Tf',
    '(' + subtitle.replace(/[\(\)]/g, '') + ') Tj',
    '0 -25 Td',
  ];
  for (const line of lines) {
    content.push('(' + line.replace(/[\(\)]/g, '') + ') Tj');
    content.push('0 -18 Td');
  }
  content.push('ET');
  const streamContent = content.join('\n');
  const streamLength = Buffer.byteLength(streamContent);

  const objects = [
    '%PDF-1.4',
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj',
    `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj'
  ];

  let xref = ['xref', '0 6', '0000000000 65535 f '];
  let offset = objects[0].length + 1;

  for (let i = 1; i < objects.length; i++) {
    xref.push(String(offset).padStart(10, '0') + ' 00000 n ');
    offset += Buffer.byteLength(objects[i]) + 1;
  }

  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${offset}\n%%EOF`;
  const pdfData = objects.join('\n') + '\n' + xref.join('\n') + '\n' + trailer;
  fs.writeFileSync(outputPath, pdfData);
}

// 1. Resume
createSimplePdf(
  'Rushikesh D. Ghatul - Resume',
  'Electrical Engineering Student | Aspiring Electrical Engineer',
  [
    'College: Government College of Engineering, Yavatmal',
    'Degree: B.Tech - Electrical Engineering (7th Semester)',
    'Career Focus: Power Systems, Industrial Automation, PLC, SCADA, Renewable Energy',
    'Internship Experience:',
    '  - MSEDCL (Maharashtra State Electricity Distribution Co. Ltd.)',
    '  - Substation Operation, Distribution Networks, Equipment Maintenance',
    '  - Shree Gajanan Electrical Works (Solar PV Installation)',
    '  - Om Sai Electrical Works, Jalna (Electrical Contracting)',
    'Skills: Power Systems, Machines, Control Systems, PLC, SCADA, Solar PV, Python, C++',
    'Industrial Visits: CSTPS Chandrapur, AURIC City Shendra, Samarth SSK Shahagad',
    '',
    '[PLACEHOLDER RESUME DOCUMENT]',
    'To update: replace assets/Rushikesh_D_Ghatul_Resume.pdf with your final PDF resume.'
  ],
  'assets/Rushikesh_D_Ghatul_Resume.pdf'
);

// 2. MSEDCL Certificate sample
createSimplePdf(
  'MSEDCL Internship Certificate',
  'Maharashtra State Electricity Distribution Co. Ltd.',
  [
    'This certifies completion of Industrial Internship Training.',
    'Candidate: Rushikesh D. Ghatul',
    'Institution: Government College of Engineering, Yavatmal',
    'Domain: Substation Operation, Power Distribution, Equipment Maintenance & Safety',
    'Status: Verified Industrial Training Document',
    '',
    '[SAMPLE CERTIFICATE PDF]',
    'Replace with official scanned PDF in assets/certificates/'
  ],
  'assets/certificates/msedcl-internship-sample.pdf'
);

// 3. CSTPS Chandrapur Visit Certificate sample
createSimplePdf(
  'Industrial Visit Certificate - CSTPS Chandrapur',
  'Chandrapur Super Thermal Power Station',
  [
    'Technical Study Tour & Field Exposure Program',
    'Participant: Rushikesh D. Ghatul',
    'Focus: Power Generation, Switchyard, Turbo-Generators & Protection Schemes',
    'Institution: Government College of Engineering, Yavatmal'
  ],
  'assets/certificates/industrial-visit-cstps.pdf'
);

// 4. PLC SCADA Training Certificate sample
createSimplePdf(
  'Certificate of Industrial Automation Training',
  'PLC and SCADA Systems Engineering',
  [
    'Participant: Rushikesh D. Ghatul',
    'Topics: Ladder Logic, Supervisory Control & Data Acquisition, I/O Wiring',
    'Duration: Technical Automation Workshop & Training Program',
    'Institution: Government College of Engineering, Yavatmal'
  ],
  'assets/certificates/plc-scada-sample.pdf'
);

// 5. Solar PV System Training sample
createSimplePdf(
  'Certificate of Solar PV Technology Training',
  'Renewable Energy & Solar Installation',
  [
    'Participant: Rushikesh D. Ghatul',
    'Topics: On-grid & Off-grid Solar Systems, Inverter Sizing, Net Metering',
    'Field Experience: Shree Gajanan Electrical Works, Yavatmal'
  ],
  'assets/certificates/solar-pv-sample.pdf'
);

console.log('Sample PDFs generated successfully!');
