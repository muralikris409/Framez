import { configureStore } from '@reduxjs/toolkit'
import  userSlice  from './userSlice'
import  searchSlice  from './searchSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      user:userSlice,
      search:searchSlice
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']