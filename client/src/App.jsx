import { BrowserRouter, Routes, Route } from "react-router-dom"

// Components
import Layout from './components/Layout'
import AuthGuard from './components/AuthGuard'

// Pages
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<AuthGuard><Layout /></AuthGuard>}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
