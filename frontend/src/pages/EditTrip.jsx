import Layout from "../components/Layout";
import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { motion } from "framer-motion";

import {
  FaPlaneDeparture,
  FaCalendarAlt,
  FaWallet,
  FaSave,
} from "react-icons/fa";




import API from "../services/api";

function EditTrip() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [title, setTitle] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [budget, setBudget] = useState("");

  const [loading, setLoading] = useState(false);

  // FETCH TRIP
  useEffect(() => {

    const fetchTrip = async () => {

      try {

        const res = await API.get("/trips");

        const trip = res.data.find(
          (item) => item.id === Number(id)
        );

        if (trip) {

          setTitle(trip.title);

          setStartDate(trip.start_date);

          setEndDate(trip.end_date);

          setBudget(trip.budget);
        }

      } catch (error) {

        console.log(error);
      }
    };

    fetchTrip();

  }, [id]);

  // UPDATE TRIP
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await API.put(`/trips/${id}`, {
        title,
        start_date: startDate,
        end_date: endDate,
        budget,
      });

      navigate(`/trip/${id}`);

    } catch (error) {

      console.log(error);

      alert("Failed to update trip");

    } finally {

      setLoading(false);
    }
  };

  return (

    <Layout>

        <div className="flex items-center justify-center p-6 md:p-10">

          <motion.form
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-10"
          >

            {/* TITLE */}
            <div className="mb-10 text-center">

              <h1 className="text-4xl font-bold text-white mb-3">

                Edit Trip ✈️

              </h1>

              <p className="text-gray-400 text-lg">

                Update your trip details

              </p>

            </div>

            {/* TRIP TITLE */}
            <div className="mb-6">

              <label className="text-white text-lg mb-3 flex items-center gap-3">

                <FaPlaneDeparture className="text-cyan-400" />

                Trip Title

              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-slate-900/70 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-400"
              />

            </div>

            {/* START DATE */}
            <div className="mb-6">

              <label className="text-white text-lg mb-3 flex items-center gap-3">

                <FaCalendarAlt className="text-pink-400" />

                Start Date

              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full bg-slate-900/70 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-pink-400"
              />

            </div>

            {/* END DATE */}
            <div className="mb-6">

              <label className="text-white text-lg mb-3 flex items-center gap-3">

                <FaCalendarAlt className="text-cyan-400" />

                End Date

              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full bg-slate-900/70 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-400"
              />

            </div>

            {/* BUDGET */}
            <div className="mb-8">

              <label className="text-white text-lg mb-3 flex items-center gap-3">

                <FaWallet className="text-green-400" />

                Budget

              </label>

              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
                className="w-full bg-slate-900/70 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-green-400"
              />

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white py-4 rounded-2xl text-lg font-bold transition"
            >

              <FaSave />

              {
                loading
                  ? "Updating..."
                  : "Update Trip"
              }

            </button>

          </motion.form>

        </div>

      </Layout>
  );
}

export default EditTrip;