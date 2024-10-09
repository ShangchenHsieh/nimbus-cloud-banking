import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./common_component/Navbar";
import LandingPage from "./common_component/LandingPage";
import About from "./common_component/AboutUs";
import Contact from "./common_component/Contact";
import SignUp from "./common_component/SignUp";
import QandA from "./common_component/QandA";
import Login from "./common_component/Login";
import UserDashboard from "./user_component/UserDashboard";
import AdminDashboard from "./admin_coponent/AdminDashboard";
import Settings from "./user_component/Settings.jsx";
import News from "./common_component/News";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />{" "}
        {/* Optional: Handle undefined routes */}
        <Route path="/news" element={<News />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Q&A" element={<QandA />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
