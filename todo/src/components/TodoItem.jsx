import { useEffect, useState } from 'react';



function TodoItem({ todo, index, onToggle, onDelete, onEditToggle, onTextChange }) {
  const todoId = `todo-${index}`;
  const [draft, setDraft] = useState(todo.text);


  useEffect(() => {
    if (todo.isEditing) {
      setDraft(todo.text);
    }
  }, [todo.isEditing, todo.text]);

  const handleSave = () => {
    onTextChange(index, draft);
    onEditToggle(index, false);
  };

  const handleCancel = () => {
    onEditToggle(index, false);
  };

  return (
    <li className="todo-item">
      <input
        id={todoId}
        type="checkbox"
        className="todo-checkbox"
        checked={todo.isDone}
        onChange={() => onToggle(index)}
      />

      <label className="custom-checkbox" htmlFor={todoId}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="transparent">
          <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
        </svg>
      </label>

      {todo.isEditing ? (
        <input
          className="todo-text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
      ) : (
        <label htmlFor={todoId} className="todo-text">
          {todo.text}
        </label>
      )}

      <div className="todo-buttons">
        {todo.isEditing ? (
          <>
            <button className="edit-button" onClick={handleSave}>
              Save
            </button>
            <button className="delete-button" onClick={handleCancel}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="edit-button"
              onClick={() => onEditToggle(index, true)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
            </button>
            <button
              className="delete-button"
              onClick={() => onDelete(index)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
            </button>
          </>
        )}
      </div>
    </li>
  );
}

export default TodoItem;
