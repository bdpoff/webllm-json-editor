import React from 'react';
import { useSelector } from 'react-redux'

const JsonView = () => {
  const metadata = useSelector((state) => state.metadata.value);
  return (
    <pre>
      {JSON.stringify(metadata.roles, null, 2)}
    </pre>
  )
}

export default JsonView