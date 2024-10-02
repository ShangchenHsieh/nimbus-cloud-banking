import React, { useState, useContext } from 'react';
import Navbar from './Navbar';
import './styling/SignUp.css';
// import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import animation from "../assets/cloud_outline.json";
import Lottie from 'react-lottie';
 
const SignUp = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    username: '',
    password: '',
    confirm_password: '',
  });
  const navigate = useNavigate();
  // const [, setToken] = useContext(UserContext);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [usernameError, setUsernameError] = useState('');
  let validationErrors = {};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setUsernameError(''); 
    validationErrors = {};
  };

  const submitRegisteration = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        // changed username to email as Django backend expects a 'email' field rather than 'username'
        email: formData.username,
        password: formData.password,
      }),
    };
    // fetch request sent to correct Django URL
    const response = await fetch('http://127.0.0.1:8000/auth/register/', requestOptions);
    const data = await response.json();
    if (response.status === 409) {
      setUsernameError(data.detail); 
    } 
    else {
      // setToken(data.access_token);
      localStorage.setItem('access_token', data.access_token);
      navigate('/userdashboard')
    }
  }
// 
  const handleSubmit = (e) => {
    e.preventDefault();
    

    // Validate required fields
    if (!formData.first_name) validationErrors.first_name = 'First name is required';
    if (!formData.username) validationErrors.username = 'Username is required';
    if (!formData.password) validationErrors.password = 'Password is required';
    if (!formData.confirm_password) validationErrors.confirm_password = 'Please confirm your password';
    if (formData.password !== formData.confirm_password) {
      setErrorMessage('Password and Confirm Password do not match.');
    }
    else if (Object.keys(validationErrors).length > 0 || errorMessage.length === 1 || usernameError === 1) {
      setErrors(validationErrors);
    } 
    else 
    {
      submitRegisteration();
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <>
      <Navbar />
      <div className="Signup-container">
        <div className="login">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                
                <div className='signup-form-container'>
                <div className="animation-container">
                  <Lottie options={defaultOptions} height={300} width={300 } speed={.45} />
                </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="first_name" className="form-label">
                        First Name<span className="required-asterisk">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${errors.first_name ? 'is-invalid' : ''}`}
                        placeholder=""
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                      {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="last_name" className="form-label">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder=""
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">
                        Phone
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="+1(xxx)-xxx-xxxx"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="username" className="form-label">
                        Email<span className="required-asterisk">*</span>
                      </label>
                      <input
                        type="email"
                        className={`form-control form-control-lg ${errors.username ? 'is-invalid' : ''}`}
                        placeholder="example@gmail.com"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                      {usernameError && <div className="invalid-feedback">{usernameError}</div>}
                      {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="password" className="form-label">
                        Password<span className="required-asterisk">*</span>
                      </label>
                      <input
                        type="password"
                        className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                        placeholder=""
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="password" className="form-label">
                        Confirm Password<span className="required-asterisk">*</span>
                      </label>
                      <input
                        type="password"
                        className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                        placeholder=""
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                      />
                      {errors.confirm_password && <div className="invalid-feedback">{errors.confirm_password}</div>}
                    </div>
                    <div className="invalid-feedback">{errorMessage}</div>
                    <div className="form-group">
                      <label htmlFor="password" className="form-label">
                        
                      </label>
                    </div>
                    <input type="submit" className="signup-btn" value="Register" />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;