const CATEGORY_COLORS = {
  Food:          "bg-orange-400",
  Transport:     "bg-blue-400",
  Shopping:      "bg-pink-400",
  Bills:         "bg-red-400",
  Entertainment: "bg-purple-400",
  Other:         "bg-gray-400",
};

const fmt = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function MonthlySummary({ summary }) {
  if (!summary) return null;

  const { month, year, total_spent, breakdown } = summary;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800">
          {MONTH_NAMES[month - 1]} {year}
        </h2>
        <div className="text-right">
          <p className="text-xs text-gray-400">Total spent</p>
          <p className="text-xl font-semibold text-gray-900">{fmt(total_spent)}</p>
        </div>
      </div>

      {breakdown.length === 0 ? (
        <p className="text-sm text-gray-400">No expenses this month.</p>
      ) : (
        <div className="space-y-3">
          {breakdown
            .sort((a, b) => b.total - a.total)
            .map((item) => {
              const pct = total_spent > 0 ? (item.total / total_spent) * 100 : 0;
              return (
                <div key={item.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">
                      {item.category}
                      <span className="text-gray-400 text-xs ml-1">({item.count} item{item.count !== 1 ? "s" : ""})</span>
                    </span>
                    <span className="font-medium text-gray-800">{fmt(item.total)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${CATEGORY_COLORS[item.category] || "bg-gray-400"}`}
                      style={{ width: `${pct.toFixed(1)}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}