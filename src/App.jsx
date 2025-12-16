import { Routes, Route, Navigate } from "react-router-dom";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import Layout from "./components/Layout";
import { useSelector } from "react-redux";

export default function App() {
  const { token, user } = useSelector((s) => s.auth);
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/admin"
          element={token && user?.role === 'admin' ? <Admin /> : <Navigate to="/login" />}
        />
        <Route
          path="/checkout"
          element={token ? <Checkout /> : <Navigate to="/login" />}
        />
      </Route>
    </Routes>
  );
}
