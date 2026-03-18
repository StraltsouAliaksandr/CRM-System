import { useState } from 'react';
import { addTodo } from '../../api/todos';
import { useNotification } from '../Notifications/NotificationProvider';
import styles from './TodoForm.module.css';

interface Props {
  loadTodos: () => Promise<void>;
}

export default function TodoForm({ loadTodos }: Props) {
  const [text, setText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { showNotification } = useNotification();

  const submitNewTodo = async (formData: FormData): Promise<void> => {
    const title = String(formData.get('title') ?? '').trim();

    if (title.length < 2 || title.length > 64) {
      setError('Название задачи должно быть от 2 до 64 символов');
      return;
    }

    try {
      await addTodo({ title, isDone: false });
      setText('');
      setError('');
      await loadTodos();
    } catch {
      showNotification('Ошибка добавления задачи');
    }
  };

  return (
    <form className={styles.form} action={submitNewTodo}>
      <input
        className={styles.input}
        name="title"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Task To Be Done..."
      />
      <button className={styles.addButton}>Add</button>
      {error && <div className={styles.errorMessage}>{error}</div>}
    </form>
  );
}
