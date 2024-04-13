import styles from './task.module.css';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { TiTrash } from 'react-icons/ti';

interface TaskProps {
  task: {
    id: string;
    title: string;
    isCompleted: boolean;
  };
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

export function Task({ task, onDelete, onComplete }: TaskProps) {
  return (
    <div className={styles.task}>
      <button className={styles.checkContainer} onClick={() => onComplete(task.id)}>
        {task.isCompleted ? <BsFillCheckCircleFill /> : <div />}
      </button>

      <p className={task.isCompleted ? styles.textCompleted : ""}>
        {task.title}
      </p>

      <button className={styles.deleteButton} onClick={() => onDelete(task.id)}>
        <TiTrash size={20} />
      </button>
    </div>
  );
}
