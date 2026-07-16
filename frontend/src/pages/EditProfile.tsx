import api from "../api"
import toast from "react-hot-toast"
import { useUser } from "../context/UserContext"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"



function EditProfile() {

    const navigate = useNavigate()
    


    const [editTrue, setEditTrue] = useState(true)

    const {setUser} = useUser()
    const [username, setusername] = useState("")
    const [Email, setEmail] = useState("")


    const [editPasswordTrue, setEditPasswordTrue] = useState(false)
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")



    const editProfile = useMutation({
        mutationFn: async(data: {
            username: string,
            email: string
        }) => {
            const response = await api.patch("/editProfile", data)
            return response.data
        },
        onSuccess: (data) => {
            toast.success(data.message)
            setUser({
                username: data.username,
                email: data.email 
            })
            navigate("/dashboard")
        },
        onError: (err: AxiosError<{message: string}>) => {
            toast.error(err.response?.data?.message || err?.message || "Unknown Error")
        }
    })

    const editPassword = useMutation({
        mutationFn: async(data: {
            oldPassword: string,
            newPassword: string,
            confirmPassword: string
        }) => {
            const response = await api.post("/editPassword", data)
            return response.data
        },
        onSuccess: (data) => {
            toast.success(data.message)
            setEditPasswordTrue(false)
            setEditTrue(true)
            navigate("/dashboard")
        },
        onError: (err: AxiosError<{message: string}>) => {
            toast.error(err.response?.data?.message || err?.message || "Unknown Error")
        }
    })


    return (
        <div>
            {
                editTrue && (
                    <div className="edit_box">
                        <div className="editProfile">  
                            <h3 className="hs">Edit</h3>
                            <hr/>
                            <span>new Name: </span>
                            <input type="text" placeholder="enter your new name: " value={username} onChange={(e) => setusername(e.target.value)} className="input44" minLength={20} />
                            <span>new Email: </span>
                            <input type="email" placeholder="enter your new email: " value={Email} onChange={(e) => {setEmail(e.target.value)}} className="input44" minLength={20} />
                            <div className="btns3">
                                <button className="btn6" onClick={() => {
                                    setEditPasswordTrue(true)
                                    setEditTrue(false)
                                }}>
                                    Edit pass
                                </button>
                                <button className="btn5" onClick={() => {
                                    editProfile.mutate({
                                        username,
                                        email: Email
                                    })
                                }}>
                                    Edit
                                </button>
                                
                            </div>
                        </div>
                    </div>

                )
            }
            {
                editPasswordTrue && (
                    <div className="edit_box_password">
                        <div className="editPassword">  
                            <h3 className="hs">Edit</h3>
                            <hr/>
                            <span>Old pass: </span>
                            <input type="text" placeholder="enter your old Pass: " value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="input44" minLength={20} />
                            <span>New pass: </span>
                            <input type="text" placeholder="enter your new email: " value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input44" minLength={20} />
                            <span>Confirm: </span>
                            <input type="text" placeholder="enter your new email: " value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input44" minLength={20} />
                            <div className="btns3">
                                <button className="btn6" onClick={() => {
                                    setEditPasswordTrue(false)
                                    setEditTrue(true)
                                }}>
                                    Edit Profile
                                </button>
                                <button className="btn5" onClick={() => {
                                    editPassword.mutate({
                                        oldPassword,
                                        newPassword,
                                        confirmPassword
                                    })
                                }}>
                                    Edit Pass
                                </button>
                            </div>
                        </div>
                    </div>

                )
            }

        </div>



    )








}



export default EditProfile








