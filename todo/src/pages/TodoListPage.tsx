import { useEffect, useState } from 'react';
import { getAllToDos, updateTodo } from '../api/todos';
import TodoForm from '../components/TodoForm/TodoForm';
import TodoFilters from '../components/TodoFilters/TodoFilters';
import TodoList from '../components/TodoList/TodoList';
import styles from './TodoListPage.module.css';
import { Filter, Todo, TodoCounts } from '../types/todo';

export default function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [counts, setCounts] = useState<TodoCounts>({
    all: 0,
    inWork: 0,
    completed: 0,
  });
  const [filter, setFilter] = useState<Filter>('all');

  const loadTodos = async (): Promise<void> => {
    try {
      const { data, info } = await getAllToDos(filter);
      setTodos(data);
      setCounts(info);
    } catch {
      alert('Не удалось загрузить список задач.');
    }
  };

  useEffect(() => {
    void loadTodos();
  }, [filter]);

  const handleToggle = async (id: number, newDone: boolean): Promise<void> => {
    await updateTodo(id, { isDone: newDone });
    await loadTodos();
  };

  return (
    <div className={styles.wrapper}>
      <TodoForm loadTodos={loadTodos} />
      <TodoFilters filter={filter} setFilter={setFilter} counts={counts} />
      <TodoList todos={todos} toggle={handleToggle} loadTodos={loadTodos} />
    </div>
  );
}

