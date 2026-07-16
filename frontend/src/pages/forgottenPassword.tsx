import api from "../api"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import IsLoading from "./isLoading"


function ForgottenPassword() {
    const [email, setEmail] = useState("")

    const [sendCode, setSendCode] = useState(true)


    const [editTrue, setEditTrue] = useState(false)
    const [code, setCode] = useState("")
    const [password, setPassword] = useState("")



    const getCode = useMutation({
        mutationFn: async(data: {
            email: string
        }) => {
            const response = await api.post("/getCode", data)
            return response.data
        },
        onSuccess: (data) => {
            toast.success(data.message)
            setSendCode(false)
            setEditTrue(true)
        },
        onError: (err: AxiosError<{message: string}>) => {
            toast.error(err.response?.data?.message || err?.message || "Unknown Error")
        }
    })

    const editPassword = useMutation({
        mutationFn: async(data: {
            code: string,
            email: string,
            password: string
        }) => {
            const response = await api.post("/changePassword", data)
            return response.data
        },
        onSuccess: (data) => {
            toast.success(data.message)
            setEmail("")
            setCode("")
            setPassword("")
            setEditTrue(false)
            setSendCode(true)
        },
        onError: (err: AxiosError<{message: string}>) => {
            toast.error(err.response?.data?.message || err?.message || "Unknown Error")
        }
    })




    return (
        <div>
            <div className="btns1">
                <div className="btns2">
                    <button onClick={() => {
                        setSendCode(true)
                        setEditTrue(false)
                    }} className="btn3">Get code</button>
                    <button onClick={() => {
                        setEditTrue(true)
                        setSendCode(false)
                    }} className="btn3">change pass</button>
                </div>
            </div>
            {
                sendCode && (
                    <div className="fpD2">
                        <div className="getEmail">
                            <span>Email: </span>
                            <input type="text" placeholder="enter your email: " value={email} onChange={(e) => setEmail(e.target.value)} className="fpInput" maxLength={24} />
                            <h3>We will send you a code with 6 character that expires in 10 min.</h3>
                            <button onClick={() => {
                                if (email.trim() === "") {
                                    return toast.error(`Fill the blank`)
                                }
                                getCode.mutate({
                                    email
                                })
                            }} className="btn2">get code</button>
                        </div>
                    </div>
                )
            }
            {
                editTrue && (
                    <div className="changePass">
                        <div className="changePassAll">
                            <span>new password: </span>
                            <input type="text" placeholder="enter your new pass" value={password} onChange={(e) => setPassword(e.target.value)} className="np" maxLength={16} />
                            <span>Code: </span>
                            <input type="text" placeholder="enter your code" value={code} onChange={(e) => {
                                setCode(e.target.value)
                            }} className="np" maxLength={16} />
                            <button onClick={() => {
                                if (code.trim() === "" || password.trim() === "") {
                                    return toast.error("Fill all blanks")
                                }
                                editPassword.mutate({
                                    code,
                                    email,
                                    password
                                })
                            }} className="btn2">Change</button>
                        </div>
                    </div>
                )
                
            }
            {
                getCode.isPending || editPassword.isPending && (
                    <IsLoading />
                )
            }
        </div>
        


    )









}


export default ForgottenPassword



