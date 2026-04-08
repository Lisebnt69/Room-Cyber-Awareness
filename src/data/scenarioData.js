export const scenario = {
  id: 'inbox-zero',
  title: 'OPÉRATION : INBOX ZERO',
  subtitle: 'Une alerte de violation a été déclenchée. Enquêtez avant qu\'il ne soit trop tard.',
  difficulty: 'INTERMÉDIAIRE',
  duration: '15 min',
  maxScore: 1000,
  coins: 50,
}

export const emails = [
  {
    id: 'e1', from: 'Support IT <it-support@acme-corp.com>', fromName: 'Support IT', fromDomain: 'acme-corp.com',
    subject: 'Rapport T3 — Consolidation budgétaire',
    preview: 'Veuillez trouver ci-joint le rapport financier T3 pour votre examen...',
    body: 'Bonjour Sophie,\n\nVeuillez trouver ci-joint le rapport financier T3. Faites-nous savoir si des ajustements sont nécessaires avant la réunion du conseil.\n\nCordialement,\nL\'équipe Finance',
    time: '09:14', read: true, hasAttachment: true, attachmentName: 'Rapport_T3_2024.pdf', safe: true, clues: [],
  },
  {
    id: 'e2', from: 'Microsoft Account <security@microsofft.com>', fromName: 'Microsoft Account', fromDomain: 'microsofft.com',
    subject: 'URGENT : Votre compte Microsoft 365 sera suspendu',
    preview: 'Nous avons détecté une activité de connexion inhabituelle. Vérifiez votre compte immédiatement...',
    body: 'Cher utilisateur,\n\nNous avons détecté une activité de connexion inhabituelle sur votre compte Microsoft 365.\n\nPour éviter la suspension, veuillez vérifier votre identité immédiatement en cliquant sur le lien ci-dessous :\n\nhttps://microsoft-account-verify.net/login?token=Xv92kJd8\n\nCe lien expire dans 24 heures.\n\nL\'équipe de sécurité Microsoft',
    time: '11:32', read: false, hasAttachment: false, safe: false,
    clues: [
      { id: 'c1', type: 'domain', label: 'Domaine expéditeur suspect', description: '"microsofft.com" — remarquez le double F. Ce n\'est PAS microsoft.com', points: 100 },
      { id: 'c2', type: 'link', label: 'Lien suspect détecté', description: 'Le lien pointe vers "microsoft-account-verify.net" — pas un domaine officiel Microsoft', points: 150 },
      { id: 'c3', type: 'urgency', label: 'Tactique d\'urgence', description: 'Le délai de "24 heures" crée une pression artificielle — tactique de phishing classique', points: 75 },
    ],
    suspiciousLink: 'https://microsoft-account-verify.net/login?token=Xv92kJd8',
  },
  {
    id: 'e3', from: 'RH <hr@acme-corp.com>', fromName: 'Équipe RH', fromDomain: 'acme-corp.com',
    subject: 'Demande de congés approuvée ✓',
    preview: 'Votre demande de congés du 23 au 26 décembre a été approuvée...',
    body: 'Bonjour Sophie,\n\nVotre demande de congés du 23 au 26 décembre a été approuvée.\n\nBonnes fêtes !\n\nLe service RH',
    time: '13:05', read: true, hasAttachment: false, safe: true, clues: [],
  },
  {
    id: 'e4', from: 'DHL Express <noreply@dhl-delivery-tracking.info>', fromName: 'DHL Express', fromDomain: 'dhl-delivery-tracking.info',
    subject: 'Votre colis n\'a pas pu être livré — Action requise',
    preview: 'Votre colis #FR928374 nécessite une action immédiate. Payez 1,99 € de frais de douane...',
    body: 'Cher client,\n\nNous avons tenté de livrer votre colis #FR928374 mais n\'avons pas pu finaliser la livraison.\n\nDes frais de douane de 1,99 € sont requis dans les 48 heures pour libérer votre colis.\n\nPayer maintenant : http://dhl-customs-pay.ru/FR928374\n\nService client DHL',
    time: '14:47', read: false, hasAttachment: false, safe: false,
    clues: [
      { id: 'c4', type: 'domain', label: 'Faux domaine DHL', description: 'Le vrai DHL utilise "@dhl.com". Ici on a "dhl-delivery-tracking.info" — un faux domaine.', points: 100 },
      { id: 'c5', type: 'link', label: 'Lien en .ru exposé', description: 'Le lien de paiement se termine en ".ru" (Russie). DHL n\'utiliserait jamais ça.', points: 150 },
      { id: 'c6', type: 'context', label: 'Aucune commande référencée', description: 'Aucune commande associée à cet employé. Le phishing par colis est très répandu.', points: 75 },
    ],
    suspiciousLink: 'http://dhl-customs-pay.ru/FR928374',
  },
  {
    id: 'e5', from: 'Slack <notifications@slack.com>', fromName: 'Slack', fromDomain: 'slack.com',
    subject: 'Nouveau message de Thomas dans #général',
    preview: 'Thomas : Hey l\'équipe, rappel rapide pour le standup de vendredi...',
    body: 'Thomas K. a envoyé un message dans #général :\n\n"Hey l\'équipe, rappel rapide — le standup de vendredi est décalé à 10h30. À tout à l\'heure !"',
    time: '15:20', read: true, hasAttachment: false, safe: true, clues: [],
  },
]

export const logLines = [
  { time: '11:32:04', level: 'WARN', msg: 'L\'utilisateur sophieb@acme-corp.com a reçu un e-mail externe de microsofft.com' },
  { time: '11:47:19', level: 'ALERT', msg: 'Événement de clic détecté : URL sortante microsofft.com → redirection externe' },
  { time: '11:47:21', level: 'CRITICAL', msg: 'Soumission de formulaire d\'identifiants détectée sur le site externe microsoft-account-verify.net' },
  { time: '11:47:22', level: 'CRITICAL', msg: 'POST /api/auth — origine inconnue — possible exfiltration d\'identifiants' },
  { time: '11:47:25', level: 'WARN', msg: 'Jeton de session invalidé pour sophieb@acme-corp.com — réauthentification forcée' },
  { time: '12:03:41', level: 'INFO', msg: 'Tentative de connexion échouée x3 — sophieb@acme-corp.com' },
  { time: '12:03:55', level: 'ALERT', msg: 'Verrouillage du compte déclenché — sophieb@acme-corp.com' },
  { time: '14:47:08', level: 'WARN', msg: 'L\'utilisateur a reçu un 2ème e-mail externe de dhl-delivery-tracking.info' },
]
