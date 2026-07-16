import api from "../api"
import { AxiosError } from "axios"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { QueryClient, useMutation } from "@tanstack/react-query"
import { useUser } from "../context/UserContext"
import { useState } from "react"
import { Link } from "react-router-dom"



type Props = {
    setShowProfile: React.Dispatch<React.SetStateAction<boolean>>
}


function Profile({setShowProfile}: Props) {
    
    const navigate = useNavigate()
    const {user, setUser} = useUser()

    const [deleteProfile2, setDeleteProfile] = useState(0)


    const deleteProfile = useMutation({
        mutationFn: async() => {
            const response = await api.delete("/deleteProfile")
            return response.data
        },
        onSuccess: (data) => {
            toast.success(data.message)
            localStorage.removeItem("accessToken")
            setUser(null)
            navigate("/signup")
        },
        onError: (err: AxiosError<{message: string}>) => {
            toast.error(err.response?.data?.message || err?.message || "Unknown Error")
        }
    })

    const logout = useMutation({
        mutationFn: async() => {
            localStorage.removeItem("accessToken")
            const response = await api.post("/logout")
            return response.data
        },
        onSuccess: (data) => {
            toast.success(data.message)
            navigate("/login")
            setShowProfile(false)
            setUser(null)
        },
        onError: (err: AxiosError<{message: string}>) => {
            toast.error(err.response?.data?.message || err?.message || "Unknown Error")
        }
    })


    return (
        <div className="profile2">
            <div className="getProfile">
                <div className="h">
                    <button className="logout" onClick={() => {
                        logout.mutate()
                    }}>Exit</button>
                    <button className="close" onClick={() => {
                        setShowProfile(false)
                    }}>❌</button>
                </div>
                <h3>Username: {user?.username}</h3>
                <h3>Email: {user?.email}</h3>
                <button onClick={() => {
                    const newNumber = deleteProfile2 + 1
                    setDeleteProfile(newNumber)
                    if (newNumber === 1) {
                        toast.error("Click again for delete profile")
                    }
                    else if (newNumber === 2) {
                        toast.error("It can not back.")
                    }
                    else {
                        setDeleteProfile(0)
                        deleteProfile.mutate()
                    }
 
                }} className="btn3">Delete profile {
                    deleteProfile2 === 0
                    ? ""
                    : deleteProfile2 
                }</button>
                <Link to={"/editProfile"} className="btn3" onClick={() => {
                    setShowProfile(false)
                }}>Edit profile</Link>
            </div>
        </div>


    )



}





export default Profile
