// PDF Generator Service — ROOMCA
// jsPDF + jspdf-autotable chargés en import dynamique (évite le DOMException au boot)

const RED    = [235, 40, 40]
const DARK   = [18, 18, 18]
const GRAY   = [120, 120, 120]
const WHITE  = [255, 255, 255]
const GREEN  = [34, 197, 94]
const AMBER  = [245, 158, 11]

// Lazy-load jsPDF + autoTable (évite l'initialisation DOM au boot)
let _jsPDFModule = null
async function loadJsPDF() {
  if (!_jsPDFModule) {
    const [{ jsPDF }, { default: autoTable }] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable'),
    ])
    _jsPDFModule = { jsPDF, autoTable }
  }
  return _jsPDFModule
}

// Load logo as base64 via fetch (avoids canvas taint issues)
async function getLogoBase64() {
  try {
    const res = await fetch('/assets/roomca-logo-dark.png')
    const blob = await res.blob()
    return await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror   = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

// ── Standard header (dark bar + logo + red underline)
async function drawHeader(doc, logo, title, subtitle = '') {
  const W = doc.internal.pageSize.getWidth()
  doc.setFillColor(...DARK)
  doc.rect(0, 0, W, 42, 'F')
  doc.setFillColor(...RED)
  doc.rect(0, 42, W, 3, 'F')

  if (logo) {
    try { doc.addImage(logo, 'PNG', 14, 8, 50, 26) } catch { /* ignore */ }
  }

  doc.setFontSize(13)
  doc.setTextColor(...WHITE)
  doc.setFont('helvetica', 'bold')
  doc.text(title, W - 14, 22, { align: 'right' })

  if (subtitle) {
    doc.setFontSize(8)
    doc.setTextColor(180, 180, 180)
    doc.setFont('helvetica', 'normal')
    doc.text(subtitle, W - 14, 33, { align: 'right' })
  }
}

// ── Standard footer
function drawFooter(doc, page, total) {
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  doc.setFillColor(...DARK)
  doc.rect(0, H - 16, W, 16, 'F')
  doc.setFontSize(7)
  doc.setTextColor(...GRAY)
  doc.setFont('helvetica', 'normal')
  doc.text('ROOMCA — Cybersecurity Awareness Platform © 2026 — Confidentiel', 14, H - 5)
  doc.text(`Page ${page} / ${total}`, W - 14, H - 5, { align: 'right' })
}

// ─────────────────────────────────────────────
// CERTIFICATE PDF  (A4 landscape)
// ─────────────────────────────────────────────
export async function generateCertificatePDF({ title, level, userName, score, date, issuer, certId }) {
  const { jsPDF } = await loadJsPDF()
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const logo = await getLogoBase64()

  // ── Background
  doc.setFillColor(14, 14, 14)
  doc.rect(0, 0, W, H, 'F')

  // ── Outer border (red)
  doc.setDrawColor(...RED)
  doc.setLineWidth(2)
  doc.roundedRect(10, 10, W - 20, H - 20, 4, 4)

  // ── Inner border (dark gray)
  doc.setDrawColor(60, 60, 60)
  doc.setLineWidth(0.4)
  doc.roundedRect(14, 14, W - 28, H - 28, 3, 3)

  // ── Corner dots
  const corners = [[10, 10], [W - 10, 10], [10, H - 10], [W - 10, H - 10]]
  doc.setFillColor(...RED)
  corners.forEach(([x, y]) => doc.circle(x, y, 3, 'F'))

  // ── Logo (top center)
  if (logo) {
    try { doc.addImage(logo, 'PNG', W / 2 - 28, 22, 56, 28) } catch { /* ignore */ }
  } else {
    doc.setFontSize(16); doc.setTextColor(...RED); doc.setFont('helvetica', 'bold')
    doc.text('ROOMCA', W / 2, 40, { align: 'center' })
  }

  // ── "CERTIFICAT DE COMPLÉTION"
  doc.setFontSize(9)
  doc.setTextColor(...GRAY)
  doc.setFont('helvetica', 'normal')
  doc.text('CERTIFICAT  DE  COMPLÉTION', W / 2, 62, { align: 'center' })

  // ── Red separator
  doc.setDrawColor(...RED)
  doc.setLineWidth(1)
  doc.line(W / 2 - 60, 66, W / 2 + 60, 66)

  // ── Recipient name
  doc.setFontSize(26)
  doc.setTextColor(...WHITE)
  doc.setFont('helvetica', 'bold')
  doc.text(userName || 'Employé ROOMCA', W / 2, 82, { align: 'center' })

  // ── Subtitle
  doc.setFontSize(9)
  doc.setTextColor(180, 180, 180)
  doc.setFont('helvetica', 'normal')
  doc.text('a complété avec succès le module de formation en cybersécurité', W / 2, 92, { align: 'center' })

  // ── Module title
  doc.setFontSize(18)
  doc.setTextColor(...RED)
  doc.setFont('helvetica', 'bold')
  doc.text(title, W / 2, 106, { align: 'center' })

  // ── Level badge
  doc.setFillColor(50, 10, 10)
  doc.roundedRect(W / 2 - 28, 110, 56, 10, 5, 5, 'F')
  doc.setFontSize(8)
  doc.setTextColor(...RED)
  doc.text(level.toUpperCase(), W / 2, 117, { align: 'center' })

  // ── Info grid
  const infoY = 134
  const cols = [
    { label: 'SCORE OBTENU', value: `${score}/100` },
    { label: "DATE D'ÉMISSION", value: date },
    { label: 'ÉMIS PAR', value: issuer },
  ]
  const colW = (W - 40) / cols.length

  cols.forEach(({ label, value }, i) => {
    const x = 20 + i * colW + colW / 2
    doc.setFontSize(7); doc.setTextColor(...GRAY); doc.setFont('helvetica', 'normal')
    doc.text(label, x, infoY, { align: 'center' })
    doc.setFontSize(12); doc.setTextColor(...WHITE); doc.setFont('helvetica', 'bold')
    doc.text(value, x, infoY + 8, { align: 'center' })
    if (i < cols.length - 1) {
      doc.setDrawColor(60, 60, 60); doc.setLineWidth(0.3)
      doc.line(20 + (i + 1) * colW, infoY - 4, 20 + (i + 1) * colW, infoY + 12)
    }
  })

  // ── Verification ID
  const verifId = `ROOMCA-${certId.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
  doc.setFontSize(7); doc.setTextColor(...GRAY); doc.setFont('helvetica', 'normal')
  doc.text(`ID de vérification : ${verifId}`, W / 2, H - 22, { align: 'center' })
  doc.text('roomca.io/verify', W / 2, H - 15, { align: 'center' })

  doc.save(`Certificat_ROOMCA_${title.replace(/\s+/g, '_')}.pdf`)
}

// ─────────────────────────────────────────────
// REPORT PDF  (A4 portrait)
// ─────────────────────────────────────────────
export async function generateReportPDF(template, data = {}) {
  const { jsPDF, autoTable } = await loadJsPDF()
  const logo = await getLogoBase64()
  const dateStr = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()

  // ── Helpers
  const sectionTitle = (text, y) => {
    doc.setFillColor(...RED)
    doc.rect(14, y, 4, 6, 'F')
    doc.setFontSize(12); doc.setTextColor(...DARK); doc.setFont('helvetica', 'bold')
    doc.text(text, 22, y + 5)
    return y + 12
  }

  const kvRow = (label, value, y, color = DARK) => {
    doc.setFontSize(9); doc.setTextColor(...GRAY); doc.setFont('helvetica', 'normal')
    doc.text(label, 14, y)
    doc.setTextColor(...color); doc.setFont('helvetica', 'bold')
    doc.text(String(value), 85, y)
    return y + 6
  }

  const statBox = (x, y, w, h, label, value, color = RED) => {
    doc.setFillColor(245, 245, 245)
    doc.roundedRect(x, y, w, h, 3, 3, 'F')
    doc.setFontSize(7); doc.setTextColor(...GRAY); doc.setFont('helvetica', 'normal')
    doc.text(label, x + w / 2, y + 5, { align: 'center' })
    doc.setFontSize(15); doc.setTextColor(...color); doc.setFont('helvetica', 'bold')
    doc.text(String(value), x + w / 2, y + 14, { align: 'center' })
  }

  // ── Page 1
  await drawHeader(doc, logo, template.name, `Généré le ${dateStr}`)
  drawFooter(doc, 1, 1)

  let y = 55

  // Meta info
  doc.setFontSize(9); doc.setTextColor(...GRAY); doc.setFont('helvetica', 'normal')
  doc.text(
    `Organisation : ${data.org || 'ROOMCA Corp'}   |   Période : ${data.period || 'Dernier mois'}   |   Auteur : Système ROOMCA`,
    14, y
  )
  y += 12

  y = sectionTitle('RÉSUMÉ EXÉCUTIF', y)

  // Global score badge
  doc.setFillColor(245, 245, 245)
  doc.circle(170, y + 14, 18, 'F')
  doc.setFontSize(20); doc.setTextColor(...RED); doc.setFont('helvetica', 'bold')
  doc.text('83', 170, y + 12, { align: 'center' })
  doc.setFontSize(7); doc.setTextColor(...GRAY); doc.setFont('helvetica', 'normal')
  doc.text('/100', 170, y + 18, { align: 'center' })
  doc.text('Score Global', 170, y + 24, { align: 'center' })

  y = kvRow('Employés formés', '147 / 156  (94%)', y, GREEN)
  y = kvRow('Taux de clic phishing', '8%  (−12 pts vs M−1)', y, GREEN)
  y = kvRow('Scénarios complétés', '312', y)
  y = kvRow('Score moyen équipe', '78 / 100', y)
  y = kvRow('Incidents signalés', '3', y)
  y = kvRow('Certifications obtenues', '12', y)
  y += 6

  // Compliance stat boxes
  statBox(14,  y, 42, 22, 'GDPR',       '87%', GREEN)
  statBox(60,  y, 42, 22, 'ISO 27001',  '81%', AMBER)
  statBox(106, y, 42, 22, 'NIS2',       '73%', AMBER)
  statBox(152, y, 42, 22, 'Completion', '94%', GREEN)
  y += 30

  y = sectionTitle('INDICATEURS DE RISQUE PAR DÉPARTEMENT', y)

  autoTable(doc, {
    startY: y,
    head: [['Département', 'Effectif', 'Score Moy.', 'Clics Phishing', 'Niveau Risque']],
    body: [
      ['Finance',   '28', '82/100', '3%',  'FAIBLE'],
      ['IT',        '15', '91/100', '1%',  'FAIBLE'],
      ['Ventes',    '34', '58/100', '18%', 'ÉLEVÉ'],
      ['RH',        '12', '74/100', '9%',  'MOYEN'],
      ['Marketing', '22', '67/100', '14%', 'MOYEN'],
      ['Direction', '8',  '88/100', '2%',  'FAIBLE'],
    ],
    styles:           { fontSize: 8, cellPadding: 3 },
    headStyles:       { fillColor: RED, textColor: WHITE, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    margin: { left: 14, right: 14 },
  })

  y = doc.lastAutoTable.finalY + 10

  // ── ROI section (template roi only)
  if (template.id === 'roi' && data.roi) {
    if (y > 220) { doc.addPage(); y = 55 }
    y = sectionTitle('ANALYSE ROI — RETOUR SUR INVESTISSEMENT', y)

    const roi = data.roi
    const fmt = n => Number(n).toLocaleString('fr-FR')

    statBox(14,  y, 55, 28, 'INVESTISSEMENT',   `€${fmt(roi.investment || 48000)}`,  GRAY)
    statBox(73,  y, 55, 28, 'ÉCONOMIES TOTALES', `€${fmt(roi.totalSavings || 375000)}`, GREEN)
    statBox(132, y, 55, 28, 'ROI NET',           `${roi.roi || '+681'}%`,               RED)
    y += 36

    y = kvRow('Incidents évités (estimés)',      `${roi.incidentsAvoided || 3}`, y)
    y = kvRow('Retour sur investissement',       `${roi.paybackMonths || 1.5} mois`, y)
    y = kvRow('Coût moyen par incident',         `€${fmt(roi.avgIncidentCost || 125000)}`, y)
    y = kvRow('Gain productivité',               `€${fmt(roi.productivitySavings || 18000)}`, y, GREEN)
    y = kvRow('Réduction prime assurance cyber', `€${fmt(roi.insuranceSavings || 12000)}`, y, GREEN)
    y = kvRow('Réduction risque amende',         `€${fmt(roi.complianceSavings || 30000)}`, y, GREEN)
    y += 4

    // Scenarios
    const scenarios = roi.scenarios || {
      pessimistic: { roi: '340.5', savings: 187500 },
      realistic:   { roi: '681.0', savings: 375000 },
      optimistic:  { roi: '1089.6', savings: 600000 },
    }
    y = sectionTitle('ANALYSE DE SCÉNARIOS', y)
    autoTable(doc, {
      startY: y,
      head: [['Scénario', 'ROI estimé', 'Économies totales']],
      body: [
        ['Pessimiste', `${scenarios.pessimistic.roi}%`, `€${fmt(scenarios.pessimistic.savings)}`],
        ['Réaliste',   `${scenarios.realistic.roi}%`,   `€${fmt(scenarios.realistic.savings)}`],
        ['Optimiste',  `${scenarios.optimistic.roi}%`,  `€${fmt(scenarios.optimistic.savings)}`],
      ],
      styles:     { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: RED, textColor: WHITE, fontStyle: 'bold' },
      margin: { left: 14, right: 14 },
    })
    y = doc.lastAutoTable.finalY + 10

    // Benchmark note
    doc.setFillColor(245, 230, 230)
    doc.roundedRect(14, y, W - 28, 14, 3, 3, 'F')
    doc.setFontSize(8); doc.setTextColor(...DARK); doc.setFont('helvetica', 'normal')
    doc.text(
      `Benchmark industrie : ROI moyen formation cybersécurité = 342% (Ponemon 2023). Votre estimation : ${roi.roi}%`,
      20, y + 9
    )
    y += 20
  }

  // ── Recommendations
  if (y > 230) { doc.addPage(); y = 55 }
  y = sectionTitle('RECOMMANDATIONS', y)

  const recs = data.recommendations || [
    'Renforcer la formation "Social Engineering" — département Ventes (score : 58%)',
    'Activer une campagne phishing mensuelle automatisée',
    'Planifier un audit ISO 27001 interne (score < 85%)',
    'Intégrer les 9 nouveaux arrivants sans formation dans le prochain cycle',
    'Mettre en place un programme de mentorat Ventes / Finance',
  ]
  recs.forEach((rec) => {
    doc.setFillColor(...RED)
    doc.circle(18, y - 1.5, 2, 'F')
    doc.setFontSize(9); doc.setTextColor(30, 30, 30); doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(rec, 160)
    doc.text(lines, 24, y)
    y += lines.length * 5 + 3
  })

  // ── Update all footers
  const total = doc.internal.getNumberOfPages()
  for (let p = 1; p <= total; p++) {
    doc.setPage(p)
    drawFooter(doc, p, total)
  }

  doc.save(`ROOMCA_${template.id}_report_${Date.now()}.pdf`)
}
