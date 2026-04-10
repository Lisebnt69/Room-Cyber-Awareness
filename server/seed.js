// Script de seed — à lancer UNE FOIS après initSchema
// node server/seed.js

import pool from './db.js'

async function seed() {
  const client = await pool.connect()
  try {
    console.log('🌱 Seeding database...')

    // Companies
    const { rows: existingCompanies } = await client.query('SELECT COUNT(*) as n FROM companies')
    if (Number(existingCompanies[0].n) === 0) {
      const companies = [
        ['ACME Corp','admin@acme.com','Business','Finance',161,142,6,200,'31/12/2025','active'],
        ['BNP Finance','security@bnp.fr','Enterprise','Finance',892,814,12,1000,'30/06/2025','active'],
        ['Mairie de Lyon','dsi@mairie-lyon.fr','Starter','Administration',24,18,3,25,'15/05/2025','expiring'],
        ['StartupTech SAS','cto@startuptech.io','Starter','Tech',12,8,2,25,'01/09/2025','active'],
        ['Groupe Renault','cybersec@renault.com','Enterprise','Industrie',2840,2100,18,3000,'31/03/2026','active'],
      ]
      for (const c of companies) {
        await client.query('INSERT INTO companies (name,email,plan,sector,users,active,scenarios,licenses,expire,status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', c)
      }
      console.log('  ✓ Companies')
    }

    // Departments
    const { rows: existingDepts } = await client.query('SELECT COUNT(*) as n FROM departments')
    if (Number(existingDepts[0].n) === 0) {
      const depts = [
        [1,'Finance'],[1,'Informatique'],[1,'Ressources Humaines'],[1,'Commercial'],[1,'Direction'],
        [2,'Risk & Compliance'],[2,'IT & Cybersécurité'],[2,'Front Office'],
        [3,'DSI'],[3,'Services Administratifs'],
        [4,'Engineering'],[4,'Product'],
        [5,'Cybersécurité'],[5,'Ingénierie'],[5,'Achats'],
      ]
      for (const [cid, name] of depts) {
        await client.query('INSERT INTO departments (company_id,name) VALUES ($1,$2)', [cid, name])
      }
      console.log('  ✓ Departments')
    }

    // Scenarios
    const { rows: existingScenarios } = await client.query('SELECT COUNT(*) as n FROM scenarios')
    if (Number(existingScenarios[0].n) === 0) {
      const SCENARIOS = [
        ['Opération : Inbox Zero','Operation: Inbox Zero','Phishing','intermediate','15','Simulation d\'attaque phishing avancée par email','published',3241,724],
        ['CEO Fraud','CEO Fraud','Phishing','advanced','20','Usurpation d\'identité du PDG pour virement frauduleux','published',1540,638],
        ['Alerte Bancaire','Banking Alert','Phishing','beginner','10','Fausse alerte de sécurité bancaire par email','published',2870,812],
        ['Faux Support IT','Fake IT Support','Phishing','intermediate','12','Email frauduleux d\'un faux technicien informatique','published',1120,695],
        ['Spear Phishing RH','HR Spear Phishing','Phishing','advanced','18','Attaque ciblée se faisant passer pour les RH','beta',780,589],
        ['Vishing Téléphonique','Phone Vishing','Phishing','beginner','8','Arnaque par appel téléphonique simulé','published',2130,841],
        ['Arnaque Colis','Parcel Scam','Phishing','beginner','8','SMS frauduleux sur la livraison d\'un colis','published',3450,863],
        ['Bureau Compromis','Compromised Desktop','Ransomware','advanced','20','Scénario de ransomware sur poste de travail','published',1892,612],
        ['LockBit Attack','LockBit Attack','Ransomware','advanced','25','Simulation d\'infection par le ransomware LockBit','published',654,541],
        ['Cryptolocker Hôpital','Hospital Cryptolocker','Ransomware','advanced','30','Ransomware ciblant un établissement de santé','beta',421,498],
        ['Double Extorsion','Double Extortion','Ransomware','intermediate','18','Chiffrement et exfiltration de données sensibles','published',530,573],
        ['Panne Backup','Backup Failure','Ransomware','intermediate','15','Gestion de crise après destruction des sauvegardes','draft',0,0],
        ['Ingénierie Sociale','Social Engineering','Social Eng.','beginner','10','Manipulation psychologique et pretexting','published',4102,831],
        ['Prétexting PDG','CEO Pretexting','Social Eng.','advanced','20','Scénario de prétexting complexe impliquant le PDG','published',890,602],
        ['Shoulder Surfing','Shoulder Surfing','Social Eng.','beginner','8','Espionnage visuel dans les espaces publics','published',1760,872],
        ['Tailgating Bureau','Office Tailgating','Social Eng.','intermediate','12','Intrusion physique par filature derrière un employé','published',1340,718],
        ['Manipulation Helpdesk','Helpdesk Manipulation','Social Eng.','intermediate','15','Manipulation du service d\'assistance pour obtenir un accès','draft',0,0],
        ['Fuite de Données','Data Breach','Insider','advanced','25','Détection d\'une exfiltration de données sensibles','beta',987,568],
        ['Employé Mécontent','Disgruntled Employee','Insider','advanced','22','Sabotage interne par un employé insatisfait','beta',430,511],
        ['Partage Accidentel','Accidental Share','Insider','beginner','10','Envoi involontaire de documents confidentiels','published',1890,803],
        ['Abus de Privilèges','Privilege Abuse','Insider','intermediate','15','Détection d\'un abus de droits d\'accès élevés','draft',0,0],
        ['WiFi Piégé','Rogue WiFi','Réseau','intermediate','12','Attaque par point d\'accès WiFi malveillant','draft',0,0],
        ['Attaque MITM','MITM Attack','Réseau','advanced','20','Interception de communications réseau en temps réel','beta',340,529],
        ['DNS Poisoning','DNS Poisoning','Réseau','advanced','18','Empoisonnement du cache DNS pour rediriger le trafic','draft',0,0],
        ['Scan de Ports','Port Scan Detection','Réseau','intermediate','15','Détection et réponse à une reconnaissance réseau','published',610,654],
        ['Fuite VPN','VPN Leak','Réseau','beginner','10','Identification d\'une fuite DNS sur connexion VPN','published',1230,756],
        ['Macro Excel Piégée','Malicious Excel Macro','Malware','intermediate','15','Exécution d\'un malware via une macro Office','published',2100,688],
        ['USB Infectée','Infected USB','Malware','beginner','10','Risque lié à une clé USB inconnue trouvée au sol','published',2780,844],
        ['Drive-by Download','Drive-by Download','Malware','intermediate','12','Infection silencieuse par navigation web','published',870,672],
        ['Rootkit Persistant','Persistent Rootkit','Malware','advanced','25','Détection d\'un rootkit dissimulé dans le système','draft',0,0],
        ['Reconnaissance LinkedIn','LinkedIn Reconnaissance','OSINT','intermediate','15','Collecte d\'informations sur les employés via LinkedIn','published',1460,712],
        ['Google Dorks','Google Dorks','OSINT','advanced','20','Exploitation de requêtes Google pour trouver des données exposées','beta',590,621],
      ]
      for (const s of SCENARIOS) {
        await client.query('INSERT INTO scenarios (title_fr,title_en,category,difficulty,duration,description,status,plays,score) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)', s)
      }

      // Visual scenarios with hotspots
      const VISUAL = [
        { vid:'vs1', fr:'Page de connexion suspecte', en:'Suspicious Login Page', cat:'Phishing', diff:'beginner', dur:'8', desc:'Identifiez les 5 indices de phishing sur cette page de connexion', plays:2310, score:418,
          hotspots:[{x:12,y:2.5,w:52,h:6,l:'Domaine frauduleux dans l\'URL'},{x:28,y:13,w:44,h:10,l:'Logo Microsoft non officiel'},{x:28,y:57,w:44,h:8,l:'Bouton pointe vers un faux domaine'},{x:5,y:2.5,w:7,h:6,l:'Cadenas brisé — HTTP'},{x:18,y:87,w:64,h:5.5,l:'Caractère cyrillique'}]},
        { vid:'vs2', fr:'Arnaque au PDG', en:'CEO Fraud', cat:'Social Eng.', diff:'intermediate', dur:'8', desc:'Email du PDG demandant un virement urgent — trouvez les 5 signaux d\'alarme', plays:1890, score:392,
          hotspots:[{x:5,y:11,w:65,h:6.5,l:'Domaine email légèrement modifié'},{x:5,y:18.5,w:72,h:5.5,l:'Adresse Reply-To suspecte'},{x:5,y:47,w:90,h:9,l:'Demande de virement urgent'},{x:5,y:57.5,w:90,h:6,l:'Contournement des procédures'},{x:5,y:64.5,w:90,h:5.5,l:'Demande de confidentialité'}]},
        { vid:'vs3', fr:'Poste de travail compromis', en:'Compromised Workstation', cat:'Malware', diff:'intermediate', dur:'10', desc:'Identifiez les 5 signes de compromission sur ce bureau Windows', plays:1540, score:371,
          hotspots:[{x:4,y:20,w:25,h:12,l:'Fichier double extension'},{x:4,y:34,w:21,h:11,l:'autorun.inf suspect'},{x:28,y:41,w:56,h:22,l:'Fausse alerte antivirus'},{x:33,y:87,w:30,h:7,l:'svchost32.exe illégitime'},{x:75,y:87,w:16,h:7,l:'Anomalie réseau'}]},
        { vid:'vs4', fr:'Facture frauduleuse', en:'Fraudulent Invoice', cat:'Insider', diff:'advanced', dur:'10', desc:'Trouvez les 5 anomalies sur cette facture avant de valider le paiement', plays:980, score:344,
          hotspots:[{x:3,y:4,w:22,h:13,l:'Logo flou et pixelisé'},{x:3,y:37,w:94,h:9,l:'Changement coordonnées bancaires'},{x:3,y:56,w:94,h:9,l:'IBAN suspect'},{x:52,y:16,w:44,h:8,l:'Délai de paiement anormal'},{x:3,y:75.5,w:65,h:6,l:'Email domaine .cc suspect'}]},
      ]
      for (const vs of VISUAL) {
        const { rows: [s] } = await client.query(
          'INSERT INTO scenarios (title_fr,title_en,category,difficulty,duration,description,status,plays,score,visual_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id',
          [vs.fr, vs.en, vs.cat, vs.diff, vs.dur, vs.desc, 'published', vs.plays, vs.score, vs.vid]
        )
        const { rows: [blk] } = await client.query(
          'INSERT INTO scenario_blocks (scenario_id,type,position,data) VALUES ($1,$2,$3,$4) RETURNING id',
          [s.id, 'photo', 0, JSON.stringify({ visual_id: vs.vid })]
        )
        for (const h of vs.hotspots) {
          await client.query(
            'INSERT INTO hotspots (block_id,x,y,w,h,label) VALUES ($1,$2,$3,$4,$5,$6)',
            [blk.id, h.x, h.y, h.w, h.h, h.l]
          )
        }
      }
      console.log('  ✓ Scenarios (32 + 4 visuels)')
    }

    // Assign all scenarios to all companies
    const { rows: [csCount] } = await client.query('SELECT COUNT(*) as n FROM company_scenarios')
    if (Number(csCount.n) === 0) {
      const { rows: sids } = await client.query('SELECT id FROM scenarios ORDER BY id')
      const { rows: cids } = await client.query('SELECT id FROM companies ORDER BY id')
      for (const { id: cid } of cids) {
        for (const { id: sid } of sids) {
          await client.query('INSERT INTO company_scenarios (company_id,scenario_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [cid, sid])
        }
      }
      console.log('  ✓ Company scenarios (tout assigné)')
    }

    // Players
    const { rows: [pCount] } = await client.query('SELECT COUNT(*) as n FROM players')
    if (Number(pCount.n) === 0) {
      const { rows: depts } = await client.query('SELECT id, company_id, name FROM departments ORDER BY id')
      const deptMap = {} // 'company_id:name' -> id
      for (const d of depts) deptMap[`${d.company_id}:${d.name}`] = d.id

      const PLAYERS = [
        [1, deptMap['1:Finance'],         'sophieb@acme-corp.com',  'Sophie Bernard', 920],
        [1, deptMap['1:Informatique'],     'thomask@acme-corp.com',  'Thomas Keller',  850],
        [1, deptMap['1:Ressources Humaines'], 'amelied@acme-corp.com','Amélie Durand',  710],
        [1, deptMap['1:Commercial'],       'marcl@acme-corp.com',    'Marc Lefebvre',  540],
        [1, deptMap['1:Direction'],        'juliem@acme-corp.com',   'Julie Martin',   880],
        [1, deptMap['1:Finance'],          'pierrer@acme-corp.com',  'Pierre Rousseau',630],
        [1, deptMap['1:Commercial'],       'nadiac@acme-corp.com',   'Nadia Chouaib',  490],
        [1, deptMap['1:Informatique'],     'antoinem@acme-corp.com', 'Antoine Moreau', 960],
        [2, deptMap['2:Risk & Compliance'],'claire.dupont@bnp.fr',   'Claire Dupont',  780],
        [2, deptMap['2:IT & Cybersécurité'],'kevin.lemaire@bnp.fr',  'Kevin Lemaire',  890],
        [2, deptMap['2:Front Office'],     'sabine.morin@bnp.fr',    'Sabine Morin',   620],
        [3, deptMap['3:DSI'],              'jean.faure@mairie-lyon.fr','Jean Faure',    710],
        [3, deptMap['3:Services Administratifs'],'sylvie.roux@mairie-lyon.fr','Sylvie Roux',580],
        [4, deptMap['4:Engineering'],      'alex@startuptech.io',    'Alex Chen',      830],
        [4, deptMap['4:Product'],          'lea@startuptech.io',     'Léa Bonnard',    750],
        [5, deptMap['5:Cybersécurité'],    'chloe.lambert@renault.com','Chloé Lambert', 910],
        [5, deptMap['5:Ingénierie'],       'eric.duval@renault.com', 'Eric Duval',     720],
        [5, deptMap['5:Achats'],           'pauline.roy@renault.com','Pauline Roy',    640],
      ]
      for (const [cid, did, email, name, score] of PLAYERS) {
        await client.query('INSERT INTO players (company_id,department_id,email,name,score) VALUES ($1,$2,$3,$4,$5)', [cid, did, email, name, score])
      }
      console.log('  ✓ Players')
    }

    // Department scenarios
    const { rows: [dsCount] } = await client.query('SELECT COUNT(*) as n FROM department_scenarios')
    if (Number(dsCount.n) === 0) {
      const { rows: depts } = await client.query('SELECT id, company_id, name FROM departments ORDER BY id')
      const deptMap = {}
      for (const d of depts) deptMap[`${d.company_id}:${d.name}`] = d.id

      const DS = [
        ['1:Finance',              [1,2,3,4,5,6,7,18,20]],
        ['1:Informatique',         [8,9,11,22,23,24,25,26,27,28,29,30,31,32]],
        ['1:Ressources Humaines',  [1,13,14,15,16,17,20]],
        ['1:Commercial',           [1,3,6,7,13,15,16]],
        ['1:Direction',            [2,8,9,10,14,18,19]],
        ['2:Risk & Compliance',    [1,2,3,5,18,19,20,21]],
        ['2:IT & Cybersécurité',   [8,9,23,24,25,27,30,31,32]],
        ['3:DSI',                  [1,8,13,22,25,26]],
        ['4:Engineering',          [22,23,24,25,27,29,30,31,32]],
        ['5:Cybersécurité',        [8,9,10,11,22,23,24,25,27,30]],
      ]
      for (const [key, sids] of DS) {
        const did = deptMap[key]
        if (!did) continue
        const { rows: dept } = await client.query('SELECT company_id FROM departments WHERE id=$1', [did])
        for (const sid of sids) {
          await client.query('INSERT INTO department_scenarios (department_id,scenario_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [did, sid])
        }
      }
      console.log('  ✓ Department scenarios')
    }

    // Player assignments
    const { rows: [paCount] } = await client.query('SELECT COUNT(*) as n FROM player_assignments')
    if (Number(paCount.n) === 0) {
      const { rows: players } = await client.query('SELECT * FROM players')
      for (const p of players) {
        if (!p.department_id) continue
        const { rows: deptScs } = await client.query('SELECT scenario_id FROM department_scenarios WHERE department_id=$1 LIMIT 3', [p.department_id])
        for (const ds of deptScs) {
          const status = Math.random() > 0.4 ? 'completed' : 'pending'
          const score = status === 'completed' ? Math.round(500 + Math.random() * 480) : null
          await client.query(
            'INSERT INTO player_assignments (company_id,player_id,player_email,player_name,department_id,scenario_id,status,score) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
            [p.company_id, p.id, p.email, p.name, p.department_id, ds.scenario_id, status, score]
          )
        }
      }
      console.log('  ✓ Player assignments')
    }

    console.log('\n✅ Seed terminé !')
  } finally {
    client.release()
    await pool.end()
  }
}

seed().catch(e => { console.error('❌ Seed error:', e.message); process.exit(1) })
