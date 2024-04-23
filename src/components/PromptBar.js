import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { setMetadata, undoMetadata } from '../features/metadata/metadataSlice';
import * as status from '../features/status/statusSlice';
import { isValidJson } from '../util/Utils';



const PromptBar = () => {
  const dispatch = useDispatch()
  const [prompt, setPrompt] = useState('');
  const metadata = useSelector((state) => state.metadata.value);

  const handleChange = (event) => {
    setPrompt(event.target.value);
  }

  const handleUndo = () => {
    dispatch(undoMetadata())
  }

  const handleSubmit = async (event) => {
    dispatch(status.generating());
    event.preventDefault();
    const input = `<s> Modify the input JSON according to the instructions:\nInstructions: ${prompt}\nInput: ${JSON.stringify(metadata)}\nOutput:`
    setPrompt("")
    const payload = {
      prompt: input,
      max_tokens: 1024,
      temperature: 0
    }
    console.log(process.env.REACT_APP_COMPLETION_URL)
    const request = new Request(process.env.REACT_APP_COMPLETION_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: new Headers({
        "Content-Type": "application/json"
      })
    })

    const response = await fetch(request);
    const data = await response.json();
    console.log(data)
    if (!data.choices[0].text){
      dispatch(status.error());
      return
    }
    const responseData = data.choices[0].text;
    if (isValidJson(responseData)) {
      dispatch(status.done());
      dispatch(setMetadata(JSON.parse(responseData)));
    } else {
      dispatch(status.error());
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{width: 'inherit'}}>
      <input type="text" value={prompt} onChange={handleChange} />
      <button type="submit">Submit</button>
      <button id="undo-button" type="button" onClick={handleUndo}>Undo</button>
    </form>
  );
}

export default PromptBar;