import { FormEvent, useState } from 'react';
import { deleteTodo, updateTodo } from '../../api/todos';
import editIcon from '../../assets/icons/edit.svg';
import deleteIcon from '../../assets/icons/delete.svg';
import saveIcon from '../../assets/icons/save.svg';
import cancelIcon from '../../assets/icons/cancel.svg';
import styles from './TodoItem.module.css';
import { Todo } from '../../types/todo';

interface TodoItemProps {
  todo: Todo;
  toggle: (id: number, nextState: boolean) => Promise<void>;
  loadTodos: () => Promise<void>;
}

export default function TodoItem({ todo, toggle, loadTodos }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const [error, setError] = useState('');

  const handleEdit = (): void => {
    setDraft(todo.title);
    setError('');
    setEditing(true);
  };

  const saveTodo = async (): Promise<void> => {
    const value = draft.trim();
    if (value.length < 2 || value.length > 64) {
      setError('Название задачи должно быть от 2 до 64 символов');
      return;
    }

    try {
      await updateTodo(todo.id, { title: value, isDone: todo.isDone });
      setEditing(false);
      await loadTodos();
    } catch {
      alert('Failed to save todo.');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (editing) {
      await saveTodo();
      return;
    }

    handleEdit();
  };

  const removeTodo = async (): Promise<void> => {
    try {
      await deleteTodo(todo.id);
      await loadTodos();
    } catch {
      alert('Failed to delete todo.');
    }
  };

  const handleToggle = (): void => {
    void toggle(todo.id, !todo.isDone);
  };

  const handleCancel = (): void => {
    setEditing(false);
    setError('');
  };

  return (
    <li>
      <form className={styles.item} onSubmit={handleSubmit}>
        <input
          id={`todo-${todo.id}`}
          type="checkbox"
          checked={todo.isDone}
          onChange={handleToggle}
          className={styles.checkbox}
        />

        <label htmlFor={`todo-${todo.id}`} className={styles.customCheckbox} />

        {editing ? (
          <>
            <input
              className={styles.text}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            {error && <div className={styles.errorMessage}>{error}</div>}
          </>
        ) : (
          <span
            className={`${styles.text} ${todo.isDone ? styles.completed : ''}`}
            onClick={handleToggle}
            style={{ cursor: 'pointer' }}
          >
            {todo.title}
          </span>
        )}

        <div className={styles.buttons}>
          {editing ? (
            <>
              <button className={styles.editButton} type="submit">
                <img src={saveIcon} alt="Save" />
              </button>
              <button
                className={styles.cancelButton}
                type="button"
                onClick={handleCancel}
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

