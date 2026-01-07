import { useDispatch, useSelector } from "react-redux";

// Custom hook to use throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
