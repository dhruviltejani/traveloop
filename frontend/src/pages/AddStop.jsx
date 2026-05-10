import Layout from "../components/Layout";
import { useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { motion } from "framer-motion";

import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaPlus,
  FaArrowLeft,
} from "react-icons/fa";




import API from "../services/api";

function AddStop() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [city, setCity] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);

  // ADD STOP
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await API.post("/stops", {
        trip_id: Number(id),
        city,
        start_date: startDate,
        end_date: endDate,
      });

      // REDIRECT TO VIEW TRIP
      navigate(`/trip/${id}`);

    } catch (error) {

      console.log(error);

      alert("Failed to add stop");

    } finally {

      setLoading(false);
    }
  };

  return (

    <Layout>

        <div className="p-6 md:p-10">

          {/* BACK BUTTON */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white mb-8 hover:text-cyan-400 transition"
          >

            <FaArrowLeft />

            Back

          </button>

          {/* FORM CONTAINER */}
          <div className="flex items-center justify-center">

            <motion.form
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleSubmit}
              className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl"
            >

              {/* HEADER */}
              <div className="mb-10 text-center">

                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mb-5 shadow-lg">

                  <FaMapMarkerAlt className="text-white text-4xl" />

                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">

                  Add New Stop ✈️

                </h1>

                <p className="text-gray-400 text-lg">

                  Add a destination stop to your journey

                </p>

              </div>

              {/* CITY */}
              <div className="mb-6">

                <label className="text-white text-lg mb-3 flex items-center gap-3">

                  <FaMapMarkerAlt className="text-pink-400" />

                  City

                </label>

                <input
                  type="text"
                  placeholder="Enter city name"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full bg-slate-900/70 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-500 outline-none focus:border-cyan-400 transition"
                />

              </div>

              {/* START DATE */}
              <div className="mb-6">

                <label className="text-white text-lg mb-3 flex items-center gap-3">

                  <FaCalendarAlt className="text-cyan-400" />

                  Start Date

                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full bg-slate-900/70 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-400 transition"
                />

              </div>

              {/* END DATE */}
              <div className="mb-8">

                <label className="text-white text-lg mb-3 flex items-center gap-3">

                  <FaCalendarAlt className="text-pink-400" />

                  End Date

                </label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full bg-slate-900/70 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-pink-400 transition"
                />

              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-70 text-white py-4 rounded-2xl text-lg font-bold transition shadow-lg"
              >

                <FaPlus />

                {
                  loading
                    ? "Adding Stop..."
                    : "Add Stop"
                }

              </button>

            </motion.form>

          </div>

        </div>

      </Layout>
  );
}

export default AddStop;