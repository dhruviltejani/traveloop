import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaCamera,
  FaMoon,
  FaSun,
  FaGlobe,
  FaBell,
  FaTrashAlt,
  FaSave,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";



import API from "../services/api";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    profileImage: "",
    savedDestinations: [],
  });
  const [summary, setSummary] = useState({
    totalTrips: 0,
    savedDestinationsCount: 0,
    memberSince: "January 2024", // Mock for now
  });
  const [settings, setSettings] = useState({
    darkMode: true,
    language: "English",
    notifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchProfileData = async () => {
      try {
        // Fetch user info
        const userResponse = await API.get("/auth/me");
        const userData = userResponse.data;

        // Fetch user's trips
        const tripsResponse = await API.get("/trips");
        const trips = tripsResponse.data;

        // Fetch all stops to get unique cities as saved destinations
        const stopsPromises = trips.map(trip => API.get(`/trips/${trip.id}/stops`));
        const stopsResponses = await Promise.all(stopsPromises);
        const allStops = stopsResponses.flatMap(response => response.data);
        const uniqueCities = [...new Set(allStops.map(stop => stop.city))];

        setUser({
          name: userData.name,
          email: userData.email,
          profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80", // Mock for now
          savedDestinations: uniqueCities,
        });

        setSummary({
          totalTrips: trips.length,
          savedDestinationsCount: uniqueCities.length,
          memberSince: userData.created_at ? new Date(userData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : "January 2024",
        });
      } catch (err) {
        console.error(err);
        setError("Unable to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await API.put("/auth/me", {
        name: user.name,
        email: user.email,
      });

      setSuccess("Profile updated successfully!");
      // Update local user state with response data
      setUser(prev => ({
        ...prev,
        name: response.data.user.name,
        email: response.data.user.email,
      }));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmed) return;

    try {
      await API.delete("/auth/me");
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete account.");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse">
          <div className="bg-slate-800/50 h-32 rounded-3xl mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/50 h-64 rounded-3xl"></div>
            <div className="bg-slate-800/50 h-64 rounded-3xl"></div>
            <div className="bg-slate-800/50 h-64 rounded-3xl"></div>
          </div>
          <div className="bg-slate-800/50 h-48 rounded-3xl"></div>
        </div>
      </Layout>
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
                  User Profile
                </p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Manage Your Account
                </h1>
                <p className="mt-4 max-w-2xl text-slate-300 text-lg leading-relaxed">
                  Update your profile information, adjust settings, and customize your Traveloop experience.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-8 xl:grid-cols-[1fr_0.8fr]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Profile Info */}
              <div className="bg-slate-900/80 border border-white/10 rounded-[28px] p-6 shadow-xl">
                <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="relative">
                      <img
                        src={user.profileImage}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <button className="absolute bottom-0 right-0 bg-cyan-500 rounded-full p-2 text-slate-950">
                        <FaCamera />
                      </button>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm uppercase tracking-[0.2em] text-slate-400 mb-2">Name</label>
                      <input
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-[0.2em] text-slate-400 mb-2">Email</label>
                    <input
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-[0.2em] text-slate-400 mb-2">Saved Destinations</label>
                    <div className="flex flex-wrap gap-2">
                      {user.savedDestinations.map((dest, index) => (
                        <span key={index} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-4 py-2 text-sm">
                          <FaMapMarkerAlt />
                          {dest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="bg-slate-900/80 border border-white/10 rounded-[28px] p-6 shadow-xl">
                <h2 className="text-2xl font-bold mb-6">Settings & Preferences</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {settings.darkMode ? <FaMoon /> : <FaSun />}
                      <span>Dark Mode</span>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        settings.darkMode ? "bg-cyan-500" : "bg-slate-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.darkMode ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaGlobe />
                      <span>Language</span>
                    </div>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                      className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaBell />
                      <span>Notifications</span>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        settings.notifications ? "bg-cyan-500" : "bg-slate-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.notifications ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-3 rounded-2xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaSave />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white px-6 py-3 rounded-2xl font-semibold transition"
                >
                  <FaTrashAlt />
                  Delete Account
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-cyan-500/10 to-slate-900/60 border border-cyan-400/10 rounded-[28px] p-6 shadow-xl"
            >
              <p className="uppercase tracking-[0.2em] text-cyan-300 font-semibold mb-4">
                Account Summary
              </p>
              <div className="space-y-4">
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Member Since</p>
                  <p className="mt-2 text-xl font-semibold">{summary.memberSince}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Total Trips</p>
                  <p className="mt-2 text-xl font-semibold">{summary.totalTrips}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Saved Destinations</p>
                  <p className="mt-2 text-xl font-semibold">{user.savedDestinations.length}</p>
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

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-5 text-emerald-100"
            >
              <div className="flex items-center gap-3">
                <FaCheckCircle />
                <span>{success}</span>
              </div>
            </motion.div>
          )}
        </div>
      </Layout>
  );
}

export default Profile;
