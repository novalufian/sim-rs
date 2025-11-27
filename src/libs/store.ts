import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice';
import searchReducer from '@/features/search/searchSlice';
import dateRangeReducer from '@/features/dateFilter/dateRangeSlice';

export const globalStore = () => {
    return configureStore({
        reducer: {
            auth: authReducer,
            search: searchReducer,
            dateRange: dateRangeReducer,
        },
        // Add this for Redux DevTools
        devTools: process.env.NODE_ENV !== 'production', // Enable only in development
        // Optional: Add middleware if needed (redux-thunk is included by default)
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    })
}

// TypeScript types (keep these as is)
export type AppStore = ReturnType<typeof globalStore>
export type RootState = ReturnType<ReturnType<typeof globalStore>['getState']>
export type AppDispatch = AppStore['dispatch']
