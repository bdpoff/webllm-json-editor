import { Handle, Position } from 'reactflow';

function capabilitiesList(capabilities) {
  if (!capabilities || capabilities.length < 1) {
    return null;
  }
  const capabilityList = capabilities.map(capability => {
    return <li key={capability}>{capability}</li>
  }) 
  return <ul>{capabilityList}</ul>

}
 
const RoleNode = ({ data }) => {
  const capabilities = data.capabilities
  
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div>
        <strong>{data.roleName}</strong>
        {capabilitiesList(capabilities)}
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}

export default RoleNode;