require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database');
const { sendEmail } = require('./mailer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'FlowGuard is running', timestamp: new Date() });
});

// Get all workflows
app.get('/api/workflows', (req, res) => {
  const rows = db.prepare('SELECT * FROM workflows ORDER BY created_at DESC').all();
  const workflows = rows.map(r => ({
    ...r,
    nodes: JSON.parse(r.nodes),
    edges: JSON.parse(r.edges)
  }));
  res.json(workflows);
});

// Create workflow
app.post('/api/workflows', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const id = Date.now().toString();
  db.prepare(`
    INSERT INTO workflows (id, name, nodes, edges)
    VALUES (?, ?, '[]', '[]')
  `).run(id, name);
  const workflow = db.prepare('SELECT * FROM workflows WHERE id = ?').get(id);
  res.status(201).json({ ...workflow, nodes: [], edges: [] });
});

// Get one workflow
app.get('/api/workflows/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM workflows WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json({ ...row, nodes: JSON.parse(row.nodes), edges: JSON.parse(row.edges) });
});

// Save workflow (update nodes and edges)
app.put('/api/workflows/:id', (req, res) => {
  const { nodes, edges } = req.body;
  const result = db.prepare(`
    UPDATE workflows
    SET nodes = ?, edges = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(JSON.stringify(nodes || []), JSON.stringify(edges || []), req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
  const row = db.prepare('SELECT * FROM workflows WHERE id = ?').get(req.params.id);
  res.json({ ...row, nodes: JSON.parse(row.nodes), edges: JSON.parse(row.edges) });
});

// Execute workflow
app.post('/api/workflows/:id/execute', async (req, res) => {
  const row = db.prepare('SELECT * FROM workflows WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });

  const nodes = JSON.parse(row.nodes);
  const results = [];

  for (const node of nodes) {
    const label = node.data?.label || '';

    if (label.includes('Trigger')) {
      results.push({ node: label, result: '✅ Trigger fired' });

    } else if (label.includes('Email')) {
      try {
        await sendEmail({
          to: process.env.SMTP_USER || 'test@example.com',
          subject: `FlowGuard: ${row.name} executed`,
          body: `Workflow "${row.name}" ran the Email node at ${new Date().toISOString()}`
        });
        results.push({ node: label, result: '📧 Email sent' });
      } catch (err) {
        results.push({ node: label, result: `📧 Email failed: ${err.message}` });
      }

    } else if (label.includes('Encrypt')) {
      results.push({ node: label, result: '🔒 File encrypted (AES-256 simulated)' });

    } else if (label.includes('Database')) {
      results.push({ node: label, result: '🗄️ Query executed (simulated)' });

    } else if (label.includes('Condition')) {
      results.push({ node: label, result: '🔀 Condition evaluated: true' });

    } else {
      results.push({ node: label, result: '⚙️ Action completed' });
    }
  }

  // Log this execution
  db.prepare(`
    INSERT INTO execution_logs (workflow_id, results)
    VALUES (?, ?)
  `).run(row.id, JSON.stringify(results));

  // Update last_run
  db.prepare(`
    UPDATE workflows SET status = 'executed', last_run = datetime('now') WHERE id = ?
  `).run(row.id);

  res.json({
    message: `Workflow "${row.name}" executed`,
    steps: results.length,
    results
  });
});

// Get execution history for a workflow
app.get('/api/workflows/:id/logs', (req, res) => {
  const logs = db.prepare(`
    SELECT * FROM execution_logs WHERE workflow_id = ? ORDER BY ran_at DESC LIMIT 20
  `).all(req.params.id);
  res.json(logs.map(l => ({ ...l, results: JSON.parse(l.results) })));
});

// Delete workflow
app.delete('/api/workflows/:id', (req, res) => {
  const result = db.prepare('DELETE FROM workflows WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => {
  console.log(`FlowGuard backend running on http://localhost:${PORT}`);
});