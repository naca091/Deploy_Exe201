import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Loading } from './components/Loading';
import IngredientList from './components/Admin/Ingredients/IngredientList';
import CategoryList from './components/Admin/Categories/CategoryList';
import MenuList from './components/Admin/Menus/MenuList';
import ErrorFallback from './components/ErrorFallback';
import Homepage from './components/User/Homepage';
import UserProfile from './components/User/Profile';
import UserList from './components/Admin/Users/UserList';
import UserList from './components/Admin/Users/UserList';
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
            <Route path="/admin/menus" element={<MenuList />} />
            <Route path="/user/homepage" element={<Homepage />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/admin/user" element={<UserList />} />

          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;