import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHome,
  FaSuitcase,
  FaPlus,
  FaUser,
  FaPlane,
} from "react-icons/fa";

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: FaHome },
    { path: "/my-trips", label: "My Trips", icon: FaSuitcase },
    { path: "/create-trip", label: "Create Trip", icon: FaPlus },
    { path: "/profile", label: "Profile", icon: FaUser },
  ];

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-16 bottom-0 z-30 w-72 min-h-[calc(100vh-4rem)] bg-slate-950/85 backdrop-blur-xl border-r border-white/10 p-6 hidden md:flex flex-col shadow-2xl"
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 mb-12"
      >
        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
          <FaPlane className="text-white text-xl" />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Traveloop
        </span>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-2"
      >
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={item.path}
                className={`relative flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-300 group ${
                  isActive
                    ? "text-cyan-400 bg-cyan-500/10 border border-cyan-400/30"
                    : "text-white hover:text-cyan-300 hover:bg-white/5"
                }`}
              >
                <Icon className={`text-lg transition-colors ${isActive ? "text-cyan-400" : "text-gray-400 group-hover:text-cyan-300"}`} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebarActive"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-r-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Bottom Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-6 left-6 right-6"
      >
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 rounded-2xl p-4">
          <p className="text-cyan-300 text-sm font-medium mb-1">Premium Travel Planning</p>
          <p className="text-gray-400 text-xs">Plan smarter, travel better</p>
        </div>
      </motion.div>
    </motion.aside>
  );
}

export default Sidebar;