import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify'

// Components
import Layout from './components/Layout'
import AuthGuard from './components/auth/AuthGuard'

// Pages
import Login from "./pages/Login"
import Users from "./pages/Users"
import Customers from "./pages/Customers"
import DistributionCenters from "./pages/DistributionCenters"
import Products from "./pages/Products"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route element={<AuthGuard><Layout /></AuthGuard>}>
          <Route path="/users" element={<Users />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/distribution-centers" element={<DistributionCenters />} />
          <Route path="/products" element={<Products />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
