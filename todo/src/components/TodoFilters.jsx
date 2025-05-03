function TodoFilters({ filter, setFilter, counts }) {
    return (
      <div className="todo-filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          все ({counts.all})
        </button>
        <button
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          в работе ({counts.active})
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          сделано ({counts.completed})
        </button>
      </div>
    );
  }
  
  export default TodoFilters;
  