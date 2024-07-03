import React from 'react'
import { useNavigate } from "react-router-dom";


const UserPanel = () => {
  const navigate = useNavigate();

    const handleLogout = () => {
        // Clear the logged-in status from localStorage
        localStorage.removeItem("token");
        // Redirect to the login page
        navigate("/login");
      };
  return (
    <div>
      Welcome to the user Panel
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default UserPanel
