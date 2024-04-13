import { Task } from '../Task';
import styles from './tasks.module.css';

interface TaskType {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface TasksProps {
  tasks: TaskType[];
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

export function Tasks({ tasks, onDelete, onComplete }: TasksProps) {
  const tasksQuantity = tasks.length;
  const completedTasks = tasks.filter(task => task.isCompleted).length;

  return (
    <div className={styles.tasks}>
      <header className={styles.header}>
        <div>
          <p>Created tasks :)</p>
          <span>{tasksQuantity}</span>
        </div>

        <div>
          <p className={styles.textPurple}>Completed tasks</p>
          <span>{completedTasks} of {tasksQuantity}</span>
        </div>
      </header>

      <div className={styles.list}>
        {tasks.map(task => (
          <Task key={task.id} task={task} onDelete={onDelete} onComplete={onComplete} />
        ))}
      </div>
    </div>
  );
}
