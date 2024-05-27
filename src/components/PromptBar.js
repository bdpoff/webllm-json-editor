import React, { useEffect, useState } from 'react';
import * as webllm from "@mlc-ai/web-llm";
import { useDispatch, useSelector } from 'react-redux'
import { setMetadata } from '../features/metadata/metadataSlice';
import { isValidJson } from '../util/Utils';

const PromptBar = () => {
  const dispatch = useDispatch()
  const [prompt, setPrompt] = useState('');
  const [engine, setEngine] = useState('');
  const metadata = useSelector((state) => state.metadata.value);

  const initProgressCallback = (report) => {
    console.log(report.text)
  }
  const appConfig = {
    model_list: [
      {
        "model_url": "https://huggingface.co/bdpoff/llama-3-8B-json-editor-MLC/resolve/q4f32_1/",
        "model_id": "llama-3-8B-json-editor-q4f32_1",
        "model_lib_url": "https://huggingface.co/bdpoff/llama-3-8B-json-editor-MLC/resolve/q4f32_1/llama-3-8B-json-editor-MLC-q4f32_1-webgpu.wasm"
      },
      {
        "model_url": "https://huggingface.co/bdpoff/llama-3-8B-json-editor-MLC/resolve/q0f32/",
        "model_id": "llama-3-8B-json-editor-q0f32",
        "model_lib_url": "https://huggingface.co/bdpoff/llama-3-8B-json-editor-MLC/resolve/q0f32/llama-3-8B-json-editor-MLC-q0f32-webgpu.wasm"
      },
      {
        "model_url": "https://huggingface.co/bdpoff/llama-3-8B-json-editor-MLC/resolve/q0f16/",
        "model_id": "llama-3-8B-json-editor-q0f16",
        "model_lib_url": "https://huggingface.co/bdpoff/llama-3-8B-json-editor-MLC/resolve/q0f16/llama-3-8B-json-editor-MLC-q0f16-webgpu.wasm",
        "required_features": ["shader-f16"]
      },
      {
        "model_url": "https://huggingface.co/bdpoff/phi-3-mini-json-editor-MLC/resolve/q0f32/",
        "model_id": "phi-3-mini-json-editor-q0f32",
        "model_lib_url": "https://huggingface.co/bdpoff/phi-3-mini-json-editor-MLC/resolve/q0f32/phi-3-mini-json-editor-MLC-q0f32-webgpu.wasm"
      },
    ]
  }
  const selectedModel = "llama-3-8B-json-editor-q4f32_1"
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const input = `Instructions: ${prompt}\nInput: ${JSON.stringify(metadata)}\n: Output:`
    const reply = await engine.chat.completions.create({
      messages: [
        {"role": "user", "content": input}
      ],
      max_gen_len: 1024,
      temperature: 0,
      //response_format: {type: "json_object"}
    })
    let message = reply.choices[0].message
    if (message.includes("Output: ")){
      message = message.split("Output: ")[1]
    }
    message = message.substring(message.indexOf("{"), message.lastIndexOf("}") + 1)
    message = message.replaceAll("\\", "")
    if (isValidJson(message)) {
      dispatch(setMetadata({roles: JSON.parse(message)}));
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{width: 'inherit'}}>
      <input type="text" value={prompt} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default PromptBar;