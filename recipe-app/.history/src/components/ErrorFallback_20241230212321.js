const ErrorFallback = ({ error }) => {
    return (
      <div role="alert">
        <h2>Something went wrong:</h2>
        <pre>{error.message}</pre>
      </div>
    );
  };