import {
  Filter,
  GetTodosResult,
  Todo,
  TodoInfo,
  TodoRequest,
  TodosResponse,
} from '../types/todo';

const BASE_URL = 'https://easydev.club/api/v1';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(BASE_URL + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
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
    info: todosResponse.info ?? getEmptyTodoInfo(),
  };
}

export function addTodo(todoData: TodoRequest): Promise<Todo> {
  return request<Todo>('/todos', {
    method: 'POST',
    body: JSON.stringify(todoData),
  });
}

export function updateTodo(todoId: number, updates: TodoRequest): Promise<Todo> {
  return request<Todo>(`/todos/${todoId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export function deleteTodo(todoId: number): Promise<unknown> {
  return request<unknown>(`/todos/${todoId}`, {
    method: 'DELETE',
  });
}

function getEmptyTodoInfo(): TodoInfo {
  return {
    all: 0,
    completed: 0,
    inWork: 0,
  };
}
