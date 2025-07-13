import React from 'react';
import TodoItem from './TodoItem';

export default function TodoList({ todos = [], refresh, toggle }) {
  if (todos.length === 0) {
    return <p>Нет задач (todos.length = {todos.length})</p>;
  }
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} toggle={toggle} refresh={refresh} />
      ))}
    </ul>
  );
}
