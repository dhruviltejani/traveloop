import Layout from "../components/Layout";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaWallet,
  FaMapMarkerAlt,
  FaShareAlt,
  FaLink,
  FaMapSigns,
  FaClock,
  FaChevronRight,
  FaExclamationTriangle,
} from "react-icons/fa";



import API from "../services/api";

function PublicTrip() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const tripResponse = await API.get("/trips");
        const selectedTrip = tripResponse.data.find(
          (item) => item.id === Number(id)
        );

        if (!selectedTrip) {
          setError("This public trip could not be found.");
          return;
        }

        setTrip(selectedTrip);

        const stopsResponse = await API.get(`/trips/${id}/stops`);
        const stopsData = Array.isArray(stopsResponse.data)
          ? stopsResponse.data
          : [];

        const stopsWithActivities = await Promise.all(
          stopsData.map(async (stop) => {
            try {
              const activitiesResponse = await API.get(
                `/activities/${stop.id}`
              );
              return {
                ...stop,
                activities: Array.isArray(activitiesResponse.data)
                  ? activitiesResponse.data
                  : [],
              };
            } catch (activityError) {
              console.error(activityError);
              return {
                ...stop,
                activities: [],
              };
            }
          })
        );

        setStops(stopsWithActivities);
      } catch (fetchError) {
        console.error(fetchError);
        setError("Unable to load public trip data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const shareUrl = `${window.location.origin}/public-trip/${id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyStatus("Link copied to clipboard!");
      window.setTimeout(() => setCopyStatus(""), 2200);
    } catch (clipboardError) {
      console.error(clipboardError);
      setError("Unable to copy the link. Please try again.");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: trip?.title || "Traveloop Public Trip",
          text: `Check out this itinerary from Traveloop: ${trip?.title}`,
          url: shareUrl,
        });
      } catch (shareError) {
        console.error(shareError);
        setError("Share was cancelled or failed.");
      }
    } else {
      handleCopyLink();
    }
  };

  const dayStops = useMemo(() => {
    if (!stops.length) return [];

    return stops.map((stop, index) => ({
      ...stop,
      dayLabel: `Stop ${index + 1}`,
    }));
  }, [stops]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xl">
        Loading public itinerary...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
        <div className="max-w-lg rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <div className="flex items-center justify-center mb-4 text-red-300">
            <FaExclamationTriangle className="mr-3 text-2xl" />
            <span className="text-lg font-semibold">{error}</span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="mt-4 rounded-3xl bg-white/10 px-6 py-3 text-white hover:bg-white/20 transition"
          >
            Return Home
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
            className="rounded-[32px] border border-white/10 bg-slate-900/80 p-8 shadow-2xl mb-10"
          >
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="max-w-3xl">
                <p className="uppercase tracking-[0.3em] text-cyan-400 font-semibold mb-4">
                  Public itinerary
                </p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {trip.title}
                </h1>
                <p className="mt-4 text-slate-300 text-lg leading-relaxed">
                  Discover the full read-only itinerary for this trip, including stops, activities, and a polished timeline for sharing with friends.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center justify-center gap-3 rounded-3xl bg-cyan-500 px-6 py-4 text-slate-950 font-semibold transition hover:bg-cyan-400"
                >
                  <FaLink />
                  Copy Share Link
                </button>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center justify-center gap-3 rounded-3xl border border-white/10 bg-slate-950/90 px-6 py-4 text-white font-semibold transition hover:bg-slate-900"
                >
                  <FaShareAlt />
                  Share Trip
                </button>
              </div>
            </div>
            {copyStatus && (
              <div className="mt-6 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-emerald-100">
                {copyStatus}
              </div>
            )}
          </motion.div>

          <div className="grid gap-6 xl:grid-cols-[0.9fr_0.7fr]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-[32px] border border-white/10 bg-slate-900/80 p-8 shadow-2xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                    Travel dates
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-white">
                    {trip.start_date} — {trip.end_date}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 px-6 py-5 text-center">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                    Total budget
                  </p>
                  <p className="mt-3 text-3xl font-bold text-cyan-300">₹{trip.budget}</p>
                </div>
              </div>
              <div className="space-y-8">
                {dayStops.map((stop, index) => (
                  <motion.div
                    key={stop.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300 font-semibold">
                          {stop.dayLabel}
                        </p>
                        <h2 className="mt-3 text-3xl font-bold text-white flex items-center gap-3">
                          <FaMapSigns />
                          {stop.city}
                        </h2>
                        <p className="mt-2 text-slate-400">{stop.start_date} — {stop.end_date}</p>
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/90 px-4 py-2 text-slate-300 text-sm">
                        {stop.activities?.length || 0} activities
                      </span>
                    </div>
                    <div className="mt-6 space-y-4">
                      {stop.activities?.length > 0 ? (
                        stop.activities.map((activity) => (
                          <div
                            key={activity.id}
                            className="rounded-3xl border border-white/10 bg-slate-900/90 p-5"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <h3 className="text-xl font-semibold text-white">{activity.title}</h3>
                                <p className="mt-2 text-slate-400">Duration: {activity.time}</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-slate-300 text-sm">
                                <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-2">
                                  ₹{activity.cost}
                                </span>
                                <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-2">
                                  Read-only
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/70 p-6 text-slate-400">
                          No activities available for this stop.
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {dayStops.length === 0 && (
                  <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-10 text-center text-slate-400">
                    This trip has no stops yet. Share this page after itinerary items are added.
                  </div>
                )}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-[32px] border border-white/10 bg-slate-900/80 p-8 shadow-2xl"
            >
              <p className="uppercase tracking-[0.3em] text-cyan-400 font-semibold mb-4">
                Itinerary overview
              </p>
              <p className="text-slate-300 leading-relaxed mb-8">
                Use public sharing to show travelers the full plan, then copy the link or use native sharing for instant access.
              </p>
              <div className="space-y-5">
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Stops count</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{stops.length}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Activities total</p>
                  <p className="mt-3 text-3xl font-semibold text-white">
                    {stops.reduce((sum, stop) => sum + (stop.activities?.length || 0), 0)}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Share URL</p>
                  <p className="mt-3 break-all text-slate-200">{shareUrl}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
  );
}

export default PublicTrip;
