import { createSlice } from '@reduxjs/toolkit'
import Example from '../../metadata/Sample.json';

export const metadataSlice = createSlice({
  name: 'metadata',
  initialState: {
    value: Example,
  },
  reducers: {
    setMetadata: (state, newMetadata) => {
      state.old = JSON.parse(JSON.stringify(state.value))
      state.value = newMetadata.payload
    },
    undoMetadata: (state) => {
      const current = JSON.parse(JSON.stringify(state.value))
      state.value = JSON.parse(JSON.stringify(state.old))
      state.old = JSON.parse(JSON.stringify(current))
    }
  },
})

// Action creators are generated for each case reducer function
export const { setMetadata, undoMetadata } = metadataSlice.actions

export default metadataSlice.reducer