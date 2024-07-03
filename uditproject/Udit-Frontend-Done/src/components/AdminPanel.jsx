import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "./Table";
import UserModal from "./UserModal";
import AddUserModal from "./AddUserModal";
import Pagination from "./Pagination"; // Assuming you have a Pagination component

const AdminPanel = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [editUser, setEditUser] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [usersList, setUserList] = useState([]);
  const [editUserData, setEditUserData] = useState({});
  const [showAddUserModal, setShowAddUserModal] = useState(false); // State for showing/hiding add user modal
  const [searchTerm, setSearchTerm] = useState("");
  const [totalUsers, setTotalUsers] = useState()
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Number of items per page

  const getAllUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users", {
        params: { page: currentPage, limit: pageSize },
      });
      if (response.data) {
        setUserList(response.data.users);
        setTotalUsers(response.data.totalUsers)
        setLoader(false); // Set loader to false once users are fetched
      }
    } catch (error) {
      console.log("error", error);
      setLoader(false); // Handle error and set loader to false
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [currentPage, pageSize]); // Fetch users whenever currentPage or pageSize changes

  const verifyToken = async (token) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/user/verify",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Token verification failed");
      }
      if (response.data.role === "user") {
        navigate("/user")
        setLoader(false);
      } else {
        setLoader(false);
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
      setLoader(false);
      navigate("/login");
    }
  };

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("token"));
    if (!storedData?.token) {
      setLoader(false);
      navigate("/login");
    }
    verifyToken(storedData?.token);
  }, []);

  const handleLogout = () => {
    // Clear the logged-in status from localStorage
    localStorage.removeItem("token");
    // Redirect to the login page
    navigate("/login");
  };

  const handleOpenEditModal = (id) => {
    const filteredUser = usersList.find((user) => user._id === id);
    setEditUserData(filteredUser);
    setEditUser(true);
  };

  const handleEditUser = (payload, id) => {
    return axios
      .put(`http://localhost:5000/api/user/${id}`, payload)
      .then((response) => {
        getAllUsers(); // Refresh users list after editing
        return response; // return the updated user data
      })
      .catch((error) => {
        console.log(
          "error",
          error.response ? error.response.data : error.message
        );
        throw error; // rethrow the error to be handled by the caller
      });
  };

  const handleDeleteUser = (id) => {
    return axios
      .delete(`http://localhost:5000/api/user/${id}`)
      .then((response) => {
        getAllUsers(); // Refresh users list after deletion
        return response; // return the updated user data
      })
      .catch((error) => {
        console.log(
          "error",
          error.response ? error.response.data : error.message
        );
        throw error; // rethrow the error to be handled by the caller
      });
  };

  const handleAddUserModal = () => {
    setShowAddUser(true);
  };

  const handleAddUser = async (payload) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user",
        payload
      );

      if (response.status === 200) {
        getAllUsers(); // Refresh users list after adding a new user
      } else {
        console.error("Registration failed:", response.data);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset currentPage when searching
  };

  // Filter users based on search term
  const filteredUsers = usersList.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      {loader ? (
        <div className="spinner-border" role="status">
          <span className="sr-only"></span>
        </div>
      ) : (
        <>
          <h2>Welcome to Admin Panel</h2>
          <input
            className="form-control mr-sm-2 mb-3 w-25"
            onChange={handleSearch}
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <Table
            handleEditModal={handleOpenEditModal}
            usersList={filteredUsers} // Pass filtered users list to Table component
            handleDeleteUser={handleDeleteUser}
          />
          <UserModal
            setEditUser={setEditUser}
            editUser={editUser}
            editUserData={editUserData}
            handleEditUser={handleEditUser}
            showAddUserModal={showAddUserModal}
            setShowAddUserModal={setShowAddUserModal}
          />
          <AddUserModal
            showAddUser={showAddUser}
            setShowAddUser={setShowAddUser}
            handleAddUser={handleAddUser}
          />
        <div className="d-flex justify-content-center">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalUsers / pageSize)}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
          <button onClick={handleAddUserModal}>Add User</button>{" "}
          {/* Add User button */}
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
