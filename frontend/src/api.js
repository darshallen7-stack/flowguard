const BASE_URL = 'http://localhost:3001';

export async function getWorkflows() {
  const res = await fetch(`${BASE_URL}/api/workflows`);
  return res.json();
}

export async function createWorkflow(name) {
  const res = await fetch(`${BASE_URL}/api/workflows`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  return res.json();
}

export async function saveWorkflow(id, nodes, edges) {
  const res = await fetch(`${BASE_URL}/api/workflows/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nodes, edges })
  });
  return res.json();
}

export async function executeWorkflow(id) {
  const res = await fetch(`${BASE_URL}/api/workflows/${id}/execute`, {
    method: 'POST'
  });
  return res.json();
}

export async function deleteWorkflow(id) {
  const res = await fetch(`${BASE_URL}/api/workflows/${id}`, {
    method: 'DELETE'
  });
  return res.json();
}