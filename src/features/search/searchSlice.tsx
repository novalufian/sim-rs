// src/features/search/searchSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
    keyword: string;
    trigger: boolean; // used to force refresh/re-query
}

const initialState: SearchState = {
    keyword: '',
    trigger: false,
};

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setKeyword: (state, action: PayloadAction<string>) => {
        state.keyword = action.payload;
        },
        triggerSearch: (state) => {
        // toggling helps to re-trigger logic in subscriber
        state.trigger = true;
        },
        resetTrigger : (state) =>{
            state.trigger = false;
        },
        resetSearch : (state) =>{
            state.keyword = '';
            state.trigger = false;
        }
    },
});

export const { setKeyword, triggerSearch, resetSearch, resetTrigger } = searchSlice.actions;
export default searchSlice.reducer;
