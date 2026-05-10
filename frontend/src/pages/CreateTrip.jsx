import Layout from "../components/Layout";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

import {
  FaPlaneDeparture,
  FaCalendarAlt,
  FaWallet,
  FaFileAlt,
} from "react-icons/fa";




function CreateTrip() {

  const navigate = useNavigate();

  const [tripData, setTripData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    budget: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setTripData({
      ...tripData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !tripData.title ||
      !tripData.description ||
      !tripData.start_date ||
      !tripData.end_date ||
      !tripData.budget
    ) {
      alert("Please fill all fields");
      return;
    }

    try {

      setLoading(true);

      await API.post(
        "/trips",
        tripData
      );

      alert("Trip Created Successfully ✈️");

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      alert("Failed to create trip");

    } finally {

      setLoading(false);
    }
  };

  return (
    <Layout>

        <div className="p-6 md:p-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >

            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Create New Trip ✈️
            </h1>

            <p className="text-gray-400 mt-3 text-lg">
              Plan your next unforgettable journey
            </p>

          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 max-w-5xl mx-auto shadow-2xl"
          >

            {/* Trip Name */}
            <div className="mb-6">

              <label className="text-white text-lg mb-3 flex items-center gap-2">

                <FaPlaneDeparture className="text-cyan-400" />

                Trip Name

              </label>

              <input
                type="text"
                name="title"
                placeholder="e.g. Goa Adventure"
                value={tripData.title}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-slate-900/70 border border-white/10 text-white outline-none focus:border-cyan-400 transition"
              />

            </div>

            {/* Description */}
            <div className="mb-6">

              <label className="text-white text-lg mb-3 flex items-center gap-2">

                <FaFileAlt className="text-pink-400" />

                Description

              </label>

              <textarea
                rows="5"
                name="description"
                placeholder="Describe your trip..."
                value={tripData.description}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-slate-900/70 border border-white/10 text-white outline-none focus:border-pink-400 transition resize-none"
              ></textarea>

            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

              {/* Start Date */}
              <div>

                <label className="text-white text-lg mb-3 flex items-center gap-2">

                  <FaCalendarAlt className="text-green-400" />

                  Start Date

                </label>

                <input
                  type="date"
                  name="start_date"
                  value={tripData.start_date}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl bg-slate-900/70 border border-white/10 text-white outline-none focus:border-green-400 transition"
                />

              </div>

              {/* End Date */}
              <div>

                <label className="text-white text-lg mb-3 flex items-center gap-2">

                  <FaCalendarAlt className="text-yellow-400" />

                  End Date

                </label>

                <input
                  type="date"
                  name="end_date"
                  value={tripData.end_date}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl bg-slate-900/70 border border-white/10 text-white outline-none focus:border-yellow-400 transition"
                />

              </div>

            </div>

            {/* Budget */}
            <div className="mb-8">

              <label className="text-white text-lg mb-3 flex items-center gap-2">

                <FaWallet className="text-cyan-400" />

                Estimated Budget

              </label>

              <input
                type="number"
                name="budget"
                placeholder="e.g. 25000"
                value={tripData.budget}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-slate-900/70 border border-white/10 text-white outline-none focus:border-cyan-400 transition"
              />

            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-4">

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white py-4 rounded-2xl font-bold text-lg transition duration-300 hover:scale-[1.02]"
              >

                {
                  loading
                    ? "Creating Trip..."
                    : "Save Trip"
                }

              </button>

              {/* Cancel */}
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-bold text-lg transition"
              >
                Cancel
              </button>

            </div>

          </motion.form>

        </div>

      </Layout>
  );
}

export default CreateTrip;