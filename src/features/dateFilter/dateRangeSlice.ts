// slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state for the date range filter
interface DateRangeState {
  startDate: string | null; // ISO date string or null
  endDate: string | null;   // ISO date string or null
}

const initialState: DateRangeState = {
    startDate: null,
    endDate: null,
};

// Create the slice
const dateRangeSlice = createSlice({
    name: 'dateRangeFilter',
    initialState,
    reducers: {
        setDateRange: (state, action: PayloadAction<{ startDate: string | null; endDate: string | null }>) => {
        state.startDate = action.payload.startDate;
        state.endDate = action.payload.endDate;
        },
        resetDateRange: (state) => {
        state.startDate = null;
        state.endDate = null;
        },
    },
});

// Export actions
export const { setDateRange, resetDateRange } = dateRangeSlice.actions;

// Export reducer
export default dateRangeSlice.reducer;