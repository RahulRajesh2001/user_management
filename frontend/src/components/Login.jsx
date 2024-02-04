import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginSuccess, adminLoginSuccess } from "../reducers/authSlice";

const baseUrl = import.meta.env.VITE_BASEURL;

function Login() {
  const email = useRef("");
  const password = useRef("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleLogin = (adminLogin) => {
    const loginEndpoint = adminLogin ? `${baseUrl}/admin/login` : `${baseUrl}/user/login`;

    axios
      .post(loginEndpoint, {
        email: email.current.value,
        password: password.current.value,
      })
      .then((response) => {
        const token = response.data.token;
        const userId = response.data.userId;
        if (isAdminLogin) {
          dispatch(adminLoginSuccess(token));
          localStorage.setItem("adminToken", token);
          navigate("/dashboard");
        } else {
          dispatch(loginSuccess(token));
          localStorage.setItem("token", token);
          localStorage.setItem("userId", userId);
          navigate("/");
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  const toggleAdminLogin = () => {
    setIsAdminLogin(!isAdminLogin);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(isAdminLogin);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#1A2238]">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">{isAdminLogin ? "Admin Login" : "LOGIN"}</h2>
        <p className="text-gray-600 text-center mb-6">Enter your email & password to Login</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
              Email Address *
            </label>
            <input ref={email} type="email" name="email" id="email" className="htmlForm-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500" required placeholder="hello@alignui.com" />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
              Password *
            </label>
            <input ref={password} type="password" name="password" id="password" className="htmlForm-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500" required placeholder="••••••••" />
            <p className="text-gray-600 text-xs mt-1">Must contain 1 uppercase letter, 1 number, min. 8 characters.</p>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            {isAdminLogin ? "Admin Login" : "Login"}
          </button>
        </form>
        {!isAdminLogin && (
          <>
            <Link to="/register">
              <button className="w-full mt-4 px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-800 text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                Register
              </button>
            </Link>
          </>
        )}
        <button type="button" className="w-full mt-4 px-4 py-2 rounded-lg hover:underline text-gray-700 hover:bg-gray-200" onClick={toggleAdminLogin}>
          Switch to {isAdminLogin ? "User Login" : "Admin Login"}
        </button>
      </div>
    </div>
  );
}

export default Login;
