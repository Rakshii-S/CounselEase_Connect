import { useEffect, useState } from "react";
import { Header } from "./ToDo components/Header";
import { Tasks } from "./ToDo components/Tasks";

interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
}

const LOCAL_STORAGE_KEY = 'todo:tasks';

function ToDo() {
  const [tasks, setTasks] = useState<Task[]>([]);

  function loadSavedTasks() {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }

  function setTasksAndSave(newTasks: Task[]) {
    setTasks(newTasks);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTasks));
  }

  useEffect(() => {
    loadSavedTasks();
  }, []);

  function addTask(taskTitle: string) {
    setTasksAndSave([
      ...tasks,
      {
        id: crypto.randomUUID(),
        title: taskTitle,
        isCompleted: false
      }
    ]);
  }

  function deleteTaskById(taskId: string) {
    const newTasks = tasks.filter(task => task.id !== taskId);
    setTasksAndSave(newTasks);
  }

  function toggleTaskCompletedById(taskId: string) {
    const newTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          isCompleted: !task.isCompleted
        };
      }
      return task;
    });
    setTasksAndSave(newTasks);
  }

  return (
    <>
    <div className="ml-10 mt-[-150px]">
      <Header handleAddTask={addTask} />
      <img 
        src={'assets/to-do-list.png'}
        alt="ToDo Logo" 
        className='invert-white ml-[-20px] md:w-20 md:h-20 m-10 w-14 h-14 mr-16'/>
    </div>
    <Tasks
        tasks={tasks}
        onDelete={deleteTaskById}
        onComplete={toggleTaskCompletedById}
      />
    </>
  );
}

export default ToDo;
