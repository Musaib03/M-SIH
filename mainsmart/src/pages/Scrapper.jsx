import { useCallback, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './Scrapper.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Transaction Hash Id 6922b8ff4ce203415cd2a3bf9c4a0d993f0c01d2c460f92648ff9660f33edb75' }, style: { width: 350, height: 80 } },  // Center node
  { id: '2', position: { x: -250, y: 150 }, data: { label: 'Sender bc1pf6sppcppr5cn4nfgml08j5cd7x7y35rutv3pmhmselncu4' }, style: { width: 350, height: 80 } },  // First child of node 1
  { id: '3', position: { x: 250, y: 150 }, data: { label: 'Receiver   bc1qw8wrek2m7nlqldll66ajnwr9mh64syvkt67zlu' }, style: { width: 350, height: 80 } },            // Second child of node 1
  { id: '4', position: { x: 0, y: 300 }, data: { label: '(Mixers Involved) (Addresses) (bc1pf6sppcppr5cn4nfgml08j5cd7x7y35rutv3pmhmselncu4) (bc1qw8wrek2m7nlqldll66ajnwr9mh64syvkt67zlu) (bc1qw8wrek2m7nlqldll66ajnwr9mh64syvkt67zlu)( bc1qw8wrek2m7nlqldll66ajnwr9mh64syvkt67zlu)' }, style: { width: 400, height: 150 } },               // Outgoing transactions node
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' }, // Connects node 1 to node 2 (first child)
  { id: 'e1-3', source: '1', target: '3' }, // Connects node 1 to node 3 (second child)
  { id: 'e2-4', source: '2', target: '4' }, // Connects node 2 to node 4 (outgoing transactions)
  { id: 'e3-4', source: '3', target: '4' }, // Connects node 3 to node 4 (outgoing transactions)
];

function Scrapper({ incomingAddresses }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handle dynamic updates based on incomingAddresses prop
  useEffect(() => {
    if (incomingAddresses) {
      const updatedNodes = nodes.map((node) => {
        if (node.id === '2') {
          return { ...node, data: { label: incomingAddresses[0] || 'Incoming Address' } }; // Update label with the first incoming address
        }
        return node;
      });
      setNodes(updatedNodes);
    }
  }, [incomingAddresses, nodes, setNodes]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div className="scrapper-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
       
      </ReactFlow>
    </div>
  );
}

export default Scrapper;
