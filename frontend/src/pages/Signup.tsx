import api from "../api"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useState } from "react"
import { useUser } from "../context/UserContext"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import IsLoading from "./isLoading"
import { useEffect, useRef } from "react"



function Signup() {
    const [username, setUsername] = useState("")
    const [email, setEamil] = useState("")
    const [password, setPassword] = useState("")

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        inputRef.current?.focus()
    }, [])


    const navigate = useNavigate()
    const {setUser} = useUser()


    const signup = useMutation({
        mutationFn: async(data: {
            username: string,
            email: string,
            password: string
        }) => {
            const response = await api.post("/signup", data)
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
            setEamil("")
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
        <div className="signup_div">
            <div className="signup">
                <h3 className="signup_text">Signup</h3>
                <hr />
                <span className="signup_spans">name: </span>
                <input ref={inputRef} type="text" placeholder="enter your name: " value={username} onChange={(e) => setUsername(e.target.value)} className="inputs" maxLength={16}/>
                <span className="signup_spans">email: </span>
                <input type="email" placeholder="enter your email: " value={email} onChange={(e) => setEamil(e.target.value)} className="inputs" maxLength={24}/>
                <span className="signup_spans">password: </span>
                <input type="text" placeholder="enter your password: " value={password} onChange={(e) => setPassword(e.target.value)} className="inputs" maxLength={16}/>
                <button className="btn" disabled={signup.isPending} onClick={() => {
                    if (username.trim() === "" || email.trim() === "" || password.trim() === "") {
                        return toast.error("Fill all blanks")
                    }
                    signup.mutate({
                        username,
                        email,
                        password
                    })
                }}>Next</button>
            </div>
            {
                signup.isPending && (
                    <IsLoading />
                )
            }
        </div>
    )




}


export default Signup





