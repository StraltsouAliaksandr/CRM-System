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


export async function getAll(filter = 'all') {

  const resp = await request(`/todos?filter=${filter}`);
 return {
    data: resp.data || [],
    info: {
      all:       resp.info?.all       ?? resp.meta?.totalAmount ?? resp.data.length,
      inWork:    resp.info?.inWork    ?? resp.data.filter(t => !t.isDone).length,
      completed: resp.info?.completed ?? resp.data.filter(t => t.isDone).length,
    },
  };
}

export function addTodo(body) {
  return request('/todos', {
    method: 'POST',
    body:   JSON.stringify(body),
  });
}

export function updateTodo(id, body) {
  return request(`/todos/${id}`, {
    method: 'PUT',
    body:   JSON.stringify(body),
  });
}

export function deleteTodo(id) {
  return request(`/todos/${id}`, {
    method: 'DELETE',
  });
}
