// src/libs/hooks.ts (or wherever you define)
import {
    useDispatch,
    useSelector,
    useStore,
    TypedUseSelectorHook,
} from 'react-redux';
import type { AppDispatch, AppStore, RootState } from '@/libs/store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore = useStore;
