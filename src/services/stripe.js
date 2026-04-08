// Stripe Integration Service
// In production, this would use actual Stripe API keys

const STRIPE_PUBLIC_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_STRIPE_PUBLIC_KEY) || 'pk_test_demo'

export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    billing: 'month',
    features: [
      'Up to 50 employees',
      '2 scenarios',
      'Basic analytics',
      'Email support'
    ],
    limits: {
      employees: 50,
      scenarios: 2,
      campaigns: 0
    }
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 99,
    billing: 'month',
    features: [
      'Up to 500 employees',
      'All scenarios',
      'Advanced analytics',
      'Phishing campaigns',
      'Priority support'
    ],
    limits: {
      employees: 500,
      scenarios: -1,
      campaigns: -1
    }
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    billing: 'month',
    features: [
      'Unlimited employees',
      'All scenarios',
      'Advanced analytics',
      'Custom campaigns',
      'SSO & 2FA',
      'Dedicated support',
      'API access'
    ],
    limits: {
      employees: -1,
      scenarios: -1,
      campaigns: -1
    }
  }
}

export const initializeStripe = async () => {
  // In production: await import('@stripe/stripe-js')
  console.log('Stripe initialized with key:', STRIPE_PUBLIC_KEY)
  return { stripe: null, error: null }
}

export const createPaymentIntent = async (planId, quantity = 1) => {
  try {
    // In production: Call actual backend API
    const plan = Object.values(PLANS).find(p => p.id === planId)
    if (!plan) throw new Error('Plan not found')

    const amount = plan.price * 100 * quantity // Convert to cents

    return {
      clientSecret: `pi_test_${Date.now()}`,
      amount,
      planId,
      currency: 'eur'
    }
  } catch (error) {
    return { error: error.message }
  }
}

export const processPayment = async (paymentMethodId, paymentIntentId) => {
  try {
    // Simulate payment processing
    console.log('Processing payment:', { paymentMethodId, paymentIntentId })

    // In production: Call actual Stripe API via backend
    return {
      success: true,
      transactionId: `txn_${Date.now()}`,
      status: 'succeeded'
    }
  } catch (error) {
    return { error: error.message }
  }
}

export const getSubscriptionStatus = async (userId) => {
  try {
    // In production: Fetch from actual backend
    return {
      plan: PLANS.FREE,
      status: 'active',
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  } catch (error) {
    return { error: error.message }
  }
}

export const cancelSubscription = async (subscriptionId) => {
  try {
    console.log('Canceling subscription:', subscriptionId)
    return { success: true }
  } catch (error) {
    return { error: error.message }
  }
}
