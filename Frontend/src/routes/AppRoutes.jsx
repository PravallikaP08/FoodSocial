import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import UserRegister from "../pages/auth/UserRegister";
import UserLogin from "../pages/auth/UserLogin";
import FoodPartnerRegister from "../pages/auth/FoodPartnerRegister";
import FoodPartnerLogin from "../pages/auth/FoodPartnerLogin";
import ChooseRegister from "../pages/auth/ChooseRegister";
import Home from "../pages/general/Home";
import LandingPage from "../pages/general/LandingPage";
import Saved from "../pages/general/Saved";
import CreateFood from "../pages/food-partner/CreateFood";
import Profile from "../pages/food-partner/Profile";
import EditProfile from "../pages/food-partner/EditProfile";
import BottomNavbar from "../components/BottomNavbar";
import { CartProvider } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";
import { Navigate, useSearchParams } from "react-router-dom";

// Specialized Login Redirect
const LoginRedirect = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');
  
  if (role === 'partner') return <Navigate to="/food-partner/login" replace />;
  return <Navigate to="/user/login" replace />;
};

// Layout wrapper to conditionally show navigation
const AppLayout = ({ children }) => {
  const location = useLocation();
  // Only show navbar on main feed and saved pages
  const showNavbar = ['/feed', '/saved'].includes(location.pathname);
  
  return (
    <>
      {children}
      {showNavbar && <BottomNavbar />}
      <CartDrawer />
    </>
  );
};

const AppRoutes = () => {
  return (
    <CartProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/feed" element={<Home/>}/>
            <Route path="/saved" element={<Saved />} />
            <Route path="/login" element={<LoginRedirect />} />
            <Route path="/signup" element={<ChooseRegister />} />
            <Route path="/user/register" element={<UserRegister />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/choose-register" element={<ChooseRegister />} />
            <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
            <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
            <Route path="/create-food" element={<CreateFood />} />
            <Route path="/food-partner/edit" element={<EditProfile />} />
            <Route path="/food-partner/:id" element={<Profile />} />
          </Routes>
        </AppLayout>
      </Router>
    </CartProvider>
  );
};

export default AppRoutes;
