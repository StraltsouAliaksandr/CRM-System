import { FormEvent, useState } from 'react';
import { addTodo } from '../../api/todos';
import styles from './TodoForm.module.css';

interface TodoFormProps {
  loadTodos: () => Promise<void>;
}

export default function TodoForm({ loadTodos }: TodoFormProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const value = text.trim();

    if (value.length < 2 || value.length > 64) {
      setError('Название задачи должно быть от 2 до 64 символов');
      return;
    }

    try {
      await addTodo({ title: value, isDone: false });
      setText('');
      setError('');
      await loadTodos();
    } catch {
      alert('Ошибка добавления задачи');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Task To Be Done..."
      />
      <button className={styles.addButton}>Add</button>
      {error && <div className={styles.errorMessage}>{error}</div>}
    </form>
  );
}

