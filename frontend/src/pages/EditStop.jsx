import Layout from "../components/Layout";
import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { motion } from "framer-motion";

import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSave,
  FaArrowLeft,
} from "react-icons/fa";




import API from "../services/api";

function EditStop() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [city, setCity] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {

    const fetchStopDetails = async () => {

      try {

        setLoading(true);

        const response = await API.get(`/stops/${id}`);

        const stop = response.data;

        setCity(stop.city || "");

        setStartDate(stop.start_date || "");

        setEndDate(stop.end_date || "");

      } catch (err) {

        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load stop details."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchStopDetails();

  }, [id]);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSubmitting(true);

    setError("");

    try {

      const response = await API.put(`/stops/${id}`, {
        city,
        start_date: startDate,
        end_date: endDate,
      });

      const tripId = response.data.trip_id;

      navigate(tripId ? `/trip/${tripId}` : -1);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update stop. Please try again."
      );

    } finally {

      setSubmitting(false);

    }
  };

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl">

        Loading stop details...

      </div>
    );
  }

  return (

    <Layout>

        <div className="flex items-center justify-center p-6 md:p-10">

          <motion.form
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl"
          >

            <div className="mb-8 text-center">

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Edit Stop
              </h1>

              <p className="text-gray-400 text-lg">
                Update the stop details for your itinerary.
              </p>

            </div>

            {error && (
              <div className="mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-red-100">
                {error}
              </div>
            )}

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
                className="w-full bg-slate-900/70 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-400"
              />

            </div>

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
                className="w-full bg-slate-900/70 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-400"
              />

            </div>

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
                className="w-full bg-slate-900/70 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-pink-400"
              />

            </div>

            <div className="flex flex-col gap-4">

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full flex items-center justify-center gap-3 border border-white/10 text-white py-4 rounded-2xl font-semibold hover:bg-white/5 transition"
              >

                <FaArrowLeft />
                Back

              </button>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white py-4 rounded-2xl text-lg font-bold transition"
              >

                <FaSave />

                {submitting ? "Updating Stop..." : "Save Changes"}

              </button>

            </div>

          </motion.form>

        </div>

      </Layout>
  );
}

export default EditStop;
