import { createSlice } from '@reduxjs/toolkit'

export const statusSlice = createSlice({
  name: 'status',
  initialState: {
    value: "DONE",
  },
  reducers: {
    generating: (state) => {
      state.value = "GEN"
      document.getElementById("bar-indicator").style.backgroundColor = "#2AFC38"
    },
    done: (state) => {
      state.value = "DONE"
      document.getElementById("bar-indicator").style.backgroundColor = "#FFFFFF"
    },
    error: (state) => {
      state.value = "ERR"
      document.getElementById("bar-indicator").style.backgroundColor = "#FC432A"
    }
  },
})

// Action creators are generated for each case reducer function
export const { generating, done, error } = statusSlice.actions

export default statusSlice.reducer