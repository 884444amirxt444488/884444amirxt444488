import api from "../api"
import toast from "react-hot-toast"
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query"
import TaskItem from "./TaskItem"
import type { AxiosError } from "axios"
import { useState } from "react"


type TaskType = {
    _id: string,
    task: string,
    description: string,
    completed: boolean,
    order: number
}


type ColumnId = {
    columnId: string
}


function Task({columnId}: ColumnId) {
    const [task, setTask] = useState("")
    const [description, setDescription] = useState("")


    const queryClient = useQueryClient()




    const {data: TaskItems = []} = useQuery<TaskType[]>({
        queryKey: ["Tasks", columnId],
        queryFn: async() => {
            const response = await api.get(`/getTasks/${columnId}`)
            return response.data.getTasks
        }
    })

    const addTask = useMutation({
        mutationFn: async(data: {
            task: string,
            description: string
        }) => {
            const response = await api.post(`/addTask/${columnId}`, data)
            return response.data
        },
        onMutate: async(data) => {
            await queryClient.cancelQueries({
                queryKey: ["Tasks", columnId]
            })
            const previuslyTask = queryClient.getQueryData(["Tasks", columnId])
            queryClient.setQueryData(["Tasks", columnId], (old: TaskType[] = []) => [
                ...old,
                {
                    _id: "None id",
                    task: data.task,
                    description: data.description,
                    completed: false
                }
            ])
            return {previuslyTask}
        },
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries({
                queryKey: ["Tasks", columnId]
            })
        },
        onError: (err: AxiosError<{message: string}>, variabels, context) => {
            toast.error(err.response?.data?.message || err?.message || "Unknown Error")
            queryClient.setQueryData(["Tasks", columnId], context?.previuslyTask)
        }
    })
    const deleteTask = useMutation({
        mutationFn: async(data: {
            _id: string,
            columnId: string
        }) => {
            const response = await api.delete(`/deleteTask/${data._id}`, {data})
            return response.data
        },
        onMutate: (data) => {
            queryClient.cancelQueries({
                queryKey: ["Tasks", columnId]
            })
            const previuslyTask = queryClient.getQueryData(["Tasks", columnId])
            queryClient.setQueryData(["Tasks", columnId], (old: TaskType[] = []) => 
                old.filter((item) => (
                    item._id !== data._id 
                ))
            )
            return {previuslyTask}
        },
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries({
                queryKey: ["Tasks", columnId]
            })
        },
        onError: (err: AxiosError<{message: string}>, variabels, context) => {
            toast.error(err.response?.data?.message || err?.message || "Unkown Error")
            queryClient.setQueryData(["Tasks", columnId], context?.previuslyTask)
        }
    })

    const editTask = useMutation({
        mutationFn: async(data: {
            _id: string,
            columnId: string
            task?: string,
            description?: string,
            completed?: boolean
        }) => {
            const response = await api.patch(`/editTask/${data._id}`, data)
            return response.data
        },
        onMutate: (data) => {
            queryClient.cancelQueries({
                queryKey: ["Tasks", columnId]
            })
            const previuslyTask = queryClient.getQueryData(["Tasks", columnId])
            queryClient.setQueryData(["Tasks", columnId], (old: TaskType[] = []) => (
                old.map((item) => (
                    item._id === data._id
                    ? {
                        ...item,
                        task: data.task ?? item.task,
                        description: data.description ?? item.description,
                        completed: data.completed ?? item.completed
                    }
                    : item
                ))
            ))
            return {previuslyTask}
        },
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries({
                queryKey: ["Tasks", columnId]
            })
        },
        onError: (err: AxiosError<{message: string}>, variabels, context) => {
            toast.error(err.response?.data?.message || err?.message || "Unkown Error")
            queryClient.setQueryData(["Tasks", columnId], context?.previuslyTask)
        }
    })


    return (
        <div className="wowwow">
            <div className="iamtired">
                <input type="text" placeholder="task: " className="in2" value={task} onChange={(e) => setTask(e.target.value)} maxLength={14} />
                <textarea className="textBox2" placeholder="description: " value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                <button className="btn44" onClick={() => {
                    setTask("")
                    setDescription("")
                    addTask.mutate({
                        task,
                        description
                    })
                }}>Add</button>
            </div>
            <hr />
            <div className="jjjj">
                {
                    TaskItems.map((item) => (
                        <TaskItem key={item._id} 
                            task={item}
                            onDelete={() => {
                                deleteTask.mutate({
                                    _id: item._id,
                                    columnId
                                })
                            }}
                            onEdit={(task2, description2) => {
                                
                                editTask.mutate({
                                    _id: item._id,
                                    columnId,
                                    task: task2,
                                    description: description2,
                                })
                            }}
                            onCompleted={(completed) => {
                                editTask.mutate({
                                    _id: item._id,
                                    columnId,
                                    completed: !item.completed
                                })
                            }}
                        />
                    ))
                }
            </div>
        </div>
    )
}





export default Task