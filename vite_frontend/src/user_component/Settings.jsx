import React, { useState, useEffect } from "react";
import Navbar from "./UserNavBar";
import "./styling/Settings.css";

const Settings = () => {
   const [formData, setFormData] = useState({
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      password: "********",
   });

   const [editableFields, setEditableFields] = useState({
      first_name: false,
      last_name: false,
      phone: false,
      email: false,
      password: false,
   });

   const [isAccountSettingsVisible, setAccountSettingsVisible] =
      useState(false);
   const [isStatementsVisible, setStatementsVisible] = useState(false);

   const [error, setError] = useState("");

   // Fetch user data from the backend
   useEffect(() => {
      const fetchUserData = async () => {
         const token = localStorage.getItem("access_token");
         if (!token) {
            console.error("No access token found");
            return;
         }

         const requestOptions = {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
         };

         try {
            const response = await fetch(
               "http://127.0.0.1:8000/auth/user/",
               requestOptions
            );

            if (!response.ok) {
               throw new Error(
                  `Error ${response.status}: ${response.statusText}`
               );
            }

            const data = await response.json();
            setFormData({
               first_name: data.first_name,
               last_name: data.last_name,
               phone: data.phone,
               email: data.email,
               password: "********",
            });
         } catch (error) {
            console.error("Error fetching user data:", error);
         }
      };

      fetchUserData();
   }, []);

   // Function to handle when a field becomes editable
   const handleEditClick = (field) => {
      setEditableFields({
         ...editableFields,
         [field]: true,
      });
   };

   // Function to handle saving the updated data
   const handleSaveClick = async (field) => {
      // Phone # sanitation
      setError("");
      if (field == "phone") {
         const regex = /^\d{10}$/;
         if (!regex.test(formData[field])) {
            setError("Error: Enter a 10 digit phone number");
            return;
         }
      }

      setEditableFields({
         ...editableFields,
         [field]: false,
      });

      const token = localStorage.getItem("access_token");
      if (!token) {
         console.error("No access token found");
         return;
      }

      // Send updated data to the backend
      const requestOptions = {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify(formData),
      };

      try {
         const response = await fetch(
            "http://127.0.0.1:8000/auth/user/",
            requestOptions
         );
         if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
         }

         const updatedData = await response.json(); // Get updated data from the backend
         setFormData(updatedData); // Update the formData with the saved data
         console.log("User data successfully updated");
      } catch (error) {
         console.error("Error saving user data:", error);
      }
   };

   const handleInputChange = (e) => {
      if (e.target.name == "phone") {
         const regex = /^\d*$/;
         if (regex.test(e.target.value)) {
            setFormData({
               ...formData,
               [e.target.name]: e.target.value,
            });
         }
      } else {
         setFormData({
            ...formData,
            [e.target.name]: e.target.value,
         });
      }
   };

   return (
      <>
         <Navbar />
         <div className="settings-page-container">
            {/* User Info Section */}
            <div className="user-info-container">
               <div className="user-initials">
                  {formData.first_name[0]}
                  {formData.last_name[0]}
               </div>
               <div className="user-details">
                  <h2>
                     {formData.first_name} {formData.last_name}
                  </h2>
               </div>
            </div>

            {/* Account Settings Section */}
            <div className="dropdown-container">
               <h2
                  className="dropdown-header"
                  onClick={() =>
                     setAccountSettingsVisible(!isAccountSettingsVisible)
                  }
               >
                  Account Settings
                  <span
                     className={`dropdown-arrow ${
                        isAccountSettingsVisible ? "open" : ""
                     }`}
                  >
                     &#9660;
                  </span>
               </h2>
               {isAccountSettingsVisible && (
                  <div className="settings-container">
                     <form className="settings-form">
                        {[
                           "first_name",
                           "last_name",
                           "phone",
                           "email",
                           "password",
                        ].map((field) => (
                           <div key={field} className="settings-form-group">
                              <label htmlFor={field} className="settings-label">
                                 {field
                                    .split("_")
                                    .map(
                                       (f) =>
                                          f.charAt(0).toUpperCase() + f.slice(1)
                                    )
                                    .join(" ")}
                              </label>
                              <input
                                 type={
                                    field === "password" ? "password" : "text"
                                 } // Password input type for the password field
                                 name={field}
                                 className="settings-input"
                                 value={formData[field]}
                                 onChange={handleInputChange}
                                 readOnly={!editableFields[field]}
                              />
                              {editableFields[field] ? (
                                 <button
                                    className="edit-save-btn"
                                    type="button"
                                    onClick={() => handleSaveClick(field)}
                                 >
                                    Save
                                 </button>
                              ) : (
                                 <button
                                    className="edit-save-btn"
                                    type="button"
                                    onClick={() => handleEditClick(field)}
                                 >
                                    Edit
                                 </button>
                              )}
                           </div>
                        ))}
                        <p
                           style={{
                              color: "red",
                              display: error == "" ? "none" : "block",
                           }}
                        >
                           {error}
                        </p>
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
                  <span
                     className={`dropdown-arrow ${
                        isStatementsVisible ? "open" : ""
                     }`}
                  >
                     &#9660;
                  </span>
               </h2>
               {isStatementsVisible && (
                  <div className="data-container">
                     <div className="data-option">
                        <label className="data-label">Statements</label>
                        <button
                           className="download-btn"
                           onClick={() =>
                              (window.location.href = "/userstatement")
                           }
                        >
                           View More
                        </button>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </>
   );
};

export default Settings;
