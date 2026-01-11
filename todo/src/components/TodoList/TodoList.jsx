import React from 'react';
import TodoItem from '../TodoItem/TodoItem.jsx';
import styles from './TodoList.module.css';

export default function TodoList({ todos = [], loadTodos, toggle }) {
  if (todos.length === 0) {
    return <p>Нет задач (todos.length = {todos.length})</p>;
  }
  return (
    <ul className={styles.list}>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} toggle={toggle} loadTodos={loadTodos} />
      ))}
    </ul>
  );
}
