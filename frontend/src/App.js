import React, { useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import { getWorkflows, createWorkflow } from './api';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('fg_token'));
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('fg_user'));
  const [workflows, setWorkflows] = useState([]);
  const [activeWorkflow, setActiveWorkflow] = useState(null);

  useEffect(() => {
    if (token) {
      getWorkflows().then(setWorkflows).catch(console.error);
    }
  }, [token]);

  const handleLogin = (tok, user) => {
    setToken(tok);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('fg_token');
    localStorage.removeItem('fg_user');
    setToken(null);
    setCurrentUser(null);
    setWorkflows([]);
    setActiveWorkflow(null);
  };

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

  if (!token) return <Login onLogin={handleLogin} />;

  return (
    <div className="app">
      <header className="app-header">
        <h1>⚡ FlowGuard</h1>
        <span className="tagline">Compliance-Safe Workflow Automation</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: '13px', color: '#94a3b8' }}>👤 {currentUser}</span>
        <button onClick={handleLogout} style={{
          padding: '6px 14px', borderRadius: '6px',
          background: '#2d3148', border: '1px solid #4a5568',
          color: '#e2e8f0', cursor: 'pointer', fontSize: '13px'
        }}>Log Out</button>
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