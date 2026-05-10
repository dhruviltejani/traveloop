import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import {
  FaSearch,
  FaTrash,
  FaCalendarAlt,
  FaWallet,
  FaMapMarkerAlt,
  FaEye,
} from "react-icons/fa";




import API from "../services/api";

function MyTrips() {

  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  // FETCH TRIPS
  const fetchTrips = async () => {

    try {

      const res = await API.get("/trips");

      setTrips(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  // DELETE TRIP
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this trip?"
    );

    if (!confirmDelete) return;

    try {

      await API.delete(`/trips/${id}`);

      setTrips(
        trips.filter((trip) => trip.id !== id)
      );

      alert("Trip deleted successfully");

    } catch (error) {

      console.log(error);

      alert("Failed to delete trip");
    }
  };

  // PROTECT PAGE
  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    fetchTrips();

  }, []);

  // FILTER TRIPS
  const filteredTrips = trips.filter((trip) =>
    trip.title.toLowerCase().includes(
      search.toLowerCase()
    )
  );

  return (
    <Layout>

        <div className="p-6 md:p-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-10"
          >

            <div>

              <h1 className="text-4xl md:text-5xl font-bold text-white">
                My Trips ✈️
              </h1>

              <p className="text-gray-400 mt-3 text-lg">
                Manage and explore your adventures
              </p>

            </div>

            {/* Create Button */}
            <button
              onClick={() => navigate("/create-trip")}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-7 py-4 rounded-2xl font-bold transition duration-300 hover:scale-[1.02]"
            >
              + Create Trip
            </button>

          </motion.div>

          {/* Search Bar */}
          <div className="relative mb-10">

            <FaSearch className="absolute left-5 top-5 text-gray-400" />

            <input
              type="text"
              placeholder="Search your trips..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-lg border border-white/10 text-white rounded-2xl py-4 pl-14 pr-5 outline-none focus:border-cyan-400 transition"
            />

          </div>

          {/* Loading */}
          {
            loading ? (

              <div className="text-center text-white text-2xl mt-20">
                Loading trips...
              </div>

            ) : filteredTrips.length === 0 ? (

              /* Empty State */
              <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">

                <h2 className="text-3xl font-bold text-white mb-4">
                  No Trips Found
                </h2>

                <p className="text-gray-400 mb-8">
                  Start planning your next adventure ✈️
                </p>

                <button
                  onClick={() => navigate("/create-trip")}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-4 rounded-2xl font-bold transition"
                >
                  Create Your First Trip
                </button>

              </div>

            ) : (

              /* Trips Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                {
                  filteredTrips.map((trip) => (

                    <motion.div
                      key={trip.id}
                      whileHover={{ scale: 1.03 }}
                      className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                    >

                      {/* Image */}
                      <div className="relative h-56 overflow-hidden">

                        <img
                          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                          alt="trip"
                          className="w-full h-full object-cover hover:scale-110 transition duration-500"
                        />

                        <div className="absolute top-4 right-4 bg-cyan-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                          Active
                        </div>

                      </div>

                      {/* Content */}
                      <div className="p-6">

                        <h2 className="text-2xl font-bold text-white mb-5">
                          {trip.title}
                        </h2>

                        {/* Dates */}
                        <div className="flex items-center gap-3 text-gray-300 mb-3">

                          <FaCalendarAlt className="text-cyan-400" />

                          <span>
                            {trip.start_date} - {trip.end_date}
                          </span>

                        </div>

                        {/* Budget */}
                        <div className="flex items-center gap-3 text-gray-300 mb-3">

                          <FaWallet className="text-green-400" />

                          <span>
                            ₹{trip.budget}
                          </span>

                        </div>

                        {/* Type */}
                        <div className="flex items-center gap-3 text-gray-300 mb-6">

                          <FaMapMarkerAlt className="text-pink-400" />

                          <span>
                            Multi-City Adventure
                          </span>

                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">

                          {/* View */}
                          <button
                            onClick={() => navigate(`/trip/${trip.id}`)}
                            className="flex-1 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white py-3 rounded-2xl font-semibold transition"
                          >
                            <FaEye />
                            View
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(trip.id)}
                            className="bg-red-500 hover:bg-red-400 text-white px-5 rounded-2xl transition"
                          >
                            <FaTrash />
                          </button>

                        </div>

                      </div>

                    </motion.div>

                  ))
                }

              </div>

            )
          }

        </div>

      </Layout>
  );
}

export default MyTrips;