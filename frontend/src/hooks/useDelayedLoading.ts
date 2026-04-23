import { useEffect, useState } from 'react';

const useDelayedLoading = (loading: boolean, delayMs: number = 500): boolean => {
  const [shouldShowLoader, setShouldShowLoader] = useState(false);

  useEffect(() => {
    if (!loading) {
      setShouldShowLoader(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShouldShowLoader(true);
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loading, delayMs]);

  return shouldShowLoader;
};

export default useDelayedLoading;
