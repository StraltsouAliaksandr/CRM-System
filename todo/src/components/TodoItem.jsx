import React, { useState, useEffect } from 'react';
import * as api from '../api/todos.js';

export default function TodoItem({ todo, toggle, refresh }) {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(todo.title);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (editing) {
      setDraft(todo.title);
      setError('');
    }
  }, [editing, todo.title]);

  const save = async () => {
    const val = draft.trim();
    if (val.length < 2 || val.length > 64) {
      setError('Название задачи должно быть от 2 до 64 символов');
      return;
    }
    await api.updateTodo(todo.id, { title: val, isDone: todo.isDone });
    setEditing(false);
    await refresh();
  };

  const remove = async () => {
    await api.deleteTodo(todo.id);
    await refresh();
  };

  const handleToggle = () => {

    toggle(todo.id, !todo.isDone);
  };

  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={todo.isDone}
        onChange={handleToggle}
        className="todo-checkbox"
      />
      <label className="custom-checkbox" />

      {editing ? (
        <>
          <input
            className="todo-text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
          />
          {error && <div className="error-message">{error}</div>}
        </>
      ) : (
        <span
          className={`todo-text${todo.isDone ? ' completed' : ''}`}
          onClick={handleToggle}       
          style={{ cursor: 'pointer' }}       
        >
          {todo.title}
        </span>
      )}

      <div className="todo-buttons">
        {editing ? (
          <>
          <button className="edit-button" onClick={save}>Сохранить</button>
          <button className="delete-button" onClick={() => setEditing(false)}>Отменить</button>
        </>
        ) : (
          <>
          <button className="edit-button" onClick={() => setEditing(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
          </button>
          
          <button className="delete-button" onClick={remove}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
          </button>
        </>
        )}
      </div>
    </li>
  );
}



