import TodoItem from '../TodoItem/TodoItem';
import styles from './TodoList.module.css';
import { Todo } from '../../types/todo';

interface TodoListProps {
  todos: Todo[];
  loadTodos: () => Promise<void>;
  toggle: (id: number, nextState: boolean) => Promise<void>;
}

export default function TodoList({ todos, loadTodos, toggle }: TodoListProps) {
  if (todos.length === 0) {
    return <p>Нет задач</p>;
  }

  return (
    <ul className={styles.list}>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} toggle={toggle} loadTodos={loadTodos} />
      ))}
    </ul>
  );
}

