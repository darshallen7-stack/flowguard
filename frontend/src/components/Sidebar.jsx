import React, { useState } from 'react';

function Sidebar({ workflows, activeWorkflow, onSelectWorkflow, onCreateWorkflow }) {
  const [newName, setNewName] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleCreate = () => {
    if (newName.trim()) {
      onCreateWorkflow(newName.trim());
      setNewName('');
      setShowInput(false);
    }
  };

  return (
    <aside style={{
      width: '260px',
      background: '#1a1d2e',
      borderRight: '1px solid #2d3148',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px'
    }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '12px', textTransform: 'uppercase',
          letterSpacing: '1px', color: '#64748b', marginBottom: '12px' }}>
          Workflows
        </h3>
        {workflows.map(w => (
          <div
            key={w.id}
            onClick={() => onSelectWorkflow(w)}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              marginBottom: '4px',
              cursor: 'pointer',
              background: activeWorkflow?.id === w.id ? '#2d3148' : 'transparent',
              border: activeWorkflow?.id === w.id ? '1px solid #7c6af7' : '1px solid transparent',
              fontSize: '14px'
            }}
          >
            📋 {w.name}
          </div>
        ))}
      </div>

      {showInput ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            placeholder="Workflow name..."
            style={{
              background: '#0f1117',
              border: '1px solid #2d3148',
              borderRadius: '6px',
              padding: '8px 10px',
              color: '#e2e8f0',
              fontSize: '14px'
            }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleCreate} style={{
              flex: 1, padding: '8px', borderRadius: '6px',
              background: '#7c6af7', border: 'none',
              color: 'white', cursor: 'pointer', fontSize: '13px'
            }}>Create</button>
            <button onClick={() => setShowInput(false)} style={{
              flex: 1, padding: '8px', borderRadius: '6px',
              background: '#2d3148', border: 'none',
              color: '#e2e8f0', cursor: 'pointer', fontSize: '13px'
            }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowInput(true)} style={{
          padding: '10px', borderRadius: '8px',
          background: '#7c6af7', border: 'none',
          color: 'white', cursor: 'pointer',
          fontSize: '14px', fontWeight: '600'
        }}>
          + New Workflow
        </button>
      )}
    </aside>
  );
}

export default Sidebar;