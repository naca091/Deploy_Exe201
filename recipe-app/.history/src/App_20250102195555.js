import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Loading } from './components/Loading';
import IngredientList from './components/Admin/Ingredients/IngredientList';
import CategoryList from './components/Admin/Category/CategoryList';

import ErrorFallback from './components/ErrorFallback';

// Lazy load components
const Register = React.lazy(() => import('./components/User/Register'));
const Login = React.lazy(() => import('./components/User/Login'));

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
            <Route path="/login" element={<Login />} />
            <Route path="/admin/ingredients" element={<IngredientList />} />
            <Route path="/admin/categories" element={<CategoryList />} />

          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;