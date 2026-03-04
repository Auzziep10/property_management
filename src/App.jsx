import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Properties from './pages/Properties';
import Financials from './pages/Financials';
import Accounts from './pages/Accounts';
import Reminders from './pages/Reminders';

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected layout routes */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="properties" element={<Properties />} />
          <Route path="financials" element={<Financials />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="reminders" element={<Reminders />} />
          <Route path="settings" element={<div>Settings Page Placeholder</div>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
