import Layout from "../components/Layout";
import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { motion } from "framer-motion";

import {
  FaCalendarAlt,
  FaWallet,
  FaMapMarkerAlt,
  FaPlus,
  FaClock,
  FaEdit,
  FaTrash,
  FaChartPie,
  FaSearchLocation,
  FaClipboardList,
  FaShareAlt,
  FaBookOpen,
} from "react-icons/fa";




import API from "../services/api";

function ViewTrip() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [trip, setTrip] = useState(null);

  const [stops, setStops] = useState([]);

  const [loading, setLoading] = useState(true);

  // FETCH TRIP
  const fetchTrip = async () => {

    try {

      // FETCH ALL TRIPS
      const tripRes = await API.get("/trips");

      const selectedTrip = tripRes.data.find(
        (item) => item.id === Number(id)
      );

      setTrip(selectedTrip);

      // FETCH STOPS
      try {

        const stopRes = await API.get(`/trips/${id}/stops`);

        const stopsData = Array.isArray(stopRes.data)
          ? stopRes.data
          : [];

        // FETCH ACTIVITIES
        const stopsWithActivities = await Promise.all(

          stopsData.map(async (stop) => {

            try {

              const activityRes = await API.get(
                `/activities/${stop.id}`
              );

              return {
                ...stop,
                activities: Array.isArray(activityRes.data)
                  ? activityRes.data
                  : [],
              };

            } catch (error) {

              console.log(error);

              return {
                ...stop,
                activities: [],
              };
            }
          })
        );

        setStops(stopsWithActivities);

      } catch (error) {

        console.log(error);

        setStops([]);
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  // DELETE TRIP
  const deleteTrip = async () => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trip?"
    );

    if (!confirmDelete) return;

    try {

      await API.delete(`/trips/${id}`);

      navigate("/my-trips");

    } catch (error) {

      console.log(error);
    }
  };

  // EDIT TRIP
  const editTrip = () => {

    navigate(`/edit-trip/${id}`);
  };

  // ADD STOP
  const addStop = () => {

    navigate(`/add-stop/${id}`);
  };

  // ADD ACTIVITY
  const addActivity = (stopId) => {

    navigate(`/add-activity/${stopId}`);
  };

  // DELETE STOP
  const deleteStop = async (stopId) => {

    const confirmDelete = window.confirm(
      "Delete this stop?"
    );

    if (!confirmDelete) return;

    try {

      await API.delete(`/stops/${stopId}`);

      fetchTrip();

    } catch (error) {

      console.log(error);
    }
  };

  // DELETE ACTIVITY
  const deleteActivity = async (activityId) => {

    const confirmDelete = window.confirm(
      "Delete this activity?"
    );

    if (!confirmDelete) return;

    try {

      await API.delete(`/activities/${activityId}`);

      fetchTrip();

    } catch (error) {

      console.log(error);
    }
  };

  // AUTH CHECK
  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {

      navigate("/");

      return;
    }

    fetchTrip();

  }, [id]);

  // LOADING
  if (loading) {

    return (

      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl">

        Loading Trip...

      </div>
    );
  }

  // TRIP NOT FOUND
  if (!trip) {

    return (

      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl">

        Trip Not Found

      </div>
    );
  }

  return (

    <Layout>

        <div className="p-6 md:p-10">

          {/* HERO */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-8 md:p-10 text-white mb-10 shadow-2xl"
          >

            <h1 className="text-4xl md:text-5xl font-bold mb-4">

              {trip.title} ✈️

            </h1>

            <div className="flex flex-col md:flex-row md:items-center gap-6 text-lg">

              {/* DATES */}
              <div className="flex items-center gap-3">

                <FaCalendarAlt />

                <span>
                  {trip.start_date} - {trip.end_date}
                </span>

              </div>

              {/* BUDGET */}
              <div className="flex items-center gap-3">

                <FaWallet />

                <span>
                  ₹{trip.budget}
                </span>

              </div>

            </div>

          </motion.div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-4 mb-8">

            {/* EDIT */}
            <button
              onClick={editTrip}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-white px-6 py-3 rounded-2xl font-bold transition"
            >

              <FaEdit />

              Edit Trip

            </button>

            {/* BUDGET */}
            <button
              onClick={() => navigate(`/trip-budget/${id}`)}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-3 rounded-2xl font-bold transition"
            >

              <FaChartPie />

              Budget Breakdown

            </button>

            {/* DELETE */}
            <button
              onClick={deleteTrip}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white px-6 py-3 rounded-2xl font-bold transition"
            >

              <FaTrash />

              Delete Trip

            </button>

          </div>

          {/* ADD STOP */}
          <div className="flex flex-wrap justify-end gap-4 mb-8">

            <button
              onClick={() => navigate(`/trip/${id}/notes`)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-2xl font-bold transition"
            >

              <FaBookOpen />

              Trip Notes

            </button>
            <button
              onClick={() => navigate(`/trip/${id}/packing-checklist`)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-2xl font-bold transition"
            >

              <FaClipboardList />

              Packing Checklist

            </button>
            <button
              onClick={() => navigate(`/public-trip/${id}`)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-2xl font-bold transition"
            >

              <FaShareAlt />

              Share Trip

            </button>
            <button
              onClick={() => navigate(`/trip/${id}/city-search`)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-2xl font-bold transition"
            >

              <FaSearchLocation />

              Search Cities

            </button>
            <button
              onClick={addStop}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-4 rounded-2xl font-bold transition"
            >

              <FaPlus />

              Add Stop

            </button>

          </div>

          {/* EMPTY STATE */}
          {
            stops.length === 0 && (

              <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-10 text-center text-gray-300">

                No Stops Added Yet

              </div>
            )
          }

          {/* STOPS */}
          <div className="space-y-10">

            {
              stops.map((stop, index) => (

                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6 md:p-8"
                >

                  {/* HEADER */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

                    <div>

                      <h2 className="text-3xl font-bold text-white flex items-center gap-3">

                        <FaMapMarkerAlt className="text-pink-400" />

                        {stop.city}

                      </h2>

                      <p className="text-gray-400 mt-2">

                        {stop.start_date} - {stop.end_date}

                      </p>

                    </div>

                    {/* BUTTONS */}
                    <div className="flex flex-wrap gap-3">

                      {/* ADD ACTIVITY */}
                      <button
                        onClick={() => addActivity(stop.id)}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-5 py-3 rounded-2xl font-semibold transition"
                      >

                        + Add Activity

                      </button>

                      {/* SEARCH ACTIVITIES */}
                      <button
                        onClick={() => navigate(`/trip/${id}/activity-search/${stop.id}`)}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-2xl font-semibold transition"
                      >

                        <FaSearchLocation />

                        Search Activities

                      </button>

                      {/* EDIT STOP */}
                      <button
                        onClick={() => navigate(`/edit-stop/${stop.id}`)}
                        className="bg-yellow-500 hover:bg-yellow-400 text-white px-5 py-3 rounded-2xl font-semibold transition"
                      >

                        Edit Stop

                      </button>

                      {/* DELETE STOP */}
                      <button
                        onClick={() => deleteStop(stop.id)}
                        className="bg-red-500 hover:bg-red-400 text-white px-5 py-3 rounded-2xl font-semibold transition"
                      >

                        Delete Stop

                      </button>

                    </div>

                  </div>

                  {/* ACTIVITIES */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {
                      stop.activities?.length > 0 ? (

                        stop.activities.map((activity, i) => (

                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            className="bg-slate-900/70 border border-white/10 rounded-2xl p-5"
                          >

                            <h3 className="text-2xl font-bold text-white mb-4">

                              {activity.title}

                            </h3>

                            <div className="flex items-center gap-3 text-gray-300 mb-3">

                              <FaClock className="text-cyan-400" />

                              <span>
                                {activity.time}
                              </span>

                            </div>

                            <div className="flex items-center gap-3 text-gray-300 mb-5">

                              <FaWallet className="text-green-400" />

                              <span>
                                ₹{activity.cost}
                              </span>

                            </div>

                            {/* DELETE ACTIVITY */}
                            <button
                              onClick={() => deleteActivity(activity.id)}
                              className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-xl font-semibold transition"
                            >

                              Delete Activity

                            </button>

                          </motion.div>

                        ))

                      ) : (

                        <div className="text-gray-400">

                          No Activities Added

                        </div>
                      )
                    }

                  </div>

                </motion.div>

              ))
            }

          </div>

        </div>

      </Layout>
  );
}

export default ViewTrip;