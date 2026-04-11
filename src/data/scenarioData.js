export const scenario = {
  id: 'inbox-zero',
  title: { fr: 'OPÉRATION : INBOX ZERO', en: 'OPERATION: INBOX ZERO' },
  difficulty: { fr: 'INTERMÉDIAIRE', en: 'INTERMEDIATE' },
  duration: '15 min',
  maxScore: 1000,
  coins: 50,
}

// French emails
export const emails = [
  {
    id: 'e1', from: 'Support IT <it-support@roomca-corp.com>', fromName: 'Support IT', fromDomain: 'roomca-corp.com',
    subject: 'Rapport T3 — Consolidation budgétaire',
    preview: 'Veuillez trouver ci-joint le rapport financier T3 pour votre examen...',
    body: "Bonjour Sophie,\n\nVeuillez trouver ci-joint le rapport financier T3. Faites-nous savoir si des ajustements sont nécessaires avant la réunion du conseil.\n\nCordialement,\nL'équipe Finance",
    time: '09:14', read: true, hasAttachment: true, attachmentName: 'Rapport_T3_2024.pdf', safe: true, clues: [],
  },
  {
    id: 'e2', from: 'Microsoft Account <security@microsofft.com>', fromName: 'Microsoft Account', fromDomain: 'microsofft.com',
    subject: 'URGENT : Votre compte Microsoft 365 sera suspendu',
    preview: 'Nous avons détecté une activité de connexion inhabituelle. Vérifiez votre compte immédiatement...',
    body: "Cher utilisateur,\n\nNous avons détecté une activité de connexion inhabituelle sur votre compte Microsoft 365.\n\nPour éviter la suspension, veuillez vérifier votre identité immédiatement en cliquant sur le lien ci-dessous :\n\nhttps://microsoft-account-verify.net/login?token=Xv92kJd8\n\nCe lien expire dans 24 heures.\n\nL'équipe de sécurité Microsoft",
    time: '11:32', read: false, hasAttachment: false, safe: false,
    suspiciousLink: 'https://microsoft-account-verify.net/login?token=Xv92kJd8',
    clues: [
      { id: 'c1', type: 'domain', label: 'Domaine expéditeur suspect', description: '"microsofft.com" — remarquez le double F. Ce n\'est PAS microsoft.com', points: 100 },
      { id: 'c2', type: 'link', label: 'Lien suspect détecté', description: 'Le lien pointe vers "microsoft-account-verify.net" — pas un domaine officiel Microsoft', points: 150 },
      { id: 'c3', type: 'urgency', label: "Tactique d'urgence", description: 'Le délai de "24 heures" crée une pression artificielle — tactique de phishing classique', points: 75 },
    ],
  },
  {
    id: 'e3', from: 'RH <hr@roomca-corp.com>', fromName: 'Équipe RH', fromDomain: 'roomca-corp.com',
    subject: 'Demande de congés approuvée ✓',
    preview: 'Votre demande de congés du 23 au 26 décembre a été approuvée...',
    body: "Bonjour Sophie,\n\nVotre demande de congés du 23 au 26 décembre a été approuvée.\n\nBonnes fêtes !\n\nLe service RH",
    time: '13:05', read: true, hasAttachment: false, safe: true, clues: [],
  },
  {
    id: 'e4', from: 'DHL Express <noreply@dhl-delivery-tracking.info>', fromName: 'DHL Express', fromDomain: 'dhl-delivery-tracking.info',
    subject: "Votre colis n'a pas pu être livré — Action requise",
    preview: 'Votre colis #FR928374 nécessite une action immédiate. Payez 1,99 € de frais de douane...',
    body: "Cher client,\n\nNous avons tenté de livrer votre colis #FR928374 mais n'avons pas pu finaliser la livraison.\n\nDes frais de douane de 1,99 € sont requis dans les 48 heures pour libérer votre colis.\n\nPayer maintenant : http://dhl-customs-pay.ru/FR928374\n\nService client DHL",
    time: '14:47', read: false, hasAttachment: false, safe: false,
    suspiciousLink: 'http://dhl-customs-pay.ru/FR928374',
    clues: [
      { id: 'c4', type: 'domain', label: 'Faux domaine DHL', description: 'Le vrai DHL utilise "@dhl.com". Ici on a "dhl-delivery-tracking.info" — un faux domaine.', points: 100 },
      { id: 'c5', type: 'link', label: 'Lien en .ru exposé', description: 'Le lien de paiement se termine en ".ru" (Russie). DHL n\'utiliserait jamais ça.', points: 150 },
      { id: 'c6', type: 'context', label: 'Aucune commande référencée', description: 'Aucune commande associée à cet employé. Le phishing par colis est très répandu.', points: 75 },
    ],
  },
  {
    id: 'e5', from: 'Slack <notifications@slack.com>', fromName: 'Slack', fromDomain: 'slack.com',
    subject: 'Nouveau message de Thomas dans #général',
    preview: "Thomas : Hey l'équipe, rappel rapide pour le standup de vendredi...",
    body: "Thomas K. a envoyé un message dans #général :\n\n\"Hey l'équipe, rappel rapide — le standup de vendredi est décalé à 10h30. À tout à l'heure !\"",
    time: '15:20', read: true, hasAttachment: false, safe: true, clues: [],
  },
]

// English emails
export const emailsEn = [
  {
    id: 'e1', from: 'IT Support <it-support@roomca-corp.com>', fromName: 'IT Support', fromDomain: 'roomca-corp.com',
    subject: 'Q3 Report — Budget Consolidation',
    preview: 'Please find attached the Q3 financial report for your review...',
    body: "Hi Sophie,\n\nPlease find attached the Q3 financial report. Let us know if any adjustments are needed before the board meeting.\n\nBest regards,\nThe Finance Team",
    time: '09:14', read: true, hasAttachment: true, attachmentName: 'Q3_Report_2024.pdf', safe: true, clues: [],
  },
  {
    id: 'e2', from: 'Microsoft Account <security@microsofft.com>', fromName: 'Microsoft Account', fromDomain: 'microsofft.com',
    subject: 'URGENT: Your Microsoft 365 account will be suspended',
    preview: 'We detected unusual sign-in activity. Verify your account immediately...',
    body: "Dear user,\n\nWe detected unusual sign-in activity on your Microsoft 365 account.\n\nTo avoid suspension, please verify your identity immediately by clicking the link below:\n\nhttps://microsoft-account-verify.net/login?token=Xv92kJd8\n\nThis link expires in 24 hours.\n\nThe Microsoft Security Team",
    time: '11:32', read: false, hasAttachment: false, safe: false,
    suspiciousLink: 'https://microsoft-account-verify.net/login?token=Xv92kJd8',
    clues: [
      { id: 'c1', type: 'domain', label: 'Suspicious sender domain', description: '"microsofft.com" — notice the double F. This is NOT microsoft.com', points: 100 },
      { id: 'c2', type: 'link', label: 'Suspicious link detected', description: 'The link points to "microsoft-account-verify.net" — not an official Microsoft domain', points: 150 },
      { id: 'c3', type: 'urgency', label: 'Urgency tactic', description: 'The "24 hours" deadline creates artificial pressure — a classic phishing tactic', points: 75 },
    ],
  },
  {
    id: 'e3', from: 'HR <hr@roomca-corp.com>', fromName: 'HR Team', fromDomain: 'roomca-corp.com',
    subject: 'Leave request approved ✓',
    preview: 'Your leave request for December 23-26 has been approved...',
    body: "Hi Sophie,\n\nYour leave request for December 23-26 has been approved.\n\nHappy holidays!\n\nHR Department",
    time: '13:05', read: true, hasAttachment: false, safe: true, clues: [],
  },
  {
    id: 'e4', from: 'DHL Express <noreply@dhl-delivery-tracking.info>', fromName: 'DHL Express', fromDomain: 'dhl-delivery-tracking.info',
    subject: 'Your parcel could not be delivered — Action required',
    preview: 'Your parcel #FR928374 requires immediate action. Pay €1.99 customs fee...',
    body: "Dear customer,\n\nWe attempted to deliver your parcel #FR928374 but were unable to complete the delivery.\n\nCustoms fees of €1.99 are required within 48 hours to release your parcel.\n\nPay now: http://dhl-customs-pay.ru/FR928374\n\nDHL Customer Service",
    time: '14:47', read: false, hasAttachment: false, safe: false,
    suspiciousLink: 'http://dhl-customs-pay.ru/FR928374',
    clues: [
      { id: 'c4', type: 'domain', label: 'Fake DHL domain', description: 'The real DHL uses "@dhl.com". Here we have "dhl-delivery-tracking.info" — a fake domain.', points: 100 },
      { id: 'c5', type: 'link', label: 'Link ending in .ru', description: 'The payment link ends in ".ru" (Russia). DHL would never use this.', points: 150 },
      { id: 'c6', type: 'context', label: 'No order reference found', description: 'No order associated with this employee. Parcel phishing is extremely widespread.', points: 75 },
    ],
  },
  {
    id: 'e5', from: 'Slack <notifications@slack.com>', fromName: 'Slack', fromDomain: 'slack.com',
    subject: 'New message from Thomas in #general',
    preview: "Thomas: Hey team, quick reminder for Friday's standup...",
    body: "Thomas K. sent a message in #general:\n\n\"Hey team, quick reminder — Friday's standup is moved to 10:30am. See you then!\"",
    time: '15:20', read: true, hasAttachment: false, safe: true, clues: [],
  },
]

export const logLines = [
  { time: '11:32:04', level: 'WARN', msg: "L'utilisateur sophieb@roomca-corp.com a reçu un e-mail externe de microsofft.com" },
  { time: '11:47:19', level: 'ALERT', msg: 'Événement de clic détecté : URL sortante microsofft.com → redirection externe' },
  { time: '11:47:21', level: 'CRITICAL', msg: "Soumission de formulaire d'identifiants détectée sur le site externe microsoft-account-verify.net" },
  { time: '11:47:22', level: 'CRITICAL', msg: "POST /api/auth — origine inconnue — possible exfiltration d'identifiants" },
  { time: '11:47:25', level: 'WARN', msg: 'Jeton de session invalidé pour sophieb@roomca-corp.com — réauthentification forcée' },
  { time: '12:03:41', level: 'INFO', msg: 'Tentative de connexion échouée x3 — sophieb@roomca-corp.com' },
  { time: '12:03:55', level: 'ALERT', msg: 'Verrouillage du compte déclenché — sophieb@roomca-corp.com' },
  { time: '14:47:08', level: 'WARN', msg: "L'utilisateur a reçu un 2ème e-mail externe de dhl-delivery-tracking.info" },
]

export const logLinesEn = [
  { time: '11:32:04', level: 'WARN', msg: 'User sophieb@roomca-corp.com received external email from microsofft.com' },
  { time: '11:47:19', level: 'ALERT', msg: 'Click event detected: outbound URL microsofft.com → external redirect' },
  { time: '11:47:21', level: 'CRITICAL', msg: 'Credential form submission detected on external site microsoft-account-verify.net' },
  { time: '11:47:22', level: 'CRITICAL', msg: 'POST /api/auth — unknown origin — possible credential exfiltration' },
  { time: '11:47:25', level: 'WARN', msg: 'Session token invalidated for sophieb@roomca-corp.com — forced re-authentication' },
  { time: '12:03:41', level: 'INFO', msg: 'Failed login attempt x3 — sophieb@roomca-corp.com' },
  { time: '12:03:55', level: 'ALERT', msg: 'Account lockout triggered — sophieb@roomca-corp.com' },
  { time: '14:47:08', level: 'WARN', msg: 'User received 2nd external email from dhl-delivery-tracking.info' },
]
