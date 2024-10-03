import logo from "./logo.svg";
import "./App.css";

import {
   BrowserRouter as Router,
   Route,
   Routes,
   useNavigate,
} from "react-router-dom";
import LandingPage from "./common_component/LandingPage";
import SignUp from "./common_component/SignUp";
import QandA from "./common_component/QandA";
import AboutUs from "./common_component/AboutUs";
import Contact from "./common_component/Contact";
import UserDashboard from "./user_component/UserDashboard";

function App() {
   return (
      <div>
         <Router>
            <div>
               <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/q&a" element={<QandA />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/userdashboard" element={<UserDashboard />} />
               </Routes>
            </div>
         </Router>
      </div>
   );
}

export default App;
