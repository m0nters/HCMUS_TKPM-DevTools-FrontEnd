export interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  change?: string;
  subtext?: string;
}

function StatCard({ title, value, icon, change, subtext }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center">
      <div className="bg-gray-50 p-3 rounded-lg mr-4">{icon}</div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="flex items-end">
          <span className="text-2xl font-bold">{value.toLocaleString()}</span>
          {change && (
            <span className="ml-2 text-xs font-medium text-green-500">
              {change}
            </span>
          )}
        </div>
        {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
      </div>
    </div>
  );
}

export default StatCard;
