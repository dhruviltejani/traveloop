import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaWallet,
  FaArrowRight,
} from "react-icons/fa";

function TripCard({
  title,
  image,
  dates,
  budget,
  destinations,
  onView,
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/10 shadow-xl"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-110 transition duration-500"
        />

        <div className="absolute top-4 right-4 bg-cyan-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Upcoming
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-4">
          {title}
        </h2>

        {/* Dates */}
        <div className="flex items-center gap-3 text-gray-300 mb-3">
          <FaCalendarAlt className="text-cyan-400" />
          <span>{dates}</span>
        </div>

        {/* Destinations */}
        <div className="flex items-center gap-3 text-gray-300 mb-3">
          <FaMapMarkerAlt className="text-pink-400" />
          <span>{destinations} Destinations</span>
        </div>

        {/* Budget */}
        <div className="flex items-center gap-3 text-gray-300 mb-5">
          <FaWallet className="text-green-400" />
          <span>{budget}</span>
        </div>

        {/* Button */}
        <button
          onClick={onView}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white py-3 rounded-xl font-semibold transition"
        >
          View Trip
          <FaArrowRight />
        </button>
      </div>
    </motion.div>
  );
}

export default TripCard;