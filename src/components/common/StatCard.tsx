import { motion } from "framer-motion";
import { fadeInUp } from "./motion";

interface StatCardProps {
  label: string;
  value: string;
  helper: string;
  tone?: "primary" | "success" | "warning" | "neutral";
}

function StatCard({ label, value, helper, tone = "neutral" }: StatCardProps) {
  return (
    <motion.article className={`stat-card stat-card--${tone}`} variants={fadeInUp}>
      <p className="stat-card__label">{label}</p>
      <strong className="stat-card__value">{value}</strong>
      <p className="stat-card__helper">{helper}</p>
    </motion.article>
  );
}

export default StatCard;
