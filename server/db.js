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
    label TEXT DEFAULT 'Zone'
  );

  CREATE TABLE IF NOT EXISTS company_scenarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    scenario_id INTEGER NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, scenario_id)
  );

  CREATE TABLE IF NOT EXISTS player_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    player_email TEXT NOT NULL,
    player_name TEXT,
    scenario_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    score REAL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME
  );
`)

// Seed if empty
const companyCount = db.prepare('SELECT COUNT(*) as n FROM companies').get().n
if (companyCount === 0) {
  const insertCompany = db.prepare(
    'INSERT INTO companies (name, email, plan, sector, users, active, scenarios, licenses, expire, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  )
  insertCompany.run('ROOMCA Corp', 'admin@roomca.com', 'Business', 'Finance', 161, 142, 6, 200, '31/12/2025', 'active')
  insertCompany.run('BNP Finance', 'security@bnp.fr', 'Enterprise', 'Finance', 892, 814, 12, 1000, '30/06/2025', 'active')
  insertCompany.run('Mairie de Lyon', 'dsi@mairie-lyon.fr', 'Starter', 'Administration', 24, 18, 3, 25, '15/05/2025', 'expiring')
  insertCompany.run('StartupTech SAS', 'cto@startuptech.io', 'Starter', 'Tech', 12, 8, 2, 25, '01/09/2025', 'active')
  insertCompany.run('Groupe Renault', 'cybersec@renault.com', 'Enterprise', 'Industrie', 2840, 2100, 18, 3000, '31/03/2026', 'active')
}

const scenarioCount = db.prepare('SELECT COUNT(*) as n FROM scenarios').get().n
if (scenarioCount === 0) {
  const ins = db.prepare(
    'INSERT INTO scenarios (title_fr, title_en, category, difficulty, duration, description, status, plays, score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  )
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
}

const companyScenarioCount = db.prepare('SELECT COUNT(*) as n FROM company_scenarios').get().n
if (companyScenarioCount === 0) {
  const insCS = db.prepare('INSERT OR IGNORE INTO company_scenarios (company_id, scenario_id) VALUES (?, ?)')
  // ROOMCA Corp (id=1): scenarios 1,2,3
  insCS.run(1, 1); insCS.run(1, 2); insCS.run(1, 3)
  // BNP Finance (id=2): scenarios 1,3
  insCS.run(2, 1); insCS.run(2, 3)
  // Mairie de Lyon (id=3): scenario 1
  insCS.run(3, 1)
  // StartupTech SAS (id=4): scenario 1
  insCS.run(4, 1)
}

export default db
