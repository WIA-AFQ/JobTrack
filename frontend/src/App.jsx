import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AddApplication from './pages/AddApplication';
import Applications from './pages/Applications';
import EditApplication from './pages/EditApplication';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
function App() {
  return (
    <BrowserRouter>
      <Routes>
    <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/applications"
  element={
    <ProtectedRoute>
      <Applications />
    </ProtectedRoute>
  }
/>

<Route
  path="/applications/create"
  element={
    <ProtectedRoute>
      <AddApplication />
    </ProtectedRoute>
  }
/>

<Route
  path="/applications/:id/edit"
  element={
    <ProtectedRoute>
      <EditApplication />
    </ProtectedRoute>
  }
/>
        <Route path="/" element={<Navigate to="/login" />} />
       <Route
  path="/login"
  element={
    <GuestRoute>
      <Login />
    </GuestRoute>
  }
/>

<Route
  path="/register"
  element={
    <GuestRoute>
      <Register />
    </GuestRoute>
  }
/>
       

      </Routes>
    </BrowserRouter>
  )
}

export default App