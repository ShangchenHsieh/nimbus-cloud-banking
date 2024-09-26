import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route, Routes, useNavigate} from "react-router-dom";
import LandingPage from './common_component/LandingPage';
import SignUp from './common_component/SignUp';

function App() {
  return (
    <div> 
      <Router> 
      <div> 
        <Routes>
          <Route path='/' element={<LandingPage />} /> 
          <Route path='/signup' element={<SignUp />} />
        </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;
