import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import ReactFlow, { 
  ConnectionLineType, ControlButton, Controls
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { FaPlus, FaUndoAlt } from "react-icons/fa";
import RoleNode from './RoleNode.js'
import { addRole, undoMetadata } from '../features/metadata/metadataSlice';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 192;
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
  //const status = useSelector((state) => state.status.value);
  const fromMetadata = createFlowChartData(metadata);
  const layoutedMetadata = getLayoutedElements(fromMetadata.nodes, fromMetadata.edges);
  const dispatch = useDispatch();

  const handleAddRole = (name) => {
    if (metadata.roles.filter(role => role.name === name).length === 0){
      dispatch(addRole(name))
      return
    } else {
      handleAddRole(`NewRole${Number(name.substring(7)) + 1}`)
    }
  }

  const handleUndo = () => {
    dispatch(undoMetadata())
  }

  /*let background 
  switch(status){
    case "DONE":
      background = "#FFFFFF";
      break;
    case "GEN":
      background = "#2AFC38";
      break;
    case "ERR":
      background = "#FC432A"
      break;
    default:
      background = "#000000";
  }*/

  return (
    <ReactFlow
      ///style={{backgroundColor: {background}}}
      nodes={layoutedMetadata.nodes}
      nodeTypes={nodeTypes}
      edges={layoutedMetadata.edges}
      connectionLineType={ConnectionLineType.SmoothStep}
      fitView>
      <Controls showZoom={false} showFitView={false} showInteractive={false}>
        <ControlButton onClick={ () => handleAddRole("NewRole0") } title="Add role">
          <FaPlus/>
        </ControlButton>
        <ControlButton onClick={ () => handleUndo() } title="Undo">
          <FaUndoAlt/>
        </ControlButton>
      </Controls>
    </ReactFlow>
  );
};

export default LayoutFlow;