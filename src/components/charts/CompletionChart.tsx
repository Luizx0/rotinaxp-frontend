import { motion } from "framer-motion";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { fadeInUp } from "../common/motion";

interface CompletionChartProps {
  completed: number;
  open: number;
}

function CompletionChart({ completed, open }: CompletionChartProps) {
  const data = [
    { name: "Concluidas", value: completed, color: "#ff7a18" },
    { name: "Em aberto", value: open, color: "#1f2f53" },
  ];

  return (
    <motion.div className="chart-card" variants={fadeInUp}>
      <div className="chart-card__header">
        <div>
          <p className="section-eyebrow">Fluxo</p>
          <h3>Distribuicao das tarefas</h3>
        </div>
      </div>

      <div className="chart-card__body chart-card__body--compact">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={70} outerRadius={95} paddingAngle={4}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export default CompletionChart;
