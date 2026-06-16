import axios from "axios"
import api from "../api"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


function getProfile() {
    const [username, setUsername] = useState("None")
    const [email, setEmail] = useState("None")
    const [message, setMessage] = useState("")

    const navigate = useNavigate()

    const [deleteMessage, setDeleteMessage] = useState("")


    const [editUsername, setEditUsername] = useState("")
    const [editEmail, setEditEmail] = useState("")
    const [isTrue, setIsTrue] = useState(false)
    const [editMessage, setEditMessage] = useState("")


    const getprofile = async() => {
        try {
            const response = await api.get("/getProfile")
            setUsername(response.data.username)
            setEmail(response.data.email)
            setMessage(response.data.message)
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                setMessage(err.response?.data?.message || err.message)
            }
            else {
                setMessage("Unknown Error")
            }
        }
    }
    const deleteProfile = async() => {
        try {
            const response = await api.delete("/deleteProfile")
            localStorage.removeItem("accessToken")
            setDeleteMessage(response.data.message)
            setTimeout(() => {
                navigate("/signup")
            }, 2000)
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                setDeleteMessage(err.response?.data?.message || err.message)
            }
            else {
                setDeleteMessage("Unknown Error")
            }
        }
    }
    const editProfile = async() => {
        try {
            const response = await api.patch("/editProfile", 
                {
                    username: editUsername,
                    email: editEmail
                }
            )
            setEditMessage(response.data.message)
            setUsername(response.data.username)
            setEmail(response.data.email)
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                setEditMessage(err.response?.data?.message || err.message)
            }
            else {
                setEditMessage("Unknown error")
            }
        }
    }

    return (
        <div>
            <h1>username: {username}</h1>
            <h2>email: {email}</h2>
            <button onClick={getprofile}>
                get Profile
            </button>
            <h2>{message}</h2>
            <button onClick={deleteProfile}>
                delete profile
            </button>
            <h1>{deleteMessage}</h1>
            <button onClick={() => {
                setIsTrue(!isTrue)
                setEditUsername(username)
                setEditEmail(email)
            }}>
                {
                    isTrue
                    ? "close"
                    : "edit"
                }
            </button>
            {
                isTrue && (
                    <div>
                        <input type="text" placeholder="enter your new username: " value={editUsername} onChange={(e) => setEditUsername(e.target.value)} />
                        <input type="email" placeholder="enter your new email: " value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                        <button onClick={editProfile}>
                            Edit profile
                        </button>
                        <h1>{editMessage}</h1>
                    </div>
                )
            }
        </div>
    )
}



export default getProfile






