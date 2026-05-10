import Layout from "../components/Layout";
import { useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { motion } from "framer-motion";

import {
  FaClock,
  FaWallet,
  FaPlus,
  FaTasks,
} from "react-icons/fa";




import API from "../services/api";

function AddActivity() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [title, setTitle] = useState("");

  const [time, setTime] = useState("");

  const [cost, setCost] = useState("");

  const [loading, setLoading] = useState(false);

  // ADD ACTIVITY
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await API.post("/activities", {
        stop_id: id,
        title,
        time,
        cost,
      });

      navigate(-1);

    } catch (error) {

      console.log(error);

      alert("Failed to add activity");

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
            className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl"
          >

            {/* HEADER */}
            <div className="text-center mb-10">

              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mb-5 shadow-lg">

                <FaTasks className="text-white text-3xl" />

              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">

                Add Activity 🚀

              </h1>

              <p className="text-gray-400 text-lg">

                Add exciting activities to your travel stop

              </p>

            </div>

            {/* ACTIVITY TITLE */}
            <div className="mb-6">

              <label className="text-white text-lg mb-3 flex items-center gap-3">

                <FaTasks className="text-cyan-400" />

                Activity Title

              </label>

              <input
                type="text"
                placeholder="e.g. Beach Visit"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-slate-900/70 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-500 outline-none focus:border-cyan-400 transition"
              />

            </div>

            {/* TIME */}
            <div className="mb-6">

              <label className="text-white text-lg mb-3 flex items-center gap-3">

                <FaClock className="text-pink-400" />

                Activity Time

              </label>

              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full bg-slate-900/70 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-pink-400 transition"
              />

            </div>

            {/* COST */}
            <div className="mb-8">

              <label className="text-white text-lg mb-3 flex items-center gap-3">

                <FaWallet className="text-green-400" />

                Estimated Cost

              </label>

              <input
                type="number"
                placeholder="Enter amount"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                required
                className="w-full bg-slate-900/70 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-500 outline-none focus:border-green-400 transition"
              />

            </div>
            <button
  onClick={() => deleteActivity(activity.id)}
  className="mt-5 bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-xl font-semibold transition"
>

  Delete Activity

</button>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white py-4 rounded-2xl text-lg font-bold transition shadow-lg"
            >

              <FaPlus />

              {
                loading
                  ? "Adding Activity..."
                  : "Add Activity"
              }

            </button>

          </motion.form>

        </div>

      </Layout>
  );
}

export default AddActivity;