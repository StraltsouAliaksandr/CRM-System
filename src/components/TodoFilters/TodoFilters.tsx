import { Dispatch, SetStateAction } from 'react';
import styles from './TodoFilters.module.css';
import { Filter, TodoInfo } from '../../types/todo';

interface Props {
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
  counts: TodoInfo;
}

const FILTER_OPTIONS: Array<{
  key: Filter;
  label: string;
  countKey: keyof TodoInfo;
}> = [
  { key: 'all', label: 'Все', countKey: 'all' },
  { key: 'inWork', label: 'В работе', countKey: 'inWork' },
  { key: 'completed', label: 'Сделано', countKey: 'completed' },
];

export default function TodoFilters({ filter, setFilter, counts }: Props) {
  return (
    <div className={styles.filters}>
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option.key}
          className={`${styles.filterButton} ${
            filter === option.key ? styles.active : ''
          }`}
          onClick={() => setFilter(option.key)}
        >
          {option.label} ({counts[option.countKey]})
        </button>
      ))}
    </div>
  );
}

