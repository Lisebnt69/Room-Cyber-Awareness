// Ajoute des blocs de contenu réalistes aux scénarios existants
// node server/add-blocks.js

import pool from './db.js'

const SCENARIOS_CONTENT = [
  {
    title_fr: 'Opération : Inbox Zero',
    blocks: [
      {
        type: 'text',
        content: "Vous êtes Sophie Bernard, comptable chez ACME Corp. Il est 9h15, vous venez d'arriver au bureau et vous ouvrez votre boîte mail. Parmi vos nouveaux messages, certains semblent urgents — mais sont-ils vraiment légitimes ?\n\nVotre mission : analyser les emails reçus et identifier les tentatives de phishing avant qu'il ne soit trop tard.",
      },
      {
        type: 'email',
        from: 'securite@bnp-paribas-alerte.com',
        subject: '⚠️ URGENT : Activité suspecte détectée sur votre compte',
        body: "Chère cliente,\n\nNous avons détecté une activité inhabituelle sur votre compte professionnel BNP Paribas. Pour votre sécurité, votre accès a été temporairement suspendu.\n\nPour réactiver votre compte, vous devez vérifier vos informations dans les 24 heures suivant la réception de ce message, faute de quoi votre compte sera définitivement bloqué.\n\nCordialement,\nL'équipe Sécurité BNP Paribas",
        linkText: '→ Réactiver mon compte maintenant',
        link: 'bnp-paribas-alerte.com/securite/reactiver',
      },
      {
        type: 'fakelink',
        label: 'bnp-paribas-alerte.com/securite/reactiver-compte',
        url: 'https://bnp-paribas-alerte.com/securite/reactiver',
        tooltip: "⚠ Domaine suspect : 'bnp-paribas-alerte.com' ≠ 'bnpparibas.com' — PHISHING CONFIRMÉ",
      },
      {
        type: 'quiz',
        questions: [
          {
            question: "Quel est le premier indice de phishing dans cet email ?",
            options: [
              { text: "Le ton urgent de l'email", correct: false },
              { text: "Le domaine 'bnp-paribas-alerte.com' n'est pas le domaine officiel", correct: true },
              { text: "La mise en page de l'email", correct: false },
              { text: "L'heure d'envoi du message", correct: false },
            ],
          },
          {
            question: "Face à un email vous demandant de réactiver votre compte en urgence, que faites-vous ?",
            options: [
              { text: "Cliquer sur le lien pour vérifier rapidement", correct: false },
              { text: "Appeler directement votre banque via le numéro officiel de son site", correct: true },
              { text: "Répondre à l'email pour confirmer votre identité", correct: false },
              { text: "Transférer à un collègue pour avis", correct: false },
            ],
          },
          {
            question: "Quel délai est souvent utilisé dans les emails de phishing pour créer une pression psychologique ?",
            options: [
              { text: "Une semaine", correct: false },
              { text: "Un mois", correct: false },
              { text: "24 à 48 heures", correct: true },
              { text: "Immédiatement", correct: false },
            ],
          },
        ],
      },
    ],
  },

  {
    title_fr: 'CEO Fraud',
    blocks: [
      {
        type: 'text',
        content: "Vous êtes Thomas Keller, responsable informatique chez ACME Corp. Il est 17h30 un vendredi soir. Vous recevez un email urgent de votre PDG Jean-Michel Durand — du moins c'est ce que vous croyez.\n\nLisez attentivement cet email et identifiez les signaux d'alarme avant d'agir.",
      },
      {
        type: 'email',
        from: 'jm.durand@acme-corp.com.mailpro.net',
        subject: 'Confidentiel — Virement urgent requis avant ce soir',
        body: "Thomas,\n\nJe suis actuellement en déplacement à Dubai pour finaliser une acquisition stratégique hautement confidentielle. J'ai besoin d'un virement urgent de 47 800 € vers notre partenaire local avant la clôture des marchés ce soir à 18h.\n\nC'est absolument confidentiel — n'en parlez à personne, pas même à vos collègues ni à la DAF. Notre avocat maître Garnier vous contactera dans les prochaines minutes avec les coordonnées bancaires exactes.\n\nJe compte sur votre discrétion et votre rapidité.\n\nJean-Michel Durand\nPDG, ACME Corp\n+33 6 XX XX XX XX",
        linkText: '',
        link: '',
      },
      {
        type: 'decision',
        question: "Que faites-vous face à cette demande urgente ?",
        options: [
          { text: "Effectuer le virement immédiatement — c'est le PDG et c'est urgent", correct: false, feedback: "Danger ! Ne jamais effectuer un virement sans vérification vocale avec l'expéditeur sur un numéro CONNU (pas celui fourni dans l'email). C'est la fraude au président." },
          { text: "Appeler le PDG sur son numéro de portable habituel (pas celui de l'email) pour confirmer", correct: true, feedback: "Excellent ! Toujours vérifier les demandes de virement par un contact direct via un canal sécurisé et connu — même si cela semble impoli ou prend du temps." },
          { text: "Demander à un collègue de la DAF de s'en occuper", correct: false, feedback: "Non. Transférer la responsabilité ne règle pas le problème. La fraude reste la fraude, et votre collègue sera aussi vulnérable que vous." },
          { text: "Répondre à l'email pour demander plus de détails", correct: false, feedback: "Insuffisant. Répondre à l'email vous met en contact avec les fraudeurs qui continueront à vous manipuler avec de nouveaux arguments convaincants." },
        ],
      },
      {
        type: 'quiz',
        questions: [
          {
            question: "Le domaine 'acme-corp.com.mailpro.net' — pourquoi est-il suspect ?",
            options: [
              { text: "Il contient un tiret", correct: false },
              { text: "Le vrai domaine 'acme-corp.com' est suivi d'autres sous-domaines trompeurs", correct: true },
              { text: "Il est trop long", correct: false },
              { text: "Il ne contient pas de chiffres", correct: false },
            ],
          },
          {
            question: "Quel est le signe le plus caractéristique d'une fraude au président ?",
            options: [
              { text: "L'email est bien rédigé et sans fautes", correct: false },
              { text: "Demande urgente + confidentialité + contournement des procédures normales", correct: true },
              { text: "La demande vient un vendredi soir", correct: false },
              { text: "Le montant demandé est élevé", correct: false },
            ],
          },
          {
            question: "Comment les entreprises se protègent-elles des virements frauduleux ?",
            options: [
              { text: "En refusant tous les virements internationaux", correct: false },
              { text: "En imposant une double validation vocale pour tout virement au-dessus d'un seuil défini", correct: true },
              { text: "En changeant de banque régulièrement", correct: false },
              { text: "En formant uniquement le PDG", correct: false },
            ],
          },
        ],
      },
    ],
  },

  {
    title_fr: 'USB Infectée',
    blocks: [
      {
        type: 'text',
        content: "Vous arrivez au parking de votre entreprise un mardi matin. Au sol, près des ascenseurs, vous trouvez une clé USB. Elle porte l'étiquette manuscrite :\n\n« SALAIRES 2026 — CONFIDENTIEL »\n\nVous regardez autour de vous — personne. La clé est là depuis peut-être toute la nuit.",
      },
      {
        type: 'decision',
        question: "Que faites-vous avec cette clé USB ?",
        options: [
          { text: "Je la branche sur mon PC professionnel pour voir ce qu'elle contient", correct: false, feedback: "Très dangereux ! Une clé USB abandonnée peut contenir des malwares (keylogger, ransomware, RAT) qui s'exécutent automatiquement à la connexion, même sans ouvrir de fichier." },
          { text: "Je la dépose au service informatique sans la brancher", correct: true, feedback: "Parfait ! Le service IT peut analyser la clé en toute sécurité dans un environnement isolé (sandbox). C'est la procédure correcte." },
          { text: "Je la jette à la poubelle pour que personne ne la trouve", correct: false, feedback: "Mieux que de la brancher, mais si elle contient des données d'entreprise perdues par un collègue, elle devrait être remise au service IT pour analyse." },
          { text: "Je la donne à un collègue pour qu'il vérifie depuis son PC", correct: false, feedback: "Non. Vous transférez juste le risque à votre collègue — la clé reste aussi dangereuse, voire plus si son PC a accès à plus de ressources réseau." },
        ],
      },
      {
        type: 'quiz',
        questions: [
          {
            question: "Pourquoi l'étiquette 'SALAIRES — CONFIDENTIEL' est-elle particulièrement efficace pour cette attaque ?",
            options: [
              { text: "Elle indique que c'est une vraie clé d'entreprise légitime", correct: false },
              { text: "Elle est conçue pour piquer la curiosité et inciter à brancher la clé (technique du baiting)", correct: true },
              { text: "Elle montre que la clé est chiffrée et donc sûre", correct: false },
              { text: "Elle n'a aucune importance dans l'attaque", correct: false },
            ],
          },
          {
            question: "Qu'est-ce qu'une attaque 'USB Baiting' ?",
            options: [
              { text: "Une attaque réseau via WiFi publics", correct: false },
              { text: "Abandonner intentionnellement des clés USB infectées pour que des employés les branchent", correct: true },
              { text: "Voler physiquement des clés USB dans les bureaux", correct: false },
              { text: "Copier des données d'entreprise sur une clé USB", correct: false },
            ],
          },
          {
            question: "Un malware sur clé USB peut-il s'exécuter sans que vous ouvriez explicitement un fichier ?",
            options: [
              { text: "Non, il faut toujours double-cliquer sur un fichier pour l'activer", correct: false },
              { text: "Oui, via l'autorun ou des exploits qui se déclenchent au simple branchement", correct: true },
              { text: "Seulement sous Windows XP et Vista", correct: false },
              { text: "Seulement si l'antivirus est désactivé manuellement", correct: false },
            ],
          },
        ],
      },
    ],
  },

  {
    title_fr: 'Ingénierie Sociale',
    blocks: [
      {
        type: 'text',
        content: "Vous êtes à la réception d'ACME Corp. Un homme bien habillé, l'air pressé, s'approche du badge reader. Il ne semble pas avoir de badge.\n\n— « Bonjour ! Je suis Martin Leblanc, consultant chez McKinsey. J'ai un meeting avec Mme Dupont dans 5 minutes et mon badge invité est en cours d'activation à l'accueil principal. Vous pouvez me laisser passer ? J'ai vraiment les mains prises avec tous ces documents. »\n\nIl tient effectivement une pile de dossiers et une mallette de présentation. Il sourit, semble pressé et professionnel.",
      },
      {
        type: 'decision',
        question: "Comment réagissez-vous ?",
        options: [
          { text: "Vous lui tenez la porte — il a l'air pressé et très professionnel", correct: false, feedback: "Attention ! C'est du tailgating et du pretexting combinés. Son apparence professionnelle et ses bras chargés sont justement conçus pour désarmer votre vigilance." },
          { text: "Vous demandez une pièce d'identité et appelez Mme Dupont pour confirmer le rendez-vous", correct: true, feedback: "Excellent ! Vérifier l'identité et confirmer avec l'hôte est la procédure correcte, même si cela peut sembler impoli. La sécurité prime sur le confort social." },
          { text: "Vous lui remettez un badge invité temporaire sans vérification d'identité", correct: false, feedback: "Non. Un badge invité sans vérification est une faille de sécurité physique majeure — il donne accès libre aux locaux." },
          { text: "Vous l'ignorez et continuez votre travail", correct: false, feedback: "Insuffisant. En tant qu'employé, vous avez la responsabilité de signaler les tentatives d'accès non autorisés à la sécurité ou à votre manager." },
        ],
      },
      {
        type: 'fakelink',
        label: "Résultats test sécurité McKinsey — cliquez pour voir votre évaluation personnelle",
        url: 'https://mckinsey-eval.weebly.com/resultats-securite',
        tooltip: "⚠ Domaine frauduleux : McKinsey.com ≠ mckinsey-eval.weebly.com — Tentative de phishing",
      },
      {
        type: 'quiz',
        questions: [
          {
            question: "Comment s'appelle la technique qui consiste à se faufiler derrière quelqu'un pour accéder à une zone sécurisée ?",
            options: [
              { text: "Phishing", correct: false },
              { text: "Tailgating (ou Piggybacking)", correct: true },
              { text: "Spoofing", correct: false },
              { text: "Sniffing", correct: false },
            ],
          },
          {
            question: "Pourquoi les attaquants utilisent-ils une mise en scène avec documents et mallette ?",
            options: [
              { text: "Pour paraître crédibles et légitimes, et réduire la méfiance", correct: true },
              { text: "C'est une exigence légale dans certaines entreprises", correct: false },
              { text: "Pour dissimuler un équipement d'espionnage", correct: false },
              { text: "Pour avoir les mains occupées et éviter de serrer des mains", correct: false },
            ],
          },
          {
            question: "Si vous vous sentez mal à l'aise de refuser l'accès à quelqu'un, quelle est la meilleure réaction ?",
            options: [
              { text: "Lui donner accès pour éviter le conflit", correct: false },
              { text: "Appeler un responsable ou la sécurité pour gérer la situation", correct: true },
              { text: "Laisser la personne entrer puis la surveiller discrètement", correct: false },
              { text: "Faire semblant de ne pas l'avoir remarqué", correct: false },
            ],
          },
        ],
      },
    ],
  },

  {
    title_fr: 'Partage Accidentel',
    blocks: [
      {
        type: 'text',
        content: "Vous venez de finaliser un rapport financier hautement confidentiel pour la direction d'ACME Corp. Le document contient les projections de fusion-acquisition pour les 18 prochains mois.\n\nVous souhaitez l'envoyer à votre directrice Marie Dupont (marie.dupont@acme-corp.com). Pressé(e), vous tapez 'marie' dans le champ destinataire et sélectionnez la première suggestion qui apparaît dans votre liste de contacts...",
      },
      {
        type: 'email',
        from: 'vous@acme-corp.com',
        subject: 'Rapport financier Q1 2026 — STRICTEMENT CONFIDENTIEL',
        body: "Bonjour Marie,\n\nVeuillez trouver ci-joint le rapport financier confidentiel Q1 2026 incluant les projections de fusion-acquisition pour les 18 prochains mois, les valorisations des cibles potentielles, et la stratégie de communication associée.\n\nCe document est strictement confidentiel et ne doit pas être partagé en dehors de la direction.\n\nCordialement",
        linkText: '📎 Rapport_Financier_Q1_2026_FA_CONFIDENTIEL.pdf (2,4 MB)',
        link: '',
      },
      {
        type: 'decision',
        question: "Vous venez d'envoyer l'email et réalisez immédiatement que vous l'avez envoyé à 'marie.dupont@gmail.com' (contact personnel) au lieu de 'marie.dupont@acme-corp.com'. Que faites-vous ?",
        options: [
          { text: "Rien — c'est peut-être son adresse personnelle correcte de toute façon", correct: false, feedback: "Non ! Tout document confidentiel envoyé en dehors du domaine de l'entreprise constitue une violation de données, peu importe le destinataire." },
          { text: "Signaler immédiatement l'incident à la DSI et à votre manager", correct: true, feedback: "Oui ! Signaler rapidement permet de déclencher la procédure de gestion des incidents : contacter Gmail pour suppression, notifier le DPO, évaluer l'impact RGPD." },
          { text: "Envoyer un second email à la bonne adresse en espérant que ça passe", correct: false, feedback: "Non. Envoyer à la bonne adresse ne supprime pas la violation déjà commise. L'incident DOIT être signalé selon le RGPD." },
          { text: "Appeler Marie par téléphone pour qu'elle supprime l'email de sa messagerie personnelle", correct: false, feedback: "Insuffisant seul. Vous devez aussi en informer la DSI — c'est une violation de données au sens du RGPD avec obligation de notification." },
        ],
      },
      {
        type: 'quiz',
        questions: [
          {
            question: "Selon le RGPD, dans quel délai une violation de données personnelles doit-elle être notifiée à la CNIL ?",
            options: [
              { text: "7 jours ouvrés", correct: false },
              { text: "72 heures après la découverte", correct: true },
              { text: "30 jours calendaires", correct: false },
              { text: "Aucun délai n'est imposé si le risque est faible", correct: false },
            ],
          },
          {
            question: "Comment éviter les envois accidentels d'emails confidentiels ?",
            options: [
              { text: "Toujours vérifier l'adresse email complète dans le champ 'À' avant d'envoyer", correct: true },
              { text: "N'utiliser que des contacts mémorisés manuellement", correct: false },
              { text: "Ne jamais envoyer de documents confidentiels par email — utiliser uniquement les serveurs internes", correct: false },
              { text: "Envoyer d'abord un email de test vide au destinataire", correct: false },
            ],
          },
          {
            question: "Quelle mesure technique peut prévenir les envois accidentels de données sensibles hors de l'entreprise ?",
            options: [
              { text: "Un antivirus à jour", correct: false },
              { text: "Un système DLP (Data Loss Prevention) qui bloque les envois de données sensibles hors domaine", correct: true },
              { text: "Un pare-feu réseau", correct: false },
              { text: "La double authentification (MFA)", correct: false },
            ],
          },
        ],
      },
    ],
  },
]

async function addBlocks() {
  const client = await pool.connect()
  try {
    console.log('📦 Ajout de blocs de contenu aux scénarios...\n')

    for (const sc of SCENARIOS_CONTENT) {
      // Find the scenario by title
      const { rows: [scenario] } = await client.query(
        'SELECT id, title_fr FROM scenarios WHERE title_fr = $1', [sc.title_fr]
      )
      if (!scenario) {
        console.log(`  ⚠ Scénario introuvable : "${sc.title_fr}" — ignoré`)
        continue
      }

      // Check if it already has blocks
      const { rows: existing } = await client.query(
        'SELECT COUNT(*) as n FROM scenario_blocks WHERE scenario_id = $1', [scenario.id]
      )
      if (Number(existing[0].n) > 0) {
        // Remove old blocks first (to allow re-running this script cleanly)
        await client.query('DELETE FROM scenario_blocks WHERE scenario_id = $1', [scenario.id])
        console.log(`  ↺ "${sc.title_fr}" — blocs existants remplacés`)
      }

      // Insert new blocks
      for (let i = 0; i < sc.blocks.length; i++) {
        const { type, ...rest } = sc.blocks[i]
        await client.query(
          'INSERT INTO scenario_blocks (scenario_id, type, position, data) VALUES ($1, $2, $3, $4)',
          [scenario.id, type, i, JSON.stringify(rest)]
        )
      }

      // Update scenario status to published
      await client.query(
        "UPDATE scenarios SET status = 'published' WHERE id = $1", [scenario.id]
      )

      console.log(`  ✓ "${sc.title_fr}" — ${sc.blocks.length} blocs ajoutés (id=${scenario.id})`)
    }

    console.log('\n✅ Contenu ajouté avec succès !')
    console.log('   Lancez "npm run server" puis "npm run dev" pour voir les changements.\n')
  } catch (e) {
    console.error('Erreur :', e.message)
  } finally {
    client.release()
    await pool.end()
  }
}

addBlocks()
