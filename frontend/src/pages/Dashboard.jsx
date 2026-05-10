import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import TripCard from "../components/TripCard";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPlane,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRupeeSign,
  FaGlobe,
  FaChartLine,
  FaChartPie,
  FaChartBar
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";

import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    totalBudget: 0,
    countriesVisited: 0,
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch trips
        const tripsRes = await API.get("/trips");
        const tripsData = tripsRes.data;

        // Fetch stops for all trips to calculate countries
        const stopsPromises = tripsData.map(trip => API.get(`/trips/${trip.id}/stops`));
        const stopsResponses = await Promise.all(stopsPromises);
        const allStops = stopsResponses.flatMap(response => response.data);

        // Calculate unique countries/cities
        const uniqueCities = [...new Set(allStops.map(stop => stop.city))];

        // Calculate upcoming trips (start_date > today)
        const today = new Date().toISOString().split('T')[0];
        const upcoming = tripsData.filter(trip => trip.start_date > today);

        // Calculate total budget
        const totalBudget = tripsData.reduce((sum, trip) => sum + Number(trip.budget || 0), 0);

        setTrips(tripsData);
        setStats({
          totalTrips: tripsData.length,
          upcomingTrips: upcoming.length,
          totalBudget,
          countriesVisited: uniqueCities.length,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Prepare chart data
  const tripsByMonth = trips.reduce((acc, trip) => {
    const month = new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const tripsChartData = Object.entries(tripsByMonth).map(([month, count]) => ({
    month,
    trips: count,
  }));

  const budgetChartData = trips.map(trip => ({
    name: trip.title.length > 15 ? trip.title.substring(0, 15) + '...' : trip.title,
    budget: Number(trip.budget || 0),
  }));

  const cityPopularity = trips.reduce((acc, trip) => {
    // For simplicity, using trip title as city indicator, but ideally from stops
    const city = trip.title.split(' ')[0]; // First word as city
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  const cityChartData = Object.entries(cityPopularity).map(([city, visits]) => ({
    city,
    visits,
  }));

  const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse">
          <div className="bg-slate-800/50 h-32 rounded-3xl mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-slate-800/50 h-24 rounded-2xl"></div>
            ))}
          </div>
          <div className="bg-slate-800/50 h-64 rounded-3xl"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 p-8 md:p-10 rounded-3xl text-white mb-8 shadow-2xl relative overflow-hidden"
      >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                Welcome back, {user?.name} ✈️
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-white/90"
              >
                Ready to plan your next adventure?
              </motion.p>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <StatCard
              title="Total Trips"
              value={stats.totalTrips}
              icon={<FaPlane />}
              color="from-cyan-500 to-blue-500"
            />
            <StatCard
              title="Upcoming Trips"
              value={stats.upcomingTrips}
              icon={<FaCalendarAlt />}
              color="from-green-500 to-emerald-500"
            />
            <StatCard
              title="Total Budget"
              value={`₹${stats.totalBudget.toLocaleString()}`}
              icon={<FaRupeeSign />}
              color="from-purple-500 to-pink-500"
            />
            <StatCard
              title="Countries Visited"
              value={stats.countriesVisited}
              icon={<FaGlobe />}
              color="from-orange-500 to-red-500"
            />
          </motion.div>

          {/* Charts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          >
            {/* Trips Overview */}
            <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <FaChartLine className="text-cyan-400 text-xl" />
                <h3 className="text-xl font-bold text-white">Trips Overview</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={tripsChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="trips"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    dot={{ fill: '#06b6d4', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Budget Breakdown */}
            <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <FaChartPie className="text-purple-400 text-xl" />
                <h3 className="text-xl font-bold text-white">Budget Breakdown</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={budgetChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="budget"
                  >
                    {budgetChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* City Popularity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 shadow-xl mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <FaChartBar className="text-green-400 text-xl" />
              <h3 className="text-xl font-bold text-white">Popular Destinations</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cityChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="city" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="visits" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent Trips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Recent Trips</h3>
              <button
                onClick={() => navigate("/my-trips")}
                className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
              >
                View All →
              </button>
            </div>

            {trips.length === 0 ? (
              <div className="text-center py-12">
                <FaPlane className="text-6xl text-gray-600 mx-auto mb-4" />
                <h4 className="text-xl text-white font-semibold mb-2">No trips yet</h4>
                <p className="text-gray-400 mb-6">Start planning your first adventure</p>
                <button
                  onClick={() => navigate("/create-trip")}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-6 py-3 rounded-2xl font-bold transition"
                >
                  Create Your First Trip
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.slice(0, 6).map((trip, index) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                    onClick={() => navigate(`/trip/${trip.id}`)}
                  >
                    <TripCard
                      title={trip.title}
                      dates={`${trip.start_date} - ${trip.end_date}`}
                      budget={`₹${trip.budget}`}
                      destinations="3"
                      image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                      onView={() => navigate(`/trip/${trip.id}`)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
      </Layout>
    );
  }

export default Dashboard;