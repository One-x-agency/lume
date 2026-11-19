import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Products", path: "/admin/products" },
    { name: "Categories", path: "/admin/categories" },
    { name: "Users", path: "/admin/users" },
    { name: "View Store", path: "/home" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-slate-900 text-white shadow-xl flex-col hidden md:flex">
        <div className="p-6 text-center border-b border-slate-700">
          <h2 className="text-3xl font-bold text-emerald-500">LUME</h2>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Admin Panel</p>
        </div>
        
        <nav className="flex-1 mt-6 px-4 space-y-2">
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive 
                  ? "bg-emerald-600 text-white font-medium shadow-md" 
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}>
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button onClick={handleLogout}className="w-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200 py-2 rounded-lg font-medium">
            Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white shadow-md p-4 md:hidden flex justify-between items-center">
            <h2 className="text-xl font-bold text-emerald-600">LUME Admin</h2>
            <div className="flex items-center gap-3">
              <Link to="/home" className="text-sm bg-emerald-100 px-3 py-1 rounded text-emerald-700 font-medium">Store</Link>
              <button onClick={handleLogout} className="text-sm bg-slate-200 px-3 py-1 rounded text-red-600 font-medium">Logout</button>
            </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
