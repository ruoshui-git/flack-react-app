import { useState, useEffect } from 'react';
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