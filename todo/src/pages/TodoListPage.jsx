import React, { useState, useEffect } from 'react';
import { getAllToDos, updateTodo } from '../api/todos.js';
import TodoForm    from '../components/TodoForm/TodoForm.jsx';
import TodoFilters from '../components/TodoFilters/TodoFilters.jsx';
import TodoList    from '../components/TodoList/TodoList.jsx';
import styles from './TodoListPage.module.css';

export default function TodoListPage() {
  const [todos,  setTodos]  = useState([]);
  const [counts,setCounts] = useState({ all:0, inWork:0, completed:0 });
  const [filter,setFilter] = useState('all');


  const loadTodos = async () => {
    try {
      console.log('loadTodos, status =', filter);
      const { data, info } = await getAllToDos(filter);
      setTodos(data);
      setCounts(info);
    } catch (err) {
      alert('Не удалось загрузить список задач.');
    }
  };


  useEffect(() => {
    loadTodos();
  }, [filter]);


  const handleToggle = async (id, newDone) => {
    await updateTodo(id, { isDone: newDone });

    await loadTodos();
  };

  return (
    <div className={styles.wrapper}>
      <TodoForm    loadTodos={loadTodos} />
      <TodoFilters filter={filter} setFilter={setFilter} counts={counts} />
      <TodoList    todos={todos} toggle={handleToggle} loadTodos={loadTodos} />
    </div>
  );
}
