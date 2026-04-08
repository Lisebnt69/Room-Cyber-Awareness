import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export const ROLES = {
  PLAYER: 'player',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
}

const MOCK_USERS = [
  { id: 1, email: 'player@acme.com', password: 'demo', role: ROLES.PLAYER, name: 'Alex Martin', company: 'ACME Corp' },
  { id: 2, email: 'admin@acme.com', password: 'demo', role: ROLES.ADMIN, name: 'Sophie Bernard', company: 'ACME Corp' },
  { id: 3, email: 'superadmin@roomca.io', password: 'demo', role: ROLES.SUPER_ADMIN, name: 'ROOMCA Admin', company: 'ROOMCA' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  const login = (email, password) => {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password)
    if (found) {
      setUser(found)
      setError(null)
      return { success: true, role: found.role }
    }
    setError('Identifiants invalides')
    return { success: false }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
