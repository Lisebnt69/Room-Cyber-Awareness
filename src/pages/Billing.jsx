import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { PLANS, createPaymentIntent } from '../services/stripe'
import Logo from '../img/roomca-logo.png'
import LangToggle from '../components/LangToggle'
import Modal from '../components/Modal'
import Toast from '../components/Toast'

export default function Billing() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { t } = useLang()
  const [currentPlan, setCurrentPlan] = useState('free')
  const [showUpgrade, setShowUpgrade] = useState(null)
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [paymentForm, setPaymentForm] = useState({ cardNumber: '', expiry: '', cvc: '' })

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleUpgrade = async (planId) => {
    if (planId === currentPlan) {
      setToast({ msg: 'You already have this plan', type: 'info' })
      return
    }

    setLoading(true)
    try {
      const result = await createPaymentIntent(planId)
      if (result.error) {
        setToast({ msg: result.error, type: 'error' })
      } else {
        setShowUpgrade(planId)
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!paymentForm.cardNumber || !paymentForm.expiry || !paymentForm.cvc) {
      setToast({ msg: 'Please fill all payment details', type: 'error' })
      return
    }

    setLoading(true)
    try {
      // Simulate payment processing
      setTimeout(() => {
        setCurrentPlan(showUpgrade)
        setShowUpgrade(null)
        setPaymentForm({ cardNumber: '', expiry: '', cvc: '' })
        setToast({ msg: 'Upgrade successful! Welcome to ' + PLANS[showUpgrade.toUpperCase()]?.name, type: 'success' })
        setLoading(false)
      }, 1500)
    } catch (error) {
      setToast({ msg: 'Payment failed', type: 'error' })
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-black)' }}>
      {/* Navigation */}
      <nav style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
        <img
  src={Logo}
  alt="ROOMCA"
  style={{ height: '32px', width: 'auto', display: 'block' }}
/>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <LangToggle />
          <button onClick={() => navigate('/admin')} style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            ← Dashboard
          </button>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '11px' }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '32px', marginBottom: '8px' }}>
            💳 Billing & Plans
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Current Plan: <span style={{ color: 'var(--red)', fontWeight: 700 }}>{PLANS[currentPlan.toUpperCase()]?.name || 'Free'}</span>
          </p>
        </div>

        {/* Plans Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
          {Object.entries(PLANS).map(([key, plan]) => {
            const isCurrentPlan = currentPlan === key.toLowerCase()
            return (
              <div
                key={key}
                style={{
                  background: isCurrentPlan ? '#0d0d0d' : 'var(--bg-card)',
                  border: isCurrentPlan ? '2px solid var(--red)' : '1px solid var(--border)',
                  borderRadius: '4px',
                  padding: '28px',
                  position: 'relative',
                  transition: 'all 0.2s'
                }}
              >
                {isCurrentPlan && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '20px',
                    background: 'var(--red)',
                    color: '#fff',
                    padding: '4px 12px',
                    fontSize: '10px',
                    fontWeight: 700,
                    borderRadius: '2px'
                  }}>
                    CURRENT
                  </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '20px', marginBottom: '8px' }}>
                    {plan.name}
                  </h3>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: isCurrentPlan ? 'var(--red)' : 'var(--text-light)', marginBottom: '4px' }}>
                    €{plan.price}
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span>
                  </div>
                </div>

                <ul style={{ marginBottom: '24px', listStyle: 'none' }}>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', gap: '8px' }}>
                      <span style={{ color: 'var(--red)', fontWeight: 700 }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(key.toLowerCase())}
                  disabled={loading || isCurrentPlan}
                  className={isCurrentPlan ? 'btn-secondary' : 'btn-primary'}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    opacity: isCurrentPlan ? 0.5 : loading ? 0.7 : 1,
                    cursor: isCurrentPlan || loading ? 'default' : 'pointer'
                  }}
                >
                  {isCurrentPlan ? 'Current Plan' : loading ? 'Processing...' : 'Upgrade'}
                </button>
              </div>
            )
          })}
        </div>

        {/* Current Usage */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '28px', borderRadius: '4px' }}>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '16px', marginBottom: '20px' }}>
            📊 Current Usage
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { label: 'Employees', used: 142, limit: PLANS[currentPlan.toUpperCase()]?.limits?.employees },
              { label: 'Scenarios', used: 8, limit: PLANS[currentPlan.toUpperCase()]?.limits?.scenarios },
              { label: 'Campaigns', used: 3, limit: PLANS[currentPlan.toUpperCase()]?.limits?.campaigns }
            ].map((usage, idx) => {
              const percentage = usage.limit > 0 ? (usage.used / usage.limit) * 100 : 0
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{usage.label}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {usage.used} / {usage.limit === -1 ? '∞' : usage.limit}
                    </span>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.5)', height: '8px', borderRadius: '2px', overflow: 'hidden' }}>
                    <div
                      style={{
                        background: percentage > 80 ? 'var(--red)' : percentage > 50 ? '#f59e0b' : '#22c55e',
                        height: '100%',
                        width: `${Math.min(percentage, 100)}%`,
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal isOpen={!!showUpgrade} onClose={() => { setShowUpgrade(null); setPaymentForm({ cardNumber: '', expiry: '', cvc: '' }) }} title={`Upgrade to ${PLANS[showUpgrade?.toUpperCase()]?.name || ''}`}>
        {showUpgrade && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(235,40,40,0.1)', border: '1px solid rgba(235,40,40,0.3)', padding: '16px', borderRadius: '2px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Monthly Amount</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--red)', marginTop: '4px' }}>
                €{PLANS[showUpgrade.toUpperCase()]?.price}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Card Number</label>
              <input
                type="text"
                value={paymentForm.cardNumber}
                onChange={e => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                className="input-dark"
                placeholder="4242 4242 4242 4242"
                maxLength="19"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Expiry</label>
                <input
                  type="text"
                  value={paymentForm.expiry}
                  onChange={e => setPaymentForm({ ...paymentForm, expiry: e.target.value })}
                  className="input-dark"
                  placeholder="MM/YY"
                  maxLength="5"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>CVC</label>
                <input
                  type="text"
                  value={paymentForm.cvc}
                  onChange={e => setPaymentForm({ ...paymentForm, cvc: e.target.value })}
                  className="input-dark"
                  placeholder="123"
                  maxLength="3"
                />
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '12px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Processing...' : `Pay €${PLANS[showUpgrade.toUpperCase()]?.price}`}
            </button>
          </div>
        )}
      </Modal>

      {/* Toast */}
      {toast && <Toast message={toast.msg} type={toast.type} />}
    </div>
  )
}
