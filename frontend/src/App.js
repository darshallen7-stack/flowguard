import React, { useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import Sidebar from './components/Sidebar';
import { getWorkflows, createWorkflow } from './api';
import './App.css';

function App() {
  const [workflows, setWorkflows] = useState([]);
  const [activeWorkflow, setActiveWorkflow] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    getWorkflows().then(setWorkflows).catch(() => {
      setStatus('⚠️ Backend offline — changes will not be saved');
    });
  }, []);

  const handleCreate = async (name) => {
    try {
      const created = await createWorkflow(name);
      setWorkflows(prev => [...prev, created]);
      setActiveWorkflow(created);
    } catch {
      const local = { id: Date.now().toString(), name, nodes: [], edges: [] };
      setWorkflows(prev => [...prev, local]);
      setActiveWorkflow(local);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>⚡ FlowGuard</h1>
        <span className="tagline">Compliance-Safe Workflow Automation</span>
        {status && <span className="status-warn">{status}</span>}
      </header>
      <div className="app-body">
        <Sidebar
          workflows={workflows}
          activeWorkflow={activeWorkflow}
          onSelectWorkflow={setActiveWorkflow}
          onCreateWorkflow={handleCreate}
        />
        <main className="canvas-area">
          {activeWorkflow ? (
            <Canvas
              workflow={activeWorkflow}
              onUpdate={(updated) => {
                setActiveWorkflow(updated);
                setWorkflows(prev => prev.map(w =>
                  w.id === updated.id ? updated : w
                ));
              }}
            />
          ) : (
            <div className="empty-state">
              <h2>No workflow selected</h2>
              <p>Create a new workflow from the sidebar to get started.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;