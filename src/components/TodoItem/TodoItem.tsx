import { FormEvent, useState } from 'react';
import { deleteTodo, updateTodo } from '../../api/todos';
import editIcon from '../../assets/icons/edit.svg';
import deleteIcon from '../../assets/icons/delete.svg';
import saveIcon from '../../assets/icons/save.svg';
import cancelIcon from '../../assets/icons/cancel.svg';
import styles from './TodoItem.module.css';
import { Todo } from '../../types/todo';
import { useNotification } from '../Notifications/NotificationProvider';
import { validateTodoTitle } from '../../utils/todoValidation';

interface Props {
  todo: Todo;
  refreshTodos: () => Promise<void>;
}

export default function TodoItem({ todo, refreshTodos }: Props) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(todo.title);
  const [error, setError] = useState<string>('');
  const { showNotification } = useNotification();

  const startEditing = (): void => {
    setEditedTitle(todo.title);
    setError('');
    setIsEditing(true);
  };

  const saveTodo = async (): Promise<void> => {
    const value = editedTitle.trim();
    const validationError = validateTodoTitle(value);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await updateTodo(todo.id, { title: value, isDone: todo.isDone });
      setIsEditing(false);
      await refreshTodos();
    } catch {
      showNotification('Не удалось сохранить задачу.');
    }
  };

  const updateStatus = async (): Promise<void> => {
    try {
      await updateTodo(todo.id, { isDone: !todo.isDone });
      await refreshTodos();
    } catch {
      showNotification('Не удалось обновить статус задачи.');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (isEditing) {
      await saveTodo();
      return;
    }

    startEditing();
  };

  const removeTodo = async (): Promise<void> => {
    try {
      await deleteTodo(todo.id);
      await refreshTodos();
    } catch {
      showNotification('Не удалось удалить задачу.');
    }
  };

  const handleStatusToggle = (): void => {
    void updateStatus();
  };

  const cancelEditing = (): void => {
    setIsEditing(false);
    setError('');
  };

  return (
    <li>
      <form className={styles.item} onSubmit={handleSubmit}>
        <input
          id={`todo-${todo.id}`}
          type="checkbox"
          checked={todo.isDone}
          onChange={handleStatusToggle}
          className={styles.checkbox}
        />

        <label htmlFor={`todo-${todo.id}`} className={styles.customCheckbox} />

        {isEditing ? (
          <>
            <input
              className={styles.text}
              value={editedTitle}
              onChange={(event) => setEditedTitle(event.target.value)}
            />
            {error && <div className={styles.errorMessage}>{error}</div>}
          </>
        ) : (
          <span
            className={`${styles.text} ${todo.isDone ? styles.completed : ''}`}
            onClick={handleStatusToggle}
            style={{ cursor: 'pointer' }}
          >
            {todo.title}
          </span>
        )}

        <div className={styles.buttons}>
          {isEditing ? (
            <>
              <button className={styles.editButton} type="submit">
                <img src={saveIcon} alt="Save" />
              </button>
              <button
                className={styles.cancelButton}
                type="button"
                onClick={cancelEditing}
              >
                <img src={cancelIcon} alt="Cancel" />
              </button>
            </>
          ) : (
            <>
              <button className={styles.editButton} type="submit">
                <img src={editIcon} alt="Edit" />
              </button>

              <button
                className={styles.deleteButton}
                type="button"
                onClick={removeTodo}
              >
                <img src={deleteIcon} alt="Delete" />
              </button>
            </>
          )}
        </div>
      </form>
    </li>
  );
}
