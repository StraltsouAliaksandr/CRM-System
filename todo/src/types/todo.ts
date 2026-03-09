export type Filter = 'all' | 'inWork' | 'completed';

export interface Todo {
  id: number;
  title: string;
  isDone: boolean;
}

export interface TodoCounts {
  all: number;
  inWork: number;
  completed: number;
}

