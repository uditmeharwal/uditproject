import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear validation error when user starts typing
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

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
          email: formData.email,
          password: formData.password,
        };

        const response = await axios.post(
          "http://localhost:5000/api/user/login",
          payload
        );

        if (response.status === 200) {
          localStorage.setItem("token", JSON.stringify({ 
            token: response?.data?.token, 
            email: response?.data?.user?.email 
          }));
          if (response?.data?.user?.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/user");
          }
        } else {
          // Handle non-successful status codes
          console.error("Login failed:", response.data);
        }
      } catch (error) {
        setApiError(error?.response?.data?.message);
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
                  <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                  <p className="text-white-50 mb-5">
                    Please enter your login and password!
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div
                      className={`form-outline form-white mb-4 ${
                        errors.email ? "is-invalid" : ""
                      }`}
                    >
                      <input
                        type="email"
                        id="typeEmailX"
                        placeholder="Enter your email"
                        className="form-control form-control-lg"
                        name="email"
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
                        placeholder="Enter your password"
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
                      Login
                    </button>
                    {apiError && <div className="text-danger">{apiError}</div>}
                  </form>

                  <div className="d-flex justify-content-center text-center mt-4 pt-1">
                    <a href="#!" className="text-white">
                      <i className="fab fa-facebook-f fa-lg"></i>
                    </a>
                    <a href="#!" className="text-white">
                      <i className="fab fa-twitter fa-lg mx-4 px-2"></i>
                    </a>
                    <a href="#!" className="text-white">
                      <i className="fab fa-google fa-lg"></i>
                    </a>
                  </div>
                </div>

                <div>
                  <p className="mb-0">
                    Don't have an account?{" "}
                    <a href="/register" className="text-white-50 fw-bold">
                      Register
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

export default LoginForm;
