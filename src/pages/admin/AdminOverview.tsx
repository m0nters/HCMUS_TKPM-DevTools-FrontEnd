import { useState, useEffect } from "react";
import {
  UsersIcon,
  PuzzlePieceIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { getPluginStats } from "../../services/admin/pluginService";
import { getUserStats } from "../../services/admin/userService";
import { LoadingSpinner } from "../../components/common";
import { StatCard } from "../../components/admin/";

function AdminOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    totalTools: 0,
    activeTools: 0,
    premiumTools: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    // Fetch dashboard stats from real API
    const fetchStats = async () => {
      try {
        setIsLoading(true);

        // Fetch stats from separate services
        const userStats = await getUserStats();
        const toolStats = await getPluginStats();

        setStats({
          ...userStats,
          ...toolStats,
        });

        setLastUpdated(new Date());
        setError(null);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Calculate percentages
  const premiumUserPercentage =
    stats.totalUsers > 0
      ? Math.round((stats.premiumUsers / stats.totalUsers) * 100)
      : 0;

  const activeToolPercentage =
    stats.totalTools > 0
      ? Math.round((stats.activeTools / stats.totalTools) * 100)
      : 0;

  const premiumToolPercentage =
    stats.totalTools > 0
      ? Math.round((stats.premiumTools / stats.totalTools) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<UsersIcon className="w-8 h-8 text-blue-500" />}
        />
        <StatCard
          title="Premium Users"
          value={stats.premiumUsers}
          icon={<CurrencyDollarIcon className="w-8 h-8 text-green-500" />}
          subtext={`${premiumUserPercentage}% of users`}
        />
        <StatCard
          title="Total Tools"
          value={stats.totalTools}
          icon={<PuzzlePieceIcon className="w-8 h-8 text-purple-500" />}
        />
        <StatCard
          title="Active Tools"
          value={stats.activeTools}
          icon={<ArrowTrendingUpIcon className="w-8 h-8 text-orange-500" />}
          subtext={`${activeToolPercentage}% of tools`}
        />
      </div>

      {/* Tool Status Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Tool Status Overview</h2>
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex justify-between">
              <span className="text-sm text-gray-500">Active Tools</span>
              <span className="text-sm font-medium">
                {stats.activeTools}/{stats.totalTools} ({activeToolPercentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{ width: `${activeToolPercentage}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="mb-2 flex justify-between">
              <span className="text-sm text-gray-500">Premium Tools</span>
              <span className="text-sm font-medium">
                {stats.premiumTools}/{stats.totalTools} ({premiumToolPercentage}
                %)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-purple-600 h-2.5 rounded-full"
                style={{ width: `${premiumToolPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700 mb-1">
                Active/Inactive Distribution
              </h3>
              <div className="flex items-center gap-2">
                <div
                  className="h-3 rounded-full bg-green-500"
                  style={{ width: `${activeToolPercentage}%` }}
                ></div>
                <div
                  className="h-3 rounded-full bg-red-500"
                  style={{ width: `${100 - activeToolPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-2 text-gray-500">
                <span>Active: {stats.activeTools}</span>
                <span>Inactive: {stats.totalTools - stats.activeTools}</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700 mb-1">
                Premium/Free Distribution
              </h3>
              <div className="flex items-center gap-2">
                <div
                  className="h-3 rounded-full bg-purple-500"
                  style={{ width: `${premiumToolPercentage}%` }}
                ></div>
                <div
                  className="h-3 rounded-full bg-blue-400"
                  style={{ width: `${100 - premiumToolPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-2 text-gray-500">
                <span>Premium: {stats.premiumTools}</span>
                <span>Free: {stats.totalTools - stats.premiumTools}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
