import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    userName: "",
    userEmail: "",
    userPass: "",
    confirmPass: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.userPass !== formData.confirmPass) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Use your Railway URL here
      const response = await fetch("https://cinetrack-production.up.railway.app/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          userName: formData.userName,
          userEmail: formData.userEmail,
          userPass: formData.userPass,
        }),
      });

      if (response.ok) {
        alert("Registration Successful!");
        navigate("/login");
      } else {
        const data = await response.json();
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Failed to connect to server. Check CORS/Network.");
      console.error("Fetch error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D11] flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-md bg-[#111318] p-8 rounded-2xl shadow-xl border border-gray-800">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-[#00FFD1]">🎬 CineTrack</h1>
          <p className="text-gray-400 mt-2">Create your account</p>
        </div>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full bg-[#1A1D24] border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-[#00FFD1]"
            required
          />
          <input
            type="text"
            name="userName"
            placeholder="Username"
            value={formData.userName}
            onChange={handleChange}
            className="w-full bg-[#1A1D24] border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-[#00FFD1]"
            required
          />
          <input
            type="email"
            name="userEmail"
            placeholder="Email Address"
            value={formData.userEmail}
            onChange={handleChange}
            className="w-full bg-[#1A1D24] border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-[#00FFD1]"
            required
          />
          <input
            type="password"
            name="userPass"
            placeholder="Password"
            value={formData.userPass}
            onChange={handleChange}
            className="w-full bg-[#1A1D24] border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-[#00FFD1]"
            required
          />
          <input
            type="password"
            name="confirmPass"
            placeholder="Confirm Password"
            value={formData.confirmPass}
            onChange={handleChange}
            className="w-full bg-[#1A1D24] border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-[#00FFD1]"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#00FFD1] text-black font-bold py-3 rounded-lg hover:bg-[#00e6bc] transition-all"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="text-[#00FFD1] cursor-pointer hover:underline">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;