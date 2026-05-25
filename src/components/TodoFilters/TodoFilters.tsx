import { Dispatch, SetStateAction } from 'react';
import { Segmented } from 'antd';
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
    <Segmented<Filter>
      value={filter}
      options={FILTER_OPTIONS.map((option) => ({
        label: `${option.label} (${counts[option.countKey]})`,
        value: option.key,
      }))}
      onChange={(value) => setFilter(value)}
      block
    />
  );
}
