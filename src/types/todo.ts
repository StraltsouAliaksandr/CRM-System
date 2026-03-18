import { MetaResponse } from './api';

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

export interface ApiMeta {
  totalAmount?: number;
}

export type TodosInfo = TodoCounts;

export interface TodoPayload {
  title: string;
  isDone: boolean;
}

export type TodoUpdates = Partial<TodoPayload>;

export interface GetTodosResult {
  data: Todo[];
  info: TodoCounts;
}

export interface TodosResponse extends MetaResponse<Todo[], ApiMeta> {
  info: TodosInfo;
}
