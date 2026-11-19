import { Navigate, Outlet } from "react-router-dom"
import { toast } from "react-toastify"

const ProtectedRoute = ({ adminOnly = false }) => {
  const token = localStorage.getItem("token")
  const role = localStorage.getItem("userRole")

  if (!token) return <Navigate to="/login" replace />

  if (adminOnly && role !== "ADMIN") {
    toast.error("Unauthorized! Admin access required.")
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
