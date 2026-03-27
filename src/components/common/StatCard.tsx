interface StatCardProps {
  label: string;
  value: string;
  helper: string;
  tone?: "primary" | "success" | "warning" | "neutral";
}

function StatCard({ label, value, helper, tone = "neutral" }: StatCardProps) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <p className="stat-card__label">{label}</p>
      <strong className="stat-card__value">{value}</strong>
      <p className="stat-card__helper">{helper}</p>
    </article>
  );
}

export default StatCard;
