import React from 'react';

export default function TodoFilters({ filter, setFilter, counts }) {
  return (
    <div className="todo-filters">
      <button
        className={filter === 'all' ? 'active' : ''}
        onClick={() => setFilter('all')}
      >
        Все ({counts.all})
      </button>
      <button
        className={filter === 'inWork' ? 'active' : ''}
        onClick={() => setFilter('inWork')}
      >
        В работе ({counts.inWork})
      </button>
      <button
        className={filter === 'completed' ? 'active' : ''}
        onClick={() => setFilter('completed')}
      >
        Сделано ({counts.completed})
      </button>
    </div>
  );
}
