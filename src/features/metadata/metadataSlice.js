import { createSlice } from '@reduxjs/toolkit'
import Example from '../../metadata/Example.json';

export const metadataSlice = createSlice({
  name: 'metadata',
  initialState: {
    value: Example,
  },
  reducers: {
    setMetadata: (state, newMetadata) => {
      state.value = newMetadata.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setMetadata } = metadataSlice.actions

export default metadataSlice.reducer