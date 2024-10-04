import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./common_component/LandingPage";
import SignUp from "./common_component/SignUp";
import QandA from "./common_component/QandA";
import AboutUs from "./common_component/AboutUs";
import Contact from "./common_component/Contact";
import UserDashboard from "./user_component/UserDashboard";
import Login from "./common_component/Login";

function App() {
   return (
      <div>
         <div>
            <Routes>
               <Route path="/" element={<LandingPage />} />
               <Route path="/signup" element={<SignUp />} />
               <Route path="/q&a" element={<QandA />} />
               <Route path="/about" element={<AboutUs />} />
               <Route path="/contact" element={<Contact />} />
               <Route path="/login" element={<Login />} />
               <Route path="/userdashboard" element={<UserDashboard />} />
            </Routes>
         </div>
      </div>
   );
}

export default App;
