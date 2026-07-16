import api from "../api"
import toast from "react-hot-toast"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { useUser } from "../context/UserContext"
import { useState } from "react"
import type { AxiosError } from "axios"
import IsLoading from "./isLoading"
import { Link } from "react-router-dom"
import { useEffect, useRef } from "react"


function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const navigate = useNavigate()
    const {setUser} = useUser()

    const login = useMutation({
        mutationFn: async(data: {
            username: string,
            password: string
        }) => {
            const response = await api.post("/login", data)
            return response.data
        },
        onSuccess: (data) => {
            toast.success(data.message)
            localStorage.setItem("accessToken", data.accessToken)
            setUser({
                username: data.username,
                email: data.email 
            })
            setUsername("")
            setPassword("")
            setTimeout(() => {
                navigate("/profile")
            }, 1000)
        },
        onError: (err: AxiosError<{message: string}>) => {
            toast.error(err.response?.data?.message || err?.message || "Unknown Error")
        }
    })

    return (
        <div className="login_div">
            <div className="login">
                <h3 className="login_text">Login</h3>
                <hr />
                <span className="login_spans">name: </span>
                <input ref={inputRef} type="text" placeholder="enter your name: " value={username} onChange={(e) => setUsername(e.target.value)} className="inputs2" maxLength={16}/>
                <span className="login_spans">password: </span>
                <input type="text" placeholder="enter your password: " value={password} onChange={(e) => setPassword(e.target.value)} className="inputs2" maxLength={16}/>
                <button className="btn" disabled={login.isPending} onClick={() => {
                    if (username.trim() === "" || password.trim() === "") {
                        return toast.error("Fill the balnks")
                    }
                    login.mutate({
                        username,
                        password
                    })
                }}>Next</button>
                <div className="fpD">
                    <span className="login_spans2">Forgotten password: </span>
                    <Link to={"/forgottenPassword"} className="fp">click here</Link>
                </div>
            </div>
            {
                login.isPending && (
                    <IsLoading />
                )
            }
        </div>


    )


}





export default Login


