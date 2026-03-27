import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ProgressPoint } from "../../types/app";

interface PointsAreaChartProps {
  data: ProgressPoint[];
}

function PointsAreaChart({ data }: PointsAreaChartProps) {
  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <div>
          <p className="section-eyebrow">Performance</p>
          <h3>Pontos por periodo</h3>
        </div>
      </div>

      <div className="chart-card__body">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 12, right: 8, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="pointsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff7a18" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#ff7a18" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(31, 47, 83, 0.12)" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="points" stroke="#ff7a18" fill="url(#pointsGradient)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PointsAreaChart;
