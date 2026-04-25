import TodoItem from '../TodoItem/TodoItem';
import styles from './TodoList.module.css';
import { Todo } from '../../types/todo';

interface Props {
  todos: Todo[];
  refreshTodos: () => Promise<void>;
}

export default function TodoList({ todos, refreshTodos }: Props) {
  if (todos.length === 0) {
    return <p>Нет задач</p>;
  }

  return (
    <ul className={styles.list}>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} refreshTodos={refreshTodos} />
      ))}
    </ul>
  );
}
