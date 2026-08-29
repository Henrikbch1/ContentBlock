import { useEffect, useState } from "react";

type AsyncResource<T> = {
  data: T | null;
  isLoading: boolean;
  error: unknown;
  hasError: boolean;
};

/** Kapselt das Fetch+isMounted-Boilerplate, das zuvor in jeder Page dupliziert war. */
export function useAsyncResource<T>(
  fetcher: () => Promise<T>,
  deps: readonly unknown[],
): AsyncResource<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (isMounted) setData(result);
      })
      .catch((caughtError: unknown) => {
        if (isMounted) setError(caughtError);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, isLoading, error, hasError: error !== null };
}
