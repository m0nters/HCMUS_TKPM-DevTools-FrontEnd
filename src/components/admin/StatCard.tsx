export interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  change?: string;
  subtext?: string;
}

export function StatCard({
  title,
  value,
  icon,
  change,
  subtext,
}: StatCardProps) {
  return (
    <div className="flex items-center rounded-lg border border-gray-200 bg-white p-6">
      <div className="mr-4 rounded-lg bg-gray-50 p-3">{icon}</div>
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
        {subtext && <p className="mt-1 text-xs text-gray-500">{subtext}</p>}
      </div>
    </div>
  );
}
