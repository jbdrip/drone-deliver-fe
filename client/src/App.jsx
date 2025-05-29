import { BrowserRouter, Routes, Route } from "react-router-dom"

// Components
import Layout from './components/Layout'
import AuthGuard from './components/AuthGuard'

// Pages
import Login from "./pages/Login"
import Users from "./pages/Users"


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route element={<AuthGuard><Layout /></AuthGuard>}>
          <Route path="/users" element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
