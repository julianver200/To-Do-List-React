import React, {useState, useEffect, useRef} from "react";
import "./styles/TodoList.css";

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [editText, setEditText] = useState('');
    const inputRef = useRef();

    useEffect(() =>{
        const storedTasks = JSON.parse(localStorage.getItem("tasks"));
        if (storedTasks && storedTasks.length > 0) {
        setTasks(storedTasks);
        }   
    }, []);


    useEffect(() =>{
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        inputRef.current.focus();
    }, [tasks]);

    const handleInputChange = (e) => {
        setNewTask(e.target.value);
    };

    const addTask = (e) => {
        e.preventDefault();
        if(newTask.trim() === "")return;
        
            const task = {text: newTask,
                          completed: false,
                          isEditing: false
            };
            setTasks(t => [...t, task]);
            setNewTask(""); 
        
    }
    const deleteTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index ));

    }
    const handleCheckbox = (index) => {
        setTasks( t =>
            t.map((task, i) =>
            i === index ? { ...task, completed: !task.completed } : task
            )
        );
    };
    const multipleDelete = () => {
        setTasks(tasks.filter(task => !task.completed));
    };
    const allDelete = () => {
         setTasks([]);
         localStorage.removeItem("tasks"); 
    };
    const editTask = (index) => {
        setTasks((t) =>
            t.map((task, i) =>
            i === index
                ? { ...task, isEditing: true } // enable edit mode for this one
                : { ...task, isEditing: false } // disable edit for others
            )
        );
        setEditText(tasks[index].text);
    };
    const saveTask = (index) => {
        if (editText.trim() === "") return;

        setTasks((t) =>
        t.map((task, i) =>
            i === index ? { ...task, text: editText, isEditing: false } : task
        )
        );
        setEditText("");
     };

    return(
        <>
            <div className="container">
                <h1>To-Do List</h1>

                <div className="inputContainer" >
                    <input placeholder="Add a task..." onChange={handleInputChange} value={newTask} maxLength={50} ref={inputRef}/>
                    <button onClick={addTask}>Add</button>
                </div>

               <ul className="taskList">
                    {tasks.map((task, index) => (
                        <li key={index}>
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleCheckbox(index)}
                            id="taskCheckbox"
                        />

              {task.isEditing ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="editInput"
                  />
                  <button onClick={() => saveTask(index)}>Save</button>
                </>
              ) : (
                <>
                  <span
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                    }}
                  >
                    {task.text}
                  </span>
                  <button onClick={() => editTask(index)}>
                    <i>edit</i>
                  </button>
                  <button id="deleteButton" onClick={() => deleteTask(index)}>
                    X
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
                <div className="tcdContainer">
                    <span >Total: {tasks.length}</span>
                    <span>Completed: {tasks.filter(task => task.completed).length}</span>
                    <span id="deleteTask" onClick={multipleDelete} style={{cursor: "pointer"}}>Delete</span>
                    <span id="deleteTask" onClick={() =>allDelete()} style={{cursor: "pointer"}}>Delete All</span>
                </div>

            </div>

        </>
    );
};

export default TodoList