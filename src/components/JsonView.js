import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { setMetadata } from '../features/metadata/metadataSlice';
import { isValidJson } from '../util/Utils';

const JsonView = () => {
  const metadata = useSelector((state) => state.metadata.value);
  const dispatch = useDispatch()

  function handleInputChange(e) {
    const json = e.target.innerHTML.replace(/\s/g,'');
    if (isValidJson(json)) {
      dispatch(setMetadata({roles: JSON.parse(json)}));
    }
  }

  return (
    <pre contentEditable="true" onInput={handleInputChange} fontSize="14px">
      {JSON.stringify(metadata.roles, null, 2)}
    </pre>
  )
}

export default JsonView