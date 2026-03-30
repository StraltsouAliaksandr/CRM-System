import { useState } from 'react';
import { addTodo } from '../../api/todos';
import { useNotification } from '../Notifications/NotificationProvider';
import { validateTodoTitle } from '../../utils/todoValidation';
import styles from './TodoForm.module.css';

interface Props {
  refreshTodos: () => Promise<void>;
}

export default function TodoForm({ refreshTodos }: Props) {
  const [text, setText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { showNotification } = useNotification();

  const submitNewTodo = async (): Promise<void> => {
    const title = text.trim();
    const titleError = validateTodoTitle(title);

    if (titleError) {
      setError(titleError);
      return;
    }

    try {
      await addTodo({ title, isDone: false });
      setText('');
      setError('');
      await refreshTodos();
    } catch {
      showNotification('Ошибка добавления задачи');
    }
  };

  return (
    <form className={styles.form} action={submitNewTodo}>
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
