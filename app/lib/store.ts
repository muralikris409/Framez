import { configureStore } from '@reduxjs/toolkit'
import  userSlice  from './userSlice'
import  searchSlice  from './searchSlice'
import chatSlice from './chatSlice';
export const makeStore = () => {
  return configureStore({
    reducer: {
      user:userSlice,
      search:searchSlice,
      chat: chatSlice,


    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']