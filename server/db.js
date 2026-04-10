import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const db = new DatabaseSync(join(__dirname, 'roomca.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    plan TEXT DEFAULT 'Starter',
    sector TEXT,
    users INTEGER DEFAULT 0,
    active INTEGER DEFAULT 0,
    scenarios INTEGER DEFAULT 0,
    licenses INTEGER DEFAULT 25,
    expire TEXT,
    status TEXT DEFAULT 'active'
  );

  CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    license INTEGER DEFAULT 1,
    score REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS scenarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_fr TEXT NOT NULL,
    title_en TEXT,
    category TEXT DEFAULT 'Phishing',
    difficulty TEXT DEFAULT 'intermediate',
    duration TEXT DEFAULT '15',
    description TEXT,
    status TEXT DEFAULT 'draft',
    plays INTEGER DEFAULT 0,
    score REAL DEFAULT 0,
    visual_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS scenario_blocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scenario_id INTEGER NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    data TEXT DEFAULT '{}'
  );

  CREATE TABLE IF NOT EXISTS hotspots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    block_id INTEGER NOT NULL REFERENCES scenario_blocks(id) ON DELETE CASCADE,
    x REAL DEFAULT 50,
    y REAL DEFAULT 50,
    w REAL DEFAULT 10,
    h REAL DEFAULT 10,
    label TEXT DEFAULT 'Zone',
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS company_scenarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    scenario_id INTEGER NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, scenario_id)
  );

  CREATE TABLE IF NOT EXISTS department_scenarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    scenario_id INTEGER NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(department_id, scenario_id)
  );

  CREATE TABLE IF NOT EXISTS player_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    player_email TEXT,
    player_name TEXT,
    department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
    scenario_id INTEGER NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    score REAL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME
  );
`)

// ─── SEED ──────────────────────────────────────────────────────────────────────

const companyCount = db.prepare('SELECT COUNT(*) as n FROM companies').get().n
if (companyCount === 0) {
  const ic = db.prepare('INSERT INTO companies (name,email,plan,sector,users,active,scenarios,licenses,expire,status) VALUES (?,?,?,?,?,?,?,?,?,?)')
  ic.run('ACME Corp','admin@acme.com','Business','Finance',161,142,6,200,'31/12/2025','active')
  ic.run('BNP Finance','security@bnp.fr','Enterprise','Finance',892,814,12,1000,'30/06/2025','active')
  ic.run('Mairie de Lyon','dsi@mairie-lyon.fr','Starter','Administration',24,18,3,25,'15/05/2025','expiring')
  ic.run('StartupTech SAS','cto@startuptech.io','Starter','Tech',12,8,2,25,'01/09/2025','active')
  ic.run('Groupe Renault','cybersec@renault.com','Enterprise','Industrie',2840,2100,18,3000,'31/03/2026','active')
}

const deptCount = db.prepare('SELECT COUNT(*) as n FROM departments').get().n
if (deptCount === 0) {
  const id = db.prepare('INSERT INTO departments (company_id, name) VALUES (?, ?)')
  // ACME Corp (1)
  id.run(1,'Finance'); id.run(1,'Informatique'); id.run(1,'Ressources Humaines')
  id.run(1,'Commercial'); id.run(1,'Direction')
  // BNP Finance (2)
  id.run(2,'Risk & Compliance'); id.run(2,'IT & Cybersécurité'); id.run(2,'Front Office')
  // Mairie de Lyon (3)
  id.run(3,'DSI'); id.run(3,'Services Administratifs')
  // StartupTech (4)
  id.run(4,'Engineering'); id.run(4,'Product')
  // Renault (5)
  id.run(5,'Cybersécurité'); id.run(5,'Ingénierie'); id.run(5,'Achats')
}

const playerCount = db.prepare('SELECT COUNT(*) as n FROM players').get().n
if (playerCount === 0) {
  const ip = db.prepare('INSERT INTO players (company_id,department_id,email,name,status,license,score) VALUES (?,?,?,?,?,?,?)')
  // ACME Corp dept IDs: Finance=1, IT=2, RH=3, Commercial=4, Direction=5
  ip.run(1,1,'sophieb@acme-corp.com','Sophie Bernard','active',1,920)
  ip.run(1,2,'thomask@acme-corp.com','Thomas Keller','active',1,850)
  ip.run(1,3,'amelied@acme-corp.com','Amélie Durand','active',1,710)
  ip.run(1,4,'marcl@acme-corp.com','Marc Lefebvre','active',1,540)
  ip.run(1,5,'juliem@acme-corp.com','Julie Martin','active',1,880)
  ip.run(1,1,'pierrer@acme-corp.com','Pierre Rousseau','active',1,630)
  ip.run(1,4,'nadiac@acme-corp.com','Nadia Chouaib','active',0,490)
  ip.run(1,2,'antoinem@acme-corp.com','Antoine Moreau','active',1,960)
  // BNP Finance dept IDs: Risk=6, IT=7, Front=8
  ip.run(2,6,'claire.dupont@bnp.fr','Claire Dupont','active',1,780)
  ip.run(2,7,'kevin.lemaire@bnp.fr','Kevin Lemaire','active',1,890)
  ip.run(2,8,'sabine.morin@bnp.fr','Sabine Morin','active',1,620)
  // Mairie de Lyon dept IDs: DSI=9, Admin=10
  ip.run(3,9,'jean.faure@mairie-lyon.fr','Jean Faure','active',1,710)
  ip.run(3,10,'sylvie.roux@mairie-lyon.fr','Sylvie Roux','active',1,580)
  // StartupTech dept IDs: Eng=11, Product=12
  ip.run(4,11,'alex@startuptech.io','Alex Chen','active',1,830)
  ip.run(4,12,'lea@startuptech.io','Léa Bonnard','active',1,750)
  // Renault dept IDs: Cyber=13, Ing=14, Achats=15
  ip.run(5,13,'chloe.lambert@renault.com','Chloé Lambert','active',1,910)
  ip.run(5,14,'eric.duval@renault.com','Eric Duval','active',1,720)
  ip.run(5,15,'pauline.roy@renault.com','Pauline Roy','active',1,640)
}

const scenarioCount = db.prepare('SELECT COUNT(*) as n FROM scenarios').get().n
if (scenarioCount === 0) {
  const ins = db.prepare('INSERT INTO scenarios (title_fr,title_en,category,difficulty,duration,description,status,plays,score) VALUES (?,?,?,?,?,?,?,?,?)')
  const SEED = [
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
  for (const row of SEED) ins.run(...row)

  // Visual scenarios (vs1-vs4) — linked to VisualChallenge player via visual_id
  const insV = db.prepare('INSERT INTO scenarios (title_fr,title_en,category,difficulty,duration,description,status,plays,score,visual_id) VALUES (?,?,?,?,?,?,?,?,?,?)')
  const insBlock = db.prepare('INSERT INTO scenario_blocks (scenario_id,type,position,data) VALUES (?,?,?,?)')
  const insHotspot = db.prepare('INSERT INTO hotspots (block_id,x,y,w,h,label,description) VALUES (?,?,?,?,?,?,?)')

  const visualSeed = [
    { visual_id:'vs1', title_fr:'Page de connexion suspecte', title_en:'Suspicious Login Page', category:'Phishing', difficulty:'beginner', duration:'8', description:'Identifiez les 5 indices de phishing sur cette page de connexion', plays:2310, score:418,
      hotspots:[
        {x:12,y:2.5,w:52,h:6,label:'Domaine frauduleux dans l\'URL',desc:'micr0soft.com — le 0 à la place du o'},
        {x:28,y:13,w:44,h:10,label:'Logo Microsoft non officiel',desc:'Logo flou et pixelisé'},
        {x:28,y:57,w:44,h:8,label:'Bouton pointe vers un faux domaine',desc:'microsofft-auth.net'},
        {x:5,y:2.5,w:7,h:6,label:'Cadenas brisé — HTTP',desc:'Connexion non chiffrée'},
        {x:18,y:87,w:64,h:5.5,label:'Caractère cyrillique dans le copyright',desc:'IDN Homograph Attack'},
      ]},
    { visual_id:'vs2', title_fr:'Arnaque au PDG', title_en:'CEO Fraud', category:'Social Eng.', difficulty:'intermediate', duration:'8', description:'Email prétendument du PDG demandant un virement urgent — trouvez les 5 signaux d\'alarme', plays:1890, score:392,
      hotspots:[
        {x:5,y:11,w:65,h:6.5,label:'Domaine email légèrement modifié',desc:'acme-corp.co au lieu de .com'},
        {x:5,y:18.5,w:72,h:5.5,label:'Adresse Reply-To personnelle suspecte',desc:'Gmail au lieu du domaine entreprise'},
        {x:5,y:47,w:90,h:9,label:'Demande de virement urgent et inhabituel',desc:'Un PDG légitime ne demande jamais ça par email'},
        {x:5,y:57.5,w:90,h:6,label:'Contournement des procédures officielles',desc:'Ne passez pas par les procédures habituelles'},
        {x:5,y:64.5,w:90,h:5.5,label:'Demande de confidentialité absolue',desc:'N\'en parlez à personne'},
      ]},
    { visual_id:'vs3', title_fr:'Poste de travail compromis', title_en:'Compromised Workstation', category:'Malware', difficulty:'intermediate', duration:'10', description:'Identifiez les 5 signes de compromission sur ce bureau Windows', plays:1540, score:371,
      hotspots:[
        {x:4,y:20,w:25,h:12,label:'Fichier avec double extension',desc:'Rapport_Q3.xlsx.exe'},
        {x:4,y:34,w:21,h:11,label:'Fichier autorun.inf suspect',desc:'Propagation via clé USB'},
        {x:28,y:41,w:56,h:22,label:'Fausse alerte antivirus (Scareware)',desc:'Defender Pro n\'est pas officiel'},
        {x:33,y:87,w:30,h:7,label:'Processus svchost32.exe illégitime',desc:'Le vrai s\'appelle svchost.exe'},
        {x:75,y:87,w:16,h:7,label:'Anomalie réseau — exfiltration potentielle',desc:'Trafic sortant élevé suspect'},
      ]},
    { visual_id:'vs4', title_fr:'Facture frauduleuse', title_en:'Fraudulent Invoice', category:'Insider', difficulty:'advanced', duration:'10', description:'Trouvez les 5 anomalies sur cette facture avant de valider le paiement', plays:980, score:344,
      hotspots:[
        {x:3,y:4,w:22,h:13,label:'Logo d\'entreprise flou et pixelisé',desc:'Copié en basse résolution'},
        {x:3,y:37,w:94,h:9,label:'Notice de changement de coordonnées bancaires',desc:'Technique classique de fraude au virement'},
        {x:3,y:56,w:94,h:9,label:'IBAN suspect ou inconnu',desc:'Ne correspond pas au système'},
        {x:52,y:16,w:44,h:8,label:'Délai de paiement anormalement court',desc:'24h pour 12.450€'},
        {x:3,y:75.5,w:65,h:6,label:'Email de contact avec domaine .cc suspect',desc:'.cc (Îles Cocos) souvent utilisé pour arnaques'},
      ]},
  ]

  for (const vs of visualSeed) {
    const info = insV.run(vs.title_fr, vs.title_en, vs.category, vs.difficulty, vs.duration, vs.description, 'published', vs.plays, vs.score, vs.visual_id)
    const blockInfo = insBlock.run(info.lastInsertRowid, 'photo', 0, JSON.stringify({ visual_id: vs.visual_id }))
    for (const h of vs.hotspots) {
      insHotspot.run(blockInfo.lastInsertRowid, h.x, h.y, h.w, h.h, h.label, h.desc)
    }
  }
}

// Assign ALL scenarios to ALL companies
const csCount = db.prepare('SELECT COUNT(*) as n FROM company_scenarios').get().n
if (csCount === 0) {
  const allScenarioIds = db.prepare('SELECT id FROM scenarios ORDER BY id').all().map(r => r.id)
  const allCompanyIds = db.prepare('SELECT id FROM companies ORDER BY id').all().map(r => r.id)
  const insCS = db.prepare('INSERT OR IGNORE INTO company_scenarios (company_id, scenario_id) VALUES (?, ?)')
  for (const cid of allCompanyIds) {
    for (const sid of allScenarioIds) {
      insCS.run(cid, sid)
    }
  }
}

// Assign scenarios to departments
const deptScCount = db.prepare('SELECT COUNT(*) as n FROM department_scenarios').get().n
if (deptScCount === 0) {
  const inDS = db.prepare('INSERT OR IGNORE INTO department_scenarios (department_id, scenario_id) VALUES (?, ?)')
  // ACME Finance (1): Phishing + Insider
  for (const sid of [1,2,3,4,5,6,7,18,20]) inDS.run(1, sid)
  // ACME IT (2): All technical
  for (const sid of [8,9,11,22,23,24,25,26,27,28,29,30,31,32]) inDS.run(2, sid)
  // ACME RH (3): Social Eng.
  for (const sid of [1,13,14,15,16,17,20]) inDS.run(3, sid)
  // ACME Commercial (4): Phishing + Social
  for (const sid of [1,3,6,7,13,15,16]) inDS.run(4, sid)
  // ACME Direction (5): Everything advanced
  for (const sid of [2,8,9,10,14,18,19]) inDS.run(5, sid)
  // BNP Risk (6)
  for (const sid of [1,2,3,5,18,19,20,21]) inDS.run(6, sid)
  // BNP IT (7)
  for (const sid of [8,9,23,24,25,27,30,31,32]) inDS.run(7, sid)
  // Mairie DSI (9)
  for (const sid of [1,8,13,22,25,26]) inDS.run(9, sid)
  // StartupTech Eng (11)
  for (const sid of [22,23,24,25,27,29,30,31,32]) inDS.run(11, sid)
  // Renault Cyber (13)
  for (const sid of [8,9,10,11,22,23,24,25,27,30]) inDS.run(13, sid)
}

// Assign scenarios to players via departments
const paCount = db.prepare('SELECT COUNT(*) as n FROM player_assignments').get().n
if (paCount === 0) {
  const inPA = db.prepare('INSERT INTO player_assignments (company_id,player_id,player_email,player_name,department_id,scenario_id,status,score) VALUES (?,?,?,?,?,?,?,?)')
  const players = db.prepare('SELECT * FROM players').all()

  for (const p of players) {
    const deptScenarios = p.department_id
      ? db.prepare('SELECT scenario_id FROM department_scenarios WHERE department_id=?').all(p.department_id).map(r => r.scenario_id)
      : []

    for (const sid of deptScenarios.slice(0, 3)) {
      const status = Math.random() > 0.4 ? 'completed' : 'pending'
      const score = status === 'completed' ? Math.round(500 + Math.random() * 480) : null
      inPA.run(p.company_id, p.id, p.email, p.name, p.department_id, sid, status, score)
    }
  }
}

export default db
