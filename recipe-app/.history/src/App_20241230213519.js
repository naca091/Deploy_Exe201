import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Loading } from './components/Loading';
import { Register } from './components/User/Register';

import ErrorFallback from './components/ErrorFallback';

// Lazy load components
const Register = React.lazy(() => import('./components/Register'));

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter future={{ 
        v7_startTransition: true,
        v7_relativeSplatPath: true 
      }}>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/register" element={<Register />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;