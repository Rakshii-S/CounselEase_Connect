
import styles from './header.module.css';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { useState, FormEvent, ChangeEvent } from 'react';

interface Props {
  handleAddTask: (taskTitle: string) => void;
}

export function Header({ handleAddTask }: Props) {
  const [title, setTitle] = useState<string>('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    handleAddTask(title);
    setTitle('');
  }

  function onChangeTitle(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  return (
    <>
    <div className={styles.header}>
      <form onSubmit={handleSubmit} className={styles.newTaskForm}>
        <input placeholder="Add a new task..." type="text" onChange={onChangeTitle} value={title} />
        <button type="submit"> <AiOutlinePlusCircle size={30} /></button>
      </form>
    </div>
    </>
  );
}
