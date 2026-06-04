import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import OtpVerify from './pages/OtpVerify'
import Home from './pages/Home'
import Products from './pages/Products'
import { useAuth } from './context/AuthContext'

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/otp" element={<OtpVerify />} />
      <Route path="/home" element={
        <ProtectedRoute><Home /></ProtectedRoute>
      } />
      <Route path="/products" element={
        <ProtectedRoute><Products /></ProtectedRoute>
      } />
    </Routes>
  )
}

