import React from 'react';

const nodeTypes = [
  { type: 'trigger',   label: '⚡ Trigger',        color: '#f59e0b' },
  { type: 'condition', label: '🔀 Condition',       color: '#3b82f6' },
  { type: 'action',    label: '⚙️ Action',          color: '#10b981' },
  { type: 'email',     label: '📧 Send Email',      color: '#8b5cf6' },
  { type: 'encrypt',   label: '🔒 Encrypt File',    color: '#ef4444' },
  { type: 'database',  label: '🗄️ Database Query',  color: '#06b6d4' },
];

function NodePanel({ onAddNode }) {
  return (
    <div style={{
      width: '180px',
      background: '#1a1d2e',
      borderRight: '1px solid #2d3148',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <h4 style={{ fontSize: '11px', textTransform: 'uppercase',
        letterSpacing: '1px', color: '#64748b', marginBottom: '8px' }}>
        Add Node
      </h4>
      {nodeTypes.map(({ type, label, color }) => (
        <button
          key={type}
          onClick={() => onAddNode(type, label)}
          style={{
            padding: '9px 10px',
            borderRadius: '8px',
            background: '#0f1117',
            border: `1px solid ${color}33`,
            color: '#e2e8f0',
            cursor: 'pointer',
            fontSize: '12px',
            textAlign: 'left',
            transition: 'all 0.15s'
          }}
          onMouseOver={e => e.currentTarget.style.borderColor = color}
          onMouseOut={e => e.currentTarget.style.borderColor = `${color}33`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default NodePanel;