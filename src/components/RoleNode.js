import { Handle, Position } from 'reactflow';
import { FaMinus } from "react-icons/fa";
import { useDispatch } from 'react-redux'
import { removeRole, addApprover, removeApprovers, renameRole } from '../features/metadata/metadataSlice';


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
  const capabilities = data.capabilities;
  const dispatch = useDispatch();

  return (
    <>
      <Handle type="target" position={Position.Top} onClick={(params) => dispatch(removeApprovers(params.target.dataset.nodeid))}/>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div contentEditable={true} onBlur={(params) => dispatch(renameRole({old: data.roleName, new: params.target.innerText}))} suppressContentEditableWarning={true}>
          <strong>{data.roleName}</strong>
        </div>
        <FaMinus onClick={ () => { dispatch(removeRole(data.roleName)) }} style={{float: 'right', paddingLeft: "4px"}} cursor={"pointer"}/>
      </div>
      <div contentEditable={true} suppressContentEditableWarning={true}>
        {capabilitiesList(capabilities)}
      </div>
      <Handle type="source" position={Position.Bottom} id="a" onConnect={(params) => {dispatch(addApprover(params))}}/>
    </>
  );
}

export default RoleNode;