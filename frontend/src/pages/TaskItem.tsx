import { useState } from "react"

type TaskItems = {
    _id: string,
    task: string,
    description: string,
    completed: boolean,
    order: number
}

type TaskType = {
    task: TaskItems,
    onDelete: () => void,
    onEdit: (task2: string, description2: string) => void,
    onCompleted: (completed: boolean) => void
}


function TaskItem({task, onDelete, onEdit, onCompleted}: TaskType) {
    const [editTrue, setEditTrue] = useState(false)
    const [task2, setTask2] = useState("")
    const [description2, setDescription2] = useState("")

    const [completed, setCompleted] = useState(task.completed)
    
    return (
        <div className="all">
            <div className={`taskDiv ${task.completed ? "completed" : ""}`}>
                <div className="botn">
                    <button className="btn19" onClick={() => {
                        editTrue
                        ? setEditTrue(false)
                        : onDelete()
                    }}>❌</button>
                    <button className="btn190" onClick={() => {
                        editTrue 
                        ? onEdit(task2, description2)
                        : setEditTrue(true)
                        setEditTrue(!editTrue)
                        setDescription2("")
                        setTask2("")
                    }}>
                        {
                            editTrue
                            ? "Edit"
                            : "✏️"
                        }
                    </button>
                </div>
                {
                    editTrue 
                    ? <div>
                        <input type="text" placeholder="new task: " value={task2} onChange={(e) => setTask2(e.target.value)} maxLength={16} className="in2" />
                        <textarea placeholder="enter your new Description: " value={description2} onChange={(e) => setDescription2(e.target.value)} className="textBox2">{task.description}</textarea>
                    </div>
                    : <div>
                        <h2 className="nnnn">Task: {task.task}</h2>
                        <hr className="hr"/>
                        <h4 className="oopp">Description: {task.description}</h4>
                    </div>
                }
                <button className="Complete" onClick={() => {
                    const newComplreted = !completed
                    setCompleted(newComplreted)
                    onCompleted(newComplreted)
                }}>
                    {
                        task.completed
                            ? "✅"
                            : "❌"
                    }
                </button>
            </div>
        </div>


    )


}


export default TaskItem