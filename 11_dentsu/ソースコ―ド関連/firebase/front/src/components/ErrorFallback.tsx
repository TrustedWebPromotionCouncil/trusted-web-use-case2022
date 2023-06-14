import { FallbackProps } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre className="text-red-500 m-2">{error.message}</pre>
      <button onClick={resetErrorBoundary} className="border-2 p-2">
        Try again
      </button>
    </div>
  );
}

export default ErrorFallback;
