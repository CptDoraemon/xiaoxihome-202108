import {useCallback, useRef} from "react";
import {useUnmount} from "react-use";

const useDebouncedCallback = (callback: () => void, delay: number) => {
  const debouncerRef = useRef<number | null>(null);

  const clearDebouncerIfNeeded = useCallback(() => {
    if (debouncerRef.current !== null) {
      window.clearTimeout(debouncerRef.current);
      debouncerRef.current = null;
    }
  }, []);

  const debouncedCallback = useCallback(() => {
    clearDebouncerIfNeeded();
    debouncerRef.current = window.setTimeout(() => {
      callback();
    }, delay)
  }, [callback, clearDebouncerIfNeeded, delay]);

  useUnmount(clearDebouncerIfNeeded);

  return debouncedCallback
};

export default useDebouncedCallback
