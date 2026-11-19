import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/user/stats");
        if (res.data?.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
        toast.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Total Products</h3>
          <p className="text-4xl font-bold text-slate-800">{loading ? "..." : stats.totalProducts}</p>
          <Link to="/admin/products" className="mt-4 text-emerald-600 text-sm font-medium hover:underline">Manage Products &rarr;</Link>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Total Categories</h3>
          <p className="text-4xl font-bold text-slate-800">{loading ? "..." : stats.totalCategories}</p>
          <Link to="/admin/categories" className="mt-4 text-emerald-600 text-sm font-medium hover:underline">Manage Categories &rarr;</Link>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Total Users</h3>
          <p className="text-4xl font-bold text-slate-800">{loading ? "..." : stats.totalUsers}</p>
          <Link to="/admin/users" className="mt-4 text-emerald-600 text-sm font-medium hover:underline">View Users &rarr;</Link>
        </div>
      </div>
      <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Welcome to your new Admin Panel!</h2>
        <p className="text-gray-500">Use the sidebar to navigate and manage your Lume store.</p>
      </div>

    </div>
  );
};

export default Dashboard;
