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
import RoleList from './components/Admin/Roles/RoleList';
import ResetPassword from './components/User//ReserPassword';
import AdminVideoUpload from './components/Admin/AdminUploadVideo';
import SeeVideo from './components/User/SeeVideo';

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
            <Route path="/admin/roles" element={<RoleList />} />
            <Route path="/user/resetpassword" element={<ResetPassword />} />
            <Route path="/admin/upload-video" element={<AdminVideoUpload />} />
            <Route path="/user/see-video" element={<SeeVideo />} />

          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;