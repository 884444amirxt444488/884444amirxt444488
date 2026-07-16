import api from "../api"
import { useEffect, useState, useContext, createContext } from "react"


type UserType = {
  username: string,
  email: string
}


type UserContextType = {
  user: UserType | null,
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({children}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<UserType | null>(null)
  useEffect(() => {
    const getProfile = async() => {
      try {
        const response = await api.get("/getProfile")
        setUser({
          username: response.data.username,
          email: response.data.email 
        })
      }
      catch (err) {
        console.error(`Error to get profile: `, err)
        setUser(null)
      }
    }
    getProfile()
  }, [])
  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("UserProvider must be in user provider")
  }
  return context
}

