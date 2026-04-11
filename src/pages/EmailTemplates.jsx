import { useState } from 'react'
import PageHeader from '../components/PageHeader'

/* ============================================================
   ROOMCA — Bibliothèque de Templates Phishing FR
   HTML fidèle aux vrais emails — usage formation/simulation
   Logos officiels chargés depuis /assets/logos/ (voir README)
   ============================================================ */

// ─── BRAND LOGO COMPONENT ──────────────────────────────────────
// Tries to load the real logo from /assets/logos/{slug}.png,
// falls back to a styled text wordmark in the brand's colors.

function BrandLogo({ slug, name, fallbackBg = '#000', fallbackColor = '#fff', fallbackFont = 'Arial', height = 32 }) {
  const [errored, setErrored] = useState(false)
  if (errored) {
    return (
      <span style={{
        display: 'inline-block',
        padding: '8px 16px',
        background: fallbackBg,
        color: fallbackColor,
        fontFamily: fallbackFont,
        fontSize: `${Math.round(height * 0.5)}px`,
        fontWeight: 800,
        letterSpacing: '-0.02em',
        borderRadius: '4px',
        lineHeight: 1,
      }}>
        {name}
      </span>
    )
  }
  return (
    <img
      src={`/assets/logos/${slug}.png`}
      alt={name}
      style={{ height: `${height}px`, width: 'auto', display: 'inline-block', verticalAlign: 'middle' }}
      onError={() => setErrored(true)}
    />
  )
}

// Brand metadata (fallback colors + sender configurations)
const BRANDS = {
  microsoft:      { name: 'Microsoft',       bg: '#fff',     fg: '#737373', font: '"Segoe UI", Arial' },
  laposte:        { name: 'La Poste',        bg: '#FFCC00',  fg: '#003DA5', font: 'Arial' },
  impots:         { name: 'impots.gouv.fr',  bg: '#000091',  fg: '#fff',    font: '"Marianne", Arial' },
  docusign:       { name: 'DocuSign',        bg: '#FFCC22',  fg: '#000',    font: 'Arial' },
  linkedin:       { name: 'LinkedIn',        bg: '#0A66C2',  fg: '#fff',    font: 'Arial' },
  netflix:        { name: 'NETFLIX',         bg: '#000',     fg: '#E50914', font: '"Helvetica Neue", Arial' },
  google:         { name: 'Google',          bg: '#fff',     fg: '#4285F4', font: '"Product Sans", Arial' },
  urssaf:         { name: 'URSSAF',          bg: '#0055A4',  fg: '#fff',    font: 'Arial' },
  amazon:         { name: 'amazon',          bg: '#232F3E',  fg: '#FF9900', font: 'Arial' },
}

const Logo = ({ slug, height = 32 }) => {
  const b = BRANDS[slug] || {}
  return <BrandLogo slug={slug} name={b.name} fallbackBg={b.bg} fallbackColor={b.fg} fallbackFont={b.font} height={height} />
}

// ─── PREHEADER (hidden text shown in inbox preview) ────────────
const Preheader = ({ children }) => (
  <div style={{
    display: 'none',
    fontSize: '1px',
    color: 'transparent',
    lineHeight: '1px',
    maxHeight: '0',
    maxWidth: '0',
    opacity: 0,
    overflow: 'hidden',
  }}>
    {children}
  </div>
)

// ─── TEMPLATES PHISHING ─────────────────────────────────────────

const templates = [

  // ════════════════════════════════════════════════════════════
  // 1. MICROSOFT 365
  // ════════════════════════════════════════════════════════════
  {
    id: 1,
    name: 'Microsoft 365 — Mot de passe expiré',
    cat: 'Credentials',
    difficulty: 'medium',
    clickRate: 47,
    sector: 'all',
    brand: 'microsoft',
    from: 'Microsoft account team',
    fromEmail: 'account-security-noreply@accountprotection.microsoft.com',
    subject: 'Vérification de sécurité Microsoft requise',
    preheader: 'Action requise sous 24h pour conserver l\'accès à votre compte',
    indicators: [
      'URL maquillée (typosquat sous-domaine)',
      'Pression temporelle 24h',
      'Imite le ton institutionnel Microsoft',
      'Demande de confirmation de mot de passe (jamais légitime)',
    ],
    body: ({ name = 'Marie Dupont' }) => (
      <div style={{ background: '#f3f3f3', padding: '20px 0', fontFamily: '"Segoe UI", Tahoma, Arial, sans-serif', WebkitFontSmoothing: 'antialiased' }}>
        <Preheader>Action requise sous 24h pour conserver l'accès à votre compte Microsoft 365</Preheader>
        <table cellPadding="0" cellSpacing="0" style={{ maxWidth: '600px', width: '100%', margin: '0 auto', background: '#fff', border: '1px solid #e1e1e1', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '24px 32px 16px', borderBottom: '1px solid #f0f0f0' }}>
                <Logo slug="microsoft" height={28} />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '32px', color: '#262626', fontSize: '15px', lineHeight: 1.55 }}>
                <h1 style={{ fontSize: '21px', color: '#1a1a1a', margin: '0 0 20px', fontWeight: 600, lineHeight: 1.3 }}>
                  Vérification de sécurité requise
                </h1>
                <p style={{ margin: '0 0 16px' }}>Bonjour {name},</p>
                <p style={{ margin: '0 0 16px' }}>
                  Notre équipe de sécurité a détecté une tentative d'accès à votre compte Microsoft depuis un appareil non reconnu.
                  Pour protéger votre compte, votre mot de passe sera réinitialisé automatiquement dans <strong>24 heures</strong>
                  si vous ne confirmez pas votre identité.
                </p>
                <table cellPadding="0" cellSpacing="0" style={{ width: '100%', background: '#fafafa', border: '1px solid #e8e8e8', margin: '20px 0' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '16px 18px', fontSize: '13px', color: '#444', lineHeight: 1.7 }}>
                        <strong style={{ color: '#1a1a1a' }}>Détails de la tentative</strong><br />
                        <span style={{ color: '#666' }}>Compte :</span> {name.toLowerCase().replace(' ', '.')}@entreprise.fr<br />
                        <span style={{ color: '#666' }}>Date :</span> Aujourd'hui, 09:14 (UTC+1)<br />
                        <span style={{ color: '#666' }}>Localisation :</span> Lagos, Nigeria<br />
                        <span style={{ color: '#666' }}>Appareil :</span> Windows 10 · Firefox 124<br />
                        <span style={{ color: '#666' }}>Adresse IP :</span> 197.210.84.122
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p style={{ margin: '0 0 24px' }}>
                  Si c'était bien vous, vous pouvez ignorer ce message. Sinon, sécurisez votre compte immédiatement en cliquant ci-dessous :
                </p>
                <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto' }}>
                  <tbody>
                    <tr>
                      <td style={{ background: '#0078d4', borderRadius: '2px' }}>
                        <a href="#" style={{ display: 'inline-block', padding: '14px 42px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '15px' }}>
                          Sécuriser mon compte
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p style={{ fontSize: '13px', color: '#605e5c', margin: '28px 0 0', lineHeight: 1.6 }}>
                  Merci,<br />
                  L'équipe Microsoft account team
                </p>
              </td>
            </tr>
            <tr>
              <td style={{ background: '#f8f8f8', padding: '20px 32px', borderTop: '1px solid #f0f0f0', fontSize: '11px', color: '#888', lineHeight: 1.5 }}>
                Cet email a été envoyé automatiquement, merci de ne pas y répondre.<br />
                Microsoft Corporation · One Microsoft Way · Redmond, WA 98052 USA<br />
                <a href="#" style={{ color: '#0078d4', textDecoration: 'none' }}>Confidentialité</a> · <a href="#" style={{ color: '#0078d4', textDecoration: 'none' }}>Conditions d'utilisation</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },

  // ════════════════════════════════════════════════════════════
  // 2. LA POSTE / COLISSIMO
  // ════════════════════════════════════════════════════════════
  {
    id: 2,
    name: 'Colissimo — Colis en attente',
    cat: 'Phishing',
    difficulty: 'easy',
    clickRate: 61,
    sector: 'all',
    brand: 'laposte',
    from: 'Colissimo - La Poste',
    fromEmail: 'no-reply@colissimo-suivi.fr',
    subject: '📦 Votre colis n\'a pas pu être livré — Action requise',
    preheader: 'Frais de réexpédition : 1,99 € · Délai 48h',
    indicators: [
      'Domaine douteux (colissimo-suivi.fr ≠ laposte.fr)',
      'Frais minimes (1,99 €) pour baisser la garde',
      'Numéro de suivi inventé mais format crédible',
      'Pression : retour expéditeur sous 48h',
    ],
    body: () => (
      <div style={{ background: '#f4f4f4', padding: '20px 0', fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <Preheader>Votre colis Colissimo est en attente — confirmez la livraison sous 48h</Preheader>
        <table cellPadding="0" cellSpacing="0" style={{ maxWidth: '600px', width: '100%', margin: '0 auto', background: '#fff', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ background: '#FFCC00', padding: '24px 32px', textAlign: 'center' }}>
                <Logo slug="laposte" height={42} />
              </td>
            </tr>
            <tr>
              <td style={{ background: '#003DA5', padding: '14px 32px', color: '#fff', fontSize: '13px', letterSpacing: '0.05em', textAlign: 'center', textTransform: 'uppercase' }}>
                Suivi de votre envoi Colissimo
              </td>
            </tr>
            <tr>
              <td style={{ padding: '32px', color: '#333', fontSize: '14px', lineHeight: 1.65 }}>
                <h2 style={{ color: '#003DA5', fontSize: '22px', margin: '0 0 8px', fontWeight: 700 }}>
                  Votre colis n'a pas pu être livré
                </h2>
                <p style={{ color: '#666', fontSize: '13px', margin: '0 0 20px' }}>
                  Aujourd'hui à 14h32 — Centre de tri Paris Charles-de-Gaulle
                </p>
                <p style={{ margin: '0 0 16px' }}>Bonjour,</p>
                <p style={{ margin: '0 0 16px' }}>
                  Notre facteur a tenté de vous livrer un colis aujourd'hui mais n'a pas pu accéder à votre domicile (absent).
                  Votre colis est actuellement retenu dans notre centre de tri.
                </p>

                <table cellPadding="0" cellSpacing="0" style={{ width: '100%', background: '#FFF8E1', border: '2px solid #FFCC00', margin: '20px 0' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '18px 22px', fontSize: '13px' }}>
                        <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
                          <tbody>
                            <tr>
                              <td style={{ color: '#666', padding: '5px 0', width: '45%' }}>N° de suivi :</td>
                              <td style={{ color: '#003DA5' }}><strong>8R 0036 4523 7891 FR</strong></td>
                            </tr>
                            <tr>
                              <td style={{ color: '#666', padding: '5px 0' }}>Expéditeur :</td>
                              <td>FNAC Direct (Paris)</td>
                            </tr>
                            <tr>
                              <td style={{ color: '#666', padding: '5px 0' }}>Poids :</td>
                              <td>1,2 kg</td>
                            </tr>
                            <tr>
                              <td style={{ color: '#666', padding: '5px 0' }}>Statut :</td>
                              <td style={{ color: '#E1000F' }}><strong>⚠ En attente d'instructions</strong></td>
                            </tr>
                            <tr style={{ borderTop: '1px solid #FFCC00' }}>
                              <td style={{ color: '#666', padding: '8px 0 5px' }}>Frais de réexpédition :</td>
                              <td style={{ padding: '8px 0 5px' }}><strong style={{ color: '#003DA5', fontSize: '15px' }}>1,99 €</strong></td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <p style={{ margin: '0 0 16px' }}>
                  Pour reprogrammer la livraison à votre domicile ou choisir un point relais, veuillez confirmer votre adresse
                  et régler les frais de réexpédition (<strong>1,99 €</strong>) dans les <strong>48 heures</strong>.
                </p>
                <p style={{ margin: '0 0 24px', color: '#E1000F' }}>
                  ⚠ Passé ce délai, votre colis sera retourné à l'expéditeur.
                </p>

                <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto' }}>
                  <tbody>
                    <tr>
                      <td style={{ background: '#003DA5' }}>
                        <a href="#" style={{ display: 'inline-block', padding: '15px 42px', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '15px', letterSpacing: '0.03em' }}>
                          PROGRAMMER LA LIVRAISON
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <p style={{ fontSize: '12px', color: '#888', textAlign: 'center', margin: '24px 0 0' }}>
                  Service client Colissimo : <strong>3631</strong> (gratuit + prix d'un appel)
                </p>
              </td>
            </tr>
            <tr>
              <td style={{ background: '#003DA5', color: '#fff', padding: '18px 32px', fontSize: '11px', textAlign: 'center', lineHeight: 1.6 }}>
                La Poste — Société anonyme au capital de 5 857 785 364 €<br />
                9 rue du Colonel Pierre Avia · 75015 Paris · RCS Paris B 356 000 000<br />
                <a href="#" style={{ color: '#FFCC00', textDecoration: 'none' }}>Mentions légales</a> ·
                <a href="#" style={{ color: '#FFCC00', textDecoration: 'none', marginLeft: '8px' }}>Se désinscrire</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },

  // ════════════════════════════════════════════════════════════
  // 3. IMPÔTS.GOUV.FR
  // ════════════════════════════════════════════════════════════
  {
    id: 3,
    name: 'Impôts.gouv.fr — Remboursement disponible',
    cat: 'Phishing',
    difficulty: 'medium',
    clickRate: 53,
    sector: 'all',
    brand: 'impots',
    from: 'Direction générale des Finances publiques',
    fromEmail: 'noreply@impots.gouv-fr.com',
    subject: '✓ Vous êtes éligible à un remboursement de 287,42 €',
    preheader: 'Suite au calcul de votre déclaration de revenus 2025',
    indicators: [
      'Faux domaine (impots.gouv-fr.com au lieu de impots.gouv.fr)',
      'Montant précis et crédible (287,42 €)',
      'Imite la marque institutionnelle République Française',
      'Demande de RIB (jamais par email)',
    ],
    body: ({ name = 'Marie Dupont' }) => (
      <div style={{ background: '#f5f5fe', padding: '20px 0', fontFamily: '"Marianne", Arial, sans-serif' }}>
        <Preheader>Votre remboursement d'impôt de 287,42 € est disponible</Preheader>
        <table cellPadding="0" cellSpacing="0" style={{ maxWidth: '620px', width: '100%', margin: '0 auto', background: '#fff', border: '1px solid #e5e5f0', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '20px 32px', borderBottom: '4px solid #000091', background: '#fff' }}>
                <Logo slug="impots" height={48} />
              </td>
            </tr>
            <tr>
              <td style={{ background: '#000091', color: '#fff', padding: '12px 32px', fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 700 }}>
                ⚖ Notification officielle — DGFiP
              </td>
            </tr>
            <tr>
              <td style={{ padding: '36px 32px', color: '#1a1a1a', fontSize: '14px', lineHeight: 1.65 }}>
                <h1 style={{ fontSize: '24px', color: '#000091', margin: '0 0 6px', fontWeight: 700, lineHeight: 1.3 }}>
                  Vous êtes éligible à un remboursement
                </h1>
                <p style={{ color: '#666', fontSize: '13px', margin: '0 0 24px' }}>
                  Référence : <strong>REMB-2026-FR-748293</strong>
                </p>

                <p style={{ margin: '0 0 16px' }}>Madame, Monsieur {name},</p>

                <p style={{ margin: '0 0 16px' }}>
                  Suite au recalcul de votre déclaration de revenus 2025, nos services ont constaté un trop-perçu d'impôt en votre faveur.
                  Conformément à l'article <strong>1965 du Code général des impôts</strong>, vous bénéficiez d'un remboursement automatique.
                </p>

                <table cellPadding="0" cellSpacing="0" style={{ width: '100%', border: '2px solid #000091', background: '#f5f5fe', margin: '24px 0' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '24px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: '#000091', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '8px' }}>
                          Montant à vous rembourser
                        </div>
                        <div style={{ fontSize: '42px', fontWeight: 700, color: '#000091', lineHeight: 1, margin: '6px 0' }}>
                          287,42 €
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                          Virement bancaire · Délai 5 à 7 jours ouvrés
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <p style={{ margin: '0 0 16px' }}>
                  Pour recevoir votre remboursement, veuillez confirmer vos coordonnées bancaires (RIB) sur votre espace particulier.
                  <strong> Vous disposez de 5 jours ouvrés</strong> pour effectuer cette démarche, à défaut le remboursement sera annulé.
                </p>

                <table cellPadding="0" cellSpacing="0" style={{ margin: '28px auto' }}>
                  <tbody>
                    <tr>
                      <td style={{ background: '#000091' }}>
                        <a href="#" style={{ display: 'inline-block', padding: '14px 36px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '15px' }}>
                          Accéder à mon espace particulier
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table cellPadding="0" cellSpacing="0" style={{ width: '100%', background: '#fff8e1', border: '1px solid #f0ad4e', marginTop: '24px' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '14px 18px', fontSize: '12px', color: '#856404', lineHeight: 1.6 }}>
                        <strong>⚠ Information importante :</strong> Cet email est envoyé automatiquement, merci de ne pas y répondre.
                        En cas de doute, connectez-vous directement sur <strong>impots.gouv.fr</strong> depuis votre navigateur — jamais via un lien.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td style={{ background: '#f5f5fe', padding: '20px 32px', fontSize: '11px', color: '#666', borderTop: '1px solid #e5e5f0', textAlign: 'center', lineHeight: 1.6 }}>
                Direction générale des Finances publiques — République Française<br />
                <strong>Liberté · Égalité · Fraternité</strong><br />
                139 rue de Bercy · 75012 Paris
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },

  // ════════════════════════════════════════════════════════════
  // 4. DOCUSIGN
  // ════════════════════════════════════════════════════════════
  {
    id: 4,
    name: 'DocuSign — Document à signer',
    cat: 'BEC',
    difficulty: 'hard',
    clickRate: 38,
    sector: 'all',
    brand: 'docusign',
    from: 'DocuSign EU via DocuSign',
    fromEmail: 'dse_eu1@docusign.net',
    subject: 'Action requise : « NDA Q1 2026 — Partenariat » à signer',
    preheader: 'Jean-Pierre Martin (Direction Juridique) vous a envoyé un document',
    indicators: [
      'Imite parfaitement le vrai DocuSign (couleurs, mise en page)',
      'Faux nom d\'expéditeur interne crédible',
      'CTA jaune authentique',
      'Pression : "avant fin de journée"',
    ],
    body: ({ name = 'Sophie Bernard' }) => (
      <div style={{ background: '#fafafa', padding: '20px 0', fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <Preheader>Jean-Pierre Martin vous a envoyé un document à signer électroniquement</Preheader>
        <table cellPadding="0" cellSpacing="0" style={{ maxWidth: '600px', width: '100%', margin: '0 auto', background: '#fff', border: '1px solid #e8e8e8', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '24px 32px 18px', borderBottom: '1px solid #e8e8e8' }}>
                <Logo slug="docusign" height={32} />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '32px', fontSize: '14px', color: '#333', lineHeight: 1.65 }}>
                <p style={{ margin: '0 0 24px', fontSize: '15px', color: '#1a1a1a' }}>
                  <strong>Jean-Pierre Martin</strong> vous a envoyé un nouveau document à examiner et signer.
                </p>

                <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto 28px' }}>
                  <tbody>
                    <tr>
                      <td style={{ background: '#FFCC22', borderRadius: '4px' }}>
                        <a href="#" style={{ display: 'inline-block', padding: '17px 60px', color: '#000', textDecoration: 'none', fontWeight: 700, fontSize: '15px', letterSpacing: '0.02em' }}>
                          EXAMINER LE DOCUMENT
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table cellPadding="0" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse', margin: '24px 0', fontSize: '13px' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
                      <td style={{ padding: '12px 0', color: '#666', width: '35%' }}>Document :</td>
                      <td style={{ color: '#333' }}>
                        <strong>NDA_Q1_2026_Partenariat.pdf</strong><br />
                        <span style={{ fontSize: '11px', color: '#888' }}>2,4 Mo · 3 pages · 2 signatures requises</span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
                      <td style={{ padding: '12px 0', color: '#666' }}>Envoyé par :</td>
                      <td style={{ color: '#333' }}>
                        <strong>Jean-Pierre Martin</strong><br />
                        <span style={{ fontSize: '12px', color: '#888' }}>j.martin@entreprise.fr · Direction Juridique</span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
                      <td style={{ padding: '12px 0', color: '#666' }}>Destinataire :</td>
                      <td style={{ color: '#333' }}>{name}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
                      <td style={{ padding: '12px 0', color: '#666' }}>Envoyé le :</td>
                      <td style={{ color: '#333' }}>Aujourd'hui à 11:34</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px 0', color: '#666' }}>Échéance :</td>
                      <td style={{ color: '#E50914' }}><strong>⏰ Avant fin de journée</strong></td>
                    </tr>
                  </tbody>
                </table>

                <table cellPadding="0" cellSpacing="0" style={{ width: '100%', background: '#fff8e1', border: '1px solid #FFCC22', margin: '20px 0' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '16px 18px', fontSize: '13px', color: '#665', lineHeight: 1.6 }}>
                        <strong style={{ color: '#1a1a1a' }}>📝 Message de l'expéditeur :</strong><br />
                        « Bonjour, suite à notre échange de ce matin avec la direction, peux-tu signer ce NDA avant la fin de la journée ?
                        C'est urgent pour le partenariat. Merci, JP »
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td style={{ background: '#f8f8f8', padding: '20px 32px', borderTop: '1px solid #e8e8e8', fontSize: '11px', color: '#888', lineHeight: 1.6 }}>
                <strong>Vous ne souhaitez pas signer ce document ?</strong> Vous pouvez décliner depuis votre compte DocuSign.<br /><br />
                Cet email a été envoyé via DocuSign, le leader mondial de la signature électronique.<br />
                <a href="#" style={{ color: '#FFCC22', textDecoration: 'none' }}>Confidentialité</a> ·
                <a href="#" style={{ color: '#FFCC22', textDecoration: 'none', marginLeft: '8px' }}>Conditions</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },

  // ════════════════════════════════════════════════════════════
  // 5. LINKEDIN
  // ════════════════════════════════════════════════════════════
  {
    id: 5,
    name: 'LinkedIn — Demande de connexion',
    cat: 'Social Eng.',
    difficulty: 'easy',
    clickRate: 58,
    sector: 'all',
    brand: 'linkedin',
    from: 'LinkedIn',
    fromEmail: 'invitations@e.linkedin-secure.com',
    subject: 'Camille Rousseau souhaite rejoindre votre réseau',
    preheader: 'Senior HR Manager · Recrutement & Talents · Paris',
    indicators: [
      'Faux sous-domaine (e.linkedin-secure.com)',
      'Profil crédible (RH/recruteur)',
      'Note personnalisée pour engager',
      'Bouton mène à un faux login LinkedIn',
    ],
    body: () => (
      <div style={{ background: '#f3f2ef', padding: '20px 0', fontFamily: '-apple-system, "Segoe UI", Roboto, Arial, sans-serif' }}>
        <Preheader>Camille Rousseau (Senior HR Manager) souhaite se connecter avec vous</Preheader>
        <table cellPadding="0" cellSpacing="0" style={{ maxWidth: '580px', width: '100%', margin: '0 auto', background: '#fff', border: '1px solid #e0dfdc', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '20px 32px', borderBottom: '1px solid #e0dfdc' }}>
                <Logo slug="linkedin" height={28} />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '36px 32px 24px', textAlign: 'center' }}>
                <div style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f472b6, #7c5cff)',
                  margin: '0 auto 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '36px',
                  fontWeight: 600,
                  border: '3px solid #fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
                }}>
                  CR
                </div>
                <h2 style={{ fontSize: '22px', color: '#000', margin: '0 0 4px', fontWeight: 600 }}>
                  Camille Rousseau
                </h2>
                <p style={{ fontSize: '14px', color: '#666', margin: '0 0 4px' }}>
                  Senior HR Manager chez Recrutement & Talents
                </p>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 4px' }}>
                  Paris et périphérie · 500+ relations
                </p>
                <p style={{ fontSize: '12px', color: '#0A66C2', margin: '0 0 28px' }}>
                  🔗 12 relations en commun
                </p>

                <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto' }}>
                  <tbody>
                    <tr>
                      <td style={{ background: '#0A66C2', borderRadius: '24px' }}>
                        <a href="#" style={{ display: 'inline-block', padding: '12px 36px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '15px' }}>
                          Accepter
                        </a>
                      </td>
                      <td style={{ width: '12px' }}></td>
                      <td style={{ background: '#fff', border: '1.5px solid #999', borderRadius: '24px' }}>
                        <a href="#" style={{ display: 'inline-block', padding: '11px 36px', color: '#666', textDecoration: 'none', fontWeight: 600, fontSize: '15px' }}>
                          Ignorer
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '20px 32px', borderTop: '1px solid #e0dfdc' }}>
                <table cellPadding="0" cellSpacing="0" style={{ width: '100%', background: '#f3f2ef', borderRadius: '8px' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '16px 18px', fontSize: '13px', color: '#444', lineHeight: 1.6 }}>
                        <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#000' }}>📩 Note jointe :</p>
                        <p style={{ margin: 0, fontStyle: 'italic', color: '#555' }}>
                          « Bonjour ! J'ai vu votre profil et votre parcours m'intéresse beaucoup pour une opportunité chez l'un de nos clients
                          (CDI, télétravail flexible, package très attractif autour de 75-90k€). Pourrions-nous échanger 15 minutes cette semaine ? »
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td style={{ background: '#f9f9f9', padding: '18px 32px', fontSize: '11px', color: '#888', borderTop: '1px solid #e0dfdc', textAlign: 'center', lineHeight: 1.6 }}>
                Vous recevez cet email car vous êtes inscrit(e) sur LinkedIn.<br />
                © 2026 LinkedIn Ireland Unlimited Company · Wilton Plaza, Dublin 2<br />
                <a href="#" style={{ color: '#0A66C2', textDecoration: 'none' }}>Désabonnement</a> ·
                <a href="#" style={{ color: '#0A66C2', textDecoration: 'none', marginLeft: '8px' }}>Aide</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },

  // ════════════════════════════════════════════════════════════
  // 6. NETFLIX
  // ════════════════════════════════════════════════════════════
  {
    id: 6,
    name: 'Netflix — Échec de paiement',
    cat: 'Phishing',
    difficulty: 'easy',
    clickRate: 49,
    sector: 'all',
    brand: 'netflix',
    from: 'Netflix',
    fromEmail: 'info@account-netflix-billing.com',
    subject: 'Mise à jour requise : nous n\'avons pas pu valider votre paiement',
    preheader: 'Votre abonnement sera suspendu sous 24h',
    indicators: [
      'Domaine suspect (account-netflix-billing.com ≠ netflix.com)',
      'Émotion : peur de perdre l\'abonnement',
      'Bouton CTA imite parfaitement Netflix',
      'Aucune personnalisation (envoi de masse)',
    ],
    body: ({ name = 'Membre' }) => (
      <div style={{ background: '#000', padding: '0', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
        <Preheader>Mettez à jour votre mode de paiement pour conserver votre abonnement</Preheader>
        <table cellPadding="0" cellSpacing="0" style={{ maxWidth: '600px', width: '100%', margin: '0 auto', background: '#fff' }}>
          <tbody>
            <tr>
              <td style={{ background: '#000', padding: '24px 32px' }}>
                <Logo slug="netflix" height={32} />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '40px 36px 32px', color: '#333' }}>
                <h1 style={{ fontSize: '24px', color: '#000', margin: '0 0 24px', fontWeight: 700, lineHeight: 1.3 }}>
                  Bonjour {name},
                </h1>
                <p style={{ fontSize: '15px', lineHeight: 1.6, margin: '0 0 16px', color: '#333' }}>
                  Nous rencontrons un problème pour valider votre abonnement Netflix.
                  Cela peut être dû à plusieurs raisons :
                </p>
                <ul style={{ fontSize: '14px', color: '#555', lineHeight: 1.9, paddingLeft: '20px', margin: '0 0 16px' }}>
                  <li>Votre carte bancaire a expiré</li>
                  <li>Le solde de votre compte est insuffisant</li>
                  <li>Votre banque a refusé l'opération</li>
                  <li>Votre adresse de facturation a changé</li>
                </ul>
                <p style={{ fontSize: '15px', lineHeight: 1.6, margin: '20px 0 8px', color: '#333' }}>
                  Pour conserver l'accès à votre abonnement et éviter une <strong>suspension dans les 24 heures</strong>,
                  veuillez mettre à jour vos informations de paiement dès maintenant.
                </p>

                <table cellPadding="0" cellSpacing="0" style={{ margin: '32px auto' }}>
                  <tbody>
                    <tr>
                      <td style={{ background: '#E50914', borderRadius: '4px' }}>
                        <a href="#" style={{ display: 'inline-block', padding: '15px 44px', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '15px', letterSpacing: '0.02em' }}>
                          METTRE À JOUR LE COMPTE
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <p style={{ fontSize: '14px', color: '#666', margin: '24px 0 0', lineHeight: 1.6 }}>
                  Nous sommes là pour vous aider en cas de besoin. Visitez le <a href="#" style={{ color: '#E50914', textDecoration: 'underline' }}>Centre d'aide</a> pour plus d'informations.
                </p>
                <p style={{ fontSize: '14px', color: '#666', margin: '20px 0 0' }}>
                  Bon visionnage,<br />
                  <strong>L'équipe Netflix</strong>
                </p>
              </td>
            </tr>
            <tr>
              <td style={{ background: '#000', padding: '24px 36px', color: '#999', fontSize: '11px', lineHeight: 1.6, textAlign: 'center' }}>
                Cet email vous a été envoyé par Netflix.<br />
                Netflix International B.V. · Karperstraat 8-10 · 1075 KZ Amsterdam · Pays-Bas<br /><br />
                <a href="#" style={{ color: '#999', textDecoration: 'underline' }}>Préférences de communication</a> ·
                <a href="#" style={{ color: '#999', textDecoration: 'underline', marginLeft: '8px' }}>Confidentialité</a> ·
                <a href="#" style={{ color: '#999', textDecoration: 'underline', marginLeft: '8px' }}>Conditions</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },

  // ════════════════════════════════════════════════════════════
  // 7. GOOGLE
  // ════════════════════════════════════════════════════════════
  {
    id: 7,
    name: 'Google — Alerte de connexion suspecte',
    cat: 'Credentials',
    difficulty: 'hard',
    clickRate: 31,
    sector: 'all',
    brand: 'google',
    from: 'Google',
    fromEmail: 'no-reply@accounts.google-security-alert.com',
    subject: '⚠ Alerte de sécurité critique : nouvelle connexion détectée',
    preheader: 'Nouvel appareil — Moscou, Russie · Action requise',
    indicators: [
      'Faux domaine (google-security-alert.com)',
      'Géolocalisation alarmante (Moscou)',
      'Détails techniques pour crédibilité',
      'Imite parfaitement le ton Google',
    ],
    body: () => (
      <div style={{ background: '#f8f9fa', padding: '20px 0', fontFamily: '"Google Sans", Roboto, Arial, sans-serif' }}>
        <Preheader>Une nouvelle connexion a été détectée sur votre compte Google depuis Moscou</Preheader>
        <table cellPadding="0" cellSpacing="0" style={{ maxWidth: '580px', width: '100%', margin: '0 auto', background: '#fff', border: '1px solid #dadce0', borderRadius: '8px', overflow: 'hidden', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '28px 32px 8px', textAlign: 'center' }}>
                <Logo slug="google" height={36} />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '20px 36px 36px', color: '#202124', fontSize: '14px', lineHeight: 1.65 }}>
                <h1 style={{ fontSize: '22px', color: '#202124', margin: '0 0 16px', fontWeight: 400, textAlign: 'center' }}>
                  Alerte de sécurité critique
                </h1>
                <p style={{ margin: '0 0 16px', color: '#5f6368', textAlign: 'center' }}>
                  Une nouvelle connexion à votre compte Google a été détectée.<br />
                  Si c'était bien vous, vous pouvez ignorer ce message.<br />
                  Sinon, sécurisez votre compte immédiatement.
                </p>

                <table cellPadding="0" cellSpacing="0" style={{ width: '100%', background: '#fce8e6', border: '1px solid #ea4335', borderRadius: '8px', margin: '24px 0' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '20px' }}>
                        <table cellPadding="0" cellSpacing="0" style={{ width: '100%', fontSize: '13px' }}>
                          <tbody>
                            <tr>
                              <td style={{ padding: '6px 0', color: '#5f6368', width: '40%' }}>📅 Date et heure</td>
                              <td style={{ color: '#202124' }}><strong>Aujourd'hui, 14:32 UTC</strong></td>
                            </tr>
                            <tr>
                              <td style={{ padding: '6px 0', color: '#5f6368' }}>📍 Localisation</td>
                              <td style={{ color: '#ea4335' }}><strong>Moscou, Russie</strong></td>
                            </tr>
                            <tr>
                              <td style={{ padding: '6px 0', color: '#5f6368' }}>💻 Appareil</td>
                              <td style={{ color: '#202124' }}>Windows 10 · Chrome 124</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '6px 0', color: '#5f6368' }}>🌐 Adresse IP</td>
                              <td style={{ color: '#202124' }}>185.220.101.42</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '6px 0', color: '#5f6368' }}>🔐 Méthode</td>
                              <td style={{ color: '#202124' }}>Mot de passe + 2FA contournée</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table cellPadding="0" cellSpacing="0" style={{ margin: '28px auto' }}>
                  <tbody>
                    <tr>
                      <td style={{ background: '#1a73e8', borderRadius: '4px' }}>
                        <a href="#" style={{ display: 'inline-block', padding: '11px 28px', color: '#fff', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>
                          Vérifier l'activité
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <p style={{ fontSize: '13px', color: '#5f6368', margin: '24px 0 0', lineHeight: 1.6 }}>
                  Vous recevez ce message obligatoire pour vous tenir informé(e) des changements importants concernant
                  votre compte Google et ses services.
                </p>
              </td>
            </tr>
            <tr>
              <td style={{ background: '#f8f9fa', padding: '18px 32px', fontSize: '11px', color: '#5f6368', borderTop: '1px solid #f1f3f4', textAlign: 'center', lineHeight: 1.6 }}>
                © 2026 Google LLC · 1600 Amphitheatre Parkway · Mountain View, CA 94043 USA
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },

  
  // ════════════════════════════════════════════════════════════
  // 9. URSSAF
  // ════════════════════════════════════════════════════════════
  {
    id: 9,
    name: 'URSSAF — Régularisation cotisation',
    cat: 'BEC',
    difficulty: 'hard',
    clickRate: 24,
    sector: 'business',
    brand: 'urssaf',
    from: 'URSSAF Île-de-France',
    fromEmail: 'recouvrement@urssaf-fr.org',
    subject: 'Avis de régularisation — Trimestre 1 2026',
    preheader: 'Solde dû : 1 247,86 € — Action sous 10 jours ouvrés',
    indicators: [
      'Domaine .org au lieu de .fr',
      'Vise les TPE/indépendants',
      'Référence administrative crédible',
      'Mention "service contentieux" pour effrayer',
    ],
    body: () => (
      <div style={{ background: '#f4f6f9', padding: '20px 0', fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <Preheader>Régularisation T1 2026 — Solde dû 1 247,86 € sous 10 jours</Preheader>
        <table cellPadding="0" cellSpacing="0" style={{ maxWidth: '620px', width: '100%', margin: '0 auto', background: '#fff', border: '1px solid #d8dde6', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '24px 32px', borderBottom: '1px solid #e5e9f0' }}>
                <Logo slug="urssaf" height={42} />
              </td>
            </tr>
            <tr>
              <td style={{ background: '#0055A4', color: '#fff', padding: '12px 32px', fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em' }}>
                AVIS DE RÉGULARISATION OFFICIEL
              </td>
            </tr>
            <tr>
              <td style={{ padding: '32px', color: '#333', fontSize: '14px', lineHeight: 1.65 }}>
                <h1 style={{ color: '#0055A4', fontSize: '21px', margin: '0 0 6px', fontWeight: 700 }}>
                  Régularisation des cotisations sociales
                </h1>
                <p style={{ color: '#666', fontSize: '13px', margin: '0 0 24px' }}>
                  1<sup>er</sup> trimestre 2026 · Référence URS-2026-FR-748293-T1
                </p>

                <p style={{ margin: '0 0 16px' }}>Madame, Monsieur le dirigeant,</p>
                <p style={{ margin: '0 0 16px' }}>
                  Suite au contrôle de vos déclarations URSSAF du 1<sup>er</sup> trimestre 2026, nos services ont identifié
                  un solde restant dû. Conformément à l'<strong>article L243-7 du Code de la sécurité sociale</strong>,
                  vous êtes invité(e) à régulariser votre situation.
                </p>

                <table cellPadding="0" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse', margin: '24px 0', fontSize: '13px', border: '1px solid #d8dde6' }}>
                  <thead>
                    <tr style={{ background: '#0055A4', color: '#fff' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>Détail</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700 }}>Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e5e9f0' }}>
                      <td style={{ padding: '12px 16px' }}>Cotisations sociales T1 2026</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>1 198,40 €</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e9f0' }}>
                      <td style={{ padding: '12px 16px' }}>Majoration de retard (5%)</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>49,46 €</td>
                    </tr>
                    <tr style={{ background: '#f4f6f9', fontWeight: 700 }}>
                      <td style={{ padding: '14px 16px' }}>SOLDE DÛ</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', color: '#dc3545', fontSize: '17px' }}>1 247,86 €</td>
                    </tr>
                  </tbody>
                </table>

                <p style={{ margin: '0 0 16px' }}>
                  Pour éviter toute majoration supplémentaire et la transmission de votre dossier au
                  <strong> service contentieux</strong>, merci de procéder au règlement dans un délai de
                  <strong> 10 jours ouvrés</strong>.
                </p>

                <table cellPadding="0" cellSpacing="0" style={{ margin: '28px auto' }}>
                  <tbody>
                    <tr>
                      <td style={{ background: '#0055A4' }}>
                        <a href="#" style={{ display: 'inline-block', padding: '15px 40px', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
                          RÉGULARISER EN LIGNE
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table cellPadding="0" cellSpacing="0" style={{ width: '100%', background: '#f4f6f9', border: '1px solid #d8dde6', marginTop: '24px' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '14px 18px', fontSize: '12px', color: '#555', lineHeight: 1.6 }}>
                        <strong>📞 Service recouvrement :</strong> <strong>3957</strong> (service gratuit + prix appel)<br />
                        <strong>📧 Contact :</strong> recouvrement.idf@urssaf.fr<br />
                        <strong>🕐 Horaires :</strong> Lundi au vendredi, 9h-17h
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td style={{ background: '#0055A4', color: '#fff', padding: '16px 32px', fontSize: '11px', textAlign: 'center', lineHeight: 1.6 }}>
                URSSAF Île-de-France · 22 rue Viala · 75015 Paris<br />
                Au service des entreprises depuis 1960
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },

  // ════════════════════════════════════════════════════════════
  // 10. AMAZON
  // ════════════════════════════════════════════════════════════
  {
    id: 10,
    name: 'Amazon — Commande non confirmée',
    cat: 'Phishing',
    difficulty: 'medium',
    clickRate: 44,
    sector: 'all',
    brand: 'amazon',
    from: 'Amazon.fr',
    fromEmail: 'auto-confirm@amazon-fr-orders.com',
    subject: 'Confirmation de commande #402-7831456-2839301 — iPhone 15 Pro',
    preheader: 'Si cette commande ne vient pas de vous, annulez-la immédiatement',
    indicators: [
      'Email d\'achat alarmant pour pousser à cliquer',
      'Faux domaine (amazon-fr-orders.com)',
      'Produit cher (1 329 €) pour effrayer',
      'Adresse de livraison inconnue',
    ],
    body: ({ name = 'Cher client' }) => (
      <div style={{ background: '#fff', padding: '0', fontFamily: '"Amazon Ember", Arial, Helvetica, sans-serif' }}>
        <Preheader>Cette commande ne vient pas de vous ? Annulez-la immédiatement</Preheader>
        <table cellPadding="0" cellSpacing="0" style={{ maxWidth: '620px', width: '100%', margin: '0 auto', border: '1px solid #ddd' }}>
          <tbody>
            <tr>
              <td style={{ padding: '20px 32px', borderBottom: '1px solid #ddd', background: '#fff' }}>
                <Logo slug="amazon" height={32} />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '24px 32px', color: '#0F1111', fontSize: '14px', lineHeight: 1.65 }}>
                <h1 style={{ fontSize: '22px', margin: '0 0 16px', color: '#0F1111', fontWeight: 400 }}>
                  Merci pour votre commande, {name}
                </h1>
                <p style={{ margin: '0 0 16px', color: '#0F1111' }}>
                  Nous vous enverrons un email de confirmation lorsque votre article aura été expédié.
                  Les détails de votre commande sont indiqués ci-dessous.
                </p>

                <table cellPadding="0" cellSpacing="0" style={{ width: '100%', background: '#f3f3f3', margin: '16px 0', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '14px 18px', fontSize: '13px' }}>
                        <strong>Commande n°</strong> 402-7831456-2839301<br />
                        <strong>Date :</strong> Aujourd'hui à 11:42<br />
                        <strong>Total :</strong> <span style={{ color: '#B12704', fontSize: '17px', fontWeight: 700 }}>1 329,00 €</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table cellPadding="0" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '100px', verticalAlign: 'top', padding: '8px' }}>
                        <div style={{ width: '90px', height: '90px', background: '#f3f3f3', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                          📱
                        </div>
                      </td>
                      <td style={{ padding: '8px 8px 8px 16px', verticalAlign: 'top', fontSize: '13px' }}>
                        <a href="#" style={{ color: '#007185', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
                          Apple iPhone 15 Pro 256 Go - Titane Naturel - Débloqué tout opérateur
                        </a>
                        <div style={{ color: '#565959', marginTop: '6px' }}>Vendu par : Amazon.fr</div>
                        <div style={{ color: '#565959' }}>Quantité : 1</div>
                        <div style={{ color: '#B12704', fontWeight: 700, marginTop: '6px', fontSize: '15px' }}>1 329,00 €</div>
                        <div style={{ color: '#007600', fontSize: '12px', marginTop: '4px' }}>✓ Éligible à la livraison gratuite</div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table cellPadding="0" cellSpacing="0" style={{ width: '100%', background: '#fff8e1', border: '2px solid #f0ad4e', margin: '20px 0' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '16px 20px', fontSize: '13px', color: '#0F1111', lineHeight: 1.6 }}>
                        <strong>📍 Adresse de livraison</strong><br />
                        Inconnue Personne<br />
                        45 rue de la République<br />
                        75001 Paris<br />
                        France
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table cellPadding="0" cellSpacing="0" style={{ width: '100%', background: '#FCEEEE', border: '1px solid #e77600', margin: '24px 0' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '16px 20px' }}>
                        <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#B12704', fontSize: '14px' }}>
                          ⚠ Cette commande ne vient pas de vous ?
                        </p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#0F1111', lineHeight: 1.6 }}>
                          Si vous n'êtes pas à l'origine de cette commande, vous pouvez l'annuler immédiatement et signaler une activité suspecte.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table cellPadding="0" cellSpacing="0" style={{ margin: '24px auto' }}>
                  <tbody>
                    <tr>
                      <td style={{ background: '#FFD814', borderRadius: '8px', border: '1px solid #FCD200' }}>
                        <a href="#" style={{ display: 'inline-block', padding: '13px 36px', color: '#0F1111', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
                          Annuler cette commande
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <p style={{ fontSize: '12px', color: '#565959', margin: '24px 0 0' }}>
                  Nous espérons vous revoir bientôt.<br />
                  <strong>Amazon.fr</strong>
                </p>
              </td>
            </tr>
            <tr>
              <td style={{ background: '#232F3E', color: '#fff', padding: '24px 32px', fontSize: '11px', textAlign: 'center', lineHeight: 1.6 }}>
                © 1996-2026 Amazon.com, Inc. ou ses affiliés<br />
                Amazon France Logistique SAS · 67 boulevard du Général Leclerc · 92110 Clichy<br />
                <a href="#" style={{ color: '#FF9900', textDecoration: 'none' }}>Confidentialité</a> ·
                <a href="#" style={{ color: '#FF9900', textDecoration: 'none', marginLeft: '8px' }}>Conditions générales de vente</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },
]

const CAT_COLORS = {
  'Phishing':     'var(--violet)',
  'BEC':          'var(--rose)',
  'Credentials':  'var(--cyan)',
  'Social Eng.':  'var(--gold)',
}

const DIFF_COLORS = {
  easy:   'var(--success)',
  medium: 'var(--warning)',
  hard:   'var(--red)',
}

const DIFF_LABELS = {
  easy:   'Facile',
  medium: 'Moyen',
  hard:   'Difficile',
}

export default function EmailTemplates({ embedded = false }) {
  const [filter, setFilter] = useState('all')
  const [preview, setPreview] = useState(null)

  const filtered = filter === 'all' ? templates : templates.filter(t => t.cat === filter)
  const cats = ['all', 'Phishing', 'BEC', 'Credentials', 'Social Eng.']

  return (
    <div style={{ minHeight: embedded ? 'auto' : '100vh', background: 'var(--bg)', position: 'relative' }}>
      {!embedded && <div className="aurora-bg" style={{ opacity: 0.4 }} />}
      {!embedded && <PageHeader title="📧 Templates d'emails" subtitle={`${templates.length} templates phishing prêts à l'emploi`} />}

      <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {!embedded && (
          <div style={{ marginBottom: '32px' }}>
            <div className="tag tag-aurora" style={{ marginBottom: '12px' }}>
              <span className="status-dot violet" /> Bibliothèque française
            </div>
            <h1 style={{
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(32px, 4vw, 44px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              marginBottom: '8px',
            }}>
              📧 Templates <span className="text-gradient">d'emails phishing</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
              {templates.length} templates fidèles aux vraies marques (Microsoft, La Poste, Impôts, DocuSign, Crédit Agricole...)
            </p>
          </div>
        )}

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '28px',
          padding: '6px',
          background: 'var(--bg-muted)',
          borderRadius: 'var(--r-full)',
          border: '1px solid var(--border)',
          width: 'fit-content',
          maxWidth: '100%',
          overflowX: 'auto',
        }}>
          {cats.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--r-full)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                background: filter === c ? 'var(--bg-card)' : 'transparent',
                color: filter === c ? 'var(--violet)' : 'var(--text-secondary)',
                boxShadow: filter === c ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.25s var(--ease)',
                whiteSpace: 'nowrap',
              }}
            >
              {c === 'all' ? 'Tous' : c}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
        }}>
          {filtered.map(t => {
            const catColor = CAT_COLORS[t.cat] || 'var(--violet)'
            const diffColor = DIFF_COLORS[t.difficulty]
            return (
              <div
                key={t.id}
                className="card"
                style={{
                  padding: '0',
                  borderRadius: 'var(--r-xl)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.3s var(--ease)',
                }}
                onClick={() => setPreview(t)}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
              >
                {/* Brand preview thumbnail */}
                <div style={{
                  height: '100px',
                  background: 'var(--grad-aurora-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: '1px solid var(--border)',
                  position: 'relative',
                }}>
                  <div style={{
                    background: '#fff',
                    padding: '16px 24px',
                    borderRadius: 'var(--r-md)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '140px',
                    minHeight: '50px',
                  }}>
                    <Logo slug={t.brand} height={32} />
                  </div>
                </div>

                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '8px' }}>
                    <span className="tag" style={{
                      background: `color-mix(in srgb, ${catColor} 12%, transparent)`,
                      borderColor: `color-mix(in srgb, ${catColor} 35%, transparent)`,
                      color: catColor,
                    }}>
                      {t.cat}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: diffColor }}>
                      ● {DIFF_LABELS[t.difficulty]}
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: '15px',
                    fontWeight: 700,
                    marginBottom: '8px',
                    letterSpacing: '-0.015em',
                    lineHeight: 1.3,
                  }}>
                    {t.name}
                  </h3>

                  <p style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    marginBottom: '14px',
                    lineHeight: 1.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {t.subject}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '14px',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                  }}>
                    <span>📊 Taux de clic moyen :</span>
                    <strong style={{ color: 'var(--violet)' }}>{t.clickRate}%</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setPreview(t) }}
                      className="btn-secondary"
                      style={{ flex: 1, padding: '10px', fontSize: '12px' }}
                    >
                      👁️ Aperçu
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="btn-primary"
                      style={{ flex: 1, padding: '10px', fontSize: '12px' }}
                    >
                      Utiliser
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Preview Modal */}
        {preview && (
          <div
            onClick={() => setPreview(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(20, 22, 32, 0.65)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '24px',
              animation: 'fadeIn 0.25s var(--ease)',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-2xl)',
                maxWidth: '780px',
                width: '100%',
                maxHeight: '92vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)',
                animation: 'scaleIn 0.3s var(--ease-bounce)',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '20px 28px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '16px',
                background: 'var(--glass-bg-strong)',
                backdropFilter: 'var(--glass-blur)',
                WebkitBackdropFilter: 'var(--glass-blur)',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    marginBottom: '6px',
                    fontFamily: 'var(--font-title)',
                    letterSpacing: '-0.02em',
                  }}>
                    {preview.name}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="tag" style={{
                      background: `color-mix(in srgb, ${CAT_COLORS[preview.cat]} 12%, transparent)`,
                      borderColor: `color-mix(in srgb, ${CAT_COLORS[preview.cat]} 35%, transparent)`,
                      color: CAT_COLORS[preview.cat],
                    }}>
                      {preview.cat}
                    </span>
                    <span className="tag" style={{
                      background: `color-mix(in srgb, ${DIFF_COLORS[preview.difficulty]} 12%, transparent)`,
                      borderColor: `color-mix(in srgb, ${DIFF_COLORS[preview.difficulty]} 35%, transparent)`,
                      color: DIFF_COLORS[preview.difficulty],
                    }}>
                      {DIFF_LABELS[preview.difficulty]}
                    </span>
                    <span className="tag tag-aurora">📊 {preview.clickRate}% de clic</span>
                  </div>
                </div>
                <button
                  onClick={() => setPreview(null)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--r-full)',
                    background: 'var(--bg-muted)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    fontSize: '16px',
                    flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Email envelope */}
              <div style={{
                padding: '16px 28px',
                borderBottom: '1px solid var(--border)',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                background: 'var(--bg-soft)',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '6px 14px' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>De :</span>
                  <span><strong style={{ color: 'var(--text)' }}>{preview.from}</strong> &lt;<span style={{ color: 'var(--red)' }}>{preview.fromEmail}</span>&gt;</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>À :</span>
                  <span>vous@entreprise.fr</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Objet :</span>
                  <span style={{ color: 'var(--text)', fontWeight: 600 }}>{preview.subject}</span>
                </div>
              </div>

              {/* Email body — scrollable */}
              <div style={{ flex: 1, overflowY: 'auto', background: '#f5f5f5' }}>
                {preview.body({})}
              </div>

              {/* Indicators footer */}
              <div style={{
                padding: '20px 28px',
                borderTop: '1px solid var(--border)',
                background: 'var(--glass-bg-strong)',
                backdropFilter: 'var(--glass-blur)',
                WebkitBackdropFilter: 'var(--glass-blur)',
              }}>
                <div style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}>
                  🎯 Indices d'authentification (à apprendre à repérer)
                </div>
                <ul style={{ margin: '0 0 16px', paddingLeft: '20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {preview.indicators.map((ind, i) => (
                    <li key={i}>{ind}</li>
                  ))}
                </ul>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setPreview(null)} className="btn-secondary" style={{ flex: 1, padding: '12px', fontSize: '13px' }}>
                    Fermer
                  </button>
                  <button className="btn-primary" style={{ flex: 1, padding: '12px', fontSize: '13px' }}>
                    🚀 Utiliser ce template
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
