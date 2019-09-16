import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import handleError from './handleError';

/**
 * A React hook which performs an async endpoint request and once it's done it
 * processes the response. It also keeps track of whether the action is
 * currently being processed, handles errors and does not update state if
 * component has unmounted.
 * @param call a function that will call the endpoint
 * @param handler a function that will handle the results
 * @param changeListeners if any of those objects change, the call and handler
 *                        functions will be refreshed
 *
 * @returns an array with three things: function which triggers the call, boolean
 *          describing whether the call is currently active and string with errors
 *          (it's empty in case of no errors)
 */
const useRequest = <T extends unknown[], D>(
  call: (...args: T) => Promise<D>,
  handler: (res: D, ...args: T) => void,
  changeListeners: any[]
): [(...args: T) => void, boolean, string] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isMounted = useRef(true);
  useLayoutEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );

  const request = useMemo(
    () => async (...args: T) => {
      setLoading(true);
      setError('');
      try {
        const res = await call(...args);
        if (isMounted.current) {
          setLoading(false);
          handler(res, ...args);
        }
      } catch (err) {
        setLoading(false);
        handleError(err, setError);
      }
    },
    [call, handler, ...changeListeners] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return [request, loading, error];
};

export default useRequest;
