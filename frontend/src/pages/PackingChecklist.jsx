import Layout from "../components/Layout";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaTrashAlt,
  FaPlus,
  FaClipboardList,
  FaArrowLeft,
  FaTshirt,
  FaLaptop,
  FaIdCardAlt,
  FaToilet,
  FaStar,
  FaSyncAlt,
  FaExclamationTriangle,
} from "react-icons/fa";



import API from "../services/api";

const categories = ["All", "Clothing", "Electronics", "Documents", "Toiletries", "Essentials"];

const iconMap = {
  Clothing: <FaTshirt className="text-cyan-300" />,
  Electronics: <FaLaptop className="text-blue-300" />,
  Documents: <FaIdCardAlt className="text-amber-300" />,
  Toiletries: <FaToilet className="text-pink-300" />,
  Essentials: <FaStar className="text-emerald-300" />,
};

const defaultItems = [
  { id: 1, label: "Passport & boarding pass", category: "Documents", packed: false },
  { id: 2, label: "Phone charger + power bank", category: "Electronics", packed: false },
  { id: 3, label: "Weather layer jackets", category: "Clothing", packed: false },
  { id: 4, label: "Toothbrush & toothpaste", category: "Toiletries", packed: false },
  { id: 5, label: "Wallet, cards & cash", category: "Essentials", packed: false },
];

function loadChecklist(tripId) {
  try {
    const raw = localStorage.getItem(`packing-checklist-${tripId}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to load checklist", error);
    return null;
  }
}

function saveChecklist(tripId, items) {
  try {
    localStorage.setItem(`packing-checklist-${tripId}`, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save checklist", error);
  }
}

function PackingChecklist() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [items, setItems] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [newItemLabel, setNewItemLabel] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Clothing");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchTrip = async () => {
      try {
        const response = await API.get("/trips");
        const selectedTrip = response.data.find((item) => item.id === Number(id));
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

  useEffect(() => {
    const storedItems = loadChecklist(id);
    if (storedItems && Array.isArray(storedItems)) {
      setItems(storedItems);
    } else {
      setItems(defaultItems);
    }
  }, [id]);

  useEffect(() => {
    if (!loading) {
      saveChecklist(id, items);
    }
  }, [id, items, loading]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      return categoryFilter === "All" || item.category === categoryFilter;
    });
  }, [items, categoryFilter]);

  const packedCount = useMemo(() => items.filter((item) => item.packed).length, [items]);
  const completionPercent = useMemo(() => {
    return items.length === 0 ? 0 : Math.round((packedCount / items.length) * 100);
  }, [packedCount, items.length]);

  const handleTogglePacked = (itemId) => {
    setItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, packed: !item.packed } : item
      )
    );
  };

  const handleDelete = (itemId) => {
    setItems((current) => current.filter((item) => item.id !== itemId));
  };

  const handleAddItem = () => {
    const label = newItemLabel.trim();
    if (!label) {
      setError("Please enter an item name before adding.");
      return;
    }

    setError("");
    setSaving(true);

    const nextId = items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
    const newest = {
      id: nextId,
      label,
      category: newItemCategory,
      packed: false,
    };

    setItems((current) => [newest, ...current]);
    setNewItemLabel("");
    setNewItemCategory("Clothing");
    setSaving(false);
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "Reset checklist to the default suggested items?"
    );
    if (!confirmed) return;
    setItems(defaultItems);
    setCategoryFilter("All");
    setError("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xl">
        Loading packing checklist...
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
                  Packing Checklist
                </p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Prepare for {trip?.title}
                </h1>
                <p className="mt-4 max-w-2xl text-slate-300 leading-relaxed">
                  Build a polished trip-ready checklist with categories, progress tracking, and quick pack controls.
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
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900/80 border border-white/10 rounded-[28px] p-6 shadow-xl"
            >
              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400 mb-2">
                    Total items
                  </p>
                  <p className="text-4xl font-bold text-white">{items.length}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400 mb-2">
                    Packed so far
                  </p>
                  <p className="text-4xl font-bold text-white">{packedCount}</p>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                      Completion
                    </p>
                    <p className="text-3xl font-bold text-white">{completionPercent}%</p>
                  </div>
                  <FaClipboardList className="text-cyan-300 text-3xl" />
                </div>
                <div className="h-4 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-cyan-500/10 to-slate-900/60 border border-cyan-400/10 rounded-[28px] p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="uppercase tracking-[0.2em] text-cyan-300 font-semibold">
                    Quick actions
                  </p>
                  <p className="text-slate-300 mt-2">
                    Use the filters and actions below to keep your checklist clean and demo-ready.
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
                >
                  <FaSyncAlt />
                  Reset Checklist
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      categoryFilter === category
                        ? "border-cyan-400 bg-cyan-500/20 text-cyan-200"
                        : "border-white/10 text-slate-300 hover:border-cyan-400 hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/80 border border-white/10 rounded-[28px] p-6 shadow-xl mb-10"
          >
            <div className="grid gap-4 lg:grid-cols-[1fr_0.75fr]">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400 mb-3">
                  Add packing item
                </p>
                <input
                  value={newItemLabel}
                  onChange={(e) => setNewItemLabel(e.target.value)}
                  placeholder="Enter item name"
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400 mb-3">
                  Category
                </p>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-white focus:border-cyan-400 focus:outline-none"
                >
                  {categories.slice(1).map((category) => (
                    <option key={category} value={category} className="bg-slate-950 text-white">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button
                onClick={handleAddItem}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-3xl bg-cyan-500 px-6 py-4 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FaPlus />
                Add Item
              </button>
              <p className="text-slate-400">
                New items are saved locally and ready for live demo use.
              </p>
            </div>
          </motion.div>

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

          <div className="grid gap-6 xl:grid-cols-2">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2 text-sm uppercase tracking-[0.25em] text-slate-300">
                      {iconMap[item.category] || <FaClipboardList className="text-cyan-300" />}
                      {item.category}
                    </div>
                    <h2 className="mt-5 text-2xl font-bold text-white">{item.label}</h2>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-3xl border border-red-500/30 bg-red-500/10 p-3 text-red-300 transition hover:bg-red-500/20"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => handleTogglePacked(item.id)}
                    className={`inline-flex items-center gap-2 rounded-3xl px-5 py-3 font-semibold transition ${
                      item.packed
                        ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                        : "bg-slate-800 text-white hover:bg-slate-700"
                    }`}
                  >
                    <FaCheckCircle />
                    {item.packed ? "Packed" : "Mark Packed"}
                  </button>
                  <span className="rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-slate-300">
                    Status: {item.packed ? "Packed" : "Unpacked"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="mt-10 rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center text-slate-400">
              No items match this category. Add a new item or reset the checklist to restore defaults.
            </div>
          )}
        </div>
      </Layout>
  );
}

export default PackingChecklist;
