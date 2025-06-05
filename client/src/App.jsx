import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify'

// Components
import Layout from './components/Layout'
import AuthGuard from './components/auth/AuthGuard'

// Pages
import Login from "./pages/Login"
import Register from "./pages/Register"
import Users from "./pages/Users"
import Customers from "./pages/Customers"
import DistributionCenters from "./pages/DistributionCenters"
import Products from "./pages/Products"
import Orders from "./pages/Orders"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route element={<AuthGuard><Layout /></AuthGuard>}>
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/distribution-centers" element={<DistributionCenters />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/orders" element={<Orders/>} />
          <Route path="/customer/orders" element={<Orders/>} />
          {/* Catch-all for 404 */}
          <Route path="*" element={<div>404 No encontrado.</div>} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
