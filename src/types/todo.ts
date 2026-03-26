import { MetaResponse } from './api';

export type Filter = 'all' | 'inWork' | 'completed';

export interface Todo {
  id: number;
  title: string;
  created: string;
  isDone: boolean;
}

export type TodoRequest = Partial<Omit<Todo, 'id' | 'created'>>;

export interface TodoInfo {
  all: number;
  completed: number;
  inWork: number;
}

export interface GetTodosResult {
  data: Todo[];
  info: TodoInfo;
}

export type TodosResponse = MetaResponse<Todo, TodoInfo>;
