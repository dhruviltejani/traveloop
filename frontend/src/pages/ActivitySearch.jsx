import Layout from "../components/Layout";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaClock,
  FaWallet,
  FaStar,
  FaArrowLeft,
  FaUtensils,
  FaMountain,
  FaCocktail,
  FaDumbbell,
  FaLeaf,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";



import API from "../services/api";

const activityData = [
  {
    id: 1,
    title: "Sunset Kayak Tour",
    category: "Adventure",
    duration: "3 hrs",
    cost: 1800,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Rooftop Cocktail Night",
    category: "Nightlife",
    duration: "2 hrs",
    cost: 1400,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1516685304081-de7947d419d5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Street Food Walking Tour",
    category: "Food",
    duration: "4 hrs",
    cost: 1200,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1521302080497-181d7a5dd8c3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    title: "Forest Waterfall Hike",
    category: "Nature",
    duration: "5 hrs",
    cost: 900,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    title: "Spa & Wellness Retreat",
    category: "Relaxation",
    duration: "2 hrs",
    cost: 2000,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    title: "Sunrise Mountain Bike",
    category: "Adventure",
    duration: "3 hrs",
    cost: 1600,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 7,
    title: "Riverside Brunch",
    category: "Food",
    duration: "2 hrs",
    cost: 1100,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 8,
    title: "Private Beach Meditation",
    category: "Relaxation",
    duration: "1.5 hrs",
    cost: 700,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80",
  },
];

const categories = [
  "All",
  "Adventure",
  "Food",
  "Nature",
  "Relaxation",
  "Nightlife",
];

function getCategoryIcon(category) {
  switch (category) {
    case "Adventure":
      return <FaDumbbell className="text-cyan-300" />;
    case "Food":
      return <FaUtensils className="text-amber-300" />;
    case "Nature":
      return <FaLeaf className="text-green-300" />;
    case "Relaxation":
      return <FaCocktail className="text-pink-300" />;
    case "Nightlife":
      return <FaStar className="text-violet-300" />;
    default:
      return <FaMapMarkerAlt className="text-cyan-300" />;
  }
}

function ActivitySearch() {
  const navigate = useNavigate();
  const { id, stopId } = useParams();

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingActivityId, setSavingActivityId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchTrip = async () => {
      try {
        const response = await API.get("/trips");
        const selectedTrip = response.data.find(
          (item) => item.id === Number(id)
        );

        if (!selectedTrip) {
          setError("Trip not found.");
          return;
        }

        setTrip(selectedTrip);
      } catch (err) {
        console.error(err);
        setError("Unable to load trip details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id, navigate]);

  const filteredActivities = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return activityData.filter((activity) => {
      const matchesText =
        activity.title.toLowerCase().includes(query) ||
        activity.category.toLowerCase().includes(query);
      const matchesCategory =
        selectedCategory === "All" ||
        activity.category === selectedCategory;
      return matchesText && matchesCategory;
    });
  }, [searchText, selectedCategory]);

  const addActivity = async (activity) => {
    if (savingActivityId) return;

    setError("");
    setSuccess("");
    setSavingActivityId(activity.id);

    try {
      await API.post("/activities", {
        stop_id: Number(stopId),
        title: activity.title,
        time: activity.duration,
        cost: activity.cost,
      });

      setSuccess(`${activity.title} added successfully! Redirecting...`);
      setTimeout(() => {
        navigate(`/trip/${id}`);
      }, 900);
    } catch (err) {
      console.error(err);
      setError("Could not add this activity. Please try again.");
    } finally {
      setSavingActivityId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xl">
        Loading activity search...
      </div>
    );
  }

  return (
    <Layout>
        <div className="p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/80 border border-white/10 rounded-[32px] p-8 shadow-2xl mb-10"
          >
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
              <div>
                <p className="uppercase tracking-[0.3em] text-cyan-400 font-semibold mb-4">
                  Search Activities
                </p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Add experiences to {trip?.title}
                </h1>
                <p className="mt-4 max-w-2xl text-slate-300 text-lg leading-relaxed">
                  Filter by category, browse curated activity cards, and add them directly into your stop itinerary.
                </p>
              </div>
              <button
                onClick={() => navigate(`/trip/${id}`)}
                className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-3 rounded-2xl font-semibold transition"
              >
                <FaArrowLeft />
                Back to Itinerary
              </button>
            </div>
          </motion.div>

          <div className="grid gap-6 xl:grid-cols-[2fr_1fr] mb-10">
            <div className="bg-slate-900/80 border border-white/10 rounded-[28px] p-6 shadow-xl">
              <div className="relative">
                <FaSearch className="absolute left-4 top-4 text-cyan-400" />
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search activities, categories, or keywords"
                  className="w-full bg-slate-950/80 border border-white/10 rounded-3xl py-4 pl-14 pr-6 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      selectedCategory === category
                        ? "border-cyan-400 bg-cyan-500/15 text-cyan-200"
                        : "border-white/10 text-slate-300 hover:border-cyan-400 hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/20 via-transparent to-slate-900/40 border border-cyan-400/10 rounded-[28px] p-6 shadow-xl">
              <p className="uppercase tracking-[0.2em] text-cyan-300 font-semibold mb-4">
                Current stop
              </p>
              <p className="text-2xl font-semibold">Stop ID #{stopId}</p>
              <p className="mt-3 text-slate-300 leading-relaxed">
                Add tailored activities for this stop and keep your itinerary dynamic and exciting.
              </p>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-100"
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
              className="mb-6 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-5 text-emerald-100"
            >
              <div className="flex items-center gap-3">
                <FaCheckCircle />
                <span>{success}</span>
              </div>
            </motion.div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredActivities.map((activity) => (
              <motion.article
                key={activity.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                className="group overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/80 shadow-2xl"
              >
                <div
                  className="h-72 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${activity.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/20" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-950/80 px-4 py-2 text-sm uppercase tracking-[0.2em] text-cyan-300">
                      {getCategoryIcon(activity.category)}
                      {activity.category}
                    </span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight">{activity.title}</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-slate-300 mb-4">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/90 px-3 py-2 text-sm">
                      <FaClock />
                      {activity.duration}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/90 px-3 py-2 text-sm">
                      <FaWallet />
                      ₹{activity.cost}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-5 text-slate-300">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FaStar
                        key={index}
                        className={`text-sm ${index < Math.round(activity.rating) ? "text-amber-300" : "text-slate-700"}`}
                      />
                    ))}
                    <span className="text-sm text-slate-400">{activity.rating.toFixed(1)}</span>
                  </div>
                  <button
                    disabled={savingActivityId === activity.id}
                    onClick={() => addActivity(activity)}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-3xl bg-cyan-500 px-5 py-4 text-base font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {savingActivityId === activity.id ? "Adding..." : "Add Activity"}
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredActivities.length === 0 && (
            <div className="mt-10 rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center text-slate-400">
              No matching activities found. Try a different keyword or category.
            </div>
          )}
        </div>
      </Layout>
  );
}

export default ActivitySearch;
