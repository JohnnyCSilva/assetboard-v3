import React, {useContext, createContext} from 'react'

const AuthContext = React.createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({children, value}) {
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

