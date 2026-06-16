import axios from "axios"
import api from "../api"
import { useEffect, useState } from "react"

type TaskType = {
    _id: string,
    task: string,
    description: string,
    completed: boolean
}

function Tasks() {
    const [taskId, setTaskId] = useState("")
    const [task, setTask] = useState("")
    const [description, setDescription] = useState("")
    const [completed, setCompleted] = useState(false)
    const [tasks, setTasks] = useState<TaskType[]>([])
    const [message, setMessage] = useState("")

    const [addTaskMessage, setAddTaskMessage] = useState("")

    const [deleteTaskMessage, setDeleteTaskMessage] = useState("")

    const [editTrue, setEditTrue] = useState(false)
    const [editTaskMessage, setEditTaskMessage] = useState("") 




    useEffect(() => {
        const getTasks = async() => {
            try {
                const response = await api.get("/getTasks")
                setTasks(response.data.tasks)
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
        getTasks()
    }, [])

    const addTask = async() => {
        try {
            const response = await api.post("/addTask", 
                {
                    task,
                    description
                }
            )
            setTaskId(response.data.task._id)
            setTask(response.data.task.task)
            setDescription(response.data.task.description)
            setTasks([
                ...tasks,
                {
                    _id: response.data.task._id,
                    task,
                    description,
                    completed: false
                }
            ])
            console.log(tasks)
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                setAddTaskMessage(err.response?.data?.message || err.message)
            }
            else {
                setAddTaskMessage("Unknown Error")
            }
        }
    }
    const deleteTask = async(id: string) => {
        try {
            const response = await api.delete(`/deleteTask/${id}`)
            setDeleteTaskMessage(response.data.message)
            const filterTask = tasks.filter(
                (item) => item._id !== id
            )
            setTasks(filterTask)
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                setDeleteTaskMessage(err.response?.data?.message || err.message)
            }
            else {
                setDeleteTaskMessage("Unknown Error")
            }
        }
    }
    const editTask = async(id: string) => {
        try {

            const data : any = {}
            if (task.trim()) {
                data.task = task
            }
            if (description.trim()) {
                data.description = description
            }

            const response = await api.patch(`/editTask/${id}`, 
                data
            )
            setEditTrue(false)
            setEditTaskMessage(response.data.message)
            setTasks(
                tasks.map(item => (
                    item._id === id
                    ? {
                        ...item,
                        task,
                        description
                    }
                    : item
                ))
            )
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                setEditTaskMessage(err.response?.data?.message || err.message)
            }
            else {
                setEditTaskMessage("Unknown Error")
            }
        }
    }
    const editCompleted = async(id: string, completed: boolean) => {
        try {
            const response = await api.patch(`/editTask/${id}`, 
                {
                    completed
                }
            )
            setEditTrue(false)
            setEditTaskMessage(response.data.message)
            setTasks(
                tasks.map(item => (
                    item._id === id
                    ? {...item, completed}
                    : item
                ))
            )
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                setEditTaskMessage(err.response?.data?.message || err.message)
            }
            else {
                setEditTaskMessage("Unknown Error")
            }
        }
    }

    return (
        <div>
            <h1>{message}</h1>
            <input type="text" placeholder="enter your task: " value={task} onChange={(e) => setTask(e.target.value)} />
            <input type="text" placeholder="enter your description: " value={description} onChange={(e) => setDescription(e.target.value)} />
            <button onClick={() => {
                editTrue
                ? editTask(taskId)
                : addTask()
            }}>
                {
                    editTrue
                    ? "edit"
                    : "add"
                } 
            </button>
            <h1>{addTaskMessage}</h1>
            <h1>{editTaskMessage}</h1>
            {
                tasks.map(
                    (item) => (
                        <div key={item._id}>
                            <h1>{item.task}</h1>
                            <h2>{item.description}</h2>
                            <h2>{item.completed}</h2>
                            <button onClick={() => {
                                editCompleted(item._id, !item.completed)
                            }}>
                                {
                                    item.completed
                                    ? "yes conpleted"
                                    : "not completed"
                                }
                            </button>
                            <button onClick={() => {
                                setTaskId(item._id)
                                setTask(item.task)
                                setDescription(item.description)
                                setCompleted(item.completed)
                                setEditTrue(true)
                            }}>
                                Edit
                            </button>
                            <button onClick={() => deleteTask(item._id)}>
                                delete
                            </button>
                            <h1>{deleteTaskMessage}</h1>
                        </div>
                    )
                )
            }

        </div>
    )
}

    

export default Tasks













