import { useCallback, useRef } from 'react';

export const useThrottle = (callback: (...args: any[]) => void, delay = 500) => {
    const lastExecuted = useRef(0);
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    return useCallback(
        (...args: any[]) => {
            const now = Date.now();
            if (now - lastExecuted.current >= delay) {
                lastExecuted.current = now;
                callbackRef.current(...args);
            }
        },
        [delay],
    );
};
