import React, { useState, useEffect } from 'react';
import * as api from '../api/todos.js';
import TodoForm    from '../components/TodoForm.jsx';
import TodoFilters from '../components/TodoFilters.jsx';
import TodoList    from '../components/TodoList.jsx';

export default function TodoListPage() {
  const [todos,  setTodos]  = useState([]);
  const [counts,setCounts] = useState({ all:0, inWork:0, completed:0 });
  const [filter,setFilter] = useState('all');


  const refresh = async () => {
    try {
      console.log('refresh, status =', filter);
      const { data, info } = await api.getAll(filter);
      setTodos(data);
      setCounts(info);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    refresh();
  }, [filter]);


  const handleToggle = async (id, newDone) => {
  
    setTodos(ts => ts.map(t => t.id === id ? { ...t, isDone: newDone } : t));

    await api.updateTodo(id, { isDone: newDone });

    await refresh();
  };

  return (
    <div className="wrapper">
      <TodoForm    refresh={refresh} />
      <TodoFilters filter={filter} setFilter={setFilter} counts={counts} />
      <TodoList    todos={todos} toggle={handleToggle} refresh={refresh} />
    </div>
  );
}
