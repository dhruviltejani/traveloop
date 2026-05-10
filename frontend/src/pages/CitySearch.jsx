import Layout from "../components/Layout";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaStar,
  FaWallet,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";



import API from "../services/api";

const cityData = [
  {
    id: 1,
    city: "Bali",
    country: "Indonesia",
    popularity: "Ultra Popular",
    costLevel: "₹₹",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    highlight: "Beach clubs, rice terraces, surf vibes",
  },
  {
    id: 2,
    city: "Kyoto",
    country: "Japan",
    popularity: "Cultural Hotspot",
    costLevel: "₹₹₹",
    image:
      "https://images.unsplash.com/photo-1518110832367-0f8ec9f7a1be?auto=format&fit=crop&w=1200&q=80",
    highlight: "Temples, tea houses, autumn colors",
  },
  {
    id: 3,
    city: "Lisbon",
    country: "Portugal",
    popularity: "Coastal Charm",
    costLevel: "₹₹",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    highlight: "Tram-lined streets, pastel neighborhoods",
  },
  {
    id: 4,
    city: "Cape Town",
    country: "South Africa",
    popularity: "Adventure Capital",
    costLevel: "₹₹₹",
    image:
      "https://images.unsplash.com/photo-1511732358754-667a4c6fd1e4?auto=format&fit=crop&w=1200&q=80",
    highlight: "Table Mountain, vineyards, coastlines",
  },
  {
    id: 5,
    city: "Reykjavik",
    country: "Iceland",
    popularity: "Northern Lights",
    costLevel: "₹₹₹₹",
    image:
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1200&q=80",
    highlight: "Glaciers, hot springs, dramatic landscapes",
  },
  {
    id: 6,
    city: "Barcelona",
    country: "Spain",
    popularity: "Urban Escape",
    costLevel: "₹₹₹",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    highlight: "Gaudí architecture, beaches, nightlife",
  },
  {
    id: 7,
    city: "Vancouver",
    country: "Canada",
    popularity: "Nature Meets City",
    costLevel: "₹₹₹",
    image:
      "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1200&q=80",
    highlight: "Mountains, waterfront, urban design",
  },
  {
    id: 8,
    city: "Chiang Mai",
    country: "Thailand",
    popularity: "Peaceful Retreat",
    costLevel: "₹",
    image:
      "https://images.unsplash.com/photo-1538928801215-5f28b2d9ab4c?auto=format&fit=crop&w=1200&q=80",
    highlight: "Night markets, temples, slow travel",
  },
];

function CitySearch() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [searchText, setSearchText] = useState("");
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingCityId, setSavingCityId] = useState(null);
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

  const filteredCities = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return cityData;
    }

    return cityData.filter((item) => {
      return (
        item.city.toLowerCase().includes(query) ||
        item.country.toLowerCase().includes(query) ||
        item.popularity.toLowerCase().includes(query)
      );
    });
  }, [searchText]);

  const addToTrip = async (city) => {
    if (savingCityId) return;

    setError("");
    setSuccess("");
    setSavingCityId(city.id);

    try {
      if (!trip) {
        throw new Error("Trip data unavailable.");
      }

      await API.post("/stops", {
        trip_id: Number(id),
        city: city.city,
        start_date: trip.start_date,
        end_date: trip.end_date,
      });

      setSuccess(`${city.city} added to ${trip.title}! Redirecting...`);
      setTimeout(() => {
        navigate(`/trip/${id}`);
      }, 900);
    } catch (err) {
      console.error(err);
      setError("Could not add this city to your trip. Please try again.");
    } finally {
      setSavingCityId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xl">
        Loading city search...
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
                  Search Cities
                </p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Discover destinations for {trip?.title}
                </h1>
                <p className="mt-4 max-w-2xl text-slate-300 text-lg leading-relaxed">
                  Browse a premium city library, filter by mood, and add the perfect stop directly to your itinerary.
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
                  placeholder="Search cities, countries, or moods"
                  className="w-full bg-slate-950/80 border border-white/10 rounded-3xl py-4 pl-14 pr-6 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950/70 border border-white/10 rounded-3xl p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400 mb-3">
                    Selected Trip
                  </p>
                  <p className="text-xl font-semibold">{trip?.title}</p>
                  <p className="text-slate-400 mt-2">
                    {trip?.start_date} - {trip?.end_date}
                  </p>
                </div>
                <div className="bg-slate-950/70 border border-white/10 rounded-3xl p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400 mb-3">
                    Total Budget
                  </p>
                  <p className="text-xl font-semibold">₹{trip?.budget}</p>
                  <p className="text-slate-400 mt-2">Instant stop creation for your itinerary.</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/20 via-transparent to-slate-900/40 border border-cyan-400/10 rounded-[28px] p-6 shadow-xl">
              <p className="uppercase tracking-[0.2em] text-cyan-300 font-semibold mb-4">
                Travel Tips
              </p>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="mt-1 text-cyan-400" />
                  <span>Pick cities that match your trip pace and budget.</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="mt-1 text-cyan-400" />
                  <span>Add stops quickly without leaving the city search flow.</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="mt-1 text-cyan-400" />
                  <span>Use the search bar to find coastal, cultural, and adventure hotspots.</span>
                </li>
              </ul>
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
            {filteredCities.map((city) => (
              <motion.article
                key={city.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                className="group overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/80 shadow-2xl"
              >
                <div
                  className="h-72 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${city.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/0" />
                  <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-3 text-white">
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-950/80 px-4 py-2 text-sm uppercase tracking-[0.2em] text-cyan-300">
                      <FaMapMarkerAlt />
                      {city.country}
                    </div>
                    <div>
                      <p className="text-3xl font-bold tracking-tight">{city.city}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between text-slate-400 mb-4">
                    <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em]">
                      <FaStar className="text-amber-300" />
                      {city.popularity}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/90 px-3 py-2 text-sm text-slate-200">
                      <FaWallet className="text-cyan-300" />
                      {city.costLevel}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-6">{city.highlight}</p>
                  <button
                    disabled={savingCityId === city.id}
                    onClick={() => addToTrip(city)}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-3xl bg-cyan-500 px-5 py-4 text-base font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {savingCityId === city.id ? "Adding..." : "Add To Trip"}
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredCities.length === 0 && (
            <div className="mt-10 rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center text-slate-400">
              No cities match that search yet. Try keywords like "beach", "culture", or "adventure".
            </div>
          )}
        </div>
      </Layout>
  );
}

export default CitySearch;
