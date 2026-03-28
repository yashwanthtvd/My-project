import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Auth from "./components/Auth";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import MyBookings from "./components/MyBookings";


const ProtectedUser = ({ children }) => {
  return localStorage.getItem("hotelbook_user") ? children : <Navigate to="/auth/user" />;
};

const ProtectedAdmin = ({ children }) => {
  return localStorage.getItem("hotelbook_admin") ? children : <Navigate to="/auth/admin" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/:role" element={<Auth />} />
        <Route path="/user" element={<ProtectedUser><UserDashboard /></ProtectedUser>} />
        <Route path="/user/bookings" element={<ProtectedUser><MyBookings /></ProtectedUser>} />
        <Route path="/admin" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;