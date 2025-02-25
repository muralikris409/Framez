import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

interface SearchState {
  isOpen: boolean;
  searchText: string;
}

const initialState: SearchState = {
  isOpen: false,
  searchText: ''
}

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    openModal: state => {
      state.isOpen = true;
    },
    closeModal: state => {
      state.isOpen = false;
    },
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    }
  }
})

export const { openModal, closeModal, setSearchText } = searchSlice.actions

export const selectSearchState = (state: RootState) => state.search;

export default searchSlice.reducer
