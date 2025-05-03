import TodoItem from './TodoItem.jsx';

function TodoList({ items, onToggle, onDelete, onEditToggle, onTextChange }) {
  return (
    <ul className="todo-list">
      {items.map(({ todo, idx }) => (
        <TodoItem
          key={idx}
          index={idx}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEditToggle={onEditToggle}
          onTextChange={onTextChange}
        />
      ))}
    </ul>
  );
}

export default TodoList;