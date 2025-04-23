import React, {  useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import "./Login.css";
import { api } from "../../utils/url.js";
import Loader from "../../components/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess } from "../../redux/slices/userSlice.jsx";
import { toast, Toaster } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: "",
    teacherId: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const roleOptions = [
    { value: "superAdmin", label: "Super Admin" },
    { value: "admin", label: "Admin" },
    { value: "teacher", label: "Teacher" },
  ];

  useEffect(() => {
    if (user !== null) {
      navigate("/");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleRoleChange = (value) => {
    setFormData({
      ...formData,
      role: value,
    });
    // Clear error when user selects a role
    if (errors.role) {
      setErrors({
        ...errors,
        role: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    if (!formData.teacherId) {
      newErrors.teacherId = "Teacher ID is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (validateForm()) {
        setIsLoading(true);
        console.log(formData);
        dispatch(loginStart());

        const response = await api.post("auth/login", formData);
        console.log(response);
        dispatch(loginSuccess(response?.data?.data));
        toast.success(response?.data?.message);
        localStorage.setItem(
          "token",
          JSON.stringify(response?.data?.token)
        );
        setIsLoading(false);
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
    <Toaster position="top-right" />
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="40" height="40" rx="8" fill="#3A86FF" />
                <path
                  d="M20 10C14.4772 10 10 14.4772 10 20C10 25.5228 14.4772 30 20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10ZM20 28C15.5817 28 12 24.4183 12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28Z"
                  fill="white"
                />
                <path
                  d="M20 14C16.6863 14 14 16.6863 14 20C14 23.3137 16.6863 26 20 26C23.3137 26 26 23.3137 26 20C26 16.6863 23.3137 14 20 14ZM20 24C17.7909 24 16 22.2091 16 20C16 17.7909 17.7909 16 20 16C22.2091 16 24 17.7909 24 20C24 22.2091 22.2091 24 20 24Z"
                  fill="white"
                />
                <circle cx="20" cy="20" r="4" fill="white" />
              </svg>
            </div>
            <h1 className="login-title">Attendance Management System</h1>
            <p className="login-subtitle">Sign in to your account</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <CustomDropdown
              options={roleOptions}
              value={formData.role}
              onChange={handleRoleChange}
              placeholder="Select your role"
              label="Role"
              error={errors.role}
              required
            />
            <br />

            <Input
              type="text"
              name="teacherId"
              id="teacherId"
              label="Teacher ID"
              placeholder="Enter your teacher ID"
              value={formData.teacherId}
              onChange={handleChange}
              error={errors.teacherId}
              required
              icon={
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                    fill="currentColor"
                  />
                </svg>
              }
            />

            <Input
              type="password"
              name="password"
              id="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              icon={
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z"
                    fill="currentColor"
                  />
                </svg>
              }
            />

            <div className="form-footer">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              disabled={isLoading}
              icon={
                isLoading ? (
                  <svg
                    className="spinner"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4.75V6.25C12 6.80228 12.4477 7.25 13 7.25C13.5523 7.25 14 6.80228 14 6.25V4.75C14 4.19772 13.5523 3.75 13 3.75C12.4477 3.75 12 4.19772 12 4.75Z"
                      fill="currentColor"
                    />
                    <path
                      d="M17.75 12C17.75 12.5523 18.1977 13 18.75 13H20.25C20.8023 13 21.25 12.5523 21.25 12C21.25 11.4477 20.8023 11 20.25 11H18.75C18.1977 11 17.75 11.4477 17.75 12Z"
                      fill="currentColor"
                    />
                    <path
                      d="M13 17.75C13 18.3023 12.5523 18.75 12 18.75C11.4477 18.75 11 18.3023 11 17.75V16.25C11 15.6977 11.4477 15.25 12 15.25C12.5523 15.25 13 15.6977 13 16.25V17.75Z"
                      fill="currentColor"
                    />
                    <path
                      d="M3.75 12C3.75 12.5523 4.19772 13 4.75 13H6.25C6.80228 13 7.25 12.5523 7.25 12C7.25 11.4477 6.80228 11 6.25 11H4.75C4.19772 11 3.75 11.4477 3.75 12Z"
                      fill="currentColor"
                    />
                    <path
                      d="M18.364 5.63604C18.7585 5.24152 19.3917 5.24152 19.7862 5.63604C20.1807 6.03057 20.1807 6.66373 19.7862 7.05826L18.6728 8.17157C18.2783 8.5661 17.6451 8.5661 17.2506 8.17157C16.8561 7.77705 16.8561 7.14389 17.2506 6.74936L18.364 5.63604Z"
                      fill="currentColor"
                    />
                    <path
                      d="M5.63604 18.364C5.24152 18.7585 5.24152 19.3917 5.63604 19.7862C6.03057 20.1807 6.66373 20.1807 7.05826 19.7862L8.17157 18.6728C8.5661 18.2783 8.5661 17.6451 8.17157 17.2506C7.77705 16.8561 7.14389 16.8561 6.74936 17.2506L5.63604 18.364Z"
                      fill="currentColor"
                    />
                    <path
                      d="M18.364 18.364C17.9695 18.7585 17.9695 19.3917 18.364 19.7862C18.7585 20.1807 19.3917 20.1807 19.7862 19.7862C20.1807 19.3917 20.1807 18.7585 19.7862 18.364L18.6728 17.2506C18.2783 16.8561 17.6451 16.8561 17.2506 17.2506C16.8561 17.6451 16.8561 18.2783 17.2506 18.6728L18.364 18.364Z"
                      fill="currentColor"
                    />
                    <path
                      d="M5.63604 5.63604C6.03057 5.24152 6.66373 5.24152 7.05826 5.63604C7.45279 6.03057 7.45279 6.66373 7.05826 7.05826L6.74936 7.36716C6.35484 7.76168 5.72168 7.76168 5.32716 7.36716C4.93263 6.97263 4.93263 6.33947 5.32716 5.94495L5.63604 5.63604Z"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 16L17 12L11 8V11H2V13H11V16Z"
                      fill="currentColor"
                    />
                    <path
                      d="M20 19H12V21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3H12V5H20V19Z"
                      fill="currentColor"
                    />
                  </svg>
                )
              }
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account? <a href="#">Contact administrator</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
