import { AxiosError } from 'axios';

export default (error: Error, setError: (msg: string) => void): void => {
  const ae = error as AxiosError;
  if (ae.response) {
    if (ae.response.status === 400) {
      setError(ae.response.data.message);
    } else {
      setError("This didn't work, probably a bug");
    }
  } else if (ae.request) {
    setError('No connection');
  } else {
    setError("This didn't work, probably a bug");
  }
};
