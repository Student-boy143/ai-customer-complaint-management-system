import { useDispatch, useSelector } from 'react-redux'

/**
 * Typed Redux hooks for consistent store access across components.
 * Extend with additional custom hooks as features are implemented.
 */
export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector
