import { configureStore } from '@reduxjs/toolkit'
import databaseReducer from './database'

export default configureStore({
  reducer: {
    database: databaseReducer,
  },
})
