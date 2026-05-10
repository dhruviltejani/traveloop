import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const res = await API.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login Successful!");

      navigate("/dashboard");

    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">

      <form
        onSubmit={handleLogin}
        className="bg-white/10 p-10 rounded-3xl w-[400px]"
      >

        <h1 className="text-4xl text-white mb-6 font-bold">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-4 mb-4 rounded-xl bg-white/10 text-white"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-4 mb-4 rounded-xl bg-white/10 text-white"
        />

        <button className="w-full bg-cyan-500 p-4 rounded-xl text-white">
          Login
        </button>

        <p className="text-gray-300 mt-5">
          Don’t have an account?

          <Link to="/signup" className="text-cyan-400 ml-2">
            Signup
          </Link>
        </p>

      </form>
    </div>
  );
}

export default Login;