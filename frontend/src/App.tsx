import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Sidebar from './components/common/Sidebar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import TaxHub from './pages/TaxHub';
import CreditCards from './pages/CreditCards';
import { FinancialProvider } from './context/FinancialContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileManager from './pages/ProfileManager';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <FinancialProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <div className="flex-1 flex">
              <Sidebar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/tax-hub" element={<TaxHub />} />
                  <Route path="/credit-cards" element={<CreditCards />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfileManager />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
            </div>
            <Footer />
          </div>
        </Router>
      </FinancialProvider>
    </AuthProvider>
  );
}

export default App;