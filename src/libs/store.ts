import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice';
import searchReducer from '@/features/search/searchSlice';
import dateRangeReducer from '@/features/dateFilter/dateRangeSlice';
export const globalStore = () => {
    return configureStore({
        reducer: {
            auth : authReducer,
            search : searchReducer,
            dateRange : dateRangeReducer,
        }
    })
}

// Infer the type of globalStore
export type AppStore = ReturnType<typeof globalStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']