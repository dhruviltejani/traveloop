import { motion } from "framer-motion";

function StatCard({ title, value, icon, color = "from-cyan-500 to-blue-500" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-lg relative overflow-hidden group`}
    >
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-white/20 backdrop-blur-sm`}>
            {icon}
          </div>
        </div>
        <h3 className="text-white/80 text-sm font-medium uppercase tracking-wide">{title}</h3>
        <h1 className="text-3xl font-bold text-white mt-2">
          {value}
        </h1>
      </div>
      <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors"></div>
    </motion.div>
  );
}

export default StatCard;