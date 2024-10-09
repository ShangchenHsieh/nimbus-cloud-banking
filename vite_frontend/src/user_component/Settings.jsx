import React, { useState } from 'react';
import Navbar from './UserNavBar';
import './styling/Settings.css';

const Settings = () => {
  const [formData, setFormData] = useState({
    first_name: 'Ava',
    last_name: 'Cado',
    phone: '+1 (555) 555-5555',
    email: 'ava.cado@example.com',
    password: '********'
  });

  const [editableFields, setEditableFields] = useState({
    first_name: false,
    last_name: false,
    phone: false,
    email: false,
    password: false
  });

  const [isAccountSettingsVisible, setAccountSettingsVisible] = useState(false);
  const [isStatementsVisible, setStatementsVisible] = useState(false);

  const handleEditClick = (e, field) => {
    e.preventDefault(); 
    setEditableFields({
      ...editableFields,
      [field]: true
    });
  };

  /* decide if we want page not to reload after editing
  const handleSaveClick = (e, field) => {
    e.preventDefault(); 
    setEditableFields({
      ...editableFields,
      [field]: false
    });
  };*/

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Navbar />
      <div className="settings-page-container">

        {/* User Info Section */}
        <div className="user-info-container">
          <div className="user-initials">AC</div>
          <div className="user-details">
            <h2>Ava Cado</h2>
            <p>Last sign-in: October 8, 2024 at 9:45 AM</p>
          </div>
        </div>

        {/* Account Settings Section */}
        <div className="dropdown-container">
          <h2
            className="dropdown-header"
            onClick={() => setAccountSettingsVisible(!isAccountSettingsVisible)}
          >
            Account Settings
            <span className={`dropdown-arrow ${isAccountSettingsVisible ? 'open' : ''}`}>&#9660;</span>
          </h2>
          {isAccountSettingsVisible && (
            <div className="settings-container">
              <form className="settings-form">
                <div className="settings-form-group">
                  <label htmlFor="first_name" className="settings-label">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    className="settings-input"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    readOnly={!editableFields.first_name}
                  />
                  {editableFields.first_name ? (
                    <button className="edit-save-btn" onClick={(e) => handleSaveClick(e, 'first_name')}>Save</button>
                  ) : (
                    <button
                      className="edit-save-btn"
                      type="button"
                      onClick={(e) => handleEditClick(e, 'first_name')}
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="settings-form-group">
                  <label htmlFor="last_name" className="settings-label">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    className="settings-input"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    readOnly={!editableFields.last_name}
                  />
                  {editableFields.last_name ? (
                    <button className="edit-save-btn" onClick={(e) => handleSaveClick(e, 'last_name')}>Save</button>
                  ) : (
                    <button
                      className="edit-save-btn"
                      type="button"
                      onClick={(e) => handleEditClick(e, 'last_name')}
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="settings-form-group">
                  <label htmlFor="phone" className="settings-label">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    className="settings-input"
                    value={formData.phone}
                    onChange={handleInputChange}
                    readOnly={!editableFields.phone}
                  />
                  {editableFields.phone ? (
                    <button className="edit-save-btn" onClick={(e) => handleSaveClick(e, 'phone')}>Save</button>
                  ) : (
                    <button
                      className="edit-save-btn"
                      type="button"
                      onClick={(e) => handleEditClick(e, 'phone')}
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="settings-form-group">
                  <label htmlFor="email" className="settings-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="settings-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    readOnly={!editableFields.email}
                  />
                  {editableFields.email ? (
                    <button className="edit-save-btn" onClick={(e) => handleSaveClick(e, 'email')}>Save</button>
                  ) : (
                    <button
                      className="edit-save-btn"
                      type="button"
                      onClick={(e) => handleEditClick(e, 'email')}
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="settings-form-group">
                  <label htmlFor="password" className="settings-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="settings-input"
                    value={formData.password}
                    onChange={handleInputChange}
                    readOnly={!editableFields.password}
                  />
                  {editableFields.password ? (
                    <button className="edit-save-btn" onClick={(e) => handleSaveClick(e, 'password')}>Save</button>
                  ) : (
                    <button
                      className="edit-save-btn"
                      type="button"
                      onClick={(e) => handleEditClick(e, 'password')}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Statements & Documents Section */}
        <div className="dropdown-container">
          <h2
            className="dropdown-header"
            onClick={() => setStatementsVisible(!isStatementsVisible)}
          >
            Statements & Documents
            <span className={`dropdown-arrow ${isStatementsVisible ? 'open' : ''}`}>&#9660;</span>
          </h2>
          {isStatementsVisible && (
            <div className="data-container">
              <div className="data-option">
                <label className="data-label">Monthly Statements</label>
                <button className="download-btn">Download PDF</button>
              </div>
              <div className="data-option">
                <label className="data-label">Tax Documents</label>
                <button className="download-btn">Download PDF</button>
              </div>
              <div className="data-option">
                <label className="data-label">Notices</label>
                <button className="download-btn">Download PDF</button>
              </div>
              <div className="data-option">
                <label className="data-label">Annual Summaries</label>
                <button className="download-btn">Download PDF</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;
