import React, { useState } from 'react';
import { addTodo } from '../../api/todos.js';
import styles from './TodoForm.module.css';

export default function TodoForm({ loadTodos }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = text.trim();
    if (val.length < 2 || val.length > 64) {
      setError('Название задачи должно быть от 2 до 64 символов');
      return;
    }

    try {
      await addTodo({ title: val, isDone: false });
      setText('');
      setError('');
      await loadTodos();
    } catch (err) {
      alert('Ошибка добавления задачи');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        value={text}
        onChange={(e) => setText(e.target.value)}   
        placeholder="Task To Be Done..."
      />
      <button className={styles.addButton}>Add</button>
      {error && <div className={styles.errorMessage}>{error}</div>}
    </form>
  );
}
