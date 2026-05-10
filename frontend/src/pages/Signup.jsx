import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";

function Signup() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {

      await API.post("/auth/register", formData);

      alert("Signup Successful!");

      navigate("/");

    } catch (error) {
      alert("Signup Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">

      <form
        onSubmit={handleSignup}
        className="bg-white/10 p-10 rounded-3xl w-[400px]"
      >

        <h1 className="text-4xl text-white mb-6 font-bold">
          Signup
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-4 mb-4 rounded-xl bg-white/10 text-white"
        />

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
          Signup
        </button>

        <p className="text-gray-300 mt-5">
          Already have an account?

          <Link to="/" className="text-cyan-400 ml-2">
            Login
          </Link>
        </p>

      </form>
    </div>
  );
}

export default Signup;