import { useState, useEffect, useRef } from 'react';
export function useMediaQuery(query, handler) {
    const [matches, setMatch] = useState(false);

    useEffect(() => {
        const handleChange = mql => {
            setMatch(mql.matches);
            handler && handler(mql.matches);
        }

        const mediaQueryList = window.matchMedia(query);
        mediaQueryList.addEventListener('change', handleChange);
        // mediaQueryList.addListener(handleChange);
    
        // run handler once
        handleChange(mediaQueryList);

        return () => mediaQueryList.removeEventListener('change', handleChange);
        // return () => mediaQueryList.removeListener(handleChange);
    });

    return matches;
}

/* :: (any, ?Function) -> Array<any> */
export function useStateWithEffect(initialState) {
    const [state, setState] = useState(initialState);
  
    /** @NOTE: Handle setState callback */
    const lookup = useRef([]);
    useEffect(
      () => {
        const entry = lookup.current.find(([stateSet]) => state === stateSet);
  
        if (Array.isArray(entry)) {
          const [, callback] = entry;
          callback(state);
        }
  
        lookup.current = [];
      },
      [state]
    );
    const $setState = (nextStateOrGetter, callback) => {
      setState(nextStateOrGetter);
  
      if (typeof callback !== "function") {
        return;
      }
  
      const nextState =
        typeof nextStateOrGetter === "function"
          ? nextStateOrGetter(state)
          : nextStateOrGetter;
      lookup.current.push([nextState, callback]);
    };
  
    return [state, $setState];
  };