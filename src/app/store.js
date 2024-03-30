import { configureStore } from '@reduxjs/toolkit'
import metadataReducer from '../features/metadata/metadataSlice'

export default configureStore({
  reducer: {
    metadata: metadataReducer
  },
})