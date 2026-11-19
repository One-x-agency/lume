import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./Home"
import Shop from "./Shop"
import Cart from "./Cart"
import Blog from "./blog"

const User = () => {
  return (
    <Routes>
    <Route path="/" element={<Navigate to="home"/>} />
    <Route path="home" element={<Home />} />
    <Route path="shop" element={<Shop />} />
    <Route path="cart" element={<Cart />} />
    <Route path="blog" element={<Blog />} />
  </Routes>
  )
}

export default User