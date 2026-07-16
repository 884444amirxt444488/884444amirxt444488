import api from "../api"
import toast from "react-hot-toast"
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { useState } from "react"
import Task from "./Task"

type ColumnType = {
    _id: string,
    title: string,
    order: number
}


function Column() {
    const [showTask, setShowTask] = useState(false)
    const [columnId, setColumnId] = useState("")
    
    const queryClient = useQueryClient()

    const [title, setTitle] = useState("")


    const [editTrue, setEditTrue] = useState(false)
    const [editId, setEditId] = useState("")
    const [editTitle, setEditTitle] = useState("")



    const {data = [], isLoading, error} = useQuery<ColumnType[]>({
        queryKey: ["Column"],
        queryFn: async() => {
            const response = await api.get("/getColumn")
            return response.data
        }
    })

    const addColumn = useMutation({
        mutationFn: async(data: {
            title: string
        }) => {
            const response = await api.post("/addColumn", data)
            return response.data
        },
        onMutate: (data) => {
            setTitle("")
            queryClient.cancelQueries({
                queryKey: ["Column"]
            })
            const previuslyColumn = queryClient.getQueryData(["Column"])
            queryClient.setQueryData(["Column"], (old: ColumnType[] = []) => [
                ...old,
                {
                    _id: "None Id",
                    title: data.title,
                    order: 44444444
                }
            ])
            return {previuslyColumn}
        },
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries({
                queryKey: ["Column"]
            })
        },
        onError: (err: AxiosError<{message: string}>, isLoading, context) => {
            toast.error(err.response?.data?.message || err?.message || "Unknown Error")
            queryClient.setQueryData(["Column"], context?.previuslyColumn)
        }
    })

    const deleteColumn = useMutation({
        mutationFn: async(data: {
            _id: string
        }) => {
            const response = await api.delete(`/deleteColumn/${data._id}`)
            return response.data
        },
        onMutate: (data) => {
            queryClient.cancelQueries({
                queryKey: ["Column"]
            })
            const previuslyColumn = queryClient.getQueryData(["Column"])
            queryClient.setQueryData(["Column"], (old: ColumnType[] = []) => 
                old.filter((item) => item._id !== data._id)
            )
            return {previuslyColumn}
        },
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries({
                queryKey: ["Column"]
            })
        },
        onError: (err: AxiosError<{message: string}>, isLoading, context) => {
            toast.error(err.response?.data?.message || err?.message || "Unkown Error")
            queryClient.setQueryData(["Column"], context?.previuslyColumn)
        }
    })

    const editColumn = useMutation({
        mutationFn: async(data: {
            _id: string,
            title: string
        }) => {
            const response = await api.patch(`/editColumn/${data._id}`, data)
            return response.data
        },
        onMutate: (data) => {
            queryClient.cancelQueries({
                queryKey: ["Column"]
            })
            setEditTrue(false)
            const previuslyColumn = queryClient.getQueryData(["Column"])
            queryClient.setQueryData(["Column"], (old: ColumnType[] = []) => 
                old.map((item) => (
                    item._id === data._id 
                    ? {
                        ...item,
                        title: data.title
                    }
                    : item
                ))
            )
            return {previuslyColumn}
        },
        onSuccess: (data) => {
            setEditId("")
            toast.success(data.message)
            queryClient.invalidateQueries({
                queryKey: ["Column"]
            })
        },
        onError: (err: AxiosError<{message: string}>, isLoading, context) => {
            toast.error(err.response?.data?.message || err?.message || "Unknown Error")
            queryClient.setQueryData(["Column"], context?.previuslyColumn)
        }
    })

    return (
        <div>
            
            <hr/>
                {
                    showTask 
                    ? <div>
                        <button className="btn3" onClick={() => {
                            setShowTask(false)
                            setColumnId("")
                        }}>
                            Back
                        </button>
                        <Task columnId={columnId} />
                    </div>
                    : 
                    <div>
                    <div className="Add">
                        <input type="text" placeholder="Title" className="in2" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={10} />
                        <button className="btn15" onClick={() => {
                            addColumn.mutate({
                                title
                            })
                        }}>Add</button>
                    </div>
                    <div className="bbbbbbbb">
                        
                        {data.map((item) => (
                            <div key={item._id} className="folders">
                                <div className="folder" onClick={() => {
                                    setShowTask(true)
                                    setColumnId(item._id)
                                }}>
                                    {
                                        item._id === editId
                                        ? <button className="bbttnn" onClick={(e) => {
                                            e.stopPropagation()
                                            setEditId("")
                                            setEditTitle("")
                                        }}>
                                            Close
                                        </button>
                                        : <i>📁</i>
                                    }
                                    {
                                        item._id === editId 
                                        ? <input onClick={(e) => e.stopPropagation()} type="text" placeholder="Title: " value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="in" maxLength={14} />
                                        : <h2>{item.title}</h2>
                                    }
                                    <div className="btns7">
                                        <button className="bbttnn" onClick={(e) => {
                                            e.stopPropagation()
                                            item._id === editId 
                                            ? editColumn.mutate({
                                                _id: item._id,
                                                title: editTitle
                                            })
                                            : setEditId(item._id)
                                        }}>
                                            {
                                                editTrue
                                                ? "➜"
                                                : "✏️"
                                            }
                                        </button>
                                        <button className="bbttnn" onClick={(e) => {
                                            e.stopPropagation()
                                            deleteColumn.mutate({
                                                _id: item._id
                                            })
                                        }}>
                                            ❌
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>

                    }
                    
                

        </div>
    )


}


export default Column