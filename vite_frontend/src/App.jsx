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
import SearchATMs from "./user_component/searchATMs.jsx";
import News from "./common_component/News";
import { UserProvider } from "./user_context/UserContext.jsx";
import Help from "./user_component/Help.jsx";
import UserTransactions from "./user_component/UserTransactions.jsx";
import UserStatement from "./user_component/UserStatement.jsx";
import UserPayment from "./user_component/UserPayment.jsx";
import Deposit from './user_component/Deposit.jsx'
import Withdrawal from "./user_component/Withdrawal.jsx";
import.meta.env.VITE_API_KEY
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

               {/* Need to be protected*/}
               <Route path="/userdashboard" element={<UserDashboard />} />
               <Route path="/usertransactions" element={<UserTransactions />} />
               <Route path="/deposit" element={<Deposit />} />
               <Route path="/withdraw" element={<Withdrawal />} />
               <Route path="/userstatement" element={<UserStatement />} />
               <Route path="/userpayment" element={<UserPayment />} />
               <Route path="/admindashboard" element={<AdminDashboard />} />
               <Route path="/settings" element={<Settings />} />
               <Route path="/maps" element={<SearchATMs />} />
               <Route path="/help" element={<Help />} />
            </Routes>
         </Router>
      </UserProvider>
   );
}

export default App;
