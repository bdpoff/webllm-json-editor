import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { setMetadata } from '../features/metadata/metadataSlice';

const JsonView = () => {
  const metadata = useSelector((state) => state.metadata.value);
  const dispatch = useDispatch()

  function isValidJson(input) {
    try {
      JSON.parse(input);
      return true;
    } catch (err) {
      return false;
    }
  }

  function handleInputChange(e) {
    const json = e.target.innerHTML.replace(/\s/g,'');
    if (isValidJson(json)) {
      dispatch(setMetadata({roles: JSON.parse(json)}));
    }
  }

  return (
    <pre contentEditable="true" onInput={handleInputChange}>
      {JSON.stringify(metadata.roles, null, 2)}
    </pre>
  )
}

export default JsonView