import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    console.log("Register component rendered");

    const [value, setValue] = useState({
        Name: '',
        Email: '',
        Password: '',
        role: 'User'
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChanges = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Basic validation
        if (!value.Name || !value.Email || !value.Password) {
            setError("All fields are required.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('http://localhost:3000/auth/register', value);
            if (response.status === 201) {
                navigate('/login');
            }
            console.log(response);
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Something went wrong. Try again.");
           
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4">
            <div className="w-full max-w-sm">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-[1.01] duration-300 border border-pink-100 bg-gradient-to-r from-fuchsia-200 to-fuchsia-200">
                    <div className="p-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">Create Account</h2>
                            <p className="text-gray-600 text-sm">Join our fashion community</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-500 p-2 rounded-lg text-xs text-center mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label htmlFor="name" className="text-xs font-medium text-gray-700">
                                    Username
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Enter your username" 
                                    className="w-full px-3 py-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-200 outline-none bg-white/50 text-sm"
                                    name="Name" 
                                    value={value.Name} 
                                    onChange={handleChanges} 
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="email" className="text-xs font-medium text-gray-700">
                                    Email Address
                                </label>
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    className="w-full px-3 py-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-200 outline-none bg-white/50 text-sm"
                                    name="Email" 
                                    value={value.Email} 
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
                                    name="Password" 
                                    value={value.Password} 
                                    onChange={handleChanges} 
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="role" className="text-xs font-medium text-gray-700">
                                    Register As
                                </label>
                                <select 
                                    name="role" 
                                    className="w-full px-3 py-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-200 outline-none bg-white/50 text-sm"
                                    value={value.role} 
                                    onChange={handleChanges}
                                >
                                    <option value="User">User</option>
                                    <option value="Owner">Owner</option>
                                </select>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white py-2 rounded-lg font-medium hover:from-pink-500 hover:to-rose-500 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 transition duration-200 transform hover:scale-[1.02] text-sm ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                            </button>
                        </form>

                        <div className="mt-4 text-center">
                            <p className="text-gray-600 text-sm">
                                Already have an account?{" "}
                                <Link 
                                    to="/login" 
                                    className="text-pink-500 hover:text-pink-600 font-medium transition duration-200"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
