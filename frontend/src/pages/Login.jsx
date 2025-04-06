import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [value, setValue] = useState({
    Email: "",
    Password: "",
    role: "", 
  });
 
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChanges = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!value.Email || !value.Password || !value.role) {
      setError("All fields are required!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/auth/login", value);
      
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", response.data.Email);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("userId", response.data.id);

        if (response.data.role === "User") {
          navigate(`/profile/${localStorage.getItem("userId")}`);
        } else if (response.data.role === "Owner") {
          navigate("/owner");
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-[1.01] duration-300 border border-pink-100 bg-gradient-to-r from-fuchsia-200 to-fuchsia-200">
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back</h2>
              <p className="text-gray-600 text-sm">Please sign in to your account</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-200 outline-none bg-white/50 text-sm"
                  value={value.Email}
                  name="Email"
                  onChange={handleChanges}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="text-xs font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-200 outline-none bg-white/50 text-sm"
                  value={value.Password}
                  name="Password"
                  onChange={handleChanges}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="role" className="text-xs font-medium text-gray-700">
                  Role
                </label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-200 outline-none bg-white/50 text-sm"
                  value={value.role}
                  name="role"
                  onChange={handleChanges}
                >
                  <option value="">Select your role</option>
                  <option value="User">User</option>
                  <option value="Owner">Owner</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 p-2 rounded-lg text-xs text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white py-2 rounded-lg font-medium hover:from-pink-500 hover:to-rose-500 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 transition duration-200 transform hover:scale-[1.02] text-sm"
              >
                Sign In
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <Link 
                  to="/register" 
                  className="text-pink-500 hover:text-pink-600 font-medium transition duration-200"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
