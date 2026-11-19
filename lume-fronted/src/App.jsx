import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/forget'
import VerifyOtp from './pages/auth/verify'
import ResetPassword from './pages/auth/reset'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/user/Home'
import User from './pages/user/user'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Products from './pages/admin/Products'
import Categories from './pages/admin/Categories'
import Users from './pages/admin/Users'
import ProtectedRoute from './pages/ProtectedRoute'

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<><Navbar /><Home /><Footer /></>} />
          <Route path="/user/*" element={<><Navbar /><User /><Footer /></>} />
          <Route element={<ProtectedRoute adminOnly={true} />}>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="categories" element={<Categories />} />
              <Route path="users" element={<Users />} />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>

    </div>
  )
}

export default App