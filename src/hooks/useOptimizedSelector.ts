import { useMemo } from 'react';
import { useAppSelector } from './useAppSelector';
import { RootState } from '@/app/store';

/**
 * A custom hook that provides memoized access to Redux state,
 * optimizing performance by preventing unnecessary re-renders.
 * 
 * @param selector - A function that selects data from the Redux state
 * @param dependencies - Optional array of dependencies to control memoization
 * @returns Memoized selected state
 */
export function useOptimizedSelector<TSelected>(
  selector: (state: RootState) => TSelected,
  dependencies: any[] = []
): TSelected {
  // First, get the current state using the standard selector
  const selectedState = useAppSelector(selector);
  
  // Then memoize the result to prevent unnecessary re-renders
  return useMemo(() => selectedState, [selectedState, ...dependencies]);
}

/**
 * A utility function that creates a memoized selector for better performance.
 * Useful for creating reusable selector functions outside components.
 * 
 * @param baseSelector - The selector function to memoize
 * @param equalityFn - Optional equality function to determine if the result has changed
 * @returns A memoized selector function
 */
export function createOptimizedSelector<TResult>(
  baseSelector: (state: RootState) => TResult,
  equalityFn?: (a: TResult, b: TResult) => boolean
): (state: RootState) => TResult {
  let lastState: RootState | undefined;
  let lastResult: TResult | undefined;
  
  return (state: RootState) => {
    // If the state is the same reference and we have a previous result, return it
    if (lastState === state && lastResult !== undefined) {
      return lastResult;
    }
    
    // Calculate the new result
    const newResult = baseSelector(state);
    
    // If we have a previous result and a custom equality function,
    // use it to determine if the result has really changed
    if (
      lastResult !== undefined && 
      equalityFn && 
      equalityFn(lastResult as TResult, newResult)
    ) {
      return lastResult as TResult;
    }
    
    // Store the new state and result
    lastState = state;
    lastResult = newResult;
    
    return newResult;
  };
}

export default useOptimizedSelector; 