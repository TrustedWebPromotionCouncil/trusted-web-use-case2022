import { useRouteError } from 'react-router-dom';
import { FunctionComponent } from 'react';

interface ErrorPayload {
  statusText: string;
  message: string;
}

export const ErrorPage: FunctionComponent = () => {
  const error = useRouteError() as ErrorPayload;
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText !== '' || error.message}</i>
      </p>
    </div>
  );
};

export default ErrorPage;
