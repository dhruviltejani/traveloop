import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaMapMarkedAlt,
  FaCalendarAlt,
  FaChartBar,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";



import API from "../services/api";

const mockAnalytics = {
  totalUsers: 1247,
  totalTrips: 892,
  totalActivities: 3456,
  popularCities: [
    { city: "Bali", trips: 145 },
    { city: "Kyoto", trips: 98 },
    { city: "Barcelona", trips: 87 },
    { city: "Cape Town", trips: 76 },
    { city: "Lisbon", trips: 65 },
  ],
  monthlyTrips: [
    { month: "Jan", trips: 45 },
    { month: "Feb", trips: 52 },
    { month: "Mar", trips: 78 },
    { month: "Apr", trips: 89 },
    { month: "May", trips: 95 },
    { month: "Jun", trips: 102 },
  ],
  activityCategories: [
    { name: "Adventure", value: 35, color: "#06b6d4" },
    { name: "Food", value: 25, color: "#f59e0b" },
    { name: "Nature", value: 20, color: "#10b981" },
    { name: "Relaxation", value: 15, color: "#ec4899" },
    { name: "Nightlife", value: 5, color: "#8b5cf6" },
  ],
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(mockAnalytics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    // In real app, fetch from backend
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xl">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <Layout>
        <div className="p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/80 border border-white/10 rounded-[32px] p-8 shadow-2xl mb-10"
          >
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
              <div>
                <p className="uppercase tracking-[0.3em] text-cyan-400 font-semibold mb-4">
                  Admin Dashboard
                </p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Traveloop Analytics
                </h1>
                <p className="mt-4 max-w-2xl text-slate-300 text-lg leading-relaxed">
                  Monitor platform performance, user engagement, and travel trends with comprehensive analytics.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Key Metrics */}
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/80 border border-white/10 rounded-[28px] p-6 shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-3xl bg-cyan-500/20 p-4">
                  <FaUsers className="text-cyan-300 text-2xl" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Total Users</p>
                  <p className="text-3xl font-bold text-white">{analytics.totalUsers.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/80 border border-white/10 rounded-[28px] p-6 shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-3xl bg-emerald-500/20 p-4">
                  <FaMapMarkedAlt className="text-emerald-300 text-2xl" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Total Trips</p>
                  <p className="text-3xl font-bold text-white">{analytics.totalTrips.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/80 border border-white/10 rounded-[28px] p-6 shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-3xl bg-amber-500/20 p-4">
                  <FaCalendarAlt className="text-amber-300 text-2xl" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Total Activities</p>
                  <p className="text-3xl font-bold text-white">{analytics.totalActivities.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-900/80 border border-white/10 rounded-[28px] p-6 shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-3xl bg-violet-500/20 p-4">
                  <FaChartBar className="text-violet-300 text-2xl" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Avg Activities/Trip</p>
                  <p className="text-3xl font-bold text-white">
                    {(analytics.totalActivities / analytics.totalTrips).toFixed(1)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid gap-8 xl:grid-cols-2 mb-10">
            {/* Monthly Trips Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900/80 border border-white/10 rounded-[28px] p-6 shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-6">Monthly Trip Creation</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.monthlyTrips}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #374151",
                      borderRadius: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="trips"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    dot={{ fill: "#06b6d4", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Activity Categories Pie Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900/80 border border-white/10 rounded-[28px] p-6 shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-6">Activity Categories</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.activityCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {analytics.activityCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #374151",
                      borderRadius: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <div className="grid gap-8 xl:grid-cols-2">
            {/* Popular Cities Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/80 border border-white/10 rounded-[28px] p-6 shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-6">Popular Cities</h2>
              <div className="space-y-4">
                {analytics.popularCities.map((city, index) => (
                  <div
                    key={city.city}
                    className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/80 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-cyan-300 font-bold">#{index + 1}</span>
                      <span className="text-xl font-semibold text-white">{city.city}</span>
                    </div>
                    <span className="text-slate-300">{city.trips} trips</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/80 border border-white/10 rounded-[28px] p-6 shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-6">Platform Insights</h2>
              <div className="space-y-4">
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400 mb-2">User Growth Rate</p>
                  <p className="text-2xl font-bold text-emerald-300">+12.5%</p>
                  <p className="text-slate-400 text-sm">vs last month</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400 mb-2">Avg Trip Duration</p>
                  <p className="text-2xl font-bold text-cyan-300">7.2 days</p>
                  <p className="text-slate-400 text-sm">per trip</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400 mb-2">Most Active Hour</p>
                  <p className="text-2xl font-bold text-amber-300">2-3 PM</p>
                  <p className="text-slate-400 text-sm">peak planning time</p>
                </div>
              </div>
            </motion.div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-100"
            >
              <div className="flex items-center gap-3">
                <FaExclamationTriangle />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </div>
      </Layout>
  );
}

export default AdminDashboard;
