import { configureStore } from '@reduxjs/toolkit'
import metadataReducer from '../features/metadata/metadataSlice'
import statusReducer from '../features/status/statusSlice'

export default configureStore({
  reducer: {
    metadata: metadataReducer,
    status: statusReducer
  },
})