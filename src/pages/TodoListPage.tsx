import { useEffect, useState } from 'react';
import { getAllToDos } from '../api/todos';
import TodoForm from '../components/TodoForm/TodoForm';
import TodoFilters from '../components/TodoFilters/TodoFilters';
import TodoList from '../components/TodoList/TodoList';
import { useNotification } from '../components/Notifications/NotificationProvider';
import styles from './TodoListPage.module.css';
import { Filter, Todo, TodoInfo } from '../types/todo';

export default function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [counts, setCounts] = useState<TodoInfo>({
    all: 0,
    inWork: 0,
    completed: 0,
  });
  const [filter, setFilter] = useState<Filter>('all');
  const { showNotification } = useNotification();

  const refreshTodos = async (): Promise<void> => {
    try {
      const { data, info } = await getAllToDos(filter);
      setTodos(data);
      setCounts(info);
    } catch {
      showNotification('Не удалось загрузить список задач.');
    }
  };

  useEffect(() => {
    void refreshTodos();
  }, [filter]);

  return (
    <div className={styles.wrapper}>
      <TodoForm refreshTodos={refreshTodos} />
      <TodoFilters filter={filter} setFilter={setFilter} counts={counts} />
      <TodoList todos={todos} refreshTodos={refreshTodos} />
    </div>
  );
}
