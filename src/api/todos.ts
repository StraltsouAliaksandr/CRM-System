import {
  Filter,
  GetTodosResult,
  Todo,
  TodoInfo,
  TodoRequest,
  TodosResponse,
} from '../types/todo';

const BASE_URL = 'https://easydev.club/api/v1';
const DEFAULT_TODO_INFO: TodoInfo = {
  all: 0,
  completed: 0,
  inWork: 0,
};

interface RequestOptions extends Omit<RequestInit, 'body'> {
  data?: TodoRequest;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers, ...requestOptions } = options;

  const response = await fetch(BASE_URL + path, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...requestOptions,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (response.status === 204 || !contentType.includes('application/json')) {
    return {} as T;
  }

  return (await response.json()) as T;
}

export async function getAllToDos(filter: Filter = 'all'): Promise<GetTodosResult> {
  const searchParams = new URLSearchParams({ filter });
  const todosResponse = await request<TodosResponse>(
    `/todos?${searchParams.toString()}`
  );

  return {
    data: todosResponse.data,
    info: todosResponse.info ?? DEFAULT_TODO_INFO,
  };
}

export function addTodo(todoData: TodoRequest): Promise<Todo> {
  return request<Todo>('/todos', {
    method: 'POST',
    data: todoData,
  });
}

export function updateTodo(todoId: number, updates: TodoRequest): Promise<Todo> {
  return request<Todo>(`/todos/${todoId}`, {
    method: 'PUT',
    data: updates,
  });
}

export function deleteTodo(todoId: number): Promise<unknown> {
  return request<unknown>(`/todos/${todoId}`, {
    method: 'DELETE',
  });
}
