const BASE_URL = 'http://localhost:3001';

function getToken() {
  return localStorage.getItem('fg_token');
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  };
}

export async function getWorkflows() {
  const res = await fetch(`${BASE_URL}/api/workflows`, { headers: authHeaders() });
  return res.json();
}

export async function createWorkflow(name) {
  const res = await fetch(`${BASE_URL}/api/workflows`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name })
  });
  return res.json();
}

export async function saveWorkflow(id, nodes, edges) {
  const res = await fetch(`${BASE_URL}/api/workflows/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ nodes, edges })
  });
  return res.json();
}

export async function executeWorkflow(id) {
  const res = await fetch(`${BASE_URL}/api/workflows/${id}/execute`, {
    method: 'POST',
    headers: authHeaders()
  });
  return res.json();
}

export async function deleteWorkflow(id) {
  const res = await fetch(`${BASE_URL}/api/workflows/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  return res.json();
}