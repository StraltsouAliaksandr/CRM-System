import React, { useState } from 'react';
import { addTodo } from '../api/todos.js';

export default function TodoForm({ refresh }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = text.trim();
    if (val.length < 2 || val.length > 64) {
      setError('Название задачи должно быть от 2 до 64 символов');
      return;
    }

    await addTodo({ title: val, isDone: false });
    
    setText('');
    setError('');
    await refresh();
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        className="todo-input"
        value={text}
        onChange={(e) => setText(e.target.value)}   
        placeholder="Task To Be Done..."
      />
      <button className="add-button">Add</button>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
}
