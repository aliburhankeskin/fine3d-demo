import { useDispatch, useSelector, useStore } from "react-redux";
import type { RootState, AppDispatchType, AppStoreType } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatchType>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStoreType>();
