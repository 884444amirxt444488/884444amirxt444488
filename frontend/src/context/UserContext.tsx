import React, { createContext, useContext, useState } from "react"

type UserType = {
  username: string
  email: string
}

type UserContextType = {
  user: UserType | null
  setUser: React.Dispatch<React.SetStateAction<UserType | null >>
}

const userContext = createContext<UserContextType | null>(null)

export function UserProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<UserType | null>(null)

  return (
    <userContext.Provider value={{user, setUser}}>
      {children}
    </userContext.Provider>
  )
}

export function useUser() {
  const context = useContext(userContext)

  if (!context) {
    throw new Error("useUser must be used inside UserProvider")
  }
  return context
}
