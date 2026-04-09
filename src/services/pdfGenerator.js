// PDF Generator Service — ROOMCA
// Uses jsPDF + jspdf-autotable for all PDF exports

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const RED = [235, 40, 40]
const DARK = [18, 18, 18]
const GRAY = [100, 100, 100]
const LIGHT_GRAY = [240, 240, 240]
const WHITE = [255, 255, 255]

// Load logo as base64 for embedding in PDF
async function getLogoBase64() {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => resolve(null)
    img.src = '/roomca-logo.png'
  })
}

// Draw standard header with logo + red bar
async function drawHeader(doc, logoBase64, title, subtitle = '') {
  const W = doc.internal.pageSize.getWidth()

  // Dark background bar
  doc.setFillColor(...DARK)
  doc.rect(0, 0, W, 42, 'F')

  // Red accent line
  doc.setFillColor(...RED)
  doc.rect(0, 42, W, 3, 'F')

  // Logo
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', 14, 8, 50, 26)
    } catch {
      doc.setFontSize(16)
      doc.setTextColor(...WHITE)
      doc.setFont('helvetica', 'bold')
      doc.text('ROOMCA', 14, 28)
    }
  } else {
    doc.setFontSize(16)
    doc.setTextColor(...WHITE)
    doc.setFont('helvetica', 'bold')
    doc.text('ROOMCA', 14, 28)
  }

  // Title (right side)
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

// Draw standard footer
function drawFooter(doc, pageNum, totalPages) {
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()

  doc.setFillColor(...DARK)
  doc.rect(0, H - 16, W, 16, 'F')

  doc.setFontSize(7)
  doc.setTextColor(...GRAY)
  doc.setFont('helvetica', 'normal')
  doc.text('ROOMCA — Cybersecurity Awareness Platform © 2026 — Confidentiel', 14, H - 5)
  doc.text(`Page ${pageNum} / ${totalPages}`, W - 14, H - 5, { align: 'right' })
}

// ─────────────────────────────────────────────
// CERTIFICATE PDF
// ─────────────────────────────────────────────
export async function generateCertificatePDF({ title, level, userName, score, date, issuer, certId }) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()   // 297
  const H = doc.internal.pageSize.getHeight()  // 210

  const logoBase64 = await getLogoBase64()

  // Background
  doc.setFillColor(14, 14, 14)
  doc.rect(0, 0, W, H, 'F')

  // Decorative border
  doc.setDrawColor(...RED)
  doc.setLineWidth(2)
  doc.rect(10, 10, W - 20, H - 20)
  doc.setDrawColor(60, 60, 60)
  doc.setLineWidth(0.5)
  doc.rect(13, 13, W - 26, H - 26)

  // Corner accents
  const corners = [[10, 10], [W - 10, 10], [10, H - 10], [W - 10, H - 10]]
  doc.setFillColor(...RED)
  corners.forEach(([x, y]) => doc.circle(x, y, 3, 'F'))

  // Logo top center
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', W / 2 - 28, 22, 56, 28)
    } catch {
      doc.setFontSize(14)
      doc.setTextColor(...RED)
      doc.setFont('helvetica', 'bold')
      doc.text('ROOMCA', W / 2, 42, { align: 'center' })
    }
  }

  // "CERTIFICAT DE COMPLÉTION"
  doc.setFontSize(9)
  doc.setTextColor(...GRAY)
  doc.setFont('helvetica', 'normal')
  doc.setCharSpace(3)
  doc.text('CERTIFICAT DE COMPLÉTION', W / 2, 60, { align: 'center' })
  doc.setCharSpace(0)

  // Red separator line
  doc.setDrawColor(...RED)
  doc.setLineWidth(1)
  doc.line(W / 2 - 60, 64, W / 2 + 60, 64)

  // Recipient name
  doc.setFontSize(28)
  doc.setTextColor(...WHITE)
  doc.setFont('helvetica', 'bold')
  doc.text(userName || 'Employé ROOMCA', W / 2, 80, { align: 'center' })

  // Description
  doc.setFontSize(9)
  doc.setTextColor(180, 180, 180)
  doc.setFont('helvetica', 'normal')
  doc.text('a complété avec succès le module de formation en cybersécurité', W / 2, 90, { align: 'center' })

  // Module title
  doc.setFontSize(18)
  doc.setTextColor(...RED)
  doc.setFont('helvetica', 'bold')
  doc.text(title, W / 2, 104, { align: 'center' })

  // Level badge
  doc.setFillColor(235, 40, 40, 0.15)
  doc.setFillColor(50, 10, 10)
  doc.roundedRect(W / 2 - 28, 108, 56, 10, 5, 5, 'F')
  doc.setFontSize(8)
  doc.setTextColor(...RED)
  doc.setFont('helvetica', 'bold')
  doc.text(level.toUpperCase(), W / 2, 115, { align: 'center' })

  // Bottom info grid
  const infoY = 132
  const cols = [
    { label: 'SCORE OBTENU', value: `${score}/100` },
    { label: 'DATE D\'ÉMISSION', value: date },
    { label: 'ÉMIS PAR', value: issuer }
  ]
  const colW = (W - 40) / cols.length

  cols.forEach(({ label, value }, i) => {
    const x = 20 + i * colW + colW / 2
    doc.setFontSize(7)
    doc.setTextColor(...GRAY)
    doc.setFont('helvetica', 'normal')
    doc.setCharSpace(1.5)
    doc.text(label, x, infoY, { align: 'center' })
    doc.setCharSpace(0)
    doc.setFontSize(13)
    doc.setTextColor(...WHITE)
    doc.setFont('helvetica', 'bold')
    doc.text(value, x, infoY + 8, { align: 'center' })

    // Divider between columns
    if (i < cols.length - 1) {
      doc.setDrawColor(60, 60, 60)
      doc.setLineWidth(0.5)
      doc.line(20 + (i + 1) * colW, infoY - 4, 20 + (i + 1) * colW, infoY + 12)
    }
  })

  // Verification ID
  const verifId = `ROOMCA-${certId.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
  doc.setFontSize(7)
  doc.setTextColor(...GRAY)
  doc.setFont('helvetica', 'normal')
  doc.text(`ID de vérification : ${verifId}`, W / 2, H - 22, { align: 'center' })
  doc.setFontSize(7)
  doc.text('roomca.io/verify', W / 2, H - 16, { align: 'center' })

  doc.save(`Certificat_ROOMCA_${title.replace(/\s+/g, '_')}.pdf`)
}

// ─────────────────────────────────────────────
// REPORT PDF
// ─────────────────────────────────────────────
export async function generateReportPDF(template, data = {}) {
  const logoBase64 = await getLogoBase64()
  const now = new Date()
  const dateStr = now.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  // We'll track pages for footer
  let pageCount = 1

  const addPage = () => {
    doc.addPage()
    pageCount++
    drawFooter(doc, pageCount, pageCount)
  }

  // ── Helper: section title
  const sectionTitle = (text, y) => {
    doc.setFillColor(...RED)
    doc.rect(14, y, 4, 6, 'F')
    doc.setFontSize(12)
    doc.setTextColor(...DARK)
    doc.setFont('helvetica', 'bold')
    doc.text(text, 22, y + 5)
    return y + 12
  }

  // ── Helper: key-value row
  const kvRow = (label, value, y, color = DARK) => {
    doc.setFontSize(9)
    doc.setTextColor(...GRAY)
    doc.setFont('helvetica', 'normal')
    doc.text(label, 14, y)
    doc.setTextColor(...color)
    doc.setFont('helvetica', 'bold')
    doc.text(String(value), 80, y)
    return y + 6
  }

  // ── Stat box
  const statBox = (x, y, w, h, label, value, color = RED) => {
    doc.setFillColor(245, 245, 245)
    doc.roundedRect(x, y, w, h, 3, 3, 'F')
    doc.setFontSize(7)
    doc.setTextColor(...GRAY)
    doc.setFont('helvetica', 'normal')
    doc.text(label, x + w / 2, y + 5, { align: 'center' })
    doc.setFontSize(16)
    doc.setTextColor(...color)
    doc.setFont('helvetica', 'bold')
    doc.text(String(value), x + w / 2, y + 14, { align: 'center' })
  }

  // ─── Page 1: Header + Résumé
  await drawHeader(doc, logoBase64, template.name, `Généré le ${dateStr}`)
  drawFooter(doc, 1, 1) // will update later

  let y = 55

  // Organization info
  doc.setFontSize(9)
  doc.setTextColor(...GRAY)
  doc.setFont('helvetica', 'normal')
  doc.text(`Organisation : ${data.org || 'ACME Corp'}   |   Période : ${data.period || 'Mars 2026'}   |   Auteur : ${data.author || 'Système ROOMCA'}`, 14, y)
  y += 12

  y = sectionTitle('RÉSUMÉ EXÉCUTIF', y)

  // Score global circle-ish
  doc.setFillColor(245, 245, 245)
  doc.circle(170, y + 14, 18, 'F')
  doc.setFillColor(...RED)
  doc.setFontSize(20)
  doc.setTextColor(...RED)
  doc.setFont('helvetica', 'bold')
  doc.text('83', 170, y + 12, { align: 'center' })
  doc.setFontSize(7)
  doc.setTextColor(...GRAY)
  doc.setFont('helvetica', 'normal')
  doc.text('/100', 170, y + 18, { align: 'center' })
  doc.text('Score Global', 170, y + 24, { align: 'center' })

  y = kvRow('Employés formés', '147 / 156 (94%)', y, [34, 197, 94])
  y = kvRow('Taux de clic phishing', '8%  (−12 pts vs M−1)', y, [34, 197, 94])
  y = kvRow('Scénarios complétés', '312', y)
  y = kvRow('Score moyen équipe', '78 / 100', y)
  y = kvRow('Incidents signalés', '3', y)
  y = kvRow('Certifications obtenues', '12', y)
  y += 6

  // Stat boxes row
  statBox(14, y, 42, 22, 'GDPR', '87%', [34, 197, 94])
  statBox(60, y, 42, 22, 'ISO 27001', '81%', [245, 158, 11])
  statBox(106, y, 42, 22, 'NIS2', '73%', [245, 158, 11])
  statBox(152, y, 42, 22, 'Completion', '94%', [34, 197, 94])
  y += 30

  y = sectionTitle('INDICATEURS DE RISQUE', y)

  autoTable(doc, {
    startY: y,
    head: [['Département', 'Employés', 'Score Moy.', 'Clics Phishing', 'Niveau Risque']],
    body: [
      ['Finance', '28', '82/100', '3%', 'FAIBLE'],
      ['IT', '15', '91/100', '1%', 'FAIBLE'],
      ['Ventes', '34', '58/100', '18%', 'ÉLEVÉ'],
      ['RH', '12', '74/100', '9%', 'MOYEN'],
      ['Marketing', '22', '67/100', '14%', 'MOYEN'],
      ['Direction', '8', '88/100', '2%', 'FAIBLE'],
    ],
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: RED, textColor: WHITE, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    columnStyles: {
      4: {
        fontStyle: 'bold',
        cellCallback: function(cell) {
          if (cell.text[0] === 'ÉLEVÉ') cell.styles.textColor = RED
          else if (cell.text[0] === 'MOYEN') cell.styles.textColor = [245, 158, 11]
          else cell.styles.textColor = [34, 197, 94]
        }
      }
    },
    margin: { left: 14, right: 14 },
  })

  y = doc.lastAutoTable.finalY + 10

  // ROI section (if roi template)
  if (template.id === 'roi') {
    if (y > 220) { addPage(); y = 55 }
    y = sectionTitle('ANALYSE ROI', y)
    const roi = data.roi || {}
    statBox(14, y, 55, 28, 'INVESTISSEMENT', `€${(roi.investment || 48000).toLocaleString('fr-FR')}`, GRAY)
    statBox(73, y, 55, 28, 'ÉCONOMIES GÉNÉRÉES', `€${(roi.savings || 375000).toLocaleString('fr-FR')}`, [34, 197, 94])
    statBox(132, y, 55, 28, 'ROI NET', `${roi.roi || '+681'}%`, RED)
    y += 36
    y = kvRow('Incidents évités (estimés)', String(roi.incidentsAvoided || 3), y)
    y = kvRow('Retour sur investissement (mois)', String(roi.paybackMonths || 1.5), y)
    y = kvRow('Coût moyen par incident', `€${(roi.avgIncidentCost || 125000).toLocaleString('fr-FR')}`, y)
    y = kvRow('Économies productivité', `€${(roi.productivitySavings || 18000).toLocaleString('fr-FR')}`, y)
    y = kvRow('Réduction prime assurance cyber', `€${(roi.insuranceSavings || 12000).toLocaleString('fr-FR')}`, y)
    y += 4
  }

  if (y > 220) { addPage(); y = 55 }
  y = sectionTitle('RECOMMANDATIONS', y)

  const recommendations = data.recommendations || [
    'Renforcer la formation "Social Engineering" — département Ventes (score : 58%)',
    'Activer une campagne phishing mensuelle automatisée',
    'Planifier un audit ISO 27001 interne (score sous le seuil 85%)',
    'Intégrer les 9 nouveaux arrivants sans formation dans le prochain cycle',
    'Mettre en place un programme de mentorat Ventes/Finance',
  ]

  recommendations.forEach((rec, i) => {
    doc.setFillColor(...RED)
    doc.circle(18, y - 1.5, 2, 'F')
    doc.setFontSize(9)
    doc.setTextColor(...DARK)
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(rec, 160)
    doc.text(lines, 24, y)
    y += lines.length * 5 + 3
  })

  // Update footer page count retroactively
  const totalP = doc.internal.getNumberOfPages()
  for (let p = 1; p <= totalP; p++) {
    doc.setPage(p)
    drawFooter(doc, p, totalP)
  }
  // Re-draw header on page 1 (footer overwrites nothing but let's be safe)
  doc.setPage(1)

  doc.save(`ROOMCA_${template.id}_report_${Date.now()}.pdf`)
}

// ─────────────────────────────────────────────
// ROI REPORT PDF (dedicated)
// ─────────────────────────────────────────────
export async function generateROIReportPDF(roiData) {
  await generateReportPDF(
    { id: 'roi', name: 'ROI Report — Retour sur Investissement' },
    { roi: roiData, org: roiData.org, period: roiData.period }
  )
}
