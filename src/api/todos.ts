import axios from 'axios';
import {
  Filter,
  GetTodosResult,
  Todo,
  TodoInfo,
  TodoRequest,
  TodosResponse,
} from '../types/todo';

const BASE_URL = 'https://easydev.club/api/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const DEFAULT_TODO_INFO: TodoInfo = {
  all: 0,
  completed: 0,
  inWork: 0,
};

interface GetTodosOptions {
  signal?: AbortSignal;
}

export async function getAllToDos(
  filter: Filter = 'all',
  options: GetTodosOptions = {}
): Promise<GetTodosResult> {
  const { data: todosResponse } = await apiClient.get<TodosResponse>('/todos', {
    params: { filter },
    signal: options.signal,
  });

  return {
    data: todosResponse.data,
    info: todosResponse.info ?? DEFAULT_TODO_INFO,
  };
}

export async function addTodo(todoData: TodoRequest): Promise<Todo> {
  const { data } = await apiClient.post<Todo>('/todos', todoData);

  return data;
}

export async function updateTodo(todoId: number, updates: TodoRequest): Promise<Todo> {
  const { data } = await apiClient.put<Todo>(`/todos/${todoId}`, updates);

  return data;
}

export async function deleteTodo(todoId: number): Promise<void> {
  await apiClient.delete(`/todos/${todoId}`);
}
