import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './styling/Login.css';
import animation from "../assets/cloud_outline.json";
import Lottie from 'react-lottie';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setUsernameError('');
    setErrorMessage('');
  };

  const submitLogin = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // updated to email to match backend field
        email: formData.username,
        password: formData.password,
      }),
    };
    const response = await fetch('http://127.0.0.1:8000/auth/login/', requestOptions);
    const data = await response.json();

    if (response.status === 401 || response.status === 400) {
      setErrorMessage(data.detail); // Handle backend error message
    } else {
      // Assuming the backend returns an access token on success
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      navigate('/userdashboard');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    let validationErrors = {};
    if (!formData.username) validationErrors.username = 'Username is required';
    if (!formData.password) validationErrors.password = 'Password is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      submitLogin();
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

      <div className="Login-container">
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>

        <div className="login">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">

                <div className='login-form-container'>
                  <div className="animation-container">
                    <Lottie options={defaultOptions} height={300} width={300} speed={.45} />
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="username" className="form-label">
                        Email<span className="required-asterisk">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${errors.username ? 'is-invalid' : ''}`}
                        placeholder="example@gmail.com"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                      {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="password" className="form-label">
                        Password<span className="required-asterisk">*</span>
                      </label>
                      <input
                        type="password"
                        className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>

                    {errorMessage && <div className="invalid-feedback">{errorMessage}</div>}

                    {/* Forgot Password Link */}
                    <div className="forgot-password-link">
                      <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                    <div className="forgot-password-link">
                      <Link to="/signup">Not enrolled? Sign up today</Link>
                    </div>
                    <input type="submit" className="signup-btn" value="Login" />
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

export default Login;
