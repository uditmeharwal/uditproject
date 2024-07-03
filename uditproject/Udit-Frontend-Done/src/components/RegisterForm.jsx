import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError,setApiError] = useState("")
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear validation error when user starts typing
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters long";
      valid = false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is not valid";
      valid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "admin"
        };

        const response = await axios.post(
          "http://localhost:5000/api/user/register",
          payload
        );

        if (response.status === 200) {
            localStorage.setItem("token", JSON.stringify({ 
                token: response?.data?.token, 
                email: response?.data?.user?.email 
              }));
            if(response?.data?.user?.role === "admin"){
                navigate("/admin");
            } else {
                navigate("/user");
            }
        } else {
          // Handle non-successful status codes
          console.error("Registration failed:", response.data);
        }
      } catch (error) {
        setApiError(error?.response?.data?.message)
      }
    }
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card bg-dark text-white">
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">Register</h2>
                  <p className="text-white-50 mb-5">
                    Please fill out the form to create an account.
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div
                      className={`form-outline form-white mb-4 ${
                        errors.name ? "is-invalid" : ""
                      }`}
                    >
                      <input
                        type="text"
                        id="typeNameX"
                        className="form-control form-control-lg"
                        name="name"
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && (
                        <div className="text-danger">{errors.name}</div>
                      )}
                    </div>

                    <div
                      className={`form-outline form-white mb-4 ${
                        errors.email ? "is-invalid" : ""
                      }`}
                    >
                      <input
                        type="email"
                        id="typeEmailX"
                        className="form-control form-control-lg"
                        name="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && (
                        <div className="text-danger">{errors.email}</div>
                      )}
                    </div>

                    <div
                      className={`form-outline form-white mb-4 ${
                        errors.password ? "is-invalid" : ""
                      }`}
                    >
                      <input
                        type="password"
                        id="typePasswordX"
                        className="form-control form-control-lg"
                        name="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      {errors.password && (
                        <div className="text-danger">{errors.password}</div>
                      )}
                    </div>
                    <button
                      className="btn btn-outline-light btn-lg px-5"
                      type="submit"
                    >
                      Register
                    </button>
                    {apiError && (
                        <div className="text-danger">{apiError}</div>
                      )}
                  </form>
                </div>

                <div>
                  <p className="mb-0">
                    Already have an account?{" "}
                    <a href="/login" className="text-white-50 fw-bold">
                      Login
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;
