import React, { useState } from 'react';
import * as webllm from "@mlc-ai/web-llm";

const chat = new webllm.ChatModule();

async function main() {
  const myAppConfig = {
    model_list: [
      {
        "model_url": "https://huggingface.co/mlc-ai/Llama-2-7b-chat-hf-q4f32_1-MLC/resolve/main/",
        "local_id": "Llama-2-7b-chat-hf-q4f32_1",
        "model_lib_url": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Llama-2-7b-chat-hf/Llama-2-7b-chat-hf-q4f32_1-ctx4k_cs1k-webgpu.wasm",
      },
    ]
  }
  const selectedModel = "Llama-2-7b-chat-hf-q4f32_1"
  await chat.reload(selectedModel, undefined, myAppConfig);
}

main();

const PromptBar = () => {
  const [prompt, setPrompt] = useState('');

  const genConfig = {
    presence_penalty: 0.1,
    frequency_penalty: 0.1,
  }

  const handleChange = (event) => {
    setPrompt(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    // handle search logic here
    console.log(`TODO: use prompt ${prompt}...`);
    const reply1 = await chat.generate(prompt, undefined, 1, genConfig);
  }

  return (
    <form onSubmit={handleSubmit} style={{width: 'inherit'}}>
      <input type="text" value={prompt} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default PromptBar;