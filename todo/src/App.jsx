import { useState } from 'react';
import TodoList from './components/TodoList.jsx';
import TodoFilters from './components/TodoFilters.jsx';

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [newTask, setNewTask] = useState('');
  const [error, setError] = useState('');

  const addTodo = () => {
    const text = newTask.trim();
    if (text.length < 2 || text.length > 64) {
      setError('Название задачи должно быть от 2 до 64 символов');
      return;
    }
    setTodos([...todos, { text, isDone: false, isEditing: false }]);
    setNewTask('');
    setError('');
  };

  const updateTodoText = (index, txt) => {
    const copy = [...todos];
    copy[index].text = txt;
    setTodos(copy);
  };

  const toggleDone = (index) => {
    const copy = [...todos];
    copy[index].isDone = !copy[index].isDone;
    setTodos(copy);
  };

  const deleteTodo = (index) => {
    const copy = [...todos];
    copy.splice(index, 1);
    setTodos(copy);
  };

  const toggleEdit = (index, isEditing) => {
    const copy = [...todos];
    copy[index].isEditing = isEditing;
    setTodos(copy);
  };

  const filteredItems = todos
    .map((todo, idx) => ({ todo, idx }))
    .filter(({ todo }) => {
      if (filter === 'active') return !todo.isDone;
      if (filter === 'completed') return todo.isDone;
      return true;
    });
  
  const counts = {
    all: todos.length,
    active: todos.filter((t) => !t.isDone).length,
    completed: todos.filter((t) => t.isDone).length
  };

  return (
    <div className="wrapper">
    
      <form
        className="todo-form"
        onSubmit={(e) => { e.preventDefault(); addTodo(); }}
      >
        <input
          className="todo-input"
          placeholder="Task To Be Done..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit" className="add-button">Add</button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <TodoFilters filter={filter} setFilter={setFilter} counts={counts} />

      <TodoList
        items={filteredItems}
        onToggle={toggleDone}
        onDelete={deleteTodo}
        onEditToggle={toggleEdit}
        onTextChange={updateTodoText}
      />
    </div>
  );
}

export default App;
