
'use client'

import {createContext, useContext, useEffect, useState} from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const AuthContext = createContext({})

export function useAuth() {
  return useContext(AuthContext)
}


export function AuthContextProvider({children}:{children: React.ReactNode}) {

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user)
        }
        else {
          setUser(null)
        }
      })
      return () => unsubscribe()
        // onAuthStateChanged(auth,(user) => {
        //     setUser(user)
        // })
    }, [])
    
  return (
    <AuthContext.Provider value={{user}}>
      {children}
    </AuthContext.Provider>
  )
}

