// Visual "Cherche et Trouve" scenarios
// Each hotspot has x/y/w/h as percentage (0-100) of the scene container
export const visualScenarios = [
  {
    id: 'vs1',
    title: { fr: 'PAGE DE CONNEXION SUSPECTE', en: 'SUSPICIOUS LOGIN PAGE' },
    subtitle: { fr: 'Analyse cette page web', en: 'Analyze this web page' },
    difficulty: { fr: 'DÉBUTANT', en: 'BEGINNER' },
    category: { fr: 'Phishing Web', en: 'Web Phishing' },
    duration: 480,
    maxScore: 500,
    coins: 30,
    scene: 'login',
    description: {
      fr: 'Un collègue vous a transféré cette page de connexion reçue par email. Quelque chose cloche. Identifiez les 5 indices qui prouvent qu\'il s\'agit d\'une tentative de phishing.',
      en: 'A colleague forwarded you this login page received by email. Something is off. Identify the 5 clues proving it\'s a phishing attempt.'
    },
    hotspots: [
      {
        id: 'vs1_h1', points: 100,
        label: { fr: 'Domaine frauduleux dans l\'URL', en: 'Fraudulent domain in URL' },
        description: {
          fr: '"micr0soft.com" utilise le chiffre zéro (0) à la place de la lettre "o". Vérifiez toujours l\'URL exacte avant de saisir vos identifiants.',
          en: '"micr0soft.com" uses the number zero (0) instead of the letter "o". Always verify the exact URL before entering credentials.'
        },
        x: 12, y: 2.5, w: 52, h: 6,
      },
      {
        id: 'vs1_h2', points: 75,
        label: { fr: 'Logo Microsoft non officiel', en: 'Unofficial Microsoft logo' },
        description: {
          fr: 'Le logo est flou et pixelisé — signe d\'une image copiée sans autorisation. Les vraies pages Microsoft utilisent des assets vectoriels nets.',
          en: 'The logo is blurry and pixelated — a sign of an unauthorized copied image. Real Microsoft pages use crisp vector assets.'
        },
        x: 28, y: 13, w: 44, h: 10,
      },
      {
        id: 'vs1_h3', points: 125,
        label: { fr: 'Bouton "Suivant" pointe vers un faux domaine', en: '"Next" button points to a fake domain' },
        description: {
          fr: 'En survolant le bouton, l\'URL de destination est "microsofft-auth.net" — jamais un domaine officiel Microsoft. Toujours inspecter la destination des boutons.',
          en: 'Hovering the button shows the destination URL is "microsofft-auth.net" — never an official Microsoft domain. Always inspect button destinations.'
        },
        x: 28, y: 57, w: 44, h: 8,
      },
      {
        id: 'vs1_h4', points: 75,
        label: { fr: 'Cadenas brisé — connexion non sécurisée', en: 'Broken padlock — unsecured connection' },
        description: {
          fr: 'Le cadenas barré indique que la connexion n\'est PAS chiffrée (HTTP). Microsoft utilise toujours HTTPS avec un certificat valide.',
          en: 'The crossed-out padlock means the connection is NOT encrypted (HTTP). Microsoft always uses HTTPS with a valid certificate.'
        },
        x: 5, y: 2.5, w: 7, h: 6,
      },
      {
        id: 'vs1_h5', points: 125,
        label: { fr: 'Caractère cyrillique dans le copyright', en: 'Cyrillic character in copyright' },
        description: {
          fr: '"Micrоsoft" utilise un "о" cyrillique (U+043E) à la place du "o" latin — technique IDN Homograph Attack. Invisible à l\'œil nu mais différent pour les DNS.',
          en: '"Micrоsoft" uses a Cyrillic "о" (U+043E) instead of the Latin "o" — an IDN Homograph Attack technique. Invisible to the eye but different for DNS.'
        },
        x: 18, y: 87, w: 64, h: 5.5,
      }
    ]
  },
  {
    id: 'vs2',
    title: { fr: 'ARNAQUE AU PDG', en: 'CEO FRAUD' },
    subtitle: { fr: 'Email entrant — Analyse requise', en: 'Incoming email — Analysis required' },
    difficulty: { fr: 'INTERMÉDIAIRE', en: 'INTERMEDIATE' },
    category: { fr: 'Ingénierie sociale', en: 'Social Engineering' },
    duration: 480,
    maxScore: 500,
    coins: 40,
    scene: 'ceo_email',
    description: {
      fr: 'Vous venez de recevoir cet email prétendument de votre PDG. Il demande un virement urgent. Trouvez les 5 signaux d\'alarme avant de prendre une décision.',
      en: 'You just received this email supposedly from your CEO requesting an urgent wire transfer. Find the 5 red flags before making a decision.'
    },
    hotspots: [
      {
        id: 'vs2_h1', points: 125,
        label: { fr: 'Domaine email légèrement modifié', en: 'Slightly modified email domain' },
        description: {
          fr: '"acme-corp.co" au lieu de "acme-corp.com". Ce type de typosquatting est la base de la fraude BEC (Business Email Compromise).',
          en: '"acme-corp.co" instead of "acme-corp.com". This type of typosquatting is the foundation of BEC (Business Email Compromise) fraud.'
        },
        x: 5, y: 11, w: 65, h: 6.5,
      },
      {
        id: 'vs2_h2', points: 100,
        label: { fr: 'Adresse Reply-To personnelle suspecte', en: 'Suspicious personal Reply-To address' },
        description: {
          fr: 'Le Reply-To est une adresse Gmail. Votre réponse partira vers un attaquant, pas vers le vrai PDG. Vérifiez toujours l\'adresse de réponse.',
          en: 'The Reply-To is a Gmail address. Your reply will go to an attacker, not the real CEO. Always check the reply address.'
        },
        x: 5, y: 18.5, w: 72, h: 5.5,
      },
      {
        id: 'vs2_h3', points: 100,
        label: { fr: 'Demande de virement urgent et inhabituel', en: 'Unusual urgent wire transfer request' },
        description: {
          fr: 'Un PDG légitime ne demande JAMAIS un virement urgent par email. Ce type de fraude coûte des milliards chaque année aux entreprises mondiales.',
          en: 'A legitimate CEO NEVER requests an urgent wire transfer by email. This type of fraud costs billions annually to global businesses.'
        },
        x: 5, y: 47, w: 90, h: 9,
      },
      {
        id: 'vs2_h4', points: 75,
        label: { fr: 'Contournement des procédures officielles', en: 'Bypassing official procedures' },
        description: {
          fr: '"Ne passez pas par les procédures habituelles" — cette demande désactive délibérément vos mécanismes de vérification. C\'est le cœur de la manipulation.',
          en: '"Don\'t go through usual procedures" — this request deliberately disables your verification mechanisms. This is the core of the manipulation.'
        },
        x: 5, y: 57.5, w: 90, h: 6,
      },
      {
        id: 'vs2_h5', points: 100,
        label: { fr: 'Demande de confidentialité absolue', en: 'Absolute confidentiality request' },
        description: {
          fr: '"N\'en parlez à personne" — empêche toute vérification avec des collègues. Technique d\'isolement classique de la fraude BEC.',
          en: '"Don\'t tell anyone" — prevents any verification with colleagues. Classic BEC fraud isolation technique.'
        },
        x: 5, y: 64.5, w: 90, h: 5.5,
      }
    ]
  },
  {
    id: 'vs3',
    title: { fr: 'POSTE DE TRAVAIL COMPROMIS', en: 'COMPROMISED WORKSTATION' },
    subtitle: { fr: 'Inspectez ce bureau Windows', en: 'Inspect this Windows desktop' },
    difficulty: { fr: 'INTERMÉDIAIRE', en: 'INTERMEDIATE' },
    category: { fr: 'Malware & Ransomware', en: 'Malware & Ransomware' },
    duration: 600,
    maxScore: 500,
    coins: 40,
    scene: 'desktop',
    description: {
      fr: 'L\'équipe IT vous a partagé une capture d\'écran du bureau d\'un employé qui se plaint de comportements suspects. Identifiez les 5 signes de compromission.',
      en: 'The IT team shared a screenshot of an employee\'s desktop reporting suspicious behavior. Identify the 5 signs of compromise.'
    },
    hotspots: [
      {
        id: 'vs3_h1', points: 125,
        label: { fr: 'Fichier avec double extension', en: 'File with double extension' },
        description: {
          fr: '"Rapport_Q3.xlsx.exe" — le vrai fichier est un exécutable (.exe) déguisé en Excel (.xlsx). Windows masque souvent les extensions, trompant les utilisateurs.',
          en: '"Rapport_Q3.xlsx.exe" — the real file is an executable (.exe) disguised as Excel (.xlsx). Windows often hides extensions, deceiving users.'
        },
        x: 4, y: 20, w: 25, h: 12,
      },
      {
        id: 'vs3_h2', points: 100,
        label: { fr: 'Fichier autorun.inf suspect', en: 'Suspicious autorun.inf file' },
        description: {
          fr: '"autorun.inf" est un fichier de démarrage automatique utilisé par les malwares pour se propager via clé USB et s\'exécuter sans intervention.',
          en: '"autorun.inf" is an auto-start file used by malware to spread via USB drives and execute without user intervention.'
        },
        x: 4, y: 34, w: 21, h: 11,
      },
      {
        id: 'vs3_h3', points: 75,
        label: { fr: 'Fausse alerte antivirus (Scareware)', en: 'Fake antivirus alert (Scareware)' },
        description: {
          fr: '"Defender Pro" n\'est pas Windows Defender officiel. Ce scareware pousse l\'utilisateur à cliquer, installant ainsi le vrai malware.',
          en: '"Defender Pro" is not official Windows Defender. This scareware pushes the user to click, thereby installing the real malware.'
        },
        x: 28, y: 41, w: 56, h: 22,
      },
      {
        id: 'vs3_h4', points: 100,
        label: { fr: 'Processus svchost32.exe illégitime', en: 'Illegitimate svchost32.exe process' },
        description: {
          fr: 'Le vrai processus Windows s\'appelle "svchost.exe" (sans "32"). "svchost32.exe" est un malware classique usurpant le nom d\'un processus système.',
          en: 'The real Windows process is called "svchost.exe" (without "32"). "svchost32.exe" is classic malware impersonating a system process name.'
        },
        x: 33, y: 87, w: 30, h: 7,
      },
      {
        id: 'vs3_h5', points: 100,
        label: { fr: 'Anomalie réseau — exfiltration potentielle', en: 'Network anomaly — potential exfiltration' },
        description: {
          fr: 'L\'icône réseau affiche un avertissement avec un trafic sortant élevé — signe possible d\'exfiltration de données ou de connexion C2 (Command & Control).',
          en: 'The network icon shows a warning with high outbound traffic — possible sign of data exfiltration or C2 (Command & Control) connection.'
        },
        x: 75, y: 87, w: 16, h: 7,
      }
    ]
  },
  {
    id: 'vs4',
    title: { fr: 'FACTURE FRAUDULEUSE', en: 'FRAUDULENT INVOICE' },
    subtitle: { fr: 'Document financier entrant', en: 'Incoming financial document' },
    difficulty: { fr: 'AVANCÉ', en: 'ADVANCED' },
    category: { fr: 'Fraude financière', en: 'Financial Fraud' },
    duration: 600,
    maxScore: 500,
    coins: 50,
    scene: 'invoice',
    description: {
      fr: 'Vous êtes comptable. Vous recevez cette facture d\'un fournisseur habituel avec de nouvelles coordonnées bancaires. Trouvez les 5 anomalies avant de valider le paiement.',
      en: 'You are an accountant. You receive this invoice from a regular supplier with new banking details. Find the 5 anomalies before approving payment.'
    },
    hotspots: [
      {
        id: 'vs4_h1', points: 75,
        label: { fr: 'Logo d\'entreprise flou et pixelisé', en: 'Blurry, pixelated company logo' },
        description: {
          fr: 'Le logo est visiblement pixelisé — copié en basse résolution depuis un site web. Les vraies factures utilisent des fichiers vectoriels de haute qualité.',
          en: 'The logo is visibly pixelated — copied in low resolution from a website. Real invoices use high-quality vector files.'
        },
        x: 3, y: 4, w: 22, h: 13,
      },
      {
        id: 'vs4_h2', points: 125,
        label: { fr: 'Notice de changement de coordonnées bancaires', en: 'Banking details change notice' },
        description: {
          fr: '"Mise à jour suite à une fusion bancaire" — les fraudeurs modifient l\'IBAN pour rediriger les paiements. Vérifiez TOUJOURS par téléphone via un numéro connu (pas celui de la facture).',
          en: '"Update following a bank merger" — fraudsters change the IBAN to redirect payments. ALWAYS verify by phone using a known number (not the one on the invoice).'
        },
        x: 3, y: 37, w: 94, h: 9,
      },
      {
        id: 'vs4_h3', points: 125,
        label: { fr: 'IBAN suspect ou inconnu', en: 'Suspicious or unknown IBAN' },
        description: {
          fr: 'Cet IBAN ne correspond pas aux coordonnées enregistrées dans votre système. Le changement d\'IBAN par email est la technique de fraude au virement la plus répandue.',
          en: 'This IBAN does not match the coordinates registered in your system. Changing IBAN via email is the most widespread wire fraud technique.'
        },
        x: 3, y: 56, w: 94, h: 9,
      },
      {
        id: 'vs4_h4', points: 100,
        label: { fr: 'Délai de paiement anormalement court', en: 'Abnormally short payment deadline' },
        description: {
          fr: 'Émise le 15/12, échéance le 16/12 — 24h pour valider un paiement de 12.450€. Cette pression artificielle vise à éviter les vérifications habituelles.',
          en: 'Issued 15/12, due 16/12 — 24h to approve a €12,450 payment. This artificial pressure aims to avoid the usual verification procedures.'
        },
        x: 52, y: 16, w: 44, h: 8,
      },
      {
        id: 'vs4_h5', points: 75,
        label: { fr: 'Email de contact avec domaine .cc suspect', en: 'Contact email with suspicious .cc domain' },
        description: {
          fr: '"comptabilite@acme-corp.cc" — ".cc" (Îles Cocos) est souvent utilisé pour des arnaques. L\'email légitime devrait être "@acme-corp.com".',
          en: '"comptabilite@acme-corp.cc" — ".cc" (Cocos Islands) is often used for scams. The legitimate email should be "@acme-corp.com".'
        },
        x: 3, y: 75.5, w: 65, h: 6,
      }
    ]
  }
]
