import React, { useCallback } from 'react';
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

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const addNode = (type, label) => {
    const newNode = {
      id: Date.now().toString(),
      type: 'default',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { label: `${label}` },
      ...nodeDefaults
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      <NodePanel onAddNode={addNode} />
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <MiniMap
            style={{ background: '#1a1d2e' }}
            nodeColor="#7c6af7"
          />
          <Controls />
          <Background color="#2d3148" gap={20} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default Canvas;