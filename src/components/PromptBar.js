import React, { useEffect, useState } from 'react';
import * as webllm from "@mlc-ai/web-llm";
import { useDispatch, useSelector } from 'react-redux'
import { setMetadata, undoMetadata } from '../features/metadata/metadataSlice';
import * as status from '../features/status/statusSlice';
import { isValidJson } from '../util/Utils';



const PromptBar = () => {
  const dispatch = useDispatch()
  const [prompt, setPrompt] = useState('');
  const [engine, setEngine] = useState('');
  const metadata = useSelector((state) => state.metadata.value);

  const initProgressCallback = (report) => {
    console.log(report.text)
    if (report.text.includes("Finish loading on ")){
      document.getElementById("prompt-input").placeholder = "Ready"
    }
  }
  
  const appConfig = {
    model_list: [
      {
        "model_url": "https://huggingface.co/bdpoff/mistral-7B-json-editor-MLC/resolve/q4f32_1/",
        "model_id": "mistral-7B-json-editor-q4f32_1",
        "model_lib_url": "https://huggingface.co/bdpoff/mistral-7B-json-editor-MLC/resolve/q4f32_1/mistral-7B-json-editor-MLC-q4f32_1-webgpu.wasm"
      }
    ]
  }
  const selectedModel = "mistral-7B-json-editor-q4f32_1"
  useEffect(() => {
    async function createEngine(){
      const eng = await webllm.CreateEngine(
        selectedModel,
        { appConfig: appConfig, initProgressCallback: initProgressCallback}
      )
      setEngine(eng)
    }
    
    if (!engine){
      createEngine();
    }
  }, [])
  
  const handleChange = (event) => {
    setPrompt(event.target.value);
  }

  const handleUndo = () => {
    dispatch(undoMetadata())
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(metadata).replace(/"/g,"\\\""))
  }

  const handleSubmit = async (event) => {
    if (engine.currentModelId !== selectedModel){
      event.preventDefault();
      return
    } 
    dispatch(status.generating());
    event.preventDefault();
    const input = `Below is an instruction that describes a modification, paired with a JSON input. Write a JSON response that implements the modification to the JSON input according to the instruction.\n\n### Instruction:\n${prompt}\n\n### Input:\n${JSON.stringify(metadata)}\n\n### Response:\n`
    setPrompt("")
    const reply = await engine.chat.completions.create({
      messages: [
        {"role": "user", "content": input}
      ],
      max_gen_len: 1024,
      temperature: 0.0,
      //response_format: {type: "json_object"}
    })
    console.log(reply.choices[0].message)
    if (!reply.choices[0].message){
      dispatch(status.error());
      return
    }
    let message = reply.choices[0].message.content
    if (message.includes("Output: ")){
      message = message.split("Output: ")[1]
    }
    message = message.substring(message.indexOf("{"), message.lastIndexOf("}") + 1)
    message = message.replaceAll("\\", "")
    if (isValidJson(message)) {
      dispatch(status.done());
      dispatch(setMetadata(JSON.parse(message)));
    } else {
      dispatch(status.error());
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{width: 'inherit'}}>
      <input id="prompt-input" type="text" value={prompt} onChange={handleChange} placeholder="Loading..."/>
      <button type="submit">Submit</button>
      <button id="undo-button" type="button" onClick={handleUndo}>Undo</button>
      <button id="copy-button" type="button" onClick={handleCopy}>Copy</button>
    </form>
  );
}

export default PromptBar;