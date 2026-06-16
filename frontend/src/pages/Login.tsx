import axios from "axios"
import api from "../api"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")

    const navigate = useNavigate()

    const login = async() => {
        try {
            const response = await api.post("/login", 
                {
                    username, 
                    password
                }
            )
            localStorage.setItem("accessToken", response.data.accessToken)
            setMessage(response.data.message)
            setTimeout(() => {
                navigate("/profile")
            }, 2000)
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

    return (
        <div>
            <input type="text" placeholder="enter your name: " value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="enter your pass" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={login}>
                LOGIN
            </button>
            <h1>{message}</h1>
        </div>
    )
}

export default Login