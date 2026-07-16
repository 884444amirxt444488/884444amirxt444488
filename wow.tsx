import api from "../api"
import toast from "react-hot-toast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import type { AxiosError } from "axios"
import { useRef } from "react"
import Task from "./Task"




type ColumnType = {
    _id: string,
    title: string,
    order: number
}




function Column() {




    const [title, setTitle] = useState("")


    const [columnId, setColumnId] = useState("")


    const [editTrue, setEditTrue] = useState(false)
    const [editId, setEditId] = useState("")



    const queryClient = useQueryClient()

    const formRef = useRef<HTMLDivElement>(null)



    const {data = [], isLoading, error} = useQuery<ColumnType[]>({
        queryKey: ["Columns"],
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
                queryKey: ["Columns"]
            })
            const previuslyColumn = queryClient.getQueryData(["Columns"])
            queryClient.setQueryData(["Columns"], (old: ColumnType[] = []) => [
                ...old,
                {
                    _id: "None id",
                    title: data.title,
                    order: 99999999
                }
            ])
            return {previuslyColumn}
        },
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries({
                queryKey: ["Columns"]
            })
        },
        onError: (err: AxiosError<{message: string}>, isLoading, context) => {
            toast.error(err.response?.data?.message || err?.message || "Unknown Error")
            queryClient.setQueryData(["Columns"], context?.previuslyColumn)
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
                queryKey: ["Columns"]
            })
            const previuslyColumn = queryClient.getQueryData(["Columns"])
            queryClient.setQueryData(["Columns"], (old: ColumnType[] = []) => 
                old.filter((item) => (
                    item._id !== data._id
                ))
            )
            return {previuslyColumn}
        },
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries({
                queryKey: ["Columns"]
            })
        },
        onError: (err: AxiosError<{message: string}>, isLoading, context) => {
            toast.error(err.response?.data?.message || err?.message || "Unkown Error")
            queryClient.setQueryData(["Columns"], context?.previuslyColumn)
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
                queryKey: ["Columns"]
            })
            const previuslyColumn = queryClient.getQueryData(["Columns"])
            queryClient.setQueryData(["Columns"], (old: ColumnType[] = []) => 
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
            setEditTrue(false)
            setTitle("")
            toast.success(data.message)
            queryClient.invalidateQueries({
                queryKey: ["Columns"]
            })
        },
        onError: (err: AxiosError<{message: string}>, isLoading, context) => {
            toast.error(err.response?.data?.message || err?.message || "Unkwon Error")
            queryClient.setQueryData(["Columns"], context?.previuslyColumn)
        }
    })

    return (
        <div ref={formRef}>
            <input type="text" placeholder="enter your title: " value={title} onChange={(e) => setTitle(e.target.value)} className="in" />
            <button className="btn" disabled={addColumn.isPending} onClick={() => {
                if (title.trim() === "") {
                    return toast.error("Fill the blank")
                }
                editTrue 
                ? editColumn.mutate({
                    _id: editId,
                    title
                })
                : addColumn.mutate({
                    title
                })
            }}>
                {
                    editTrue
                    ? "Edit"
                    : "Add"
                }
            </button>
            {
                editTrue && (
                    <button className="btn" onClick={() => {
                        setEditTrue(false)
                        setTitle("")
                        setEditId("")
                    }}>
                        Close
                    </button>
                )
            }
            <hr />
            {
                data.map((item) => (
                    <div key={item._id}>
                        <h1 className="jj">Title: {item.title}</h1>
                        <button className="btn" onClick={() => {
                            deleteColumn.mutate({
                                _id: item._id
                            })
                        }}>
                            Delete 
                        </button>
                        <button className="btn" onClick={() => {
                            formRef.current?.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            })
                            setEditTrue(true)
                            setTitle(item.title)
                            setEditId(item._id)
                        }}>
                            Edit
                        </button>
                        <button className="btn" onClick={() => {
                            setColumnId(item._id)
                        }}>
                            Show task
                        </button>
                        {
                            columnId === item._id && (
                                <Task columnId={item._id} />
                            )
                        }
                    </div>
                ))
            }

        </div>




    )





}



export default Column


import { useState } from "react"
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"








type TaskType = {
    _id: string,
    columnId: string,
    task: string,
    description: string,
    completed: boolean
}

type TaskType2 = {
    task: TaskType,
    onDelete: () => void,
    onEdit: (task: string, description: string) => void

}


function TaskItem({task, onDelete, onEdit}: TaskType2) {

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: task._id
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    }




    const [editTrue, setEditTrue] = useState(false)
    const [task2, setTask] = useState("")
    const [description, setDescription] = useState("")

    
    return (
        <div 
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <h1 className="jj">Task: {task.task}</h1>
            <h1 className="jj">Description: {task.description}</h1>
            <h1 className="jj">
                {
                    task.completed
                    ? `✅ Completed`
                    : `❌ Not completed`
                }
            </h1>
            <button className="btn" onClick={onDelete}>
                Delete 
            </button>
            <button className="btn" onClick={() => {
                setEditTrue(true)
            }}>
                Edit
            </button>
            {
                editTrue && (
                    <div>
                        <input type="text" placeholder="enter your new task: " value={task2} onChange={(e) => setTask(e.target.value)} className="in" />
                        <input type="text" placeholder="enter your new description: " value={description} onChange={(e) => setDescription(e.target.value)} className="in" />
                        <button className="btn" onClick={() => onEdit(task2, description)}>
                            Edit
                        </button>
                        <button className="btn" onClick={() => {
                            setEditTrue(false)
                        }}>
                            Close
                        </button>
                    </div>
                )
            }
        </div>

    )


}




export default TaskItem



import api from "../api"
import TaskItem from "./TaskItem"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import type { AxiosError } from "axios"
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import { DndContext, closestCenter } from "@dnd-kit/core"



type TaskType = {
    _id: string,
    task: string,
    description: string,
    columnId: string
    completed: boolean
}

function Task({columnId}: {
    columnId: string
}) {

    const [addTaskTrue, setAddTaskTrue] = useState(false)
    const [task, setTask] = useState("")
    const [description, setDescription] = useState("")




    const queryClient = useQueryClient()

    const {data: TaskData = [], isLoading, error} = useQuery<TaskType[]>({
        queryKey: ["Tasks", columnId],
        queryFn: async() => {
            const response = await api.get(`/getTask/${columnId}`)
            return response.data
        }
    })

    const addTask = useMutation({
        mutationFn: async(data: {
            columnId: string,
            task: string,
            description: string
        }) => {
            const response = await api.post(`/addTask/${columnId}`, data)
            return response.data
        },
        onMutate: (data) => {
            queryClient.cancelQueries({
                queryKey: ["Tasks", columnId]
            })
            const previuslyTask = queryClient.getQueryData(["Tasks", columnId])
            queryClient.setQueryData(["Tasks", columnId], (old: TaskType[] = []) => [
                ...old,
                {
                    _id: "None id",
                    columnId: columnId,
                    task: data.task,
                    description: data.description,
                    completed: false
                }
            ])
            return {previuslyTask}
        },
        onSuccess: (data, variables) => {
            toast.success(data.message)
            queryClient.invalidateQueries({
                queryKey: ["Tasks", variables.columnId]
            })
        },
        onError: (err: AxiosError<{message: string}>, variabels, context) => {
            toast.error(err.response?.data?.message || err?.message || "Unknown Error")
            queryClient.setQueryData(["Tasks", variabels.columnId], context?.previuslyTask)
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
                old.filter(item => item._id !== data._id)
            )
            return {previuslyTask}
        },
        onSuccess: (data, variables) => {
            toast.success(data.message)
            queryClient.invalidateQueries({
                queryKey: ["Tasks", variables.columnId]
            })
        },
        onError: (err: AxiosError<{message: string}>, variabels, context) => {
            toast.error(err.response?.data?.message || err?.message || "Unknown Error")
            queryClient.setQueryData(["Tasks", variabels.columnId], context?.previuslyTask)
        }
    })

    const editTask = useMutation({
        mutationFn: async(data: {
            _id: string,
            columnId: string,
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
            queryClient.setQueryData(["Tasks", columnId], (old: TaskType[] = []) => 
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
            )
            return {previuslyTask}
        },
        onSuccess: (data, variables) => {
            toast.success(data.message)
            queryClient.invalidateQueries({
                queryKey: ["Tasks", variables.columnId]
            })
        },
        onError: (err: AxiosError<{message: string}>, variabels, context) => {
            toast.error(err.response?.data?.message || err?.message || "Unknown Error")
            queryClient.setQueryData(["Tasks", variabels.columnId], context?.previuslyTask)
        }
    })

    const reorder = useMutation({
        mutationFn: async(
            tasks: TaskType[]
        ) => {
            const response = await api.patch(`/reorder`, {
                tasks: tasks.map((item, index) => ({
                    _id: item._id,
                    order: index + 1
                }))
            })
        }
    })

    const hangdrag = async(event: any) => {
        const {active, over} = event
        if (!over || active.id === over.id) return

        queryClient.setQueryData<TaskType[]>(["Tasks", columnId], (old =  []) => {
            const oldIndex = old.findIndex(i => i._id === active.id)
            const newIndex = old.findIndex(p => p._id === over.id)

            const newTask = arrayMove(
                old,
                oldIndex,
                newIndex
            )
            reorder.mutate(newTask)
            return newTask
        })

    }
    
    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={hangdrag}>
            <SortableContext items={TaskData.map((item) => item._id)} strategy={verticalListSortingStrategy}>
                <div>
                    <button className="btn" onClick={() => {
                        setAddTaskTrue(!addTaskTrue)
                    }}>
                        {
                            addTaskTrue
                            ? "Close"
                            : "Add Task"
                        }
                    </button>
                    {
                        addTaskTrue && (
                            <div>
                                <input type="text" placeholder="enter your task: " value={task} onChange={(e) => setTask(e.target.value)} className="in" />
                                <input type="text" placeholder="enter your description: " value={description} onChange={(e) => setDescription(e.target.value)} className="in" />
                                <button className="btn" onClick={() => {
                                    addTask.mutate({
                                        task,
                                        description,
                                        columnId
                                    })
                                }}>
                                    Add
                                </button>
                            </div>
                                )
                                }
                    
                    {
                        TaskData.map((item) => (
                            <div>
                                <TaskItem key={item._id} task={item}
                                onDelete={() => {
                                    deleteTask.mutate({
                                        _id: item._id,
                                        columnId: item.columnId
                                    })
                                }}
                                onEdit={(task2, description) => {
                                    editTask.mutate({
                                        _id: item._id,
                                        task: task2,
                                        description,
                                        columnId: item.columnId
                                    })
                                }} />
                                <button className="btn" onClick={() => {
                                    editTask.mutate({
                                        _id: item._id,
                                        columnId: item.columnId,
                                        completed: !item.completed
                                    })
                                }}>
                                    {
                                        item.completed
                                        ? "Not complete"
                                        : "Complete"
                                    }
                                </button>
                                
                            </div>
                            
                        ))
                    }
                </div>
            </SortableContext>
        </DndContext>


    )
    




}


export default Task

