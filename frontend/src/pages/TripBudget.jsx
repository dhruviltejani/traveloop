import Layout from "../components/Layout";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  FaArrowLeft,
  FaWallet,
  FaFire,
  FaCalendarAlt,
  FaChartPie,
  FaChartBar,
} from "react-icons/fa";


import API from "../services/api";

const chartColors = ["#06b6d4", "#38bdf8", "#7c3aed", "#f97316", "#14b8a6", "#e11d48"];

function TripBudget() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBudgetData = async () => {
      setLoading(true);
      setError("");

      try {
        const tripRes = await API.get("/trips");
        const selectedTrip = tripRes.data.find((item) => item.id === Number(id));

        if (!selectedTrip) {
          setError("Trip could not be found.");
          return;
        }

        const stopRes = await API.get(`/trips/${id}/stops`);
        const stopsData = Array.isArray(stopRes.data) ? stopRes.data : [];

        const stopsWithActivities = await Promise.all(
          stopsData.map(async (stop) => {
            try {
              const activityRes = await API.get(`/activities/${stop.id}`);
              return {
                ...stop,
                activities: Array.isArray(activityRes.data) ? activityRes.data : [],
              };
            } catch (activityError) {
              console.error("Activity fetch error:", activityError);
              return {
                ...stop,
                activities: [],
              };
            }
          })
        );

        setTrip(selectedTrip);
        setStops(stopsWithActivities);
      } catch (fetchError) {
        console.error("Budget fetch error:", fetchError);
        setError("Unable to load budget data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, [id]);

  const totalBudget = useMemo(() => Number(trip?.budget || 0), [trip]);

  const totalSpent = useMemo(() => {
    return stops.reduce((stopSum, stop) => {
      const stopTotal = (stop.activities || []).reduce(
        (activitySum, activity) => activitySum + Number(activity.cost || 0),
        0
      );
      return stopSum + stopTotal;
    }, 0);
  }, [stops]);

  const remainingBudget = useMemo(() => totalBudget - totalSpent, [totalBudget, totalSpent]);

  const tripDays = useMemo(() => {
    if (!trip?.start_date || !trip?.end_date) return 1;
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const diff = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 1;
  }, [trip]);

  const averageCostPerDay = useMemo(() => {
    return tripDays > 0 ? totalSpent / tripDays : 0;
  }, [totalSpent, tripDays]);

  const citySpendingData = useMemo(() => {
    const totals = stops.reduce((acc, stop) => {
      const stopTotal = (stop.activities || []).reduce(
        (activitySum, activity) => activitySum + Number(activity.cost || 0),
        0
      );
      const cityKey = stop.city || "Unknown";
      acc[cityKey] = (acc[cityKey] || 0) + stopTotal;
      return acc;
    }, {});

    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [stops]);

  const activityChartData = useMemo(() => {
    return stops.flatMap((stop) =>
      (stop.activities || []).map((activity) => ({
        name: activity.title,
        cost: Number(activity.cost || 0),
        city: stop.city,
      }))
    );
  }, [stops]);

  const stopSummary = useMemo(() => {
    return stops.map((stop) => ({
      ...stop,
      total: (stop.activities || []).reduce(
        (activitySum, activity) => activitySum + Number(activity.cost || 0),
        0
      ),
    }));
  }, [stops]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xl">
        Loading budget breakdown...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 text-center text-white">
        <div className="max-w-xl bg-white/5 border border-white/10 rounded-3xl p-10">
          <h2 className="text-3xl font-bold mb-4">Budget Breakdown Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate(`/trip/${id}`)}
            className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-3 rounded-2xl font-semibold transition"
          >
            Return to Trip
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout>

        <div className="p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6 mb-10"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <button
                onClick={() => navigate(`/trip/${id}`)}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-white px-5 py-3 rounded-2xl hover:bg-white/15 transition"
              >
                <FaArrowLeft />
                Back to Trip
              </button>

              <div className="space-y-2 text-right">
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-400 font-semibold">
                  Budget Insights
                </p>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  {trip.title}
                </h1>
                <p className="text-gray-300">
                  {trip.start_date} - {trip.end_date} • {tripDays} days
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6">
                <h2 className="text-sm text-gray-400 uppercase tracking-[0.24em] mb-4">
                  Total Trip Budget
                </h2>
                <div className="flex items-center gap-4">
                  <span className="p-4 bg-cyan-500/10 text-cyan-300 rounded-2xl">
                    <FaWallet />
                  </span>
                  <div>
                    <p className="text-5xl font-bold text-white">₹{totalBudget.toLocaleString()}</p>
                    <p className="text-gray-400 mt-2">Estimated total for the trip</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6">
                <h2 className="text-sm text-gray-400 uppercase tracking-[0.24em] mb-4">
                  Total Spent
                </h2>
                <div className="flex items-center gap-4">
                  <span className="p-4 bg-rose-500/10 text-rose-300 rounded-2xl">
                    <FaFire />
                  </span>
                  <div>
                    <p className="text-5xl font-bold text-white">₹{totalSpent.toLocaleString()}</p>
                    <p className="text-gray-400 mt-2">Across all activities</p>
                  </div>
                </div>
              </div>

              <div className={`bg-slate-900/80 border rounded-3xl p-6 ${remainingBudget < 0 ? "border-rose-500/40" : "border-emerald-500/20"}`}>
                <h2 className="text-sm text-gray-400 uppercase tracking-[0.24em] mb-4">
                  Remaining Budget
                </h2>
                <div className="flex items-center gap-4">
                  <span className={`p-4 rounded-2xl ${remainingBudget < 0 ? "bg-rose-500/10 text-rose-300" : "bg-emerald-500/10 text-emerald-300"}`}>
                    <FaChartBar />
                  </span>
                  <div>
                    <p className={`text-5xl font-bold ${remainingBudget < 0 ? "text-rose-300" : "text-emerald-300"}`}>
                      ₹{remainingBudget.toLocaleString()}
                    </p>
                    <p className="text-gray-400 mt-2">{remainingBudget < 0 ? "Over budget" : "Still available"}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-8 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <p className="text-sm text-cyan-400 uppercase tracking-[0.24em] mb-2">City-wise Spending</p>
                  <h2 className="text-2xl font-bold text-white">Stop Spending Breakdown</h2>
                </div>
                <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl text-sm text-gray-300">
                  <FaChartPie />
                  Smart city allocation
                </span>
              </div>

              <div className="h-80">
                {citySpendingData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={citySpendingData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={4}
                        stroke="transparent"
                      >
                        {citySpendingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`₹${value.toLocaleString()}`, "Spent"]}
                        contentStyle={{ background: "rgba(15, 23, 42, 0.95)", borderRadius: 16, border: "none" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">No spending data available yet.</div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <p className="text-sm text-cyan-400 uppercase tracking-[0.24em] mb-2">Activity Costs</p>
                  <h2 className="text-2xl font-bold text-white">Cost by Activity</h2>
                </div>
                <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl text-sm text-gray-300">
                  <FaChartBar />
                  Sorted by expense
                </span>
              </div>

              <div className="h-80">
                {activityChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityChartData} margin={{ top: 10, right: 10, left: -12, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.18)" />
                      <XAxis dataKey="name" tick={{ fill: "#cbd5e1", fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={70} />
                      <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                      <Tooltip
                        formatter={(value) => [`₹${value.toLocaleString()}`, "Cost"]}
                        contentStyle={{ background: "rgba(15, 23, 42, 0.95)", borderRadius: 16, border: "none" }}
                      />
                      <Legend wrapperStyle={{ color: "#94a3b8" }} />
                      <Bar dataKey="cost" fill="#06b6d4" radius={[12, 12, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">No activity cost data yet.</div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-2xl font-bold text-white">Stop-by-Stop Breakdown</h2>
              <p className="text-sm text-gray-400">Average cost per day: ₹{averageCostPerDay.toFixed(0)}</p>
            </div>

            {stopSummary.length > 0 ? (
              <div className="grid gap-6 lg:grid-cols-2">
                {stopSummary.map((stop) => (
                  <div key={stop.id} className="bg-slate-900/80 border border-white/10 rounded-3xl p-6">
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div>
                        <p className="text-sm text-gray-400 uppercase tracking-[0.2em] mb-2">{stop.city}</p>
                        <h3 className="text-2xl text-white font-bold">₹{stop.total.toLocaleString()}</h3>
                      </div>
                      <div className="text-right text-gray-400">
                        <p>{stop.start_date}</p>
                        <p>{stop.end_date}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {(stop.activities || []).length > 0 ? (
                        stop.activities.map((activity) => (
                          <div key={activity.id} className="rounded-2xl bg-white/5 p-4 border border-white/10">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-white font-semibold">{activity.title}</p>
                                <p className="text-gray-400 text-sm mt-1">{activity.time}</p>
                              </div>
                              <p className="text-emerald-300 font-semibold">₹{Number(activity.cost || 0).toLocaleString()}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400">No activity costs added for this stop yet.</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center text-gray-400">
                No stops have been added to this trip yet.
              </div>
            )}
          </motion.div>
        </div>
      </Layout>
  );
}

export default TripBudget;
