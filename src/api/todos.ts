import { Filter, Todo, TodoCounts } from '../types/todo';

const BASE_URL = 'https://easydev.club/api/v1';

interface ApiInfo {
  all?: number;
  inWork?: number;
  completed?: number;
}

interface ApiMeta {
  totalAmount?: number;
}

interface TodosResponse {
  data?: Todo[];
  info?: ApiInfo;
  meta?: ApiMeta;
}

interface TodoPayload {
  title: string;
  isDone: boolean;
}

type TodoUpdates = Partial<TodoPayload>;

interface GetTodosResult {
  data: Todo[];
  info: TodoCounts;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(BASE_URL + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (res.status === 204 || !contentType.includes('application/json')) {
    return {} as T;
  }

  return (await res.json()) as T;
}

function buildInfo(resp: TodosResponse, data: Todo[]): TodoCounts {
  return {
    all: resp.info?.all ?? resp.meta?.totalAmount ?? data.length,
    inWork: resp.info?.inWork ?? data.filter((todo) => !todo.isDone).length,
    completed:
      resp.info?.completed ?? data.filter((todo) => todo.isDone).length,
  };
}

export async function getAllToDos(filter: Filter = 'all'): Promise<GetTodosResult> {
  const resp = await request<TodosResponse>(`/todos?filter=${filter}`);
  const data = resp.data ?? [];

  return {
    data,
    info: buildInfo(resp, data),
  };
}

export function addTodo(todoData: TodoPayload): Promise<Todo> {
  return request<Todo>('/todos', {
    method: 'POST',
    body: JSON.stringify(todoData),
  });
}

export function updateTodo(todoId: number, updates: TodoUpdates): Promise<Todo> {
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

