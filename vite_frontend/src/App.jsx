import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Make sure you install jwt-decode: `npm install jwt-decode`
import Navbar from "./common_component/Navbar";
import LandingPage from "./common_component/LandingPage";
import About from "./common_component/AboutUs";
import Contact from "./common_component/Contact";
import SignUp from "./common_component/SignUp";
import QandA from "./common_component/QandA";
import Login from "./common_component/Login";
import AdminLogin from "./common_component/AdminLogin";
import UserDashboard from "./user_component/UserDashboard";
import AdminDashboard from "./admin_coponent/AdminDashboard";
import Settings from "./user_component/Settings.jsx";
import SearchATMs from "./user_component/SearchATMs.jsx";
import News from "./common_component/News";
import { UserProvider } from "./user_context/UserContext.jsx";
import Help from "./user_component/Help.jsx";
import UserTransactions from "./user_component/UserTransactions.jsx";
import UserStatement from "./user_component/UserStatement.jsx";
import UserPayment from "./user_component/UserPayment.jsx";
import UserTransfer from "./user_component/UserTransfer.jsx";
import Deposit from "./user_component/Deposit.jsx";
import Withdrawal from "./user_component/Withdrawal.jsx";
import AdminUserTransactions from "./admin_coponent/AdminUserTransactions.jsx";
import "./App.css";

const ProtectedRoute = ({ children }) => {
   const navigate = useNavigate();

   useEffect(() => {
      const token = localStorage.getItem("access_token");
      if (!token) {
         navigate("/"); // Redirect to home if token is missing
         return;
      }

      try {
         const decoded = jwtDecode(token);
         const currentTime = Date.now() / 1000; // Current time in seconds
         if (decoded.exp < currentTime) {
            localStorage.removeItem("access_token"); // Clear expired token
            navigate("/"); // Redirect to home if token is expired
         }
      } catch (error) {
         console.error("Error decoding token:", error);
         navigate("/"); // Redirect to home if token is invalid
      }
   }, [navigate]);

   return <>{children}</>;
};

function App() {
   return (
      <UserProvider>
         <Router>
            <Routes>
               <Route path="/" element={<LandingPage />} />
               <Route path="*" element={<div>404 Not Found</div>} />{" "}
               {/* Handle undefined routes */}
               <Route path="/news" element={<News />} />
               <Route path="/signup" element={<SignUp />} />
               <Route path="/Q&A" element={<QandA />} />
               <Route path="/about" element={<About />} />
               <Route path="/contact" element={<Contact />} />
               <Route path="/login" element={<Login />} />
               <Route path="/adminlogin" element={<AdminLogin />} />
               {/* Protected Routes */}
               <Route
                  path="/userdashboard"
                  element={
                     <ProtectedRoute>
                        <UserDashboard />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/usertransactions"
                  element={
                     <ProtectedRoute>
                        <UserTransactions />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/deposit"
                  element={
                     <ProtectedRoute>
                        <Deposit />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/withdraw"
                  element={
                     <ProtectedRoute>
                        <Withdrawal />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/userstatement"
                  element={
                     <ProtectedRoute>
                        <UserStatement />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/userpayment"
                  element={
                     <ProtectedRoute>
                        <UserPayment />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/usertransfer"
                  element={
                     <ProtectedRoute>
                        <UserTransfer />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/admindashboard"
                  element={
                     <ProtectedRoute>
                        <AdminDashboard />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/adminusertransactions"
                  element={
                     <ProtectedRoute>
                        <AdminUserTransactions />
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
               <Route
                  path="/maps"
                  element={
                     <ProtectedRoute>
                        <SearchATMs />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/help"
                  element={
                     <ProtectedRoute>
                        <Help />
                     </ProtectedRoute>
                  }
               />
            </Routes>
         </Router>
      </UserProvider>
   );
}

export default App;
