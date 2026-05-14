import React, { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import NodePanel from './NodePanel';
import { saveWorkflow, executeWorkflow } from '../api';

const nodeDefaults = {
  style: {
    background: '#1a1d2e',
    border: '1px solid #7c6af7',
    borderRadius: '10px',
    padding: '12px 18px',
    color: '#e2e8f0',
    fontSize: '13px',
    minWidth: '160px'
  }
};

function Canvas({ workflow, onUpdate }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(workflow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflow.edges);
  const [message, setMessage] = useState('');
  const [results, setResults] = useState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const addNode = (type, label) => {
    const newNode = {
      id: Date.now().toString(),
      type: 'default',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 200 + 80 },
      data: { label },
      ...nodeDefaults
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleSave = async () => {
    try {
      await saveWorkflow(workflow.id, nodes, edges);
      setMessage('✅ Saved successfully');
    } catch {
      setMessage('⚠️ Could not reach backend');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleExecute = async () => {
    try {
      await saveWorkflow(workflow.id, nodes, edges);
      const data = await executeWorkflow(workflow.id);
      setResults(data.results || []);
      setMessage(`⚡ Executed — ${data.steps} steps ran`);
    } catch {
      setMessage('⚠️ Execution failed — is the backend running?');
    }
    setTimeout(() => setMessage(''), 6000);
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 16px', background: '#1a1d2e',
        borderBottom: '1px solid #2d3148'
      }}>
        <span style={{ fontWeight: 600, fontSize: '14px' }}>{workflow.name}</span>
        <div style={{ flex: 1 }} />
        {message && (
          <span style={{ fontSize: '13px', color: '#a78bfa' }}>{message}</span>
        )}
        <button onClick={handleSave} style={{
          padding: '7px 16px', borderRadius: '6px',
          background: '#2d3148', border: '1px solid #4a5568',
          color: '#e2e8f0', cursor: 'pointer', fontSize: '13px'
        }}>💾 Save</button>
        <button onClick={handleExecute} style={{
          padding: '7px 16px', borderRadius: '6px',
          background: '#7c6af7', border: 'none',
          color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600
        }}>▶ Execute</button>
      </div>

      <div style={{ flex: 1, display: 'flex' }}>
        <NodePanel onAddNode={addNode} />
        <div style={{ flex: 1, position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <MiniMap style={{ background: '#1a1d2e' }} nodeColor="#7c6af7" />
            <Controls />
            <Background color="#2d3148" gap={20} />
          </ReactFlow>

          {/* Results panel */}
          {results.length > 0 && (
            <div style={{
              position: 'absolute', bottom: '16px', right: '16px',
              background: '#1a1d2e', border: '1px solid #2d3148',
              borderRadius: '10px', padding: '14px', minWidth: '260px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)'
            }}>
              <div style={{ fontSize: '12px', color: '#64748b',
                marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Execution Results
              </div>
              {results.map((r, i) => (
                <div key={i} style={{ fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: '#7c6af7' }}>{r.node}</span>
                  <br />
                  <span style={{ color: '#94a3b8' }}>{r.result}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Canvas;