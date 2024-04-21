import React from 'react';
import { useSelector } from 'react-redux'
import ReactFlow, { 
  ConnectionLineType
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import RoleNode from './RoleNode.js'

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 84;

const nodeTypes = { roleNode: RoleNode };

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

const createFlowChartData = (data) => {
  const nodes = data.roles.map((role) => ({
    id: role.name,
    type: "roleNode",
    data: {
      roleName: role.name,
      capabilities: role.capabilities
    },
  }));

  let edges = []
  data.roles.forEach(role => {
    if (role.approvedBy){
      role.approvedBy.forEach(approver => {
        edges.push({
          id: `${role.name}_${approver}_edge`,
          source: approver,
          target: role.name,
        })
      });
    }
  });

  return { 
    nodes: nodes, 
    edges: edges 
  };
};


const LayoutFlow = () => {
  const metadata = useSelector((state) => state.metadata.value);
  const fromMetadata = createFlowChartData(metadata);
  const layoutedMetadata = getLayoutedElements(fromMetadata.nodes, fromMetadata.edges);

  return (
    <ReactFlow
      nodes={layoutedMetadata.nodes}
      nodeTypes={nodeTypes}
      edges={layoutedMetadata.edges}
      connectionLineType={ConnectionLineType.SmoothStep}
      fitView/>
  );
};

export default LayoutFlow;