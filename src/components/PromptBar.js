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
        "model_url": "https://huggingface.co/bdpoff/mistral-json-editor-MLC/resolve/q4f32_1/",
        "model_id": "mistral-json-editor-q4f32_1",
        "model_lib_url": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Mistral-7B-Instruct-v0.2/Mistral-7B-Instruct-v0.2-q4f16_1-sw4k_cs1k-webgpu.wasm"
      },
    ]
  }
  const selectedModel = "mistral-json-editor-q4f32_1"
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
  

  const genConfig = {
    presence_penalty: 0.1,
    frequency_penalty: 0.1,
  }

  const handleChange = (event) => {
    setPrompt(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(`TODO: use prompt ${prompt}...`);
    const request = {
      stream: false,
      messages: [
        {}
      ]
    }
    const input = `Instructions: ${prompt}\nInput: ${metadata.toString()}\n: Output:`
    const reply0 = await engine.chat.completions.create({
      messages: [
        {"role": "user", "content": input}
      ],
      max_gen_len: 1024,
      temperature: 0,

    })
    //const reply1 = await chat.generate(prompt, undefined, 1, genConfig);
    console.log(reply0)
    if (isValidJson(reply0)) {
      dispatch(setMetadata({roles: JSON.parse(reply0)}));
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