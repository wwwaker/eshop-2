import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Location } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import OrderListPage from './pages/OrderListPage';
import OrderDetailPage from './pages/OrderDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

/**
 * EShop商城应用主组件
 * 配置应用路由和全局状态提供者
 */
const ROUTE_TRANSITION_DELAY_MS = 250;

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState<Location>(location);

  useEffect(() => {
    if (location.key === displayLocation.key) {
      return;
    }

    const timer = window.setTimeout(() => {
      setDisplayLocation(location);
    }, ROUTE_TRANSITION_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [location, displayLocation]);

  return (
    <Routes location={displayLocation}>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/orders" element={<OrderListPage />} />
      <Route path="/order/:id" element={<OrderDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
};

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="app-shell">
          <Navbar />
          <main className="app-main">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
