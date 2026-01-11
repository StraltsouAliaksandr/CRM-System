const BASE_URL = 'https://easydev.club/api/v1';

async function request(path, options = {}) {
  const res = await fetch(BASE_URL + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  if (res.status === 204 || !ct.includes('application/json')) return {};
  return res.json();
}

function buildInfo(resp, data) {
  return {
    all:       resp.info?.all       ?? resp.meta?.totalAmount ?? data.length,
    inWork:    resp.info?.inWork    ?? data.filter(t => !t.isDone).length,
    completed: resp.info?.completed ?? data.filter(t => t.isDone).length,
  };
}

export async function getAllToDos(filter = 'all') {

  const resp = await request(`/todos?filter=${filter}`);
  const data = resp.data || [];
  return {
    data,
    info: buildInfo(resp, data),
  };
}

export function addTodo(todoData) {
  return request('/todos', {
    method: 'POST',
    body:   JSON.stringify(todoData),
  });
}

export function updateTodo(todoId, updates) {
  return request(`/todos/${todoId}`, {
    method: 'PUT',
    body:   JSON.stringify(updates),
  });
}

export function deleteTodo(todoId) {
  return request(`/todos/${todoId}`, {
    method: 'DELETE',
  });
}
