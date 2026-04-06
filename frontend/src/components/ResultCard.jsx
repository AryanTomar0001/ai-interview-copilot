import { PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";

export default function ResultCard({ result }) {
  const score = result.evaluation.score;

  const data = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ];

  const COLORS = ["#22c55e", "#1e293b"];

  const feedback = result.feedback || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 mt-6"
    >
      <h3 className="text-2xl mb-6 font-semibold">📊 Result Analysis</h3>

      {/* 🔥 Chart */}
      <div className="flex flex-col items-center">
        <PieChart width={200} height={200}>
          <Pie data={data} dataKey="value" outerRadius={80}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
        </PieChart>

        <p className="mt-4 text-xl font-bold text-green-400">
          Score: {score}
        </p>
      </div>

      {/* ❌ Missing Points */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-red-400">❌ Missing Points</h4>
        {feedback.missing?.length ? (
          feedback.missing.map((item, i) => (
            <p key={i} className="text-sm mt-1">• {item}</p>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No major missing points</p>
        )}
      </div>

      {/* 🔧 Improvements */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-yellow-400">🔧 Improvements</h4>
        {feedback.improvements?.length ? (
          feedback.improvements.map((item, i) => (
            <p key={i} className="text-sm mt-1">• {item}</p>
          ))
        ) : (
          <p className="text-gray-400 text-sm">Good answer 👍</p>
        )}
      </div>

      {/* 💡 Ideal Answer */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-blue-400">💡 Ideal Answer</h4>
        {feedback.ideal_answer ? (
          <p className="text-sm mt-2 leading-relaxed">
            {feedback.ideal_answer}
          </p>
        ) : (
          <p className="text-gray-400 text-sm">No sample answer available</p>
        )}
      </div>
    </motion.div>
  );
}