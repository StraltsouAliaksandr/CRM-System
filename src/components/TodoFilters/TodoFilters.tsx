import { Dispatch, SetStateAction } from 'react';
import styles from './TodoFilters.module.css';
import { Filter, TodoCounts } from '../../types/todo';

interface Props {
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
  counts: TodoCounts;
}

export default function TodoFilters({ filter, setFilter, counts }: Props) {
  return (
    <div className={styles.filters}>
      <button
        className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
        onClick={() => setFilter('all')}
      >
        Все ({counts.all})
      </button>
      <button
        className={`${styles.filterButton} ${filter === 'inWork' ? styles.active : ''}`}
        onClick={() => setFilter('inWork')}
      >
        В работе ({counts.inWork})
      </button>
      <button
        className={`${styles.filterButton} ${filter === 'completed' ? styles.active : ''}`}
        onClick={() => setFilter('completed')}
      >
        Сделано ({counts.completed})
      </button>
    </div>
  );
}

