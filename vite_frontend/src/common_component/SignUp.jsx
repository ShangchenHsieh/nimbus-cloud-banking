import React, { useState } from 'react';
import Navbar from './Navbar';
import './styling/SignUp.css';
import { useNavigate } from 'react-router-dom';
import animation from "../assets/cloud_outline.json";
import Lottie from 'react-lottie';
import Modal from 'react-modal';

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
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false); // State to track the checkbox
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal
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
    else if (response.status === 400) {

      setErrorMessage("This email is already associated with another account.");

      navigate('/signup');
    }
    else {

      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      navigate('/userdashboard');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.first_name) validationErrors.first_name = 'First name is required';
    if (!formData.username) validationErrors.username = 'Username is required';
    if (!formData.password) validationErrors.password = 'Password is required';
    if (!formData.confirm_password) validationErrors.confirm_password = 'Please confirm your password';
    if (formData.password !== formData.confirm_password) {
      setErrorMessage('Password and Confirm Password do not match.');
    } else if (Object.keys(validationErrors).length > 0 || errorMessage.length === 1 || usernameError === 1) {
      setErrors(validationErrors);
    } else if (!agreeToTerms) {
      setErrorMessage('You must agree to the terms and conditions.');
    } else {
      submitRegisteration();
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Toggles modal visibility
  };

  return (
    <>
      <Navbar />
      {/* Bubbles */}

      <div className="Signup-container">
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>

        <div className="login">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <div className='signup-form-container'>
                  <div className="animation-container">
                    <Lottie options={defaultOptions} height={300} width={300} speed={.45} />
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
                      <label htmlFor="confirm_password" className="form-label">
                        Confirm Password<span className="required-asterisk">*</span>
                      </label>
                      <input
                        type="password"
                        className={`form-control form-control-lg ${errors.confirm_password ? 'is-invalid' : ''}`}
                        placeholder=""
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                      />
                      {errors.confirm_password && <div className="invalid-feedback">{errors.confirm_password}</div>}
                    </div>

                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          id="agreeToTerms"
                          checked={agreeToTerms}
                          onChange={() => setAgreeToTerms(!agreeToTerms)}
                        />
                        I agree to the <span className="terms-link" onClick={toggleModal}>Terms & Conditions</span>
                      </label>
                    </div>
                    <div></div>
                    <div className="invalid-feedback">{errorMessage}</div>

                    <input type="submit" className="signup-btn" value="Register" />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={toggleModal}
          contentLabel="Terms and Conditions"
          className="terms-modal"
          overlayClassName="terms-modal-overlay"
        >
          <h2>Terms and Conditions</h2>
          <p>
            PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY. BY ACCESSING THIS WEBSITE YOU AGREE TO BE BOUND BY THE TERMS AND CONDITIONS BELOW. THESE TERMS AND CONDITIONS ARE SUBJECT TO CHANGE. ANY CHANGES WILL BE INCORPORATED INTO THE TERMS AND CONDITIONS POSTED TO THIS WEBSITE FROM TIME TO TIME. IF YOU DO NOT AGREE WITH THESE TERMS AND CONDITIONS, PLEASE DO NOT ACCESS THIS WEBSITE.
            <br /><br />
            Unauthorized use of Nimbus' Websites and systems, including but not limited to unauthorized entry into Nimbus' systems, misuse of passwords, posting of objectionable or offensive content, or your unauthorized use of legally protected third-party content, or misuse of any information posted to a site, is strictly prohibited.
            <br /><br />
            If you use Nimbus’ Website or systems to access data related to any account(s) of which you are not the owner or authorized user as reflected in Nimbus' systems, you shall indemnify, defend, and hold harmless Nimbus & Co. and all of its direct and indirect subsidiaries, officers, directors, employees, agents, successors, and assigns from any and all losses, liabilities, damages, and all related costs and expenses, arising from, relating to, or resulting (directly or indirectly) from such access. Further, without limiting Nimbus’ rights or your obligations under any other provision of these Terms and Conditions, and notwithstanding the same, in the event of any actual or reasonably suspected unauthorized access to the personal information of a customer (including but not limited to customer names, addresses, phone numbers, bank and credit card account numbers, income and credit histories, and social security numbers) under your control or subsequent to and arising from your past exercise of control, direct damages in connection with any such breach will include the cost and expenses of investigation and analysis (including by law firms and forensic firms), correction or restoration of any destroyed, lost, or altered data, notification to affected customers, offering and providing of credit monitoring, customer service, or other remediation services, and any related cost. Nimbus & Co.’s rights to indemnity under this section are in addition to all other rights and remedies available at Law or in equity. Any exercise by Nimbus & Co. of its rights to indemnification shall be without prejudice to such other rights and remedies. You manifest your assent to this indemnity by accessing account data through Nimbus’ Website or systems, notwithstanding the terms of any agreement you have with a customer or an account owner stating otherwise. This indemnity includes but is not limited to losses associated with (1) a data breach of your system(s) and (2) a data breach of the system(s) of any person or entity with whom you provided or shared Nimbus customer account data.
            <br /><br />
            <strong>Copyright Notices</strong><br />
            The works of authorship contained in the nimbus.com Website (the "Website"), including but not limited to all design, text, sound recordings, and images, are owned, except as otherwise expressly stated, by Nimbus & Co. or one of its subsidiaries, ("Nimbus"). Except as otherwise expressly stated herein, they may not be copied, transmitted, displayed, performed, distributed (for compensation or otherwise), licensed, altered, framed, stored for subsequent use, or otherwise used in whole or in part in any manner without Nimbus' prior written consent, except to the extent permitted by the Copyright Act of 1976 (17 U.S.C. § 107), as amended, and then, only with notices of Nimbus' proprietary rights provided that you may download information and print out hard copies for your personal use, so long as you do not remove any copyright or other notice as may be contained in information, as downloaded.
            <br /><br />
            <strong>Trademark Notices</strong><br />
            Nimbus is the marketing name for the retail financial services activities of Nimbus & Co. and its subsidiaries and affiliates in the United States. "Nimbus," the Nimbus logo, and the Octagon Symbol are trademarks of Nimbus Bank, N.A., a wholly-owned subsidiary of Nimbus & Co. Other featured words or symbols, used to identify the source of goods and services, may be the trademarks of their respective owners.
            <br /><br />
            <strong>Limitation of Liability</strong><br />
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, NIMBUS WILL NOT BE LIABLE TO YOU OR ANYONE ELSE FOR ANY DAMAGES, INCLUDING BUT NOT LIMITED TO DIRECT OR INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, LOSSES OR EXPENSES ARISING IN CONNECTION WITH THIS WEBSITE OR ANY LINKED WEBSITE OR USE THEREOF OR INABILITY TO USE BY ANY PARTY, OR IN CONNECTION WITH ANY FAILURE OF PERFORMANCE, ERROR, OMISSION, INTERRUPTION, DEFECT, DELAY IN OPERATION OR TRANSMISSION, COMPUTER VIRUS OR LINE OR SYSTEM FAILURE, EVEN IF NIMBUS, OR REPRESENTATIVES THEREOF, ARE ADVISED OF THE POSSIBILITY OF SUCH DAMAGES, LOSSES OR EXPENSES.
          </p>
          <button onClick={toggleModal}>Close</button>
        </Modal>

      </div>
    </>
  );
};

export default SignUp;
