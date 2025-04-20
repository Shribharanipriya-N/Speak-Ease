import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoCloseSharp } from "react-icons/io5";

const UserProfile = ({ userId, onClose }) => {
  const token = sessionStorage.getItem("token");
  const [userDetails, setUserDetails] = useState({});
  const [originalUserDetails, setOriginalUserDetails] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUserDetails(response.data);
        setOriginalUserDetails(response.data);
      })
      .catch((error) => console.error("Error fetching user details:", error));
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSave = () => {
    if (!userDetails.name || !userDetails.email) {
      alert("Please fill all the fields.");
      return;
    }
    axios
      .put(`http://localhost:4000/user`, userDetails, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        console.log(result);
        if (result.data.message === "Email already exists") {
          window.alert("Email already exists. Please use another email.");
        } else if (result.data.message === "Username already exists") {
          window.alert("Username already exists. Please use another username.");
        } else {
          setUserDetails(result.data);
          setOriginalUserDetails(result.data);
          setEditMode(false);
        }
      })
      .catch((error) => {
        console.error(error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          window.alert(error.response.data.message);
        } else {
          window.alert("Something went wrong. Please try again later.");
        }
      });
  };

  return (
    <div className="user-profile-popup">
      <IoCloseSharp className="close-icon" onClick={onClose} size={32} />
      <h2>User Details</h2>
      {editMode ? (
        <>
          <div className="field-container">
            <label htmlFor="name">UserName:</label>
            <input
              style={{
                width: "250px",
                height: "30px",
                borderRadius: "10px",
                fontFamily: "Itim",
                fontSize: "17px",
              }}
              type="text"
              id="name"
              name="name"
              value={userDetails.name || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="field-container">
            <label htmlFor="email">Email:</label>
            <input
              style={{
                width: "250px",
                height: "30px",
                borderRadius: "10px",
                fontFamily: "Itim",
                fontSize: "17px",
              }}
              type="email"
              id="email"
              name="email"
              value={userDetails.email || ""}
              onChange={handleInputChange}
            />
          </div>
          <button
            style={{
              width: "60px",
              height: "30px",
              borderRadius: "10px",
              fontFamily: "Itim",
            }}
            onClick={handleSave}
          >
            Save
          </button>
        </>
      ) : (
        <>
          <p>UserName: {userDetails.name}</p>
          <p>Email: {userDetails.email}</p>
          <button
            style={{
              width: "60px",
              height: "30px",
              borderRadius: "10px",
              fontFamily: "Itim",
            }}
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
        </>
      )}
    </div>
  );
};

export default UserProfile;
